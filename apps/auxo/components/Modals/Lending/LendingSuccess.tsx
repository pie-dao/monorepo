import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useAppSelector } from '../../../hooks';
import { useChainExplorer } from '../../../hooks/useToken';
import { formatBalance } from '../../../utils/formatBalance';
import { useEnanchedPools } from '../../../hooks/useEnanchedPools';
import { isEqual } from 'lodash';
import { zeroBalance } from '../../../utils/balances';
import { Dialog } from '@headlessui/react';
import { PREFERENCES } from '../../../utils/constants';
import classNames from '../../../utils/classnames';

type Props = {
  action?:
    | 'deposit'
    | 'unlend'
    | 'claim'
    | 'withdrawConfirm'
    | 'withdrawRequest'
    | 'changePreference'
    | 'compound';
};

export default function LendingSuccess({ action }: Props) {
  const { t } = useTranslation();
  const { tx, selectedPool, amount, preference } = useAppSelector(
    (state) => state.lending.lendingFlow,
  );
  const { data } = useEnanchedPools(selectedPool);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const chainExplorer = useChainExplorer();
  return (
    <div className="flex flex-col items-center justify-center w-full gap-y-4">
      <Dialog.Title className="bg-clip-text text-transparent bg-gradient-major-secondary-predominant font-bold text-xl z-10">
        {t(`${action}Completed`)}
      </Dialog.Title>
      <Dialog.Description className="text-center text-base text-sub-dark w-full font-medium">
        {t(`${action}CompletedDescription`)}
      </Dialog.Description>
      {action === 'changePreference' ? (
        <div className="text-lg text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant px-4 py-2 rounded-lg z-10">
          <span>
            {t(
              Object.keys(PREFERENCES)
                .find(
                  (key) =>
                    PREFERENCES[key as keyof typeof PREFERENCES] === preference,
                )
                ?.toLowerCase() ?? '',
            )}
          </span>
        </div>
      ) : null}
      {amount && !isEqual(amount, zeroBalance) ? (
        <div
          className={classNames(
            'flex flex-col items-center justify-center w-full gap-y-4 rounded-lg px-2 py-4 m-2 relative',
            action === 'claim' &&
              "bg-[url('/images/background/bg-rewards.png')] bg-cover shadow-md",
          )}
        >
          <div className="absolute inset-0 bg-white opacity-30 z-0" />
          <div className="text-2xl text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant px-4 py-2 rounded-lg z-10">
            {data?.attributes?.token?.data?.attributes?.icon?.data?.attributes
              ?.url ? (
              <Image
                src={
                  data?.attributes?.token?.data?.attributes?.icon?.data
                    ?.attributes?.url
                }
                alt={
                  data?.attributes?.token?.data?.attributes?.icon?.data
                    ?.attributes?.name
                }
                width={24}
                height={24}
              />
            ) : null}
            <span>
              {formatBalance(amount.label, defaultLocale, 4, 'standard')}{' '}
              {data?.attributes?.token?.data?.attributes?.name}
            </span>
          </div>
        </div>
      ) : null}
      {tx?.hash && (
        <div className="flex items-center self-center justify-between w-full py-2">
          <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
            <Image
              src={'/images/icons/etherscan.svg'}
              alt={'etherscan'}
              width={24}
              height={24}
            />
            <span className="text-sm text-sub-dark font-medium">
              {t('tx')}:
            </span>
          </div>
          <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
            <a
              href={
                chainExplorer?.url
                  ? `${chainExplorer?.url}/tx/${tx?.hash}`
                  : '#'
              }
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-primary truncate underline max-w-xs"
            >
              {tx?.hash}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
