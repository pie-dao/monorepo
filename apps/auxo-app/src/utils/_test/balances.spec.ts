import { toBalance } from "..";
import { addBalances, compareBalances, subBalances, zeroBalance } from "../balances";

describe('Testing balances', () => {
    const DECIMALS = 20;
    const balTen = toBalance(10, DECIMALS);
    const balTwenty = toBalance(20, DECIMALS);
    it('Can add 2 balances', () => {
        const expectedBalThirty = addBalances(balTen, balTwenty);
        expect(expectedBalThirty).toEqual(toBalance(30, DECIMALS));
    });

    it('Can sub 2 balances', () => {
        const expectedBalTen = subBalances(balTwenty, balTen);
        expect(expectedBalTen).toEqual(toBalance(10, DECIMALS));
    });

    it('Can compare 2 balances', () => {
        const conditions = [
            compareBalances(zeroBalance(), 'lte', zeroBalance()),
            compareBalances(balTen, 'lt', balTwenty),
            compareBalances(balTwenty, 'gte', balTwenty),
            compareBalances(balTwenty, 'gt', balTen),
            compareBalances(balTwenty, 'gt', balTen),
        ];
        const allConditons = conditions.every(Boolean);
        expect(allConditons).toEqual(true);
    });
});