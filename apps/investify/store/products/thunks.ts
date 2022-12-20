import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  BigNumber,
  BigNumberish,
  BytesLike,
  ContractTransaction,
  ethers,
} from 'ethers';
import {
  YieldvaultAbi,
  Erc20Abi,
  MerkleauthAbi,
  TokenLockerAbi,
  XAUXOAbi,
  VeAUXOAbi,
  AUXOAbi,
} from '@shared/util-blockchain';
import filter from 'lodash/filter';
import find from 'lodash/find';
import { promiseObject } from '../../utils/promiseObject';
import { percentageBetween, toBalance } from '../../utils/formatBalance';
import {
  contractWrappers,
  FTMAuthContractWrapper,
  PolygonAuthContractWrapper,
  FTMContractWrappers,
  PolygonContractWrappers,
  underlyingContractsFTMWrappers,
  underlyingContractsPolygonWrappers,
  stakingContract,
  xAUXOStakingManager,
  xAUXOContract,
  veAUXOContract,
} from './products.contracts';
import { BigNumberReference, Tokens, Vault, Vaults } from './products.types';
import { vaults as vaultConfigs } from '../../config/auxoVaults';
import { calculateSharesAvailable } from '../../utils/sharesAvailable';
import { pendingNotification } from '../../components/Notifications/Notifications';
import { setStep, setTx, setTxHash, setTxState } from '../modal/modal.slice';
import { Steps, STEPS, TX_STATES } from '../modal/modal.types';
import { getPermitSignature } from '../../utils/permit';
import { JsonRpcSigner } from '@ethersproject/providers';
import { ONE_HOUR_DEADLINE } from '../../utils/constants';

export const THUNKS = {
  GET_PRODUCTS_DATA: 'app/getProductsData',
  GET_VE_AUXO_STAKING_DATA: 'app/getVeAUXOStakingData',
  GET_X_AUXO_STAKING_DATA: 'app/getXAUXOStakingData',
  GET_VAULTS_DATA: 'app/getVaultsData',
  GET_USER_PRODUCTS_DATA: 'app/getUserProductsData',
  GET_USER_STAKING_DATA: 'app/getUserStakingData',
  GET_USER_VAULTS_DATA: 'app/getUserVaultsData',
  VAULT_INCREASE_WITHDRAWAL: 'vault/increaseWithdrawal',
  VAULT_APPROVE_DEPOSIT: 'vault/approveDeposit',
  VAULT_MAKE_DEPOSIT: 'vault/makeDeposit',
  VAULT_CONFIRM_WITHDRAWAL: 'vault/confirmWithdrawal',
  AUTHORIZE_DEPOSITOR: 'vault/authorizrDepositor',
  APPROVE_STAKE_AUXO: 'veAUXO/approveStakeAUXO',
  STAKE_AUXO: 'veAUXO/stakeAUXO',
  INCREASE_STAKE_AUXO: 'veAUXO/increaseStakeAUXO',
  STAKE_X_AUXO: 'xAUXO/stakeXAUXO',
  BOOST_VE_AUXO: 'veAUXO/boostVeAUXO',
  INCREASE_LOCK_VE_AUXO: 'veAUXO/increaseLockVeAUXO',
  WITHDRAW_VE_AUXO: 'veAUXO/withdrawVeAUXO',
};

const sum = (x: ethers.BigNumber, y: ethers.BigNumber) => x.add(y);
const sumBalance = (x: number, y: number) => x + y;

export const thunkGetProductsData = createAsyncThunk(
  THUNKS.GET_PRODUCTS_DATA,
  async () => {
    const productDataResults = await Promise.allSettled(
      contractWrappers.map((contractWrapper) => {
        const results = promiseObject({
          productDecimals: contractWrapper.decimals(),
          symbol: contractWrapper.symbol(),
          addresses: contractWrapper._multichainConfig,
        });
        return results;
      }),
    );
    const results = productDataResults.map((result): Tokens => {
      if (result.status === 'fulfilled') {
        return {
          [result.value.symbol]: {
            productDecimals: result.value.productDecimals,
            chainInfo: Object.assign(
              {},
              ...Object.entries(result.value.addresses).map(
                ([chainId, config]) => ({
                  [chainId]: {
                    address: config.address,
                  },
                }),
              ),
            ),
          },
        };
      }
    });
    return Object.assign({}, ...results);
  },
);

export const thunkGetUserProductsData = createAsyncThunk(
  THUNKS.GET_USER_PRODUCTS_DATA,
  async ({ account, spender }: { account: string; spender?: string }) => {
    if (!account) return;
    const productDataResults = await Promise.allSettled(
      contractWrappers.map((contractWrapper) => {
        const results = promiseObject({
          balances: contractWrapper.multichain.balanceOf(account),
          productDecimals: contractWrapper.decimals(),
          symbol: contractWrapper.symbol(),
          addresses: contractWrapper._multichainConfig,
          allowances: spender
            ? contractWrapper.multichain.allowance(account, spender)
            : null,
        });
        return results;
      }),
    );

    const enrichWithTotalBalance = productDataResults.map((result): Tokens => {
      if (result.status === 'fulfilled' && result.value.balances.data) {
        const filterFulfilled = Object.values(
          result.value.balances.data,
        ).filter(
          (value) => value.status === 'fulfilled',
        ) as PromiseFulfilledResult<BigNumber>[];
        const totalBalanceBN = filterFulfilled
          .map((balance) => balance.value)
          .reduce(sum, ethers.constants.Zero);
        const totalBalance = toBalance(
          totalBalanceBN,
          result.value.productDecimals,
        );

        const balances = Object.entries(result.value.balances.data).filter(
          ([, value]) => value.status === 'fulfilled',
        ) as [string, PromiseFulfilledResult<BigNumber>][];

        const balancesFormatted = balances.map(([key, amount]) => ({
          [key]: toBalance(amount.value, result.value.productDecimals),
        }));

        let allowancesFormatted: { [x: string]: BigNumberReference }[];

        if (result?.value?.allowances?.data && spender) {
          const allowances = Object.entries(
            result.value.allowances.data,
          ).filter(([, value]) => value.status === 'fulfilled') as [
            string,
            PromiseFulfilledResult<BigNumber>,
          ][];
          allowancesFormatted = allowances.map(([key, amount]) => ({
            [key]: toBalance(amount.value, result.value.productDecimals),
          }));
        }

        return {
          [result.value.symbol]: {
            chainInfo: Object.assign(
              {},
              ...Object.entries(result.value.addresses).map(
                ([chainId, config]) => ({
                  [chainId]: {
                    address: config.address,
                    balance: balancesFormatted.find(
                      (balance) => balance[chainId],
                    )?.[chainId],
                    allowance:
                      spender && allowancesFormatted
                        ? {
                            [spender]: allowancesFormatted.find(
                              (allowance) => allowance[chainId],
                            )?.[chainId],
                          }
                        : null,
                  },
                }),
              ),
            ),
            productDecimals: result.value.productDecimals,
            totalBalance,
          },
        };
      }
    });

    const totalBalances = enrichWithTotalBalance
      .map((result) => {
        return Number(Object.values(result)[0].totalBalance.label);
      })
      .reduce(sumBalance, 0);

    const tokens = Object.assign({}, ...enrichWithTotalBalance);

    const networksUsed = enrichWithTotalBalance.map((result) => {
      return Object.values(result)[0].chainInfo;
    });

    const uniqueNetworksPerChain = Object.assign(
      {},
      ...Object.values(networksUsed),
    );

    const uniqueNetworks = filter(
      uniqueNetworksPerChain,
      ({ label }) => label !== 0,
    ).length;

    const totalAssets = enrichWithTotalBalance.filter((result) => {
      return Object.values(result)[0].totalBalance.label !== 0;
    }).length;

    return {
      tokens,
      uniqueNetworks,
      totalAssets,
      totalBalances,
    };
  },
);

export const thunkGetVeAUXOStakingData = createAsyncThunk(
  THUNKS.GET_VE_AUXO_STAKING_DATA,
  async () => {
    const results = promiseObject({
      stakingAmount: contractWrappers[0].balanceOf(stakingContract.address),
      stakingToken: stakingContract.depositToken(),
      decimals: veAUXOContract.decimals(),
      totalSupply: veAUXOContract.totalSupply(),
    });

    const stakingData = await results;

    return {
      ['veAUXO']: {
        stakingAmount: toBalance(
          stakingData.stakingAmount,
          stakingData.decimals,
        ),
        stakingToken: stakingData.stakingToken,
        totalSupply: toBalance(stakingData.totalSupply, stakingData.decimals),
      },
    };
  },
);

export const thunkGetXAUXOStakingData = createAsyncThunk(
  THUNKS.GET_X_AUXO_STAKING_DATA,
  async () => {
    const results = promiseObject({
      stakingAmount: veAUXOContract.balanceOf(xAUXOStakingManager.address),
      decimals: xAUXOContract.decimals(),
      totalSupply: xAUXOContract.totalSupply(),
      fee: xAUXOContract.entryFee(),
    });

    const stakingData = await results;

    return {
      ['xAUXO']: {
        stakingAmount: toBalance(
          stakingData.stakingAmount,
          stakingData.decimals,
        ),
        totalSupply: toBalance(stakingData.totalSupply, stakingData.decimals),
        fee: toBalance(stakingData.fee, stakingData.decimals),
      },
    };
  },
);

export const thunkGetUserStakingData = createAsyncThunk(
  THUNKS.GET_USER_STAKING_DATA,
  async ({ account }: { account: string }) => {
    if (!account) return;

    const results = promiseObject({
      lock: stakingContract.lockOf(account),
      decimals: veAUXOContract.decimals(),
      totalSupply: veAUXOContract.totalSupply(),
      votes: veAUXOContract.getVotes(account),
      delegation: veAUXOContract.delegates(account),
    });

    const userStakingData = await results;
    return {
      ['veAUXO']: {
        userStakingData: {
          amount: toBalance(
            userStakingData.lock.amount,
            userStakingData.decimals,
          ),
          lockedAt: userStakingData.lock.lockedAt,
          lockDuration: userStakingData.lock.lockDuration,
          votingPower: percentageBetween(
            userStakingData.votes,
            userStakingData.totalSupply,
            userStakingData.decimals,
          ),
          delegator: userStakingData.delegation,
        },
      },
    };
  },
);

export const thunkGetVaultsData = createAsyncThunk(
  THUNKS.GET_VAULTS_DATA,
  async () => {
    const vaultsData = [
      ...PolygonContractWrappers.map(async (auxo) => {
        const findUnderlyingAddress = find(vaultConfigs, {
          address: auxo.address,
        }).token.address;
        const underlyingTokenContract = find(
          underlyingContractsPolygonWrappers,
          {
            address: findUnderlyingAddress,
          },
        );
        const results = promiseObject({
          address: auxo.address,
          underlyingSymbol: underlyingTokenContract.symbol(),
          name: auxo.name(),
          symbol: auxo.symbol(),
          chainId: 137,
          tokenDecimals: auxo.underlyingDecimals(),
          tokenAddress: auxo.underlying(),
          authAddress: auxo.auth(),
          capUnderlying: auxo.userDepositLimit(),
          statsDeposit: auxo.totalUnderlying(),
          statsLastHarvest: auxo.lastHarvest(),
          statsCurrentAPY: auxo.estimatedReturn(),
          statsBatchBurnRound: auxo.batchBurnRound(),
          statsExchangeRate: auxo.exchangeRate(),
        });
        return results;
      }),
      ...FTMContractWrappers.map((ftm) => {
        const findUnderlyingAddress = find(vaultConfigs, {
          address: ftm.address,
        }).token.address;
        const underlyingTokenContract = find(underlyingContractsFTMWrappers, {
          address: findUnderlyingAddress,
        });
        const results = promiseObject({
          address: ftm.address,
          underlyingSymbol: underlyingTokenContract.symbol(),
          name: ftm.name(),
          symbol: ftm.symbol(),
          chainId: 250,
          tokenDecimals: ftm.underlyingDecimals(),
          tokenAddress: ftm.underlying(),
          authAddress: ftm.auth(),
          capUnderlying: ftm.userDepositLimit(),
          statsDeposit: ftm.totalUnderlying(),
          statsLastHarvest: ftm.lastHarvest(),
          statsCurrentAPY: ftm.estimatedReturn(),
          statsBatchBurnRound: ftm.batchBurnRound(),
          statsExchangeRate: ftm.exchangeRate(),
        });
        return results;
      }),
    ];

    const resolvedVaults = await Promise.allSettled(vaultsData);

    const orderedVaults = Object.values(resolvedVaults).map((result) => {
      if (result.status === 'fulfilled') {
        const filterFulfilled = {
          [result.value.name]: {
            address: result.value.address,
            name: result.value.name,
            symbol: result.value.symbol,
            underlyingSymbol: result.value.underlyingSymbol,
            chainId: result.value.chainId,
            token: {
              decimals: result.value.tokenDecimals,
              address: result.value.tokenAddress,
            },
            auth: {
              address: result.value.authAddress,
            },
            cap: {
              underlying: toBalance(
                result.value.capUnderlying,
                result.value.tokenDecimals,
              ),
            },
            stats: {
              deposits: toBalance(
                result.value.statsDeposit,
                result.value.tokenDecimals,
              ),
              lastHarvest: result.value.statsLastHarvest.toNumber(),
              currentAPY: toBalance(
                result.value.statsCurrentAPY,
                result.value.tokenDecimals,
              ),
              batchBurnRound: result.value.statsBatchBurnRound.toNumber(),
              exchangeRate: toBalance(
                result.value.statsExchangeRate,
                result.value.tokenDecimals,
              ),
            },
          },
        };
        return filterFulfilled;
      }
    });
    return Object.assign({}, ...orderedVaults);
  },
);

export const thunkGetUserVaultsData = createAsyncThunk(
  THUNKS.GET_USER_VAULTS_DATA,
  async (account: string) => {
    if (!account) return;

    const authContractsData = [
      ...PolygonContractWrappers.map(async (auxo) => {
        const auth = promiseObject({
          auth: auxo.auth(),
          address: auxo.address,
        });
        return auth;
      }),
      ...FTMContractWrappers.map((ftm) => {
        const auth = promiseObject({
          auth: ftm.auth(),
          address: ftm.address,
        });
        return auth;
      }),
    ];

    const batchBurnsVaultData = [
      ...PolygonContractWrappers.map(async (auxo) => {
        const batchBurn = promiseObject({
          batchBurnRound: auxo.batchBurnRound(),
          address: auxo.address,
        });
        return batchBurn;
      }),
      ...FTMContractWrappers.map((ftm) => {
        const batchBurn = promiseObject({
          batchBurnRound: ftm.batchBurnRound(),
          address: ftm.address,
        });
        return batchBurn;
      }),
    ];
    const vaultsData = (
      batchBurns: {
        batchBurnRound: BigNumber;
        address: string;
      }[],
      auths: {
        auth: string;
        address: string;
      }[],
    ) => [
      ...PolygonContractWrappers.map((auxo) => {
        const findUnderlyingAddress = find(vaultConfigs, {
          address: auxo.address,
        }).token.address;
        const underlyingTokenContract = find(
          underlyingContractsPolygonWrappers,
          {
            address: findUnderlyingAddress,
          },
        );

        const authAddress = find(auths, {
          address: auxo.address,
        }).auth;

        const batchBurnRound = find(batchBurns, {
          address: auxo.address,
        }).batchBurnRound.toNumber();
        const results = promiseObject({
          vault: auxo.balanceOf(account),
          wallet: underlyingTokenContract.balanceOf(account),
          vaultUnderlying: auxo.balanceOfUnderlying(account),
          allowance: underlyingTokenContract.allowance(account, auxo.address),
          isDepositor: PolygonAuthContractWrapper(authAddress).isDepositor(
            auxo.address,
            account,
          ),
          userBatchBurnReceipts: auxo.userBatchBurnReceipts(account),
          batchBurnRound,
          batchBurns:
            batchBurnRound > 0
              ? auxo.batchBurns(batchBurnRound - 1)
              : auxo.batchBurns(batchBurnRound),
          name: auxo.name(),
          chainId: 137,
          decimals: auxo.decimals(),
        });
        return results;
      }),
      ...FTMContractWrappers.map((ftm) => {
        const findUnderlyingAddress = find(vaultConfigs, {
          address: ftm.address,
        }).token.address;
        const underlyingTokenContract = find(underlyingContractsFTMWrappers, {
          address: findUnderlyingAddress,
        });

        const authAddress = find(auths, {
          address: ftm.address,
        }).auth;

        const batchBurnRound = find(batchBurns, {
          address: ftm.address,
        }).batchBurnRound.toNumber();
        const results = promiseObject({
          vault: ftm.balanceOf(account),
          wallet: underlyingTokenContract.balanceOf(account),
          vaultUnderlying: ftm.balanceOfUnderlying(account),
          allowance: underlyingTokenContract.allowance(account, ftm.address),
          isDepositor: FTMAuthContractWrapper(authAddress).isDepositor(
            ftm.address,
            account,
          ),
          userBatchBurnReceipts: ftm.userBatchBurnReceipts(account),
          batchBurns:
            batchBurnRound > 0
              ? ftm.batchBurns(batchBurnRound - 1)
              : ftm.batchBurns(batchBurnRound),
          batchBurnRound,
          name: ftm.name(),
          chainId: 250,
          decimals: ftm.decimals(),
        });
        return results;
      }),
    ];

    const batchBurnData = await Promise.allSettled(batchBurnsVaultData);
    const BatchBurnValues = Object.values(batchBurnData).map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
    });

    const authData = await Promise.allSettled(authContractsData);
    const authDataValues = Object.values(authData).map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
    });

    const resolvedVaults = await Promise.allSettled(
      vaultsData(BatchBurnValues, authDataValues),
    );
    const orderedVaults = Object.values(resolvedVaults).map((result) => {
      if (result.status === 'fulfilled') {
        const filterFulfilled = {
          [result.value.name]: {
            auth: {
              isDepositor: result.value.isDepositor,
            },
            userBalances: {
              wallet: toBalance(result.value.wallet, result.value.decimals),
              vault: toBalance(result.value.vault, result.value.decimals),
              vaultUnderlying: toBalance(
                result.value.vaultUnderlying,
                result.value.decimals,
              ),
              allowance: toBalance(
                result.value.allowance,
                result.value.decimals,
              ),
              batchBurn: {
                round: result.value.userBatchBurnReceipts.round.toNumber(),
                shares: toBalance(
                  result.value.userBatchBurnReceipts.shares,
                  result.value.decimals,
                ),
                available: calculateSharesAvailable({
                  shares: result.value.userBatchBurnReceipts.shares,
                  amountPerShare: result.value.batchBurns.amountPerShare,
                  decimals: result.value.decimals,
                  batchBurnRound: result.value.batchBurnRound,
                  userBatchBurnRound:
                    result.value.userBatchBurnReceipts.round.toNumber(),
                }),
              },
            },
          },
        };
        return filterFulfilled;
      }
    });

    const vaults = Object.assign({}, ...orderedVaults) as Vaults;

    const totalAssets = Object.values(vaults).filter((value) => {
      return value.userBalances.vault.label !== 0;
    }) as Vault[];

    const totalBalances = totalAssets
      .map((result) => {
        return result.userBalances.vault.label;
      })
      .reduce(sumBalance, 0);

    const chainUsed = totalAssets.map((result) => {
      return result.chainId;
    });

    return {
      vaults,
      totalAssets: totalAssets.length,
      totalBalances,
      chainUsed: [...new Set(chainUsed)].length,
    };
  },
);

/**
 * Start the batch burn process by requesting the burning of the users' existing auxo tokens.
 * Users can increase the number of tokens to be converted up and until the batch burn process has completed.
 */
export type ThunkIncreaseWithdrawalProps = {
  withdraw: BigNumberReference;
  auxo: YieldvaultAbi | undefined;
};
export const thunkIncreaseWithdrawal = createAsyncThunk(
  THUNKS.VAULT_INCREASE_WITHDRAWAL,
  async (
    { withdraw, auxo }: ThunkIncreaseWithdrawalProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!auxo) return rejectWithValue('Missing Contract or Selected Vault');
    const tx = await auxo.enterBatchBurn(withdraw.value);

    pendingNotification({
      title: `increaseWithdrawalPending`,
      id: 'increaseWithdrawal',
    });

    const receipt = await tx.wait();
    const addressFromSigner = await auxo.signer.getAddress();

    if (receipt.status === 1) {
      dispatch(thunkGetUserVaultsData(addressFromSigner));
      dispatch(thunkGetVaultsData());
    }

    return receipt.status === 1
      ? { withdraw }
      : rejectWithValue('Exit Batch Burn Failed');
  },
);

export type ThunkApproveDepositProps = {
  deposit: BigNumberReference;
  token: Erc20Abi | undefined;
  spender: string;
};
export const thunkApproveDeposit = createAsyncThunk(
  THUNKS.VAULT_APPROVE_DEPOSIT,
  async (
    { deposit, token, spender }: ThunkApproveDepositProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!token || !spender)
      return rejectWithValue('Missing token or selected vault');
    const tx = await token.approve(spender, deposit.value);

    pendingNotification({
      title: `approveDepositPending`,
      id: 'approveDeposit',
    });
    const receipt = await tx.wait();
    const addressFromSigner = await token.signer.getAddress();

    if (receipt.status === 1) {
      dispatch(thunkGetUserVaultsData(addressFromSigner));
      dispatch(thunkGetVaultsData());
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Approval Failed');
  },
);

/**
 * Actually make the deposit of underlying tokens into the auxo vault
 */
export type ThunkMakeDepositProps = {
  deposit: BigNumberReference;
  auxo: YieldvaultAbi | undefined;
  account: string | null | undefined;
};
export const thunkMakeDeposit = createAsyncThunk(
  THUNKS.VAULT_MAKE_DEPOSIT,
  async (
    { deposit, auxo, account }: ThunkMakeDepositProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!auxo || !account)
      return rejectWithValue(
        'Missing Contract, Selected Vault or Account Details',
      );
    const tx = await auxo.deposit(account, deposit.value);

    pendingNotification({
      title: `makeDepositPending`,
      id: 'makeDeposit',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(thunkGetUserVaultsData(account));
      dispatch(thunkGetVaultsData());
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Deposit Failed');
  },
);

/**
 * Exits the batch burn process, converting all shares currently awaiting a burn into the underlying
 * currency.
 */
export type ThunkConfirmWithdrawProps = {
  pendingSharesUnderlying: BigNumberReference;
  auxo: YieldvaultAbi | undefined;
};
export const thunkConfirmWithdrawal = createAsyncThunk(
  THUNKS.VAULT_CONFIRM_WITHDRAWAL,
  async (
    { pendingSharesUnderlying, auxo }: ThunkConfirmWithdrawProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!auxo) return rejectWithValue('Missing Contract');
    const tx = await auxo.exitBatchBurn();

    pendingNotification({
      title: `confirmWithdrawalPending`,
      id: 'confirmWithdrawal',
    });

    const receipt = await tx.wait();
    const addressFromSigner = await auxo.signer.getAddress();

    if (receipt.status === 1) {
      dispatch(thunkGetUserVaultsData(addressFromSigner));
      dispatch(thunkGetVaultsData());
    }

    return receipt.status === 1
      ? { pendingSharesUnderlying }
      : rejectWithValue('Enter Batch Burn Failed');
  },
);

export type ThunkAuthorizeDepositorProps = {
  account: string | null | undefined;
  auth: MerkleauthAbi | undefined;
  proof: BytesLike[];
};

export const thunkAuthorizeDepositor = createAsyncThunk(
  THUNKS.AUTHORIZE_DEPOSITOR,
  async (
    { account, auth, proof }: ThunkAuthorizeDepositorProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!auth || !account)
      return rejectWithValue(
        'Missing Auth Contract, Selected Vault or account details',
      );
    if (!proof)
      return rejectWithValue(
        'The current account is unauthorized to use this vault.',
      );
    const tx = await auth.authorizeDepositor(account, proof);

    pendingNotification({
      title: `authorizeDepositorPending`,
      id: 'authorizeDepositor',
    });

    const receipt = await tx.wait();

    const addressFromSigner = await auth.signer.getAddress();

    if (receipt.status === 1) {
      dispatch(thunkGetUserVaultsData(addressFromSigner));
      dispatch(thunkGetVaultsData());
    }
    if (receipt.status !== 1) return rejectWithValue('Authorization Failed');
  },
);

export type ThunkApproveTokenProps = {
  deposit: BigNumberReference;
  token: Erc20Abi | XAUXOAbi | VeAUXOAbi | undefined;
  spender: string;
  nextStep: Steps;
};
export const thunkApproveToken = createAsyncThunk(
  THUNKS.APPROVE_STAKE_AUXO,
  async (
    { deposit, token, spender, nextStep }: ThunkApproveTokenProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!token || !spender)
      return rejectWithValue('Missing token or staking contract');
    const tx = await token.approve(spender, deposit.value);

    pendingNotification({
      title: `approveDepositPending`,
      id: 'approveDeposit',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();
    const addressFromSigner = await token.signer.getAddress();

    if (receipt.status === 1) {
      dispatch(setTxState(TX_STATES.COMPLETE));
      dispatch(setStep(nextStep));
      dispatch(
        thunkGetUserProductsData({ account: addressFromSigner, spender }),
      );
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Approval Failed');
  },
);

/**
 * Actually make the deposit of underlying tokens into the auxo vault
 */
export type ThunkStakeAuxoProps = {
  signer: JsonRpcSigner;
  deposit: BigNumberReference;
  stakingTime: BigNumberish;
  tokenLocker: TokenLockerAbi | undefined;
  AUXOToken: AUXOAbi;
  account: string | null | undefined;
};
export const thunkStakeAuxo = createAsyncThunk(
  THUNKS.STAKE_AUXO,
  async (
    {
      deposit,
      tokenLocker,
      account,
      stakingTime,
      signer,
      AUXOToken,
    }: ThunkStakeAuxoProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!tokenLocker || !account || !stakingTime || !deposit)
      return rejectWithValue('Missing Contract, Account Details or Deposit');
    dispatch(setTxHash(null));

    const deadline = Math.floor(
      Date.now() / 1000 + ONE_HOUR_DEADLINE,
    ).toString();

    let tx: ContractTransaction;
    let r: string;
    let v: number;
    let s: string;

    try {
      ({ r, v, s } = await getPermitSignature(
        signer,
        AUXOToken,
        tokenLocker.address,
        deposit.value,
        deadline,
      ));
    } catch (e) {
      console.error(e);
      return rejectWithValue('Permit Signature Failed');
    }

    try {
      tx = await tokenLocker.depositByMonthsWithSignature(
        deposit.value,
        stakingTime,
        signer._address,
        deadline,
        v,
        r,
        s,
      );
    } catch (e) {
      console.error(e);
      return rejectWithValue('Deposit Failed');
    }

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `stakeAuxoPending`,
      id: 'stakeAuxo',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setStep(STEPS.STAKE_COMPLETED));
      dispatch(thunkGetVeAUXOStakingData());
      dispatch(thunkGetUserStakingData({ account }));
      dispatch(
        thunkGetUserProductsData({ account, spender: tokenLocker.address }),
      );
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Deposit Failed');
  },
);

export type ThunkIncreaseStakeAuxoProps = {
  deposit: BigNumberReference;
  tokenLocker: TokenLockerAbi | undefined;
  signer: JsonRpcSigner;
  AUXOToken: AUXOAbi;
};

export const thunkIncreaseStakeAuxo = createAsyncThunk(
  THUNKS.INCREASE_STAKE_AUXO,
  async (
    { signer, deposit, tokenLocker, AUXOToken }: ThunkIncreaseStakeAuxoProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!tokenLocker || !deposit)
      return rejectWithValue('Missing Contract, Account Details or Deposit');
    dispatch(setTxHash(null));

    const deadline = Math.floor(
      Date.now() / 1000 + ONE_HOUR_DEADLINE,
    ).toString();

    let tx: ContractTransaction;
    let r: string;
    let v: number;
    let s: string;

    try {
      ({ r, v, s } = await getPermitSignature(
        signer,
        AUXOToken,
        tokenLocker.address,
        deposit.value,
        deadline,
      ));
    } catch (e) {
      console.error(e);
      return rejectWithValue('Permit Signature Failed');
    }

    try {
      tx = await tokenLocker.increaseAmountWithSignature(
        deposit.value,
        deadline,
        v,
        r,
        s,
      );
    } catch (e) {
      console.error(e);
      return rejectWithValue('Increase Amount Failed');
    }

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `increaseStakeAuxoPending`,
      id: 'increaseStakeAuxo',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setStep(STEPS.STAKE_COMPLETED));
      dispatch(thunkGetVeAUXOStakingData());
      dispatch(thunkGetUserStakingData({ account: signer._address }));
      dispatch(
        thunkGetUserProductsData({
          account: signer._address,
          spender: tokenLocker.address,
        }),
      );
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Deposit Failed');
  },
);

export type ThunkBoostToMaxVeAUXO = {
  account: string;
  tokenLocker: TokenLockerAbi | undefined;
};

export const thunkBoostToMaxVeAUXO = createAsyncThunk(
  THUNKS.BOOST_VE_AUXO,
  async (
    { account, tokenLocker }: ThunkBoostToMaxVeAUXO,
    { rejectWithValue, dispatch },
  ) => {
    if (!tokenLocker || !account)
      return rejectWithValue('Missing Contract or Account Details');
    dispatch(setTxHash(null));

    const tx = await tokenLocker.boostToMax();

    // set block explorer transaction hash

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `boostVeAuxoPending`,
      id: 'boostToMaxVeAuxo',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(thunkGetVeAUXOStakingData());
      dispatch(thunkGetUserStakingData({ account }));
      dispatch(
        thunkGetUserProductsData({
          account,
          spender: tokenLocker.address,
        }),
      );
    }

    if (receipt.status !== 1) return rejectWithValue('Boost Failed');
  },
);

export type ThunkWithdrawFromVeAUXO = {
  tokenLocker: TokenLockerAbi | undefined;
  account: string;
};

export const thunkWithdrawFromVeAUXO = createAsyncThunk(
  THUNKS.WITHDRAW_VE_AUXO,
  async (
    { account, tokenLocker }: ThunkBoostToMaxVeAUXO,
    { rejectWithValue, dispatch },
  ) => {
    if (!tokenLocker || !account)
      return rejectWithValue('Missing Contract or Account Details');
    dispatch(setTxHash(null));

    const tx = await tokenLocker.withdraw();

    // set block explorer transaction hash

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `withdrawVeAuxoPending`,
      id: 'withdrawVeAuxo',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(thunkGetVeAUXOStakingData());
      dispatch(thunkGetUserStakingData({ account }));
      dispatch(
        thunkGetUserProductsData({
          account,
          spender: tokenLocker.address,
        }),
      );
    }

    if (receipt.status !== 1) return rejectWithValue('Withdraw Failed');
  },
);

export type ThunkIncreaseLockVeAUXO = {
  tokenLocker: TokenLockerAbi | undefined;
  account: string;
  months: number;
};

export const thunkIncreaseLockVeAUXO = createAsyncThunk(
  THUNKS.INCREASE_LOCK_VE_AUXO,
  async (
    { months, account, tokenLocker }: ThunkIncreaseLockVeAUXO,
    { rejectWithValue, dispatch },
  ) => {
    if (!tokenLocker || !months || !account)
      return rejectWithValue('Missing Contract, Account Details or months');

    dispatch(setTxHash(null));

    const tx = await tokenLocker.increaseByMonths(months);

    // set block explorer transaction hash

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `increaseLockVeAuxoPending`,
      id: 'increaseLockVeAuxo',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(thunkGetVeAUXOStakingData());
      dispatch(thunkGetUserStakingData({ account }));
      dispatch(
        thunkGetUserProductsData({
          account,
          spender: tokenLocker.address,
        }),
      );
    }

    if (receipt.status !== 1) return rejectWithValue('Withdraw Failed');
  },
);

export type ThunkStakeXAUXOProps = {
  deposit: BigNumberReference;
  xAUXOContract: XAUXOAbi | undefined;
  account: string;
};

export const thunkStakeXAUXO = createAsyncThunk(
  THUNKS.STAKE_X_AUXO,
  async (
    { account, deposit, xAUXOContract }: ThunkStakeXAUXOProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!deposit || !xAUXOContract || !account)
      return rejectWithValue('Missing Contract, Account Details or Deposit');

    dispatch(setTxHash(null));
    const tx = await xAUXOContract.depositFor(account, deposit.value);

    // set block explorer transaction hash

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `stakeXAUXOPending`,
      id: 'stakeXAUXODeposit',
    });

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setStep(STEPS.STAKE_COMPLETED));
      dispatch(thunkGetXAUXOStakingData());
      dispatch(thunkGetUserStakingData({ account }));
      dispatch(
        thunkGetUserProductsData({
          account,
          spender: xAUXOContract.address,
        }),
      );
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Deposit Failed');
  },
);
