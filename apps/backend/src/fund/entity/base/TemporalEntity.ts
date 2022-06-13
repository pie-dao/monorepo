import { prop } from '@typegoose/typegoose';

export abstract class TemporalEntity {
  @prop({ required: true, index: true })
  timestamp: Date;
}
