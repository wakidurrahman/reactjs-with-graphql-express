import { gql } from '@apollo/client';

export const GET_ME = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;

export const GET_MEETINGS = gql`
  query Meetings {
    meetings {
      id
      title
      description
      startTime
      endTime
      createdAt
      updatedAt
    }
  }
`;
