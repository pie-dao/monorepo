import { useState } from 'react';
import { useAppDispatch } from '../../../../hooks';
import { useWeb3Cache } from '../../../../hooks/useCachedWeb3';
import { useAuxoVaultContract } from '../../../../hooks/multichain/useMultichainContract';
import { useApproximatePendingAsUnderlying } from '../../../../hooks/useMaxDeposit';
import { useSelectedVault } from '../../../../hooks/useSelectedVault';
import { useStatus, WITHDRAWAL } from '../../../../hooks/useWithdrawalStatus';
import { thunkConfirmWithdrawal } from '../../../../store/vault/vault.thunks';
import { prettyNumber } from '../../../../utils';
import StyledButton from '../../../UI/button';
import LoadingSpinner from '../../../UI/loadingSpinner';

function WithdrawButton({ showAvailable }: { showAvailable?: boolean }) {
  const [withdrawing, setWithdrawing] = useState(false);
  const { chainId } = useWeb3Cache();
  const vault = useSelectedVault();
  const dispatch = useAppDispatch();
  const auxoContract = useAuxoVaultContract(vault?.address);
  const available = vault?.userBalances?.batchBurn.available;
  const status = useStatus();
  const pendingSharesUnderlying = useApproximatePendingAsUnderlying();

  const buttonText = showAvailable
    ? prettyNumber(available?.label)
    : 'WITHDRAW';

  const buttonDisabled = () => {
    const wrongStatus = status !== WITHDRAWAL.READY;
    const wrongNetwork = chainId !== vault?.network.chainId;
    return wrongNetwork || withdrawing || wrongStatus;
  };

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
    <StyledButton
      disabled={buttonDisabled()}
      onClick={makeWithdrawal}
      className="min-w-[60px]"
    >
      {withdrawing ? <LoadingSpinner /> : buttonText}
    </StyledButton>
  );
}

export default WithdrawButton;
