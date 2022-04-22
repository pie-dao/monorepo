import { BigNumber } from "ethers";
import { BigNumberMin, convertFromUnderlying, convertToUnderlying, fromScale, prettyNumber, smallToBalance, toBalance, toScale } from "..";

describe('Testing misc utils', () => {
    it('Computes min of 2 ethers bns', () => {
        const x = BigNumber.from(1);
        const y = BigNumber.from(2);
        expect(BigNumberMin(x, y)).toEqual(x)
    });

    it('Formats large numbers in a readable way', () => {
        const expected = '1,123,560,505,051';
        const input = 1123560505051;
        expect(prettyNumber(input)).toEqual(expected);
    });

    it('Transforms a regular to a big number', () => {
        expect(toScale(100, 10)).toEqual(BigNumber.from(100 * 1e10))
    });

    it('Transforms a big number to a regular number', () => {
        const input = BigNumber.from(100 * 1e12);
        expect(fromScale(input, 12)).toEqual(100);
    });

    it('Does not transfer a number if we try to convert', () => {
        expect(fromScale(100, 12)).toEqual(100);
    });    

    it('Throws 0 if we pass a falsy value for N', () => {
        expect(fromScale(undefined, 12)).toEqual(0);
    });        


    describe('Exchange rate conversions', () => {
        const decimals = 10;
        const exchangeRate = 1.1
        const bigExchangeRate = toBalance(
            BigNumber.from(exchangeRate * 1e10), decimals
        );
        const original = smallToBalance(100, decimals);

        it('Converts from an original balance to an underlying amount', () => {
            const expected = toBalance(BigNumber.from('909090909090'), decimals);
            const converted = convertFromUnderlying(original, bigExchangeRate, decimals);        
            expect(converted.label).toEqual(expected.label);
            expect(converted.value).toEqual(expected.value);
        });

        it('Converts back to the underlying amount', () => {
            const converted = convertFromUnderlying(original, bigExchangeRate, decimals);        
            const convertedBack = convertToUnderlying(converted, bigExchangeRate, decimals);        
            expect(convertedBack.label).toEqual(original.label);
            expect(Number(convertedBack.value) - Number(original.value)).toBeLessThanOrEqual(1);
        });
    });
});