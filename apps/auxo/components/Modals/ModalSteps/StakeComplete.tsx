import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../../hooks';
import Image from 'next/image';
import ArrowRight from '../../../public/images/icons/arrow-right.svg';
import { formatBalance } from '../../../utils/formatBalance';
import AUXOImage from '../../../public/tokens/AUXO.svg';
import veAUXOImage from '../../../public/tokens/veAUXO.svg';
import xAUXOImage from '../../../public/tokens/xAUXO.svg';
import classNames from '../../../utils/classnames';

const imageMap = {
  AUXO: AUXOImage,
  veAUXO: veAUXOImage,
  xAUXO: xAUXOImage,
};

export default function StakeConfirm() {
  const { t } = useTranslation();
  const { tx, swap } = useAppSelector((state) => state.modal);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { hash } = tx;

  return (
    <>
      <Dialog.Title
        as="h3"
        className="font-bold text-center text-xl text-primary capitalize w-full"
      >
        {t('completed')}
      </Dialog.Title>
      <div className="flex flex-col items-center justify-center w-full gap-y-6">
        <div className="mt-2">
          <p className="text-lg text-sub-dark">
            {t('stakeCompletedModalDescription', {
              token: swap?.from.token,
            })}
          </p>
        </div>
        <div className="divide-y border-y flex flex-col items-center gap-x-2 self-center justify-between w-full">
          {swap && (
            <div
              className={classNames(
                'grid justify-items-center w-full py-2',
                swap.to.token ? 'grid-cols-3' : 'grid-cols-2',
              )}
            >
              {swap?.to?.token ? (
                <>
                  <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-start">
                    <Image
                      src={imageMap[swap.from.token]}
                      alt={swap.from.token}
                      width={24}
                      height={24}
                    />
                    <span className="text-xl font-medium text-primary">
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
                  <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-end">
                    <Image
                      src={imageMap[swap.to.token]}
                      alt={swap.to.token}
                      width={24}
                      height={24}
                    />
                    <span className="text-xl font-medium text-secondary">
                      {formatBalance(
                        swap.to.amount.label,
                        defaultLocale,
                        2,
                        'standard',
                      )}{' '}
                      {swap.to.token}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-start">
                    <span className="text-xl font-medium text-primary">
                      {t('amount')}:
                    </span>
                  </div>
                  <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-end">
                    <Image
                      src={imageMap[swap.from.token]}
                      alt={swap.from.token}
                      width={24}
                      height={24}
                    />
                    <span className="text-xl font-medium text-primary">
                      {formatBalance(
                        swap.from.amount.label,
                        defaultLocale,
                        2,
                        'standard',
                      )}{' '}
                      {swap.from.token}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
          {swap?.stakingTime && (
            <div className="flex items-center self-center justify-between w-full py-2 justify-self-end">
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                <span className="text-xl font-medium text-primary">
                  {t('stakeTime')}
                </span>
              </div>
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                <span className="text-xl font-medium text-secondary">
                  {t('monthsAmount', { count: swap.stakingTime })}
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
                <span className="text-xl font-medium text-primary">
                  {t('tx')}:
                </span>
              </div>
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                <a
                  href={`https://goerli.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl font-medium text-secondary truncate underline max-w-xs"
                >
                  {hash}
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="w-full text-center">
          <p className="uppercase text-secondary font-medium">
            {t('transactionCompleted')}
          </p>
        </div>
      </div>
    </>
  );
}
