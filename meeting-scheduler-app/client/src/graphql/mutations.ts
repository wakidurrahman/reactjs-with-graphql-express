import { gql } from '@apollo/client';
import { TypedDocumentNode as TD } from '@graphql-typed-document-node/core';

// Types for Register mutation
export interface RegisterMutationData {
  register: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface RegisterMutationVariables {
  name: string;
  email: string;
  password: string;
}

export const REGISTER: TD<RegisterMutationData, RegisterMutationVariables> =
  gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
      register(name: $name, email: $email, password: $password) {
        token
        user {
          id
          name
          email
        }
      }
    }
  ` as unknown as TD<RegisterMutationData, RegisterMutationVariables>;

// Types for Login mutation
export interface LoginMutationData {
  login: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface LoginMutationVariables {
  email: string;
  password: string;
}

export const LOGIN: TD<LoginMutationData, LoginMutationVariables> = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
` as unknown as TD<LoginMutationData, LoginMutationVariables>;

// Types for CreateMeeting mutation
export interface CreateMeetingMutationData {
  createMeeting: {
    id: string;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
  };
}

export interface CreateMeetingMutationVariables {
  input: {
    title: string;
    description?: string | null;
    startTime: string;
    endTime: string;
    attendeeIds: string[];
  };
}

export const CREATE_MEETING: TD<
  CreateMeetingMutationData,
  CreateMeetingMutationVariables
> = gql`
  mutation CreateMeeting($input: MeetingInput!) {
    createMeeting(input: $input) {
      id
      title
      description
      startTime
      endTime
    }
  }
` as unknown as TD<CreateMeetingMutationData, CreateMeetingMutationVariables>;
