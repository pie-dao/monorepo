import { useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { useAuxoVaultContract } from '../../hooks/useContracts';
import { useSelectedVault } from '../../hooks/useSelectedVault';
import { useStatus, WITHDRAWAL } from '../../hooks/useWithdrawalStatus';
import { SetStateType } from '../../types/utilities';
import { zeroBalance } from '../../utils/balances';
import { BigNumberReference } from '../../store/products/products.types';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { thunkIncreaseWithdrawal } from '../../store/products/thunks';

function ApproveWithdrawButton({
  withdraw,
  setWithdraw,
}: {
  withdraw: BigNumberReference;
  setWithdraw: SetStateType<BigNumberReference>;
}) {
  const [approving, setApproving] = useState(false);
  const dispatch = useAppDispatch();
  const vault = useSelectedVault();
  const auxoContract = useAuxoVaultContract(vault?.address);
  const status = useStatus();

  const enterBatchBurn = () => {
    setApproving(true);
    dispatch(
      thunkIncreaseWithdrawal({
        auxo: auxoContract,
        withdraw,
      }),
    )
      .then(() => setWithdraw(zeroBalance))
      .finally(() => setApproving(false));
  };

  return (
    <button
      className="w-full px-8 py-3 mt-4 text-lg font-medium text-white bg-secondary rounded-2xl ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
      disabled={
        withdraw.value === '0' || status === WITHDRAWAL.READY || approving
      }
      onClick={enterBatchBurn}
    >
      {approving ? <LoadingSpinner /> : 'Request'}
    </button>
  );
}

export default ApproveWithdrawButton;
