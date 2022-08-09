import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Mongoose } from 'mongoose';
import { RawUserEntityModel, UserModel } from './entity';
import { MongoUserRepository } from './MongoUserRepository';
import * as E from 'fp-ts/Either';

const TEST_USER = {
  id: '123',
  name: 'test',
  rawUserEvents: [
    {
      kind: 'RawUserEvent' as const,
      userId: '123',
      payload: {
        hey: 'ho',
      },
    },
  ],
};

describe('Given a Mongo User Repository', () => {
  let connection: Mongoose;
  let target: MongoUserRepository;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    connection = await connect(mongod.getUri());
    target = new MongoUserRepository(UserModel, RawUserEntityModel);
  });

  afterEach(async () => {
    await connection.disconnect();
    await mongod.stop();
  });

  it('When saving a new User Then it is saved properly', async () => {
    await target.save(TEST_USER)();

    const result = await target.find()();

    expect(result).toEqual([TEST_USER]);
  });

  it('When saving a new User Then it can be found properly', async () => {
    await target.save(TEST_USER)();

    const result = await target.findOne({ id: '123' })();

    expect(result).toEqual(E.right(TEST_USER));
  });
});
