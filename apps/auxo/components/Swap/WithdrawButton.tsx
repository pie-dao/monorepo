import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '../../hooks';
import { BigNumberReference } from '../../store/products/products.types';
import { TokenConfig } from '../../types/tokensConfig';
import { ConnectButton } from '@shared/ui-library';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import {
  setClaim,
  setIsOpen,
  setStep,
  setSwap,
} from '../../store/modal/modal.slice';
import { STEPS } from '../../store/modal/modal.types';
import { PrvWithdrawalRecipient } from '../../types/merkleTree';

function WithdrawButton({
  disabled,
  deposit,
  estimation,
  fee,
  claim,
  children,
}: {
  deposit: BigNumberReference;
  estimation: BigNumberReference;
  fee: BigNumberReference;
  tokenConfig: TokenConfig;
  claim: PrvWithdrawalRecipient & {
    account: string;
  };
  children?: React.ReactNode;
  disabled: boolean;
}) {
  const { account } = useWeb3React();
  const ready = useServerHandoffComplete();
  const dispatch = useAppDispatch();

  const openModal = () => {
    dispatch(
      setSwap({
        swap: {
          from: {
            token: 'PRV',
            amount: deposit,
          },
          to: {
            token: 'AUXO',
            amount: estimation,
          },
          losingAmount: fee,
        },
      }),
    );
    dispatch(setClaim(claim));
    dispatch(setStep(STEPS.WITHDRAW_PRV));
    dispatch(setIsOpen(true));
  };

  return (
    <div className="flex justify-center items-center gap-x-4 flex-wrap gap-y-4">
      {account ? (
        <>
          <button
            onClick={openModal}
            disabled={disabled}
            className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
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

export default WithdrawButton;
