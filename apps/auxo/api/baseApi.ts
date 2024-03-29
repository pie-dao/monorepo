import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { graphqlRequestBaseQuery } from './baseQuery';

export const api = createApi({
  reducerPath: 'user',
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  baseQuery: graphqlRequestBaseQuery({ url: '/' }),
  endpoints: () => ({}),
});
