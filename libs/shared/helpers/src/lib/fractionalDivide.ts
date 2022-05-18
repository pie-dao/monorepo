import { BigNumber, BigNumberish, ethers } from 'ethers';

/**
 *  Ethers naming conventions are a bit ambiguous, these functions are more 'human readable'
 *
 * `utils . parseUnits ( valueString , decimalsOrUnitName )   =>   BigNumber`
 *  Parse the valueString representation of units into a BigNumber instance of the amount of wei. The decimalsOrUnitsName may be a number of decimals between 3 and 18 (multiple of 3) or a name, such as gwei.
 */
export const scaleUp = (n: number, decimals = 18): BigNumber =>
  ethers.utils.parseUnits(n.toString(), decimals);

/**
 *  Ethers naming conventions are a bit ambiguous, these functions are more 'human readable'
 *
 * `utils . formatUnits ( wei , decimalsOrUnitName )   =>   string`
 *  Format an amount of wei into a decimal string representing the amount of units. The output will always include at least one whole number and at least one decimal place, otherwise leading and trailing 0’s will be trimmed. The decimalsOrUnitsName may be a number of decimals between 3 and 18 (multiple of 3) or a name, such as gwei.
 **/
export const scaleDown = (b: BigNumberish, decimals = 18): string =>
  ethers.utils.formatUnits(b, decimals);

/**
 * Use when dividing 2 big numbers where the result in 'real numbers' would be < 1.
 * This function scales up a big number numerator such that when using the ethers BN division, it correctly returns the bignumber value.
 * Not using this method would cause integer rounding to zero.
 *
 * @returns the big number scaled up to the number of decimals of the token (defaults to 18)
 */
export const fractionalBNDivide = (
  numerator: BigNumber,
  denominator: BigNumber,
  decimals = 18,
): BigNumber => {
  const scale = BigNumber.from(10).pow(decimals);
  const scaleUpNumerator = numerator.mul(scale);
  const calc = scaleUpNumerator.div(denominator);
  return calc;
};

/**
 * Takes 2 numbers and divides them, however works by converting to and from `ethers.BigNumber` instances.
 *
 * Primarily used for testing and validation that bigNumber division has functioned correctly.
 *
 * @returns the numerical value
 */
export const fractionalNumberDivide = (
  numerator: number,
  denominator: number,
  decimals = 18,
): number => {
  const [bigNumerator, bigDenomiator] = [numerator, denominator].map((x) =>
    scaleUp(x),
  );
  const bigOutcome = fractionalBNDivide(bigNumerator, bigDenomiator, decimals);
  const outcome = scaleDown(bigOutcome, decimals);
  return Number(outcome);
};
