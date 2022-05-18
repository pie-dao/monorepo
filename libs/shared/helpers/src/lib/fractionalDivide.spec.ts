import { fractionalNumberDivide } from './fractionalDivide';

describe('testing fractional division with big numbers', () => {
  it('Works when num < denominator', () => {
    const numerator = 0.3;
    const denominator = 1.25;
    const expected = 0.24;
    const actual = fractionalNumberDivide(numerator, denominator);
    expect(actual).toEqual(expected);
  });

  it('Works when denom < numerator', () => {
    const numerator = 2;
    const denominator = 1.25;
    const expected = 1.6;
    const actual = fractionalNumberDivide(numerator, denominator);
    expect(actual).toEqual(expected);
  });

  it('Is a good approximation with irrational numbers', () => {
    const numerator = 1;
    const denominator = 3;
    const expected = 0.33;
    const actual = fractionalNumberDivide(numerator, denominator);
    expect(actual).toBeCloseTo(expected);
  });

  it('Works when both values are <1', () => {
    const numerator = 0.5;
    const denominator = 0.2;
    const expected = 2.5;
    const actual = fractionalNumberDivide(numerator, denominator);
    expect(actual).toEqual(expected);
  });
});
