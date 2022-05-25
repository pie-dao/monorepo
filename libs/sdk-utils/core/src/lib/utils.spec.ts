import { ethers } from 'ethers';
import { decorate, typesafeContract } from './utils';
import smartPool from '../../../../shared/util-blockchain/abis/smart-pool/smartpool.abi.json';

describe('Testing sdk core utils', () => {
  it('decorates', () => {
    const a = { a: 1 };
    const b = {
      method() {
        return 'Test';
      },
    };

    const decorated = decorate(a, b);

    expect(decorated.a).toEqual(1);
    expect(decorated.method()).toEqual('Test');
  });

  it('Returns the contract instance when typesafe cast', () => {
    // const
    const original = new ethers.Contract(
      '0x33e18a092a93ff21ad04746c7da12e35d34dc7c4',
      smartPool.abi,
    );

    const newContract = typesafeContract(
      '0x33e18a092a93ff21ad04746c7da12e35d34dc7c4',
      smartPool.abi,
    );

    // stringify because checks to different refs in memory will not equal
    expect(JSON.stringify(original)).toEqual(JSON.stringify(newContract));
  });
});
