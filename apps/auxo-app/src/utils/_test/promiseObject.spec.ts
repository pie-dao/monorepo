import { promiseObject } from '../promiseObject';

describe('testing the promise object', () => {
  it('creates an key value pair of awaited results', async () => {
    const input = {
      truthy: new Promise((res) => res(true)),
      falsy: new Promise((res) => res(false)),
      aString: new Promise((res) => res('test')),
    };

    const res = await promiseObject(input);

    expect(res.falsy).toEqual(false);
    expect(res.truthy).toEqual(true);
    expect(res.aString).toEqual('test');
  });
});
