import { gql } from '@apollo/client';
import { TypedDocumentNode as TD } from '@graphql-typed-document-node/core';

/**
 * Get the current user
 * @returns {Object} The current user
 */
// Types for Me query
export interface MeQueryData {
  me: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export type MeQueryVariables = Record<string, never>;

export const GET_ME: TD<MeQueryData, MeQueryVariables> = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
` as unknown as TD<MeQueryData, MeQueryVariables>;

/**
 * Get the meetings
 * @returns {Object} The meetings
 */
// Types for Meetings query
export interface MeetingsQueryData {
  meetings: Array<{
    id: string;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export type MeetingsQueryVariables = Record<string, never>;

export const GET_MEETINGS: TD<MeetingsQueryData, MeetingsQueryVariables> = gql`
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
` as unknown as TD<MeetingsQueryData, MeetingsQueryVariables>;
