import BigNumber from 'bignumber.js';
import { connect, Mongoose } from 'mongoose';
import { PieSmartPoolHistoryModel } from '../';
import { PieSmartPoolModel, TokenModel } from '../entity';
describe('Test', () => {
  let connection: Mongoose;

  beforeAll(async () => {
    connection = await connect(process.env.MONGO_DB_TEST);
    await TokenModel.deleteMany({}).exec();
    await PieSmartPoolHistoryModel.deleteMany({}).exec();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it('should pass', async () => {
    const psp = await new PieSmartPoolModel({
      address: '0x0000000000000000000000000000000000000000',
      name: 'psp',
      symbol: 'psp',
      decimals: 18,
    }).save();

    await new PieSmartPoolModel({
      address: '0x0000000000000000000000000000000000000001',
      name: 'psp',
      symbol: 'psp',
      decimals: 18,
    }).save();

    await new PieSmartPoolHistoryModel({
      fundId: psp._id,
      timestamp: Date.now(),
      underlyingTokenAddresses: ['0x0000000000000000000000000000000000000002'],
      controllerAddress: '0x0000000000000000000000000000000000000003',
      publicSwapSetterAddress: '0x0000000000000000000000000000000000000004',
      tokenBinderAddress: '0x0000000000000000000000000000000000000005',
      circuitBreakerAddress: '0x0000000000000000000000000000000000000006',
      publicSwapEnabled: true,
      cap: new BigNumber(1),
      annualFee: new BigNumber(1),
      feeRecipientAddress: '0x0000000000000000000000000000000000000007',
      balancerPoolAddressAddress: '0x0000000000000000000000000000000000000008',
      swapFee: new BigNumber(1),
      joinExitEnabled: true,
      startWeights: {
        '0x0000000000000000000000000000000000000009': new BigNumber(1),
      },
    }).save();

    const result = await PieSmartPoolModel.find({}).populate('history').exec();

    console.log(JSON.stringify(result, null, 2));
  });
});
