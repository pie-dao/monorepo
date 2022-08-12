import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { graphqlRequestBaseQuery } from './baseQuery';

const baseQueryOptions = {
  url: process.env.NEXT_PUBLIC_BACKEND_URL,
};

export const api = createApi({
  reducerPath: 'backend',
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  baseQuery: graphqlRequestBaseQuery(baseQueryOptions),
  endpoints: () => ({}),
});
