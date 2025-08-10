module.exports = `
  scalar Date

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Meeting {
    id: ID!
    title: String!
    description: String
    startTime: String!
    endTime: String!
    attendees: [User!]!
    createdBy: User!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input MeetingInput {
    title: String!
    description: String
    startTime: String!
    endTime: String!
    attendeeIds: [ID!]!
  }

  type Query {
    me: User
    meetings: [Meeting!]!
    meeting(id: ID!): Meeting
    users: [User!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createMeeting(input: MeetingInput!): Meeting!
    deleteMeeting(id: ID!): Boolean!
  }
`;
