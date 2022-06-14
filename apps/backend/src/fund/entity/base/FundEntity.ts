import { FundHistory, Token } from '@domain/feature-funds';

export type FundEntity<H extends FundHistory> = Token & {
  history?: H[];
};
