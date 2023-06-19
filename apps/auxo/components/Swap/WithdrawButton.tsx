import { useConnectWallet } from '@web3-onboard/react';
import { useAppDispatch } from '../../hooks';
import { BigNumberReference } from '../../store/products/products.types';
import { TokenConfig } from '../../types/tokensConfig';
import {
  setClaim,
  setIsOpen,
  setStep,
  setSwap,
} from '../../store/modal/modal.slice';
import { STEPS } from '../../store/modal/modal.types';
import { PrvWithdrawalRecipient } from '../../types/merkleTree';
import useTranslation from 'next-translate/useTranslation';

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
  const [{ wallet }, connect] = useConnectWallet();

  const account = wallet?.accounts[0]?.address;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

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
        <button
          onClick={() => connect()}
          className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
        >
          {t('connectWallet')}
        </button>
      )}
    </div>
  );
}

export default WithdrawButton;
