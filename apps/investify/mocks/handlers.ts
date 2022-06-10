// src/mocks/handlers.js
import { mockAllUsersQuery } from '../api/generated/graphql';

export const handlers = [
  mockAllUsersQuery((req, res, ctx) => {
    return res(
      ctx.data({
        allUsers: [{ address: '0x0' }],
      }),
    );
  }),
];
