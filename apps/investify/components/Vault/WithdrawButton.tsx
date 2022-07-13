import { useWeb3React } from '@web3-react/core';
import classNames from '../../utils/classnames';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { useAuxoVaultContract } from '../../hooks/useContracts';
import { useApproximatePendingAsUnderlying } from '../../hooks/useMaxDeposit';
import { useSelectedVault } from '../../hooks/useSelectedVault';
import { useStatus, WITHDRAWAL } from '../../hooks/useWithdrawalStatus';
import { thunkConfirmWithdrawal } from '../../store/products/thunks';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

function WithdrawButton({
  showAvailable,
  className,
}: {
  showAvailable?: boolean;
  className?: string;
}) {
  const { chainId } = useWeb3React();
  const { t } = useTranslation();
  const [withdrawing, setWithdrawing] = useState(false);
  const vault = useSelectedVault();
  const dispatch = useAppDispatch();
  const auxoContract = useAuxoVaultContract(vault?.address);
  const available = vault?.userBalances?.batchBurn.available;
  const status = useStatus();
  const pendingSharesUnderlying = useApproximatePendingAsUnderlying();

  const buttonText = showAvailable
    ? `${t('withdraw')} ${available?.label} ${vault.symbol}`
    : t('withdraw');

  const buttonDisabled = (() => {
    const wrongStatus = status !== WITHDRAWAL.READY;
    const wrongNetwork = chainId !== vault?.chainId;
    return wrongNetwork || withdrawing || wrongStatus;
  })();

  const makeWithdrawal = () => {
    setWithdrawing(true);
    dispatch(
      thunkConfirmWithdrawal({
        auxo: auxoContract,
        pendingSharesUnderlying,
      }),
    ).finally(() => setWithdrawing(false));
  };

  return (
    <button
      disabled={buttonDisabled}
      onClick={makeWithdrawal}
      className={classNames(
        'w-full px-8 py-3 text-md font-medium text-white bg-secondary rounded-2xl ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70',
        className,
      )}
    >
      {withdrawing ? <LoadingSpinner /> : buttonText}
    </button>
  );
}

export default WithdrawButton;
