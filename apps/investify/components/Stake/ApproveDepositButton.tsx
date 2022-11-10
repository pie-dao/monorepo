import { useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '../../hooks';
import {
  useApprovalLimit,
  useCurrentTokenContract,
  useTokenBalance,
} from '../../hooks/useToken';
import { BigNumberReference } from '../../store/products/products.types';
import { compareBalances, zeroBalance } from '../../utils/balances';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import {
  thunkApproveDeposit,
  thunkStakeAuxo,
} from '../../store/products/thunks';
import { SetStateType } from '../../types/utilities';
import useTranslation from 'next-translate/useTranslation';
import { TokenConfig } from '../../types/tokensConfig';
import { useStakingTokenContract } from '../../hooks/useContracts';

function ApproveDepositButton({
  deposit,
  tokenConfig,
}: {
  deposit: BigNumberReference;
  tokenConfig: TokenConfig;
}) {
  const [approving, setApproving] = useState(false);
  const dispatch = useAppDispatch();
  const tokenContract = useCurrentTokenContract(tokenConfig.name);
  const tokens = useTokenBalance(tokenConfig.name);
  const { limit } = useApprovalLimit(tokenConfig.name);
  const stakingContract = useStakingTokenContract(tokenConfig.name);

  const buttonDisabled = useMemo(() => {
    const invalidDepost = deposit.label <= 0;
    const sufficientApproval =
      compareBalances(limit, 'gte', deposit) &&
      compareBalances(tokens, 'gte', deposit);
    return !sufficientApproval || invalidDepost || approving;
  }, [deposit, limit, tokens, approving]);

  const approveDeposit = () => {
    setApproving(true);
    dispatch(
      thunkApproveDeposit({
        deposit,
        token: tokenContract,
        spender: stakingContract.address,
      }),
    ).finally(() => setApproving(false));
  };

  return (
    <button
      disabled={buttonDisabled || deposit.value === '0'}
      onClick={approveDeposit}
      className="w-full px-8 py-3 text-lg font-medium text-white bg-secondary rounded-2xl ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
      data-cy="approve-button"
    >
      {approving ? <LoadingSpinner /> : 'Approve'}
    </button>
  );
}

function DepositButtons({
  deposit,
  setDeposit,
  tokenConfig,
  stakingTime,
}: {
  deposit: BigNumberReference;
  setDeposit: SetStateType<BigNumberReference>;
  tokenConfig: TokenConfig;
  stakingTime: number;
}) {
  const [depositing, setDepositing] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { limit } = useApprovalLimit(tokenConfig.name);
  const tokens = useTokenBalance(tokenConfig.name);
  const stakingContract = useStakingTokenContract(tokenConfig.name);

  const buttonDisabled = useMemo(() => {
    const invalidDepost = deposit.label <= 0;
    const sufficientApproval =
      compareBalances(limit, 'gte', deposit) &&
      compareBalances(tokens, 'gte', deposit);
    return !sufficientApproval || invalidDepost || depositing;
  }, [deposit, limit, tokens, depositing]);

  const makeDeposit = () => {
    setDepositing(true);
    dispatch(
      thunkStakeAuxo({
        deposit,
        tokenLocker: stakingContract,
        stakingTime,
        account,
      }),
    )
      .then(() => setDeposit(zeroBalance))
      .finally(() => setDepositing(false));
  };

  return (
    <button
      className="w-full px-8 py-1 text-lg font-medium text-secondary bg-transparent rounded-2xl ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70"
      disabled={buttonDisabled}
      onClick={makeDeposit}
      data-cy="deposit-button"
    >
      {t('Deposit')}
    </button>
  );
}

function DepositActions({
  deposit,
  setDeposit,
  tokenConfig,
  stakingTime,
}: {
  deposit: BigNumberReference;
  setDeposit: SetStateType<BigNumberReference>;
  tokenConfig: TokenConfig;
  stakingTime: number;
}) {
  return (
    <div className="flex justify-between items-center gap-x-4 flex-wrap gap-y-4">
      <ApproveDepositButton deposit={deposit} tokenConfig={tokenConfig} />
      <DepositButtons
        deposit={deposit}
        stakingTime={stakingTime}
        setDeposit={setDeposit}
        tokenConfig={tokenConfig}
      />
    </div>
  );
}

export default DepositActions;
