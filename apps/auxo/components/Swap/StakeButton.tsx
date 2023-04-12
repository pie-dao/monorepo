import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '../../hooks';
import { useTokenBalance, useUserStakedPRV } from '../../hooks/useToken';
import { BigNumberReference } from '../../store/products/products.types';
import { compareBalances } from '../../utils/balances';
import useTranslation from 'next-translate/useTranslation';
import { TokenConfig } from '../../types/tokensConfig';
import { ConnectButton } from '@shared/ui-library';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import { setIsOpen, setStep, setSwap } from '../../store/modal/modal.slice';
import { STEPS } from '../../store/modal/modal.types';

const StakeActions: React.FC<{
  deposit: BigNumberReference;
  tokenConfig: TokenConfig;
  action?: 'convert' | 'unstake' | 'convertAndStake';
  isConvertAndStake?: boolean;
}> = ({ deposit, tokenConfig, action = 'stake', isConvertAndStake }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const ready = useServerHandoffComplete();
  const dispatch = useAppDispatch();
  const tokens = useTokenBalance(tokenConfig.name);
  const auxoBalance = useTokenBalance('AUXO');
  const stakedXAUXO = useUserStakedPRV();

  const sufficientTokens = useMemo(() => {
    switch (action) {
      case 'convert':
        return compareBalances(tokens, 'gte', deposit);
      case 'convertAndStake':
        return compareBalances(auxoBalance, 'gte', deposit);
      case 'unstake':
        return compareBalances(stakedXAUXO, 'gte', deposit);
    }
  }, [action, auxoBalance, deposit, stakedXAUXO, tokens]);

  const disabledStake = useMemo(() => {
    const invalidDeposit = deposit.label <= 0;
    const sufficientTokenNumber = sufficientTokens;
    return !sufficientTokenNumber || invalidDeposit;
  }, [deposit?.label, sufficientTokens]);

  const openModal = () => {
    dispatch(
      setStep(
        action === 'convert' || action === 'convertAndStake'
          ? STEPS.CONFIRM_STAKE_PRV
          : STEPS.CONFIRM_UNSTAKE_PRV,
      ),
    );
    dispatch(
      setSwap({
        swap: {
          from: {
            token: tokenConfig.name,
            amount: deposit,
          },
          to: {
            token: tokenConfig.name,
            amount: deposit,
          },
          spender: null,
        },
      }),
    );
    dispatch(setIsOpen(true));
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
        ready && <ConnectButton className="w-full" />
      )}
    </div>
  );
};

export default StakeActions;
