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
  // Query resolvers (buildSchema root resolvers: (args, context))
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
  users: async (_args, context) => {
    requireAuth(context);
    return User.find({}).sort({ name: 1 });
  },
  meeting: async ({ id }, context) => {
    requireAuth(context);
    return Meeting.findById(id).populate('attendees').populate('createdBy');
  },

  // Mutation resolvers
  register: async ({ name, email, password }, context) => {
    RegisterInputSchema.parse({ name, email, password });
    const existing = await User.findOne({ email });
    if (existing)
      throw new GraphQLError('Email already in use', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    const hashed = await bcrypt.hash(password, 10);
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
  login: async ({ email, password }, context) => {
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
    console.log('input', input);
    const userId = requireAuth(context);
    let parsed;
    try {
      parsed = MeetingInputSchema.parse(input);
    } catch (err) {
      throw new GraphQLError('Invalid meeting input', {
        extensions: {
          code: 'BAD_USER_INPUT',
          details: err?.errors ?? undefined,
        },
      });
    }
    const { title, description, startTime, endTime, attendeeIds } = parsed;
    // Ensure attendees are ObjectIds to avoid cast errors surfacing as 500s
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
