import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { TemporalEntity } from './TemporalEntity';

export abstract class HistoryEntityBase extends TemporalEntity {
  @prop({ required: true, index: true })
  public fundId: Types.ObjectId;
}
