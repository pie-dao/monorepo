import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import Image from 'next/image';
import { useCurrentTokenContract } from '../../../hooks/useToken';
import { thunkApproveToken } from '../../../store/products/thunks';
import ArrowRight from '../../../public/images/icons/arrow-right.svg';
import { formatBalance } from '../../../utils/formatBalance';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import AUXOImage from '../../../public/tokens/AUXO.svg';
import veAUXOImage from '../../../public/tokens/veAUXO.svg';
import xAUXOImage from '../../../public/tokens/xAUXO.svg';

const imageMap = {
  AUXO: AUXOImage,
  ARV: veAUXOImage,
  PRV: xAUXOImage,
};

export default function Approve() {
  const { t } = useTranslation();
  const { tx, swap } = useAppSelector((state) => state.modal);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { hash } = tx;
  const dispatch = useAppDispatch();
  const [approving, setApproving] = useState(false);
  const tokenContract = useCurrentTokenContract(swap?.from?.token);

  const approveDeposit = () => {
    setApproving(true);
    const nextStep =
      swap?.to?.token === 'PRV'
        ? (`CONFIRM_CONVERT_${swap.to.token.toUpperCase()}` as const)
        : (`CONFIRM_STAKE_${swap.to.token.toUpperCase()}` as const);
    dispatch(
      thunkApproveToken({
        deposit: swap?.from?.amount,
        token: tokenContract,
        spender: swap?.spender,
        nextStep,
      }),
    ).finally(() => setApproving(false));
  };

  return (
    <>
      <Dialog.Title
        as="h3"
        className="font-bold text-center text-xl text-primary capitalize w-full"
      >
        {t('approveTokenForStaking', { token: swap?.from.token })}
      </Dialog.Title>
      <div className="flex flex-col items-center justify-center w-full gap-y-6">
        <div className="mt-2">
          <p className="text-lg text-sub-dark font-medium">
            {t('approveTokenModalDescription', {
              token: swap?.from.token,
            })}
          </p>
        </div>
        <div className="divide-y border-y flex flex-col items-center gap-x-2 self-center justify-between w-full">
          {swap && (
            <div className="flex place-content-center w-full py-6 gap-x-2">
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-start">
                <Image
                  src={imageMap[swap.from.token]}
                  alt={swap.from.token}
                  width={24}
                  height={24}
                />
                <span className="text-xl font-semibold text-primary">
                  {formatBalance(
                    swap.from.amount.label,
                    defaultLocale,
                    2,
                    'standard',
                  )}{' '}
                  {swap.from.token}
                </span>
              </div>
              <div className="flex items-center">
                <Image
                  src={ArrowRight}
                  alt={'transfer'}
                  width={24}
                  height={24}
                />
              </div>
              <div className="text-2xl text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant px-4 py-2 rounded-lg">
                <Image
                  src={imageMap[swap.to.token]}
                  alt={swap.to.token}
                  width={24}
                  height={24}
                />
                <span>
                  {formatBalance(
                    swap.to.amount.label,
                    defaultLocale,
                    2,
                    'standard',
                  )}{' '}
                  {swap.to.token}
                </span>
              </div>
            </div>
          )}
          {hash && (
            <div className="flex items-center self-center justify-between w-full py-2">
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                <Image
                  src={'/images/icons/etherscan.svg'}
                  alt={'etherscan'}
                  width={24}
                  height={24}
                />
                <span className="text-xl font-semibold text-primary">
                  {t('blockExplorer')}
                </span>
              </div>
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                <a
                  href={`https://goerli.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-primary truncate underline max-w-xs"
                >
                  {hash}
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex justify-center">
          {!approving ? (
            <button
              type="button"
              className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
              onClick={approveDeposit}
            >
              {t('approveToken', { token: swap?.from.token })}
            </button>
          ) : (
            <div className="w-full flex justify-center">
              <p className="bg-clip-text bg-gradient-major-colors text-transparent ">
                {t('confirmInWallet')}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
