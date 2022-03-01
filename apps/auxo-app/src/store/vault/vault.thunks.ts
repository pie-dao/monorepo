import { createAsyncThunk } from "@reduxjs/toolkit";
import { Erc20, MerkleAuth, Mono } from "../../types/artifacts/abi";
import { LibraryProvider } from "../../types/utilities";
import { getProof } from "../../utils/merkleProof";
import { Balance, VaultState } from "./Vault";

/**
 * Thunks allow us to execute asynchronous actions while maintaining a predictable state. 
 * In particular, the `createAsyncThunk` method exposes lifecycle methods
 * that can trigger reducers in various parts of the store, depending on the status
 * of a promise.
 * 
 * Define contract interactions inside the thunk, then return a value that will
 * Be handled by the 'fulfilled' hook, as an extra reducer in the vault slice.
 * 
 * Rejected values will be passed to the `rejected` handlers.
 * 
 * If you want notifications to be shown to the user, use the `addTxNotifications` 
 * in the application slice to automatically subscribe to the lifecycle methods 
 */


/**
 * For ERC20 tokens without a 'permit' method, request an approval from the user for 
 * A transfer of tokens to the auxo vault.
 */
export type ThunkApproveDepositProps = {
    deposit: Balance,
    provider: LibraryProvider,
    token: Erc20 | undefined,
};
export const thunkApproveDeposit = createAsyncThunk(
    'vault/approveDeposit', 
    async ({
      deposit, 
      provider,
      token
    }: ThunkApproveDepositProps,
    { getState, rejectWithValue }
) => {
    const { vault } = getState() as { vault: VaultState };
    if (!token || !vault.selected) return rejectWithValue('Missing token or selected vault');
    const tx = await token.approve(vault.selected, deposit.value);
    const receipt = await provider.getTransactionReceipt(tx.hash);
    return (receipt.status === 1) 
        ? { deposit }
        : rejectWithValue('Approval Failed');
});
  
/**
 * Actually make the deposit of underlying tokens into the auxo vault
 */
export type ThunkMakeDepositProps = {
    deposit: Balance,
    provider: LibraryProvider,
    auxo: Mono | undefined,
    account: string | null | undefined
};
export const thunkMakeDeposit = createAsyncThunk(
    'vault/makeDeposit', 
    async ({
      deposit,
      provider,
      auxo,
      account
    }: ThunkMakeDepositProps,
    { getState, rejectWithValue }
) => {
    const { vault } = getState() as { vault: VaultState };
    if (!auxo || !account || !vault.selected) return rejectWithValue(
        'Missing Contract, Selected Vault or Account Details'
    );
    const tx = await auxo.deposit(account, deposit.value);
    const receipt = await provider.getTransactionReceipt(tx.hash);
    return (receipt.status === 1) 
        ? { deposit }
        : rejectWithValue('Deposit Failed');
});

/**
 * Exits the batch burn process, converting all shares currently awaiting a burn into the underlying
 * currency.
 */
export type ThunkConfirmWithdrawProps = {
    pendingSharesUnderlying: Balance,
    provider: LibraryProvider,
    auxo: Mono | undefined,
};
export const thunkConfirmWithdrawal = createAsyncThunk(
    'vault/confirmWithdrawal', 
    async ({
      pendingSharesUnderlying,
      provider,
      auxo,
    }: ThunkConfirmWithdrawProps,
    { getState, rejectWithValue }
) => {
    const { vault } = getState() as { vault: VaultState };
    if (!auxo || !vault.selected) return rejectWithValue(
        'Missing Contract or Selected Vault'
    );
    const tx = await auxo.exitBatchBurn();     
    const receipt = await provider.getTransactionReceipt(tx.hash);
    return (receipt.status === 1) 
        ? { pendingSharesUnderlying }
        : rejectWithValue('Enter Batch Burn Failed');
});

/**
 * Start the batch burn process by requesting the burning of the users' existing auxo tokens.
 * Users can increase the number of tokens to be converted up and until the batch burn process has completed.
 */
export type ThunkIncreaseWithdrawalProps = {
    withdraw: Balance,
    provider: LibraryProvider,
    auxo: Mono | undefined,
};
export const thunkIncreaseWithdrawal = createAsyncThunk(
    'vault/increaseWithdrawal', 
    async ({
      withdraw,
      provider,
      auxo,
    }: ThunkIncreaseWithdrawalProps,
    { getState, rejectWithValue }
) => {
    const { vault } = getState() as { vault: VaultState };
    if (!auxo || !vault.selected) return rejectWithValue(
        'Missing Contract or Selected Vault'
    );
    const tx = await auxo.enterBatchBurn(withdraw.value);     
    const receipt = await provider.getTransactionReceipt(tx.hash);
    return (receipt.status === 1) 
        ? { withdraw }
        : rejectWithValue('Exit Batch Burn Failed');
});


/**
 * Certain vaults implement a preview mechanism that restricts
 * Access to only PieDAO veDOUGH holders. To enforce this while reducing the
 * amount of onchain data held, each account must opt-in by submitting a merkle proof
 * Corresponding to the signing account (this mapping is public and held in the src files)
 * There is a merkle root stored on chain which validates the correctness of the proof.
 * Once a user opts in, they are added to the depositors list and can use the vault.
 */
 export type ThunkAuthorizeDepositorProps = {
    account: string | null | undefined,
    provider: LibraryProvider,
    auth: MerkleAuth | undefined,
};
export const thunkAuthorizeDepositor = createAsyncThunk(
    'vault/authorizeDepositor', 
    async ({
      account,
      provider,
      auth,
    }: ThunkAuthorizeDepositorProps,
    { getState, rejectWithValue }
) => {
    const { vault } = getState() as { vault: VaultState };
    if (!auth || !vault.selected || !account) return rejectWithValue(
        'Missing Auth Contract, Selected Vault or account details'
    );
    const proof = getProof(account);
    if (!proof) return rejectWithValue('The current account is unauthorized to use this vault.');
    const tx = await auth.authorizeDepositor(account, proof);     
    const receipt = await provider.getTransactionReceipt(tx.hash);
    if (receipt.status !== 1) return rejectWithValue('Authorization Failed');
});