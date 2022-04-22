import { Test, TestingModule } from '@nestjs/testing';
import { StakingService } from '../../staking.service';
import { ConfigModule } from '@nestjs/config';
import { VotesStub1 } from './stubs/windows/votes_window_1.stubs';
import { VotesStub2 } from './stubs/windows/votes_window_2.stubs';
import { VotesStub3 } from './stubs/windows/votes_window_3.stubs';
import { VotesStub4 } from './stubs/windows/votes_window_4.stubs';
import { StakersStub } from './stubs/stakers.stubs';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { EpochEntity, EpochSchema } from '../../entities/epoch.entity';
import * as ethDater from 'ethereum-block-by-date';
import { ethers } from 'ethers';

/* 
This test is, right now, just for the slashing mechanism.
We shall implement also the calculation of the math rewards, 
and include the compound/claim/unclaim edge cases.
 */

describe('Slashing Mechanism Tests', () => {
  let module: TestingModule;

  let votes_epochs = [
    // 31/10/2021
    {
      windowIndex: 1,
      votes: VotesStub1(),
      timestamp: 1635724799,
      distributedRewards: '1350000',
      month: 10,
      year: 2021,
    },
    // 30/11/2021
    {
      windowIndex: 2,
      votes: VotesStub2(),
      timestamp: 1638316799,
      distributedRewards: '40000',
      month: 11,
      year: 2021,
    },
    // 31/12/2021
    {
      windowIndex: 3,
      votes: VotesStub3(),
      timestamp: 1640995199,
      distributedRewards: '30000',
      month: 12,
      year: 2021,
    },
    // 31/01/2022
    {
      windowIndex: 4,
      votes: VotesStub4(),
      timestamp: 1643673599,
      distributedRewards: '1000000',
      month: 1,
      year: 2022,
    },
  ];

  let { stakers, accounts } = StakersStub();
  let service: StakingService;
  let provider: any;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [StakingService],
      imports: [
        HttpModule,
        ConfigModule.forRoot(),
        ScheduleModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_DB_TEST),
        MongooseModule.forFeature([
          { name: EpochEntity.name, schema: EpochSchema },
        ]),
      ],
    }).compile();

    service = module.get<StakingService>(StakingService);
    provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_RPC);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(provider).toBeDefined();
  });

  describe('Generate Epoch 1', () => {
    let epoch = votes_epochs[0];
    jest.setTimeout(100000);
    let generatedEpoch = null;

    beforeAll(async () => {
      const getSnapshotHandle = jest.spyOn(
        StakingService.prototype as any,
        'getSnapshotVotes',
      );

      getSnapshotHandle.mockImplementation(() => {
        return new Promise((resolve) => resolve(epoch.votes));
      });

      const getStakersHandle = jest.spyOn(
        StakingService.prototype as any,
        'getStakers',
      );

      getStakersHandle.mockImplementation(() => {
        return new Promise((resolve) => resolve(stakers));
      });

      const ethDaterHelper = new ethDater(provider);

      let blockNumber = await ethDaterHelper.getDate(
        epoch.timestamp * 1000,
        true,
      );

      generatedEpoch = await service.generateEpoch(
        epoch.month,
        epoch.year,
        epoch.distributedRewards,
        epoch.windowIndex,
        undefined,
        blockNumber.block,
        null,
      );
    });

    test('there should be 3 voting addresses', () => {
      // alice, mark and paul must be in the participant array...
      expect(generatedEpoch.participants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            address: '0x3c341129dac2096b88945a8985f0ada799abf8c9',
          }),
          expect.objectContaining({
            address: '0x42556f667dfc74704914f98d1e0c0ac4ea2f492e',
          }),
          expect.objectContaining({
            address: '0xabf26352aadaaa1cabffb3a55e378bac6bf15791',
          }),
        ]),
      );
    });

    test('there should be 3 claiming addresses', () => {
      // alice, mark and paul must be in the claims array...
      expect(Object.keys(generatedEpoch.merkleTree.claims)).toEqual(
        expect.arrayContaining([
          expect.stringMatching('0x3c341129dac2096b88945a8985f0ada799abf8c9'),
          expect.stringMatching('0x42556f667dfc74704914f98d1e0c0ac4ea2f492e'),
          expect.stringMatching('0xabf26352aadaaa1cabffb3a55e378bac6bf15791'),
        ]),
      );
    });

    test('there should be 3 not-voting addresses', () => {
      // instead mickie, mouse and foobar must be in the notVotingAddresses array...
      expect(
        Object.keys(generatedEpoch.merkleTree.stats.notVotingAddresses),
      ).toEqual(
        expect.arrayContaining([
          expect.stringMatching('0x3fe4d5d50fD7694b07589510621930aa14CE396e'),
          expect.stringMatching('0xb5BA664321aeb345A8207430d94a5130ecCA4259'),
          expect.stringMatching('0x087933667B22e8403cCb3E9169526484414f3336'),
        ]),
      );
    });

    test('there should be 0 slashed', () => {
      // instead no one should be slashed...
      expect(generatedEpoch.merkleTree.stats.toBeSlashed.accounts).toEqual([]);
    });
  });

  describe('Generate Epoch 2', () => {
    let epoch = votes_epochs[1];
    jest.setTimeout(100000);
    let generatedEpoch = null;

    beforeAll(async () => {
      const getSnapshotHandle = jest.spyOn(
        StakingService.prototype as any,
        'getSnapshotVotes',
      );

      getSnapshotHandle.mockImplementation(() => {
        return new Promise((resolve) => resolve(epoch.votes));
      });

      const getStakersHandle = jest.spyOn(
        StakingService.prototype as any,
        'getStakers',
      );

      getStakersHandle.mockImplementation(() => {
        return new Promise((resolve) => resolve(stakers));
      });

      const ethDaterHelper = new ethDater(provider);

      let blockNumber = await ethDaterHelper.getDate(
        epoch.timestamp * 1000,
        true,
      );

      generatedEpoch = await service.generateEpoch(
        epoch.month,
        epoch.year,
        epoch.distributedRewards,
        epoch.windowIndex,
        1,
        blockNumber.block,
        null,
      );
    });

    test('there should be 2 voting addresses', () => {
      // alice and paul must be in the participant array...
      expect(generatedEpoch.participants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            address: '0x3c341129dac2096b88945a8985f0ada799abf8c9',
          }),
          expect.objectContaining({
            address: '0xabf26352aadaaa1cabffb3a55e378bac6bf15791',
          }),
        ]),
      );
    });

    test('there should be 2 claiming addresses', () => {
      // alice and paul must be in the claims array...
      expect(Object.keys(generatedEpoch.merkleTree.claims)).toEqual(
        expect.arrayContaining([
          expect.stringMatching('0x3c341129dac2096b88945a8985f0ada799abf8c9'),
          expect.stringMatching('0xabf26352aadaaa1cabffb3a55e378bac6bf15791'),
        ]),
      );
    });

    test('there should be 4 not-voting addresses', () => {
      // instead mark, mickie, mouse and foobar must be in the notVotingAddresses array...
      expect(
        Object.keys(generatedEpoch.merkleTree.stats.notVotingAddresses),
      ).toEqual(
        expect.arrayContaining([
          expect.stringMatching('0x42556f667Dfc74704914F98d1e0c0aC4Ea2f492e'),
          expect.stringMatching('0x3fe4d5d50fD7694b07589510621930aa14CE396e'),
          expect.stringMatching('0xb5BA664321aeb345A8207430d94a5130ecCA4259'),
          expect.stringMatching('0x087933667B22e8403cCb3E9169526484414f3336'),
        ]),
      );
    });

    test('there should be 0 slashed', () => {
      // instead no one should be slashed...
      expect(generatedEpoch.merkleTree.stats.toBeSlashed.accounts).toEqual([]);
    });
  });

  describe('Generate Epoch 3', () => {
    let epoch = votes_epochs[2];

    jest.setTimeout(100000);
    let generatedEpoch = null;

    beforeAll(async () => {
      const getSnapshotHandle = jest.spyOn(
        StakingService.prototype as any,
        'getSnapshotVotes',
      );

      getSnapshotHandle.mockImplementation(() => {
        return new Promise((resolve) => resolve(epoch.votes));
      });

      const getStakersHandle = jest.spyOn(
        StakingService.prototype as any,
        'getStakers',
      );

      getStakersHandle.mockImplementation(() => {
        return new Promise((resolve) => resolve(stakers));
      });

      const ethDaterHelper = new ethDater(provider);

      let blockNumber = await ethDaterHelper.getDate(
        epoch.timestamp * 1000,
        true,
      );

      generatedEpoch = await service.generateEpoch(
        epoch.month,
        epoch.year,
        epoch.distributedRewards,
        epoch.windowIndex,
        2,
        blockNumber.block,
        null,
      );
    });

    test('there should be 2 voting addresses', () => {
      // alice and mickie must be in the participant array...
      expect(generatedEpoch.participants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            address: '0x3c341129dac2096b88945a8985f0ada799abf8c9',
          }),
          expect.objectContaining({
            address: '0x3fe4d5d50fd7694b07589510621930aa14ce396e',
          }),
        ]),
      );
    });

    test('there should be 2 claiming addresses', () => {
      // alice and mickie must be in the claims array...
      expect(Object.keys(generatedEpoch.merkleTree.claims)).toEqual(
        expect.arrayContaining([
          expect.stringMatching('0x3c341129dac2096b88945a8985f0ada799abf8c9'),
          expect.stringMatching('0x3fe4d5d50fd7694b07589510621930aa14ce396e'),
        ]),
      );
    });

    test('there should be 4 not-voting addresses', () => {
      // instead mark, mickie, mouse and foobar must be in the notVotingAddresses array...
      expect(
        Object.keys(generatedEpoch.merkleTree.stats.notVotingAddresses),
      ).toEqual(
        expect.arrayContaining([
          expect.stringMatching('0x42556f667Dfc74704914F98d1e0c0aC4Ea2f492e'),
          expect.stringMatching('0xaBf26352aAdAAa1CabFfB3a55e378bac6BF15791'),
          expect.stringMatching('0xb5BA664321aeb345A8207430d94a5130ecCA4259'),
          expect.stringMatching('0x087933667B22e8403cCb3E9169526484414f3336'),
        ]),
      );
    });

    test('there should be 2 slashed', () => {
      // instead mouse and foobar must be slashed...
      expect(generatedEpoch.merkleTree.stats.toBeSlashed.accounts).toEqual(
        expect.arrayContaining([
          expect.stringMatching('0xb5BA664321aeb345A8207430d94a5130ecCA4259'),
          expect.stringMatching('0x087933667B22e8403cCb3E9169526484414f3336'),
        ]),
      );
    });
  });

  describe('Generate Epoch 4', () => {
    let epoch = votes_epochs[3];

    jest.setTimeout(100000);
    let generatedEpoch = null;

    beforeAll(async () => {
      const getSnapshotHandle = jest.spyOn(
        StakingService.prototype as any,
        'getSnapshotVotes',
      );

      getSnapshotHandle.mockImplementation(() => {
        return new Promise((resolve) => resolve(epoch.votes));
      });

      const getStakersHandle = jest.spyOn(
        StakingService.prototype as any,
        'getStakers',
      );

      getStakersHandle.mockImplementation(() => {
        return new Promise((resolve) => resolve(stakers));
      });

      const ethDaterHelper = new ethDater(provider);

      let blockNumber = await ethDaterHelper.getDate(
        epoch.timestamp * 1000,
        true,
      );

      generatedEpoch = await service.generateEpoch(
        epoch.month,
        epoch.year,
        epoch.distributedRewards,
        epoch.windowIndex,
        3,
        blockNumber.block,
        null,
      );
    });

    test('there should be 3 voting addresses', () => {
      // alice, paul and mouse must be in the participant array...
      expect(generatedEpoch.participants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            address: '0x3c341129dac2096b88945a8985f0ada799abf8c9',
          }),
          expect.objectContaining({
            address: '0xabf26352aadaaa1cabffb3a55e378bac6bf15791',
          }),
          expect.objectContaining({
            address: '0xb5ba664321aeb345a8207430d94a5130ecca4259',
          }),
        ]),
      );
    });

    test('there should be 3 claiming addresses', () => {
      // alice, paul and mouse must be in the claims array...
      expect(Object.keys(generatedEpoch.merkleTree.claims)).toEqual(
        expect.arrayContaining([
          expect.stringMatching('0x3c341129dac2096b88945a8985f0ada799abf8c9'),
          expect.stringMatching('0xabf26352aadaaa1cabffb3a55e378bac6bf15791'),
          expect.stringMatching('0xb5BA664321aeb345A8207430d94a5130ecCA4259'),
        ]),
      );
    });

    test('there should be 3 not-voting addresses', () => {
      // instead mark, mickie and foobar must be in the notVotingAddresses array...
      expect(
        Object.keys(generatedEpoch.merkleTree.stats.notVotingAddresses),
      ).toEqual(
        expect.arrayContaining([
          expect.stringMatching('0x42556f667Dfc74704914F98d1e0c0aC4Ea2f492e'),
          expect.stringMatching('0x3fe4d5d50fD7694b07589510621930aa14CE396e'),
          expect.stringMatching('0x087933667B22e8403cCb3E9169526484414f3336'),
        ]),
      );
    });

    test('there should be 2 slashed', () => {
      // instead mark and foobar must be slashed...
      expect(generatedEpoch.merkleTree.stats.toBeSlashed.accounts).toEqual(
        expect.arrayContaining([
          expect.stringMatching('0x42556f667Dfc74704914F98d1e0c0aC4Ea2f492e'),
          expect.stringMatching('0x087933667B22e8403cCb3E9169526484414f3336'),
        ]),
      );
    });
  });
});
