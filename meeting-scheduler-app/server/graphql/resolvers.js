const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const User = require('../models/User');
const Meeting = require('../models/Meeting');
const {
  RegisterInputSchema,
  LoginInputSchema,
  MeetingInputSchema,
} = require('../utils/validators');

function requireAuth(context) {
  const userId = context?.req?.userId;
  if (!userId)
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  return userId;
}

module.exports = {
  // Query resolvers
  me: async (_args, context) => {
    const userId = requireAuth(context);
    const user = await User.findById(userId);
    return user;
  },
  meetings: async (_args, context) => {
    const userId = requireAuth(context);
    return Meeting.find({ $or: [{ createdBy: userId }, { attendees: userId }] })
      .sort({ startTime: 1 })
      .populate('attendees')
      .populate('createdBy');
  },
  meeting: async ({ id }, context) => {
    requireAuth(context);
    return Meeting.findById(id).populate('attendees').populate('createdBy');
  },

  // Mutation resolvers
  register: async (_root, { name, email, password }) => {
    RegisterInputSchema.parse({ name, email, password });
    const existing = await User.findOne({ email });
    if (existing)
      throw new GraphQLError('Email already in use', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    const hashed = await bcrypt.hash(password, 10);
    console.log('hashed', hashed);
    console.log('user', user);
    const user = await User.create({ name, email, password: hashed });
    if (!process.env.JWT_SECRET) {
      throw new GraphQLError('Server misconfiguration: JWT secret missing', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    return { token, user };
  },
  login: async ({ email, password }) => {
    LoginInputSchema.parse({ email, password });
    const user = await User.findOne({ email });
    if (!user)
      throw new GraphQLError('Invalid credentials', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      throw new GraphQLError('Invalid credentials', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    if (!process.env.JWT_SECRET) {
      throw new GraphQLError('Server misconfiguration: JWT secret missing', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    return { token, user };
  },
  createMeeting: async ({ input }, context) => {
    const userId = requireAuth(context);
    const { title, description, startTime, endTime, attendeeIds } =
      MeetingInputSchema.parse(input);
    const meeting = await Meeting.create({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      attendees: attendeeIds,
      createdBy: userId,
    });
    await meeting.populate('attendees');
    await meeting.populate('createdBy');
    return meeting;
  },
  deleteMeeting: async ({ id }, context) => {
    const userId = requireAuth(context);
    const meeting = await Meeting.findById(id);
    if (!meeting) return false;
    if (String(meeting.createdBy) !== String(userId))
      throw new GraphQLError('Forbidden', {
        extensions: { code: 'FORBIDDEN' },
      });
    await meeting.deleteOne();
    return true;
  },
};
