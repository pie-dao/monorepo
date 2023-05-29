import { addBalances, mulBalances, subBalances } from '../balances';
import { ethers } from 'ethers';
import { BigNumberReference } from '../../store/products/products.types';

describe('mulBalances tests', () => {
  test('should correctly multiply balances with default decimal value', () => {
    const b1: BigNumberReference = {
      label: 2,
      value: ethers.utils.parseUnits('1', 18).toString(),
    };
    const b2: BigNumberReference = {
      label: 3,
      value: ethers.utils.parseUnits('2', 18).toString(),
    };

    const result = mulBalances(b1, b2);

    expect(result.label).toBe(6);
    expect(result.value).toBe(ethers.utils.parseUnits('2', 18).toString());
  });

  test('should correctly multiply balances with custom decimal value', () => {
    const b1: BigNumberReference = {
      label: 2,
      value: ethers.utils.parseUnits('1', 9).toString(),
    };
    const b2: BigNumberReference = {
      label: 3,
      value: ethers.utils.parseUnits('2', 9).toString(),
    };

    const result = mulBalances(b1, b2, 9);

    expect(result.label).toBe(6);
    expect(result.value).toBe(ethers.utils.parseUnits('2', 9).toString());
  });

  test('should return 0 when one of the balances is 0', () => {
    const b1: BigNumberReference = {
      label: 0,
      value: ethers.utils.parseUnits('0', 18).toString(),
    };
    const b2: BigNumberReference = {
      label: 2,
      value: ethers.utils.parseUnits('1', 18).toString(),
    };

    const result = mulBalances(b1, b2);

    expect(result.label).toBe(0);
    expect(result.value).toBe(ethers.utils.parseUnits('0', 18).toString());
  });
});

describe('addBalances tests', () => {
  test('should return correct result when both balances are positive', () => {
    const b1: BigNumberReference = {
      label: 1,
      value: ethers.utils.parseUnits('1', 18).toString(),
    };
    const b2: BigNumberReference = {
      label: 2,
      value: ethers.utils.parseUnits('2', 18).toString(),
    };

    const result = addBalances(b1, b2, 18, 18, 18);

    expect(result.label).toBe(3);
    expect(result.value).toBe(ethers.utils.parseUnits('3', 18).toString());
  });

  test('should return correct result when one of the balances is 0', () => {
    const b1: BigNumberReference = {
      label: 0,
      value: ethers.utils.parseUnits('0', 18).toString(),
    };
    const b2: BigNumberReference = {
      label: 2,
      value: ethers.utils.parseUnits('2', 18).toString(),
    };

    const result = addBalances(b1, b2, 18, 18, 18);

    expect(result.label).toBe(2);
    expect(result.value).toBe(ethers.utils.parseUnits('2', 18).toString());
  });
});

describe('subBalances tests', () => {
  test('should return correct result when both balances are positive and the first is greater than the second', () => {
    const b1: BigNumberReference = {
      label: 2,
      value: ethers.utils.parseUnits('2', 18).toString(),
    };
    const b2: BigNumberReference = {
      label: 1,
      value: ethers.utils.parseUnits('1', 18).toString(),
    };

    const result = subBalances(b1, b2, 18, 18, 18);

    expect(result.label).toBeCloseTo(1);
    expect(result.value).toBe(ethers.utils.parseUnits('1', 18).toString());
  });

  test('should return correct result when one of the balances is 0', () => {
    const b1: BigNumberReference = {
      label: 2,
      value: ethers.utils.parseUnits('2', 18).toString(),
    };
    const b2: BigNumberReference = {
      label: 0,
      value: ethers.utils.parseUnits('0', 18).toString(),
    };

    const result = addBalances(b1, b2, 18, 18, 18);

    expect(result.label).toBeCloseTo(2);
    expect(result.value).toBe(ethers.utils.parseUnits('2', 18).toString());
  });
});
