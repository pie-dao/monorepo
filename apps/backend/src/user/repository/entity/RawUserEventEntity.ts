import { RawUserEvent } from '@domain/user';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { collection: 'rawuserevents' },
})
export class RawUserEventEntity implements RawUserEvent {
  @prop({ required: true, index: true })
  public userId: string;

  @prop({ required: true, type: Object })
  payload: Record<string, unknown>;

  @prop({ required: true })
  kind: 'RawUserEvent' = 'RawUserEvent';
}

export const RawUserEntityModel = getModelForClass(RawUserEventEntity);
