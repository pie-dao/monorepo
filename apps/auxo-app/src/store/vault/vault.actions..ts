
// ----- functions to be implemented in the application

import { BigNumber } from "@ethersproject/bignumber";
import { InsufficientBalanceError, NotImplementedError, NotYetReadyToWithdrawError } from "../../errors";
import { Erc20, Mono } from "../../types/artifacts/abi";
import { toScale } from "../../utils";

// actions - getters
export const getTotalDeposits = async (contract: Mono): Promise<BigNumber> => {
  return await contract.totalUnderlying();
}

export const getLatestAPY = async (contract: Mono) => {
  throw new NotImplementedError();
}

const getUserBalanceUnderlying = async (contract: Mono, user: string): Promise<BigNumber> => {
  return await contract.balanceOfUnderlying(user);
}

const getUserBalanceVaultTokens = async (contract: Mono, user: string): Promise<BigNumber> => {
  return await contract.balanceOf(user);
}

export const latestBatchBurn = async (contract: Mono): Promise<number> => {
  /**
   * Underlying tokens are redeemable once the batch burn process is complete
   * So we want to listen for the latest batch burn event
   * @dev - polygon network will not allow this
   */
  
  // list all ExecuteBatchBurn events
  const filter = contract.filters.ExecuteBatchBurn();
  const events = await contract.queryFilter(filter);

  const mostRecent = events.pop();
  if (mostRecent) {
    const mostRecentBlock = await mostRecent.getBlock();
    return mostRecentBlock.timestamp;
  } else {
    return 0;
  }
}

export const userCanWithdraw = async (contract: Mono, user: string): Promise<boolean> => {
  /**
   * Fetch batchburnindex & compare the batchBurnIndexForUser
   * (batchBurnForUser < batchBurnIndex) indicates user has something to withdraw
   */
  // const batchBurnIndex = await contract.batchBurnIndex();

  // // @dev check with dantop
  // const batchBurnIndexForUser = await contract.userBatchBurnLastRequest(user);
  // return batchBurnIndex.gt(batchBurnIndexForUser);
  const receipts = contract.userBatchBurnReceipts(user);
  
  return true
}

const getBalanceOfUser = async (token: Erc20, userAddress: string): Promise<BigNumber> => {
  return await token.balanceOf(userAddress);
}

const userHasBalance = async (token: Erc20, userAddress: string, amount: number): Promise<boolean> => {
  const balance = await getBalanceOfUser(token, userAddress);
  const decimals = await token.decimals();
  const amountScaled = toScale(amount, decimals)
  return balance.gte(amountScaled); 
}

// actions -- state changing
const deposit = async (contract: Mono, amount: number, userAddress: string, token: Erc20): Promise<void> => {    
  const _userHasBalance = await userHasBalance(token, userAddress, amount);
  if (_userHasBalance) {
    await contract.deposit(userAddress, amount);
  } else {
    throw new InsufficientBalanceError();
  }
}

const enterBatchBurn = async (contract: Mono, amount: number, userAddress: string, monoToken: Erc20): Promise<void> => {
  /**
   * Withdrawal requires first entering the batch burn process, then waiting a certain period.
   * @param monoToken is the ERC20 of the monoVault burnable token
   */
  const _userHasBalance = await userHasBalance(monoToken, userAddress, amount);
  if (_userHasBalance) {
    const decimals = await monoToken.decimals();
    await contract.enterBatchBurn(toScale(amount, decimals));
  } else {
    throw new InsufficientBalanceError();
  }
}

const withdraw = async (contract: Mono, userAddress: string): Promise<void> => {
  if (await userCanWithdraw(contract, userAddress)) {
    await contract.exitBatchBurn();
  } else {
    throw new NotYetReadyToWithdrawError()
  }
}