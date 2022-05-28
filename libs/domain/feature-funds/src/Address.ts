import { Newtype } from 'newtype-ts';

/**
 * Represents a wallet address.
 * The format is the following:
 * 0xAF2fE0d4fe879066B2BaA68d9e56cC375DF22815
 *
 *^^-- `0x` followed by 40 characters of hexadecimal digits
 * TODO: add smart constructor
 */
export type Address = Newtype<{ readonly Address: unique symbol }, string>;
