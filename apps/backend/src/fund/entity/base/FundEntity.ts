import { FundHistory } from '@domain/feature-funds';
import { TokenEntity } from '..';

export abstract class FundEntity<H extends FundHistory> extends TokenEntity {
  history?: H[];
}
