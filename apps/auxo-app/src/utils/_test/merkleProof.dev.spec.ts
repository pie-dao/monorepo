export {}

/**
 * Easier to just keep the test in a separate file for one test
 */
describe('Testing the dev merkle proof', () => {  
    it('Gets dev proof', async () => {
        // @ts-ignore
        process.env.NODE_ENV = 'development';
        const { getMerkleProof } = await import('../merkleProof')
        const proof = getMerkleProof();
        const accounts = Object.keys(proof);
        const testAccount = accounts.find(a => a === '0x63BCe354DBA7d6270Cb34dAA46B869892AbB3A79');
        expect(testAccount).toBeTruthy();        
    });
})