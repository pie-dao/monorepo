import { useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '../../hooks';
import {
  useApprovalLimit,
  useSelectedVault,
  useUserTokenBalance,
} from '../../hooks/useSelectedVault';
import {
  useTokenContract,
  useAuxoVaultContract,
} from '../../hooks/useContracts';
import { BigNumberReference } from '../../store/products/products.types';
import { compareBalances, zeroBalance } from '../../utils/balances';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import {
  thunkApproveDeposit,
  thunkMakeDeposit,
} from '../../store/products/thunks';
import { SetStateType } from '../../types/utilities';

function ApproveDepositButton({ deposit }: { deposit: BigNumberReference }) {
  const [approving, setApproving] = useState(false);
  const dispatch = useAppDispatch();
  const vault = useSelectedVault();
  const { limit } = useApprovalLimit();
  const tokenContract = useTokenContract(vault?.token.address);

  const approveDeposit = () => {
    setApproving(true);
    dispatch(
      thunkApproveDeposit({
        deposit,
        token: tokenContract,
        vaultAddress: vault.address,
      }),
    ).finally(() => setApproving(false));
  };

  return (
    <button
      disabled={
        deposit.value === '0' ||
        compareBalances(limit, 'gte', deposit) ||
        approving
      }
      onClick={approveDeposit}
      className="w-full px-8 py-3 text-lg font-medium text-white bg-secondary rounded-2xl ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
    >
      {approving ? <LoadingSpinner /> : 'Approve'}
    </button>
  );
}

function DepositButtons({
  deposit,
  setDeposit,
}: {
  deposit: BigNumberReference;
  setDeposit: SetStateType<BigNumberReference>;
}) {
  const [depositing, setDepositing] = useState(false);
  const dispatch = useAppDispatch();
  const { account, chainId } = useWeb3React();
  const { limit } = useApprovalLimit();
  const tokens = useUserTokenBalance();
  const vault = useSelectedVault();
  const auxoContract = useAuxoVaultContract(vault?.address);

  const buttonDisabled = useMemo(() => {
    const invalidDepost = deposit.label <= 0;
    const sufficientApproval =
      compareBalances(limit, 'gte', deposit) &&
      compareBalances(tokens, 'gte', deposit);
    const wrongNetwork = chainId !== vault?.chainId;
    return !sufficientApproval || wrongNetwork || invalidDepost || depositing;
  }, [deposit, limit, tokens, chainId, vault?.chainId, depositing]);

  const makeDeposit = () => {
    setDepositing(true);
    dispatch(
      thunkMakeDeposit({
        account,
        auxo: auxoContract,
        deposit,
      }),
    )
      .then(() => setDeposit(zeroBalance))
      .finally(() => setDepositing(false));
  };

  return (
    <button
      className="w-full px-8 py-3 text-lg font-medium text-white bg-secondary rounded-2xl ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
      disabled={buttonDisabled}
      onClick={makeDeposit}
    >
      Deposit
    </button>
  );
}

function DepositActions({
  deposit,
  setDeposit,
}: {
  deposit: BigNumberReference;
  setDeposit: SetStateType<BigNumberReference>;
}) {
  return (
    <div className="flex justify-between items-center gap-x-4 mt-4">
      <ApproveDepositButton deposit={deposit} />
      <DepositButtons deposit={deposit} setDeposit={setDeposit} />
    </div>
  );
}

export default DepositActions;
