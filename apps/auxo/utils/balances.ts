import { ethers, BigNumber } from 'ethers';
import { BigNumberReference } from '../store/products/products.types';
import { toBalance } from './formatBalance';

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
  decimals = 18,
): BigNumberReference => {
  const value = BigNumber.from(b1.value)
    .sub(BigNumber.from(b2.value))
    .toString();
  const formatted = ethers.utils.formatUnits(value, decimals);

  return {
    label: Number(formatted),
    value,
  };
};

export const mulBalances = (
  b1: BigNumberReference,
  b2: BigNumberReference,
): BigNumberReference => {
  const label = b1.label * b2.label;
  const value = BigNumber.from(b1.value)

    .mul(BigNumber.from(b2.value))
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
  const b1Value = BigNumber.from(b1.value);
  const percentageOfB1 = BigNumber.from(b1.value)
    .mul(percentage.value)
    .div(BigNumber.from(10).pow(decimals));

  const subtractedValue = b1Value.sub(percentageOfB1);

  return toBalance(subtractedValue, decimals);
};

export const addNumberToBnReference = (
  b1: BigNumberReference,
  number: number,
  decimals: number,
): BigNumberReference => {
  let value: BigNumber;
  try {
    value = BigNumber.from(b1.value).add(
      BigNumber.from(ethers.utils.parseUnits(number.toString(), decimals)),
    );
  } catch (e) {
    if (e.code === 'INVALID_ARGUMENT') {
      console.debug('Number too large to be converted to a BigNumber');
      value = BigNumber.from(b1.value);
    } else {
      throw e;
    }
  }

  const stringLabel = ethers.utils.formatUnits(value, decimals);

  const label = parseFloat(stringLabel);

  return {
    value: value.toString(),
    label,
  };
};
