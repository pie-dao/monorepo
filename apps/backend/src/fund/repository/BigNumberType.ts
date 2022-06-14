import BigNumber from 'bignumber.js';
import { AnyObject, Error, Schema, SchemaType } from 'mongoose';

export class BigNumberType extends SchemaType {
  constructor(path: string, options: AnyObject) {
    super(path, options, 'BigNumber');
  }

  cast(value: unknown): BigNumber {
    if (typeof value === 'string') {
      try {
        return new BigNumber(value);
      } catch (e) {
        throw new Error.CastError('BigNumber', value, this.path, e);
      }
    } else if (value instanceof BigNumber) {
      return value;
    } else {
      throw new Error.CastError('BigNumber', value, this.path);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Schema.Types as any).BigNumberType = BigNumberType;
