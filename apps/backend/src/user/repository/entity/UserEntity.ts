import { User } from '@domain/user';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { RawUserEventEntity } from './RawUserEventEntity';

@modelOptions({
  schemaOptions: { collection: 'users' },
})
export class UserEntity implements User {
  @prop({ required: true, type: String })
  id: string;

  @prop({ required: true, type: String })
  name: string;

  @prop({
    ref: () => RawUserEventEntity,
    foreignField: 'userId',
    localField: 'id',
    default: [],
  })
  rawUserEvents: RawUserEventEntity[];
}

export const UserModel = getModelForClass(UserEntity);
