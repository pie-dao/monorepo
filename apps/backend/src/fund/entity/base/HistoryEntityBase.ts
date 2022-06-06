import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export abstract class HistoryEntityBase {
  @prop({ required: true })
  public fundId: Types.ObjectId;

  @prop({ required: true })
  timestamp: Date;
}
