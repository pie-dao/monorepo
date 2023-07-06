import { useEffect, useMemo } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import { useAppDispatch } from '../../hooks';
import { useApprovalLimit, useTokenBalance } from '../../hooks/useToken';
import { BigNumberReference } from '../../store/products/products.types';
import { compareBalances } from '../../utils/balances';
import useTranslation from 'next-translate/useTranslation';
import { TokenConfig } from '../../types/tokensConfig';
import {
  setDepositValue,
  setLendingFlowOpen,
  setLendingFlowPool,
  setLendingStep,
  setPrincipal,
  setSpender,
} from '../../store/lending/lending.slice';
import { STEPS } from '../../store/lending/lending.types';
import { useTokenContract } from '../../hooks/useContracts';
import { UsePoolApproval, UseSufficentApproval } from '../../hooks/useLending';

const LendActions: React.FC<{
  deposit: BigNumberReference;
  tokenConfig: TokenConfig;
  poolAddress: string;
  action?: 'deposit' | 'unlend';
  disabled?: boolean;
}> = ({
  deposit,
  tokenConfig,
  action = 'deposit',
  poolAddress,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [{ wallet }, connect] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const dispatch = useAppDispatch();
  const tokens = useTokenBalance(tokenConfig.name);
  const hasSufficentApproval = UseSufficentApproval(poolAddress);

  const sufficientTokens = useMemo(() => {
    switch (action) {
      case 'deposit':
        return compareBalances(tokens, 'gte', deposit);
      case 'unlend':
        return compareBalances(deposit, 'gte', tokens);
    }
  }, [action, deposit, tokens]);

  const disabledStake = useMemo(() => {
    const invalidDeposit = deposit.label <= 0;
    const sufficientTokenNumber = sufficientTokens;
    return !sufficientTokenNumber || invalidDeposit || disabled;
  }, [deposit.label, disabled, sufficientTokens]);

  const openModal = () => {
    switch (action) {
      case 'deposit':
        dispatch(setLendingFlowPool(poolAddress));
        dispatch(setDepositValue(deposit));
        hasSufficentApproval
          ? dispatch(setLendingStep(STEPS.LEND_DEPOSIT))
          : dispatch(setLendingStep(STEPS.APPROVE_LEND));
        dispatch(setSpender(poolAddress));
        dispatch(setPrincipal(tokenConfig.name));
        dispatch(setLendingFlowOpen(true));
        break;
      case 'unlend':
        dispatch(setLendingFlowPool(poolAddress));
        dispatch(setLendingFlowOpen(true));
        dispatch(setLendingStep(STEPS.UNLEND));
        dispatch(setDepositValue(deposit));
    }
  };

  return (
    <div className="flex justify-center items-center gap-x-4 flex-wrap gap-y-4">
      {account ? (
        <>
          <button
            onClick={openModal}
            disabled={disabledStake}
            className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
          >
            {t(action)}
          </button>
        </>
      ) : (
        <button
          onClick={() => connect()}
          className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
        >
          {t('connectWallet')}
        </button>
      )}
    </div>
  );
};

export default LendActions;
