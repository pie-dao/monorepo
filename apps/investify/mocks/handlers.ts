// src/mocks/handlers.js
import { mockAllUsersQuery, mockFindUserQuery } from '../api/generated/graphql';

export const handlers = [
  mockAllUsersQuery((req, res, ctx) => {
    return res(
      ctx.data({
        allUsers: [{ address: '0x0' }],
      }),
    );
  }),

  mockFindUserQuery((req, res, ctx) => {
    const { userId } = req.variables;
    return res(
      ctx.data({
        user: {
          id: userId,
          address: userId,
          balances: [
            {
              currency: 'USD',
              amount: userId ? 30000.2 : 0,
            },
          ],
        },
      }),
    );
  }),
];
