import { ethers, BigNumber } from 'ethers';
import { BigNumberReference } from '../store/products/products.types';

/**
 * To avoid storing complex objects in redux (BigNumber)
 * Here are some utility functions to convert the balance
 * Objects back to bignumber and perform some simple operations
 */

export const addBalances = (
  b1: BigNumberReference,
  b2: BigNumberReference,
): BigNumberReference => {
  const label = b1.label + b2.label;
  const value = BigNumber.from(b1.value)
    .add(BigNumber.from(b2.value))
    .toString();
  return {
    label,
    value,
  };
};

export const subBalances = (
  b1: BigNumberReference,
  b2: BigNumberReference,
): BigNumberReference => {
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
  b1: BigNumberReference,
  compare: 'gt' | 'gte' | 'lt' | 'lte',
  b2: BigNumberReference,
): boolean => {
  return BigNumber.from(b1.value)[compare](BigNumber.from(b2.value));
};

export const zeroBalance = { label: 0, value: '0' };

export const convertToUnderlying = (
  original: BigNumberReference,
  exchangeRate: BigNumberReference,
  decimals: number,
): BigNumberReference => {
  const valueBN = BigNumber.from(original.value)
    .mul(exchangeRate?.value ?? 0)
    .div(BigNumber.from(10).pow(decimals));

  const stringLabel = ethers.utils.formatUnits(valueBN, decimals);

  const label = Math.round(parseFloat(stringLabel));

  return {
    value: valueBN.toString(),
    label,
  };
};

export const BigNumberMin = (b1: BigNumber, b2: BigNumber): BigNumber =>
  b1.gt(b2) ? b2 : b1;

export const isZero = (b: BigNumberReference, decimals: number): boolean => {
  const value = ethers.utils.parseUnits(b.value, decimals ?? 18);
  return value.isZero();
};

export const subPercentageToBalance = (
  b1: BigNumberReference,
  percentage: BigNumberReference,
  decimals: number,
): BigNumberReference => {
  const value = BigNumber.from(b1.value)
    .mul(BigNumber.from(100).sub(percentage.value))
    .div(BigNumber.from(100));

  const stringLabel = ethers.utils.formatUnits(value, decimals);

  const label = Math.round(parseFloat(stringLabel));

  return {
    value: value.toString(),
    label,
  };
};

export const addNumberToBnReference = (
  b1: BigNumberReference,
  number: number,
  decimals: number,
): BigNumberReference => {
  const value = BigNumber.from(b1.value).add(
    BigNumber.from(ethers.utils.parseUnits(number.toString(), decimals)),
  );

  const stringLabel = ethers.utils.formatUnits(value, decimals);

  const label = parseFloat(stringLabel);

  return {
    value: value.toString(),
    label,
  };
};
