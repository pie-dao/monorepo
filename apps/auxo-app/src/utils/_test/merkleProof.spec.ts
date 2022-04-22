import { getProof, getMerkleProof } from '../merkleProof';

describe('Testing the prod merkle proof', () => {
    const ACCOUNT = '0xFeFe8736B8DEbEb1592DaC993c81e002aF8C34e9';
    const TEST_ACCOUNT = '0x63BCe354DBA7d6270Cb34dAA46B869892AbB3A79'
    

    it('Gets prod proof', async () => {
        const proof = getMerkleProof();
        const accounts = Object.keys(proof);
        const testAccount = accounts.find(a => a === TEST_ACCOUNT);
        expect(testAccount).toBeFalsy();        
    });

    it('gets the proof if it has one', () => {
        expect(getProof(ACCOUNT)).toBeTruthy();
    });

    it('Otherwise undefined', () => {
        expect(getProof(TEST_ACCOUNT)).toBeFalsy();
    })
})