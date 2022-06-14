import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export abstract class HistoryEntityBase {
  @prop({ required: true, index: true })
  public fundId: Types.ObjectId;

  @prop({ required: true, index: true })
  timestamp: Date;
}
