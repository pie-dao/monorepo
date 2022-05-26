import { BigNumber } from '@ethersproject/bignumber';
import { Balance } from '../store/vault/Vault';

/**
 * To avoid storing complex objects in redux (BigNumber)
 * Here are some utility functions to convert the balance
 * Objects back to bignumber and perform some simple operations
 */

export const addBalances = (b1: Balance, b2: Balance): Balance => {
  const label = b1.label + b2.label;
  const value = BigNumber.from(b1.value)
    .add(BigNumber.from(b2.value))
    .toString();
  return {
    label,
    value,
  };
};

export const subBalances = (b1: Balance, b2: Balance): Balance => {
  const label = b1.label - b2.label;
  const value = BigNumber.from(b1.value)
    .sub(BigNumber.from(b2.value))
    .toString();
  return {
    label,
    value,
  };
};

export const compareBalances = (
  b1: Balance,
  compare: 'gt' | 'gte' | 'lt' | 'lte',
  b2: Balance,
): boolean => {
  return BigNumber.from(b1.value)[compare](BigNumber.from(b2.value));
};

export const zeroBalance = (): Balance => ({ label: 0, value: '0' });
