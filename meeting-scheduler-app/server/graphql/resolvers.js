const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Meeting = require('../models/Meeting');
const {
  RegisterInputSchema,
  LoginInputSchema,
  MeetingInputSchema,
} = require('../utils/validators');

function requireAuth(context) {
  const userId = context?.req?.userId;
  if (!userId) throw new Error('Not authenticated');
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
  register: async ({ name, email, password }) => {
    // RegisterInputSchema.parse({ name, email, password });
    // const existing = await User.findOne({ email });
    // if (existing) throw new Error('Email already in use');
    console.log('register', name, email, password);
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    return { token, user };
  },
  login: async ({ email, password }) => {
    LoginInputSchema.parse({ email, password });
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
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
      throw new Error('Forbidden');
    await meeting.deleteOne();
    return true;
  },
};
