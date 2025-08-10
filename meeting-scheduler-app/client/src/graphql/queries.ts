import { Meetings } from '@/types/meeting';
import { User } from '@/types/user';
import { gql } from '@apollo/client';
import { TypedDocumentNode as TD } from '@graphql-typed-document-node/core';

/**
 * Get the current user
 * @returns {Object} The current user
 */
// Types for Me query
export interface MeQueryData {
  me: User | null;
}

export const GET_ME: TD<MeQueryData, Record<string, never>> = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
` as unknown as TD<MeQueryData, Record<string, never>>;

/**
 * Get the meetings
 * @returns {Object} The meetings
 */
// Types for Meetings query
export interface MeetingsQueryData {
  meetings: Array<Meetings>;
}

export const GET_MEETINGS: TD<MeetingsQueryData, Record<string, never>> = gql`
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
` as unknown as TD<MeetingsQueryData, Record<string, never>>;

// Types for Users query
export interface UsersQueryData {
  users: Array<User>;
}

export const GET_USERS: TD<UsersQueryData, Record<string, never>> = gql`
  query Users {
    users {
      id
      name
      email
    }
  }
` as unknown as TD<UsersQueryData, Record<string, never>>;
