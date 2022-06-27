import { connect, Mongoose } from 'mongoose';

export const MongooseConnectionProvider = {
  provide: 'MONGOOSE_CONNECTION',
  useFactory: (): Promise<Mongoose> => {
    return connect(process.env.MONGO_DB);
  },
};
