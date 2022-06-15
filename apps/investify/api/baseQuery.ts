import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { DocumentNode } from 'graphql';
import { GraphQLClient, ClientError } from 'graphql-request';

export const graphqlRequestBaseQuery = (
  options:
    | { url: string; requestHeaders?: RequestHeaders }
    | { client: GraphQLClient },
): BaseQueryFn<
  { document: string | DocumentNode; variables?: any },
  unknown,
  Pick<ClientError, 'name' | 'message' | 'stack'>,
  Partial<Pick<ClientError, 'request' | 'response'>>
> => {
  const client =
    'client' in options ? options.client : new GraphQLClient(options.url);
  if ('requestHeaders' in options) {
    client.setHeaders(options.requestHeaders);
  }
  return async ({ document, variables }) => {
    try {
      return { data: await client.request(document, variables), meta: {} };
    } catch (error) {
      if (error instanceof ClientError) {
        const { name, message, stack, request, response } = error;
        return { error: { name, message, stack }, meta: { request, response } };
      }
      throw error;
    }
  };
};
