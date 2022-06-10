import { api } from '../baseApi';
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type Node = {
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  allUsers?: Maybe<Array<Maybe<User>>>;
  me: User;
  user?: Maybe<User>;
};

export type QueryUserArgs = {
  id: Scalars['ID'];
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER',
}

export type User = Node & {
  __typename?: 'User';
  address: Scalars['String'];
  ensName: Scalars['String'];
  id: Scalars['ID'];
};

export type FindUserQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;

export type FindUserQuery = {
  __typename?: 'Query';
  user?: {
    __typename?: 'User';
    id: string;
    address: string;
    ensName: string;
  } | null;
};

export type AllUsersQueryVariables = Exact<{ [key: string]: never }>;

export type AllUsersQuery = {
  __typename?: 'Query';
  allUsers?: Array<{ __typename?: 'User'; address: string } | null> | null;
};

export type UserFieldsFragment = {
  __typename?: 'User';
  id: string;
  address: string;
  ensName: string;
};

export const UserFieldsFragmentDoc = `
    fragment UserFields on User {
  id
  address
  ensName
}
    `;
export const FindUserDocument = `
    query findUser($userId: ID!) {
  user(id: $userId) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const AllUsersDocument = `
    query allUsers {
  allUsers {
    address
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    findUser: build.query<FindUserQuery, FindUserQueryVariables>({
      query: (variables) => ({ document: FindUserDocument, variables }),
    }),
    allUsers: build.query<AllUsersQuery, AllUsersQueryVariables | void>({
      query: (variables) => ({ document: AllUsersDocument, variables }),
    }),
  }),
});

export { injectedRtkApi as api };
export const {
  useFindUserQuery,
  useLazyFindUserQuery,
  useAllUsersQuery,
  useLazyAllUsersQuery,
} = injectedRtkApi;

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockFindUserQuery((req, res, ctx) => {
 *   const { userId } = req.variables;
 *   return res(
 *     ctx.data({ user })
 *   )
 * })
 */
export const mockFindUserQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<FindUserQueryVariables>,
    GraphQLContext<FindUserQuery>,
    any
  >,
) => graphql.query<FindUserQuery, FindUserQueryVariables>('findUser', resolver);

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockAllUsersQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ allUsers })
 *   )
 * })
 */
export const mockAllUsersQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<AllUsersQueryVariables>,
    GraphQLContext<AllUsersQuery>,
    any
  >,
) => graphql.query<AllUsersQuery, AllUsersQueryVariables>('allUsers', resolver);
