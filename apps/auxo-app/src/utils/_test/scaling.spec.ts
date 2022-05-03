import { BigNumber, BigNumberish, ethers } from "ethers";

/**
  `utils . parseUnits ( valueString , decimalsOrUnitName )   =>   BigNumber`
  Parse the valueString representation of units into a BigNumber instance of the amount of wei. The decimalsOrUnitsName may be a number of decimals between 3 and 18 (multiple of 3) or a name, such as gwei.
  
  `utils . formatUnits ( wei , decimalsOrUnitName )   =>   string`
  Format an amount of wei into a decimal string representing the amount of units. The output will always include at least one whole number and at least one decimal place, otherwise leading and trailing 0’s will be trimmed. The decimalsOrUnitsName may be a number of decimals between 3 and 18 (multiple of 3) or a name, such as gwei.
**/

const scaleUp = (n: number, decimals = 18): BigNumber =>
  ethers.utils.parseUnits(n.toString(), decimals);

const scaleDown = (b: BigNumberish, decimals = 18): string =>
  ethers.utils.formatUnits(b, decimals);

const fractionalDivide = (
  numerator: BigNumber,
  denominator: BigNumber,
  decimals = 18
): BigNumber => {
  const scale = BigNumber.from(10).pow(decimals);
  const scaleUpNumerator = numerator.mul(scale);
  const calc = scaleUpNumerator.div(denominator);
  return calc;
};

const divideSolidity = (
  numerator: number,
  denominator: number,
  decimals = 18
) => {
  const [bigNumerator, bigDenomiator] = [numerator, denominator].map((x) =>
    scaleUp(x)
  );
  const bigOutcome = fractionalDivide(bigNumerator, bigDenomiator);
  const outcome = scaleDown(bigOutcome);
  return Number(outcome);
};

describe("testing fractional division with big numbers", () => {
  it("Works when num < denominator", () => {
    const numerator = 0.3;
    const denominator = 1.25;
    const expected = 0.24;
    const actual = divideSolidity(numerator, denominator);
    expect(actual).toEqual(expected);
  });

  it("Works when denom > numerator", () => {
    const numerator = 2;
    const denominator = 1.25;
    const expected = 1.6;
    const actual = divideSolidity(numerator, denominator);
    expect(actual).toEqual(expected);
  });
});
