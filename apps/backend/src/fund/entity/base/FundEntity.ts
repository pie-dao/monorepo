import { FundHistory } from '@domain/feature-funds';
import { DiscriminatedTokenEntity } from '../Token';

export abstract class FundEntity<
  H extends FundHistory,
> extends DiscriminatedTokenEntity {
  history?: H[];
}
