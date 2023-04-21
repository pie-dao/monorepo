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

export function subPercentageToBalance(
  b1: BigNumberReference,
  percentage: BigNumberReference,
  decimals: number,
): BigNumberReference;

export function subPercentageToBalance(
  b1: BigNumberReference,
  percentage: BigNumberReference,
  decimals: number,
  showSubtractedValue: boolean,
): {
  value: BigNumberReference;
  subtractedValue: BigNumberReference;
};

export function subPercentageToBalance(
  b1: BigNumberReference,
  percentage: BigNumberReference,
  decimals: number,
  showSubtractedValue?: boolean,
) {
  const base18Value = BigNumber.from(b1.value);
  const base18Percentage = BigNumber.from(percentage.value);

  const subtractedValue = base18Value
    .mul(base18Percentage)
    .div(ethers.utils.parseUnits('100', decimals));

  const totalValue = base18Value.sub(subtractedValue);

  if (showSubtractedValue) {
    return {
      value: toBalance(totalValue, decimals),
      subtractedValue: toBalance(subtractedValue, decimals),
    };
  }

  return toBalance(totalValue, decimals);
}

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

// compare balances and pick the lowest

export const pickBalance = (
  b1: BigNumberReference,
  b2: BigNumberReference,
  pick: 'min' | 'max',
): BigNumberReference => {
  switch (pick) {
    case 'min':
      return BigNumber.from(b1.value).lt(BigNumber.from(b2.value)) ? b1 : b2;
    case 'max':
      return BigNumber.from(b1.value).gt(BigNumber.from(b2.value)) ? b1 : b2;
    default:
      throw new Error('Invalid pick, specify min or max');
  }
};

// refactor pick balance to allow a any amount of balances using a linked list

export const pickBalanceList = (
  balances: BigNumberReference[],
  pick: 'min' | 'max',
): BigNumberReference => {
  if (balances.length === 0) {
    throw new Error('No balances to pick from');
  }
  if (balances.length === 1) {
    return balances[0];
  }
  const [first, second, ...rest] = balances;
  const picked = pickBalance(first, second, pick);
  return pickBalanceList([picked, ...rest], pick);
};
