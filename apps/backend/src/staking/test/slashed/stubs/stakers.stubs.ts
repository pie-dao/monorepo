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
  {
    accountLocks: [
      {
        amount: '1000000000000000000000',
        id: '0x3fe4d5d50fd7694b07589510621930aa14ce396e_0',
        lockDuration: '94608000',
        lockId: '0',
        lockedAt: '1622505601',
        withdrawn: false,
      },
    ],
    accountVeTokenBalance: '10000000000000000000000',
    id: '0x3fe4d5d50fd7694b07589510621930aa14ce396e',
  },
  {
    accountLocks: [
      {
        amount: '1000000000000000000000',
        id: '0xb5BA664321aeb345A8207430d94a5130ecCA4259_0',
        lockDuration: '94608000',
        lockId: '0',
        lockedAt: '1622505601',
        withdrawn: false,
      },
    ],
    accountVeTokenBalance: '10000000000000000000000',
    id: '0xb5BA664321aeb345A8207430d94a5130ecCA4259',
  }, 
  {
    accountLocks: [
      {
        amount: '1000000000000000000000',
        id: '0x087933667B22e8403cCb3E9169526484414f3336_0',
        lockDuration: '94608000',
        lockId: '0',
        lockedAt: '1622505601',
        withdrawn: false,
      },
    ],
    accountVeTokenBalance: '10000000000000000000000',
    id: '0x087933667B22e8403cCb3E9169526484414f3336',
  },    
];

const accounts = {
  alice: '0x3c341129dac2096b88945a8985f0ada799abf8c9',
  mark: '0x42556f667dfc74704914f98d1e0c0ac4ea2f492e',
  paul: '0xabf26352aadaaa1cabffb3a55e378bac6bf15791',
  mickie: '0x3fe4d5d50fd7694b07589510621930aa14ce396e',
  mouse: '0xb5BA664321aeb345A8207430d94a5130ecCA4259',
  foobar: '0x087933667B22e8403cCb3E9169526484414f3336'
};

export const StakersStub = (): any => {
  // returning all stakers...
  return { stakers: stakers, accounts: accounts };
};
