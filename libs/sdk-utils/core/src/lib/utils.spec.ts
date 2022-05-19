import { ethers } from 'ethers';
import { decorate, typesafeContract } from './utils';

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
    const original = new ethers.Contract('', '');

    const newContract = typesafeContract('');

    expect(original).toEqual(newContract);
  });
});
