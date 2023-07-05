import { useMemo } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import { useAppDispatch } from '../../hooks';
import { useTokenBalance } from '../../hooks/useToken';
import { BigNumberReference } from '../../store/products/products.types';
import { compareBalances } from '../../utils/balances';
import { TokenConfig } from '../../types/tokensConfig';

import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import {
  setIsConvertAndStake,
  setIsOpen,
  setStep,
  setSwap,
} from '../../store/modal/modal.slice';
import { STEPS } from '../../store/modal/modal.types';
import { useXAUXOTokenContract } from '../../hooks/useContracts';
import useTranslation from 'next-translate/useTranslation';

function DepositActions({
  deposit,
  estimation,
  tokenConfig,
  toToken,
  children,
  isConvertAndStake = false,
}: {
  deposit: BigNumberReference;
  estimation: BigNumberReference;
  tokenConfig: TokenConfig;
  stakingTime?: number;
  toToken: string;
  children?: React.ReactNode;
  isConvertAndStake?: boolean;
}) {
  const [{ wallet }, connect] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const dispatch = useAppDispatch();
  const xAUXOContract = useXAUXOTokenContract();
  const tokens = useTokenBalance(tokenConfig.name);
  const { t } = useTranslation();

  const disabledStake = useMemo(() => {
    const invalidDeposit = deposit.label <= 0;
    const sufficientTokens = compareBalances(tokens, 'gte', deposit);
    return !sufficientTokens || invalidDeposit;
  }, [deposit, tokens]);

  const openModal = () => {
    dispatch(setIsConvertAndStake(isConvertAndStake));
    dispatch(setStep(STEPS.CONFIRM_CONVERT_PRV));
    dispatch(
      setSwap({
        swap: {
          from: {
            token: tokenConfig.name,
            amount: deposit,
          },
          to: {
            token: toToken,
            amount: estimation,
          },
          spender: xAUXOContract.address,
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
            className="w-fit px-10 md:px-20 py-2 text-sm md:text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
          >
            {children}
          </button>
        </>
      ) : (
        <button
          onClick={() => connect()}
          className="w-fit px-10 md:px-20 py-2 text-sm md:text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
        >
          {t('connectWallet')}
        </button>
      )}
    </div>
  );
}

export default DepositActions;
