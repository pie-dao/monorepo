import {
  getDiscriminatorModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { DiscriminatedTokenEntity, DiscriminatedTokenModel } from './Token';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class YieldBearingTokenEntity extends DiscriminatedTokenEntity {
  @prop({ required: true })
  wrappedToken: DiscriminatedTokenEntity;
}

export const YieldBearingTokenModel = getDiscriminatorModelForClass(
  DiscriminatedTokenModel,
  YieldBearingTokenEntity,
);
