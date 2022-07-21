import { Contract } from '@domain/feature-funds';
import { SupportedChain } from '@shared/util-types';
import { prop } from '@typegoose/typegoose';

export abstract class ContractEntity implements Contract {
  @prop({ type: String, required: true, index: true })
  chain: SupportedChain;
  @prop({ required: true, index: true })
  address: string;
  @prop({ required: true, index: true })
  name: string;
  @prop({ required: true, index: true })
  public kind: string;
}
