import { Meeting, MeetingInput } from '@/types/meeting';
import { User, UserLoginInput, UserRegisterInput } from '@/types/user';
import { gql } from '@apollo/client';
import { TypedDocumentNode as TD } from '@graphql-typed-document-node/core';

// Types for Register mutation
export interface RegisterMutationData {
  register: {
    token: string;
    user: User;
  };
}

export const REGISTER: TD<RegisterMutationData, UserRegisterInput> = gql`
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
` as unknown as TD<RegisterMutationData, UserRegisterInput>;

// Types for Login mutation
export interface LoginMutationData {
  login: {
    token: string;
    user: User;
  };
}

export const LOGIN: TD<LoginMutationData, UserLoginInput> = gql`
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
` as unknown as TD<LoginMutationData, UserLoginInput>;

// Types for CreateMeeting mutation
export interface CreateMeetingMutationData {
  createMeeting: Meeting;
}

export interface CreateMeetingMutationVariables {
  input: MeetingInput;
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
