import { Parser } from '@shared/helpers';
import * as E from 'fp-ts/Either';
import * as NEA from 'fp-ts/NonEmptyArray';
import { Newtype } from 'newtype-ts';

/**
 * Represents a wallet or contract address.
 * The format is the following:
 * 0xAF2fE0d4fe879066B2BaA68d9e56cC375DF22815
 *
 *^^-- `0x` followed by 40 characters of hexadecimal digits
 */
export type Address = Newtype<{ readonly Address: unique symbol }, string>;

const isAddress = (value: unknown): value is Address => {
  return (
    typeof value === 'string' && value.length === 42 && value.startsWith('0x')
  );
};

/**
 * Parses a string into an {@link Address}.
 */
export const parseAddress: Parser<Address> = E.fromPredicate(
  isAddress,
  (invalidValue) =>
    NEA.of(
      `Address value must be a valid Ethereum address, got: ${invalidValue}`,
    ),
);
