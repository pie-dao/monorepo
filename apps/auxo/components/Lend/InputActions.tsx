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
import {
  UseCanUserWithdrawFromPool,
  UseLoan,
  UseMaxWithdrawableAmountFromPool,
  UseSufficentApproval,
} from '../../hooks/useLending';

const LendActions: React.FC<{
  deposit: BigNumberReference;
  tokenConfig: TokenConfig;
  poolAddress: string;
  action?: 'deposit' | 'withdraw';
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
  const hasSufficentApproval = UseSufficentApproval(poolAddress, deposit);
  const canWithdraw = UseCanUserWithdrawFromPool(poolAddress);
  const loan = UseLoan(poolAddress);
  const unlendableAmount = UseMaxWithdrawableAmountFromPool(poolAddress);

  const sufficientTokens = useMemo(() => {
    switch (action) {
      case 'deposit':
        return compareBalances(tokens, 'gte', deposit);
      case 'withdraw':
        if (canWithdraw) {
          return compareBalances(loan, 'gte', deposit);
        }
        return compareBalances(unlendableAmount, 'gte', deposit);
    }
  }, [action, canWithdraw, deposit, loan, tokens, unlendableAmount]);

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
      case 'withdraw':
        dispatch(setLendingFlowPool(poolAddress));
        dispatch(setLendingFlowOpen(true));
        canWithdraw
          ? dispatch(setLendingStep(STEPS.WITHDRAW_CONFIRM))
          : dispatch(setLendingStep(STEPS.UNLEND));
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
            className="w-fit px-5 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
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
