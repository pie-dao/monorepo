import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '../../hooks';
import { useTokenBalance } from '../../hooks/useToken';
import { BigNumberReference } from '../../store/products/products.types';
import { compareBalances } from '../../utils/balances';
import { TokenConfig } from '../../types/tokensConfig';
import { ConnectButton } from '@shared/ui-library';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import { setIsOpen, setStep, setSwap } from '../../store/modal/modal.slice';
import { STEPS } from '../../store/modal/modal.types';
import { useXAUXOTokenContract } from '../../hooks/useContracts';

function DepositActions({
  deposit,
  estimation,
  tokenConfig,
  toToken,
  children,
}: // isConvertAndStake,
{
  deposit: BigNumberReference;
  estimation: BigNumberReference;
  tokenConfig: TokenConfig;
  stakingTime?: number;
  toToken: string;
  children?: React.ReactNode;
  // isConvertAndStake?: boolean;
}) {
  const { account } = useWeb3React();
  const ready = useServerHandoffComplete();
  const dispatch = useAppDispatch();
  const xAUXOContract = useXAUXOTokenContract();
  const tokens = useTokenBalance(tokenConfig.name);

  const disabledStake = useMemo(() => {
    const invalidDeposit = deposit.label <= 0;
    const sufficientTokens = compareBalances(tokens, 'gte', deposit);
    return !sufficientTokens || invalidDeposit;
  }, [deposit, tokens]);

  const openModal = () => {
    dispatch(setStep(STEPS.CONFIRM_CONVERT_XAUXO));
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
            className="px-8 py-1 text-lg font-medium text-white bg-secondary rounded-2xl ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
          >
            {children}
          </button>
        </>
      ) : (
        ready && <ConnectButton className="w-full" />
      )}
    </div>
  );
}

export default DepositActions;
