// src/mocks/handlers.js
import {
  mockAllUsersQuery,
  mockFindUserQuery,
  mockGetProductsBySymbolQuery,
  mockGetVaultsQuery,
} from '../api/generated/graphql';

export const handlers = [
  mockAllUsersQuery((req, res, ctx) => {
    return res(
      ctx.data({
        allUsers: [{ address: '0x0' }],
      }),
    );
  }),

  mockFindUserQuery((req, res, ctx) => {
    const { address } = req.variables;
    return res(
      ctx.data({
        user: {
          address,
          totalBalance: 20000,
          twentyFourHourChange: address ? -30.22 : null,
          pieVaults: [
            {
              symbol: 'PLAY',
              name: 'Play Metaverse Token',
            },
          ],
          yieldVaults: [
            {
              symbol: 'auxoWFTM',
              name: 'Auxo Wrapped Fantom Vault',
              twentyFourHourEarnings: 400,
              totalEarnings: 900,
            },
          ],
        },
      }),
    );
  }),
  mockGetProductsBySymbolQuery((req, res, ctx) => {
    const { symbols } = req.variables;
    return res(
      ctx.data({
        tokensBySymbol: [symbols].flat().map((symbol) => ({
          marketData: [
            { currentPrice: 200, twentyFourHourChange: '$ 0,30 / 2,3%' },
          ],
          symbol: symbol,
        })),
      }),
    );
  }),
  mockGetVaultsQuery((req, res, ctx) => {
    const vaults = ['Auxo Wrapped Fantom Vault'];
    return res(
      ctx.data({
        vaults: [vaults].flat().map((symbol) => ({
          underlyingToken: {
            marketData: [{ currentPrice: 230 }],
            symbol: 'FTM',
            address: '0x0',
            chain: 137,
            coinGeckoId: 'fantom',
            decimals: 18,
            kind: 'kind',
            name: 'Fantom Token',
          },
          symbol: 'auxoWFTM',
          name: 'Auxo Wrapped Fantom Vault',
        })),
      }),
    );
  }),
];
