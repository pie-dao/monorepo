// src/mocks/handlers.js
import {
  mockAllUsersQuery,
  mockFindUserQuery,
  mockGetProductsBySymbolQuery,
  mockGetVaultsQuery,
} from '../api/generated/graphql';
import {
  FTMContracts,
  PolygonContracts,
} from '../store/products/products.contracts';

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
          totalBalance: 20090,
          twentyFourHourChange: {
            price: 20,
            change: 10,
          },
          pieVaults: [
            {
              symbol: 'PLAY',
              name: 'Play Metaverse Token',
            },
            {
              symbol: 'DEFI++',
              name: 'Play Metaverse Token',
            },
          ],
          yieldVaults: [
            {
              symbol: 'auxoWFTM',
              name: 'Auxo Wrapped Fantom Vault',
              twentyFourHourEarnings: 400,
              totalEarnings: 900,
              address: '0x16AD251B49E62995eC6f1b6A8F48A7004666397C',
            },
            {
              symbol: 'USDC',
              name: 'USDC FTM',
              twentyFourHourEarnings: 400,
              totalEarnings: 900,
              address: '0x662556422AD3493fCAAc47767E8212f8C4E24513',
            },
          ],
          performance: 30.22,
          profit: 2034345030.43,
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
            {
              currentPrice: 200,
              twentyFourHourChange: {
                price: 30.22,
                change: 2.4,
              },
              fromInception: -30,
              discount: -12.32,
              interests: 20,
              nav: 1.5,
            },
          ],
          symbol: symbol,
          riskGrade: 'AAA',
        })),
      }),
    );
  }),
  mockGetVaultsQuery((req, res, ctx) => {
    return res(
      ctx.data({
        vaults: [...FTMContracts, ...PolygonContracts]
          .flat()
          .map((address) => ({
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
            address,
          })),
      }),
    );
  }),
];
