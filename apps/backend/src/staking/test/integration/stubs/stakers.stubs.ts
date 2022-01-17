// stake on 1 january 2021 01:00

const stakers = [
  {
    accountLocks: [
      {
        amount: '1000000000000000000000',
        id: '0x3c341129dac2096b88945a8985f0ada799abf8c9_0',
        lockDuration: '15768000',
        lockId: '0',
        lockedAt: '1622505601',
        withdrawn: false,
      },
    ],
    accountVeTokenBalance: '833333333300000000000',
    id: '0x3c341129dac2096b88945a8985f0ada799abf8c9',
  },
  {
    accountLocks: [
      {
        amount: '1000000000000000000000',
        id: '0x42556f667dfc74704914f98d1e0c0ac4ea2f492e_0',
        lockDuration: '31536000',
        lockId: '0',
        lockedAt: '1622505601',
        withdrawn: false,
      },
    ],
    accountVeTokenBalance: '2311421345000000000000',
    id: '0x42556f667dfc74704914f98d1e0c0ac4ea2f492e',
  },
  {
    accountLocks: [
      {
        amount: '1000000000000000000000',
        id: '0xabf26352aadaaa1cabffb3a55e378bac6bf15791_0',
        lockDuration: '94608000',
        lockId: '0',
        lockedAt: '1622505601',
        withdrawn: false,
      },
    ],
    accountVeTokenBalance: '10000000000000000000000',
    id: '0xabf26352aadaaa1cabffb3a55e378bac6bf15791',
  },
];

const accounts = {
  alice: '0x3c341129dac2096b88945a8985f0ada799abf8c9',
  tom: '0x42556f667dfc74704914f98d1e0c0ac4ea2f492e',
  ray: '0xabf26352aadaaa1cabffb3a55e378bac6bf15791',
};

export const StakersStub = (): any => {
  // returning all stakers...
  return { stakers: stakers, accounts: accounts };
};
