import { fractionalNumberDivide } from "./fractionalDivide";

describe('testing fractional division with big numbers', () => {

    it('Works when num < denominator', () => {
        const numerator = 0.3;
        const denominator = 1.25;
        const expected = 0.24;
        const actual = fractionalNumberDivide(numerator, denominator);
        expect(actual).toEqual(expected)
    });

    it('Works when denom > numerator', () => {
        const numerator = 2;
        const denominator = 1.25;
        const expected = 1.6;
        const actual = fractionalNumberDivide(numerator, denominator);
        expect(actual).toEqual(expected)
    });
})