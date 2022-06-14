import {
  getDiscriminatorModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { TokenEntity, TokenModel } from './Token';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class YieldBearingTokenEntity extends TokenEntity {
  @prop({ required: true })
  wrappedToken: TokenEntity;
}

export const YieldBearingTokenModel = getDiscriminatorModelForClass(
  TokenModel,
  YieldBearingTokenEntity,
);
