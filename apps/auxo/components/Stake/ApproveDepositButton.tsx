import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '../../hooks';
import { useTokenBalance } from '../../hooks/useToken';
import { BigNumberReference } from '../../store/products/products.types';
import { compareBalances } from '../../utils/balances';
import useTranslation from 'next-translate/useTranslation';
import { TokenConfig } from '../../types/tokensConfig';
import { ConnectButton } from '@shared/ui-library';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import { setIsOpen, setStep, setSwap } from '../../store/modal/modal.slice';
import { STEPS } from '../../store/modal/modal.types';
import { useStakingTokenContract } from '../../hooks/useContracts';

function DepositActions({
  deposit,
  estimation,
  tokenConfig,
  stakingTime,
  toToken,
}: {
  deposit: BigNumberReference;
  estimation: number;
  tokenConfig: TokenConfig;
  stakingTime?: number;
  toToken: string;
}) {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const ready = useServerHandoffComplete();
  const dispatch = useAppDispatch();
  const stakingContract = useStakingTokenContract('ARV');
  const tokens = useTokenBalance(tokenConfig.name);
  const disabledStake = useMemo(() => {
    const invalidDeposit = deposit.label <= 0;
    const sufficientTokens = compareBalances(tokens, 'gte', deposit);
    return !sufficientTokens || invalidDeposit;
  }, [deposit, tokens]);

  const openModal = () => {
    dispatch(setStep(STEPS.CONFIRM_STAKE_ARV));
    dispatch(
      setSwap({
        swap: {
          from: {
            token: tokenConfig.name,
            amount: deposit,
          },
          to: {
            token: toToken,
            amount: {
              label: estimation,
              value: estimation.toString(),
            },
          },
          stakingTime,
          spender: stakingContract.address,
        },
      }),
    );
    dispatch(setIsOpen(true));
  };

  return (
    <div className="flex justify-center items-center gap-x-4 flex-wrap gap-y-4 mt-auto">
      {account ? (
        <>
          <button
            onClick={openModal}
            disabled={disabledStake}
            className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
          >
            {t('stakeAUXO')}
          </button>
        </>
      ) : (
        ready && <ConnectButton className="w-full" />
      )}
    </div>
  );
}

export default DepositActions;
