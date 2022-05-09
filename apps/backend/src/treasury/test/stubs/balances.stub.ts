import { Balances } from 'src/treasury/types/treasury.types.Balance';
export const balancesStub: Balances = {
  '0x3bcf3db69897125aa61496fc8a8b55a5e3f245d5': {
    products: [
      {
        label: 'Alchemix',

        meta: [
          {
            label: 'Collateral',
            value: 0,
            type: 'dollar',
          },
          {
            label: 'Debt',
            value: 0,
            type: 'dollar',
          },
          {
            label: 'C-Ratio',
            value: 0,
            type: 'pct',
          },
        ],
      },
    ],
    meta: [
      {
        label: 'Total',
        value: 744101.9497261093,
        type: 'dollar',
      },
      {
        label: 'Assets',
        value: 744101.9497261093,
        type: 'dollar',
      },
      {
        label: 'Debt',
        value: 0,
        type: 'dollar',
      },
    ],
  },
};
