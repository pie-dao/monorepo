import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mono } from '../../types/abi/Mono'
import { LOREM } from '../../constants';
import { BigNumber } from '@ethersproject/bignumber';
import { Erc20 } from '../../types/abi/Erc20';
import { InsufficientBalanceError, NotImplementedError, NotYetReadyToWithdrawError } from '../../errors';


export interface VaultStats {
  projectedAPY: number;
  historicalAPY: number;
  deposits: number;
};

export interface Vault {
  name: string;
  addresses: {
    token: string;
    vault: string;
  }
  symbol: string;
  icon?: string;
  description: string;
  extendedDescription: string;
  network: NetworkDetails;
  stats?: VaultStats
}

export interface VaultState {
  vaults: Vault[];
  status: 'idle' | 'loading' | 'failed';
}

export type SUPPORTEDNETWORKS = 'POLYGON';

type NetworkDetails = {
  name: string;
  chainId: number;
}

type Networks = {
  [N in SUPPORTEDNETWORKS]: NetworkDetails
}

export const NETWORKS: Networks = {
  POLYGON: {
    name: 'Polygon',
    chainId: 137,
  },
}

const initialState: VaultState = {
  vaults: [
    {
      name: 'USDC',
      description: 'Stablecoin farming for UDSC',
      extendedDescription: LOREM,
      network: NETWORKS.POLYGON,
      symbol: 'USDC',
      addresses: {
        token: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        vault: '0x6bd0d8c8ad8d3f1f97810d5cc57e9296db73dc45',
      },
    },
    {
      name: 'DAI',
      description: 'Stablecoin farming for DAI',
      extendedDescription: LOREM,
      network: NETWORKS.POLYGON,
      symbol: 'DAI',
      addresses: {
        token: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        vault: '0x6bd0d8c8ad8d3f1f97810d5cc57e9296db73dc45',
      },
    }
  ],
  status: 'idle',
};


// actions - getters
export const getTotalDeposits = async (contract: Mono): Promise<BigNumber> => {
  return await contract.totalHoldings();
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

const userCanWithdraw = async (contract: Mono, user: string): Promise<boolean> => {
  /**
   * Fetch batchburnindex & compare the batchBurnIndexForUser
   * (batchBurnForUser < batchBurnIndex) indicates user has something to withdraw
   */
  const batchBurnIndex = await contract.batchBurnIndex();

  // @dev check with dantop
  const batchBurnIndexForUser = await contract.userBatchBurnLastRequest(user);
  return batchBurnIndex.gt(batchBurnIndexForUser);
}

const getBalanceOfUser = async (token: Erc20, userAddress: string): Promise<BigNumber> => {
  return await token.balanceOf(userAddress);
}

const toScale = (amount: number, decimals: number) => BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));

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
    await contract.deposit(amount);
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

export const vaultSlice = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<{ name: string, stats: VaultStats }>) => {
      const vault = state.vaults.find(a => a.name === action.payload.name);
      if (vault) vault.stats = action.payload.stats;
    },
  },
});

export const { setStats } = vaultSlice.actions;
export default vaultSlice.reducer;
