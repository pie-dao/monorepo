import { useCallback, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useWeb3React } from '@web3-react/core';
import { motion } from 'framer-motion';
import { useCopyToClipboard } from 'usehooks-ts';
import {
  ClipboardIcon,
  ClipboardCheckIcon,
  EyeIcon,
  EyeOffIcon,
} from '@heroicons/react/solid';
import { useENSName } from '@shared/ui-library';
import {
  useAppDispatch,
  useAppSelector,
  useFormattedBalance,
  useTwentyfourHourVolume,
} from '../../hooks';
import { useFindUserQuery } from '../../api/generated/graphql';
import { setHideBalance } from '../../store/preferences/preferences.slice';
import trimAccount from '../../utils/trimAccount';
import styles from './UserCard.module.scss';
import classNames from '../../utils/classnames';

export default function UserCard() {
  const { t } = useTranslation();
  const { account, library } = useWeb3React();
  const ensName = useENSName(library, account);
  const { data } = useFindUserQuery({ address: account });
  const [copied, copy] = useCopyToClipboard();
  const { hideBalance, defaultCurrency, defaultLocale } = useAppSelector(
    (state) => state.preferences,
  );
  const dispatch = useAppDispatch();

  const balanceAmount = data?.user?.totalBalance;

  const volume = data?.user?.twentyFourHourChange?.change;

  const balance = useFormattedBalance(
    balanceAmount,
    defaultLocale,
    defaultCurrency,
  );

  const twentyFourHourVolume = useTwentyfourHourVolume(volume);

  return (
    <div
      className={`flex flex-col w-full max-w-[360px] h-56 space-y-12 bg-dashboard-card dashboard-card bg-cover rounded-xl relative text-white shadow-md p-6 ${styles.dashboardCard}`}
    >
      <div className="w-full flex justify-between items-center">
        <div className={`font-medium text-base ${styles.dashboardAddress}`}>
          {ensName ? (
            <div>{ensName}</div>
          ) : account ? (
            <div>{trimAccount(account, true)}</div>
          ) : (
            <div>{t('Your Address')}</div>
          )}
        </div>
        {account && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="h-5 w-5 cursor-pointer"
          >
            {account !== copied ? (
              <ClipboardIcon onClick={() => copy(account)} />
            ) : (
              <ClipboardCheckIcon />
            )}
          </motion.button>
        )}
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="w-full flex-col items-center">
          <h2
            className={classNames(
              'text-4xl',
              hideBalance ? 'hidden-balance' : styles.dashboardAddress,
            )}
          >
            {balance}
          </h2>
          {twentyFourHourVolume && (
            <p>
              {t('24h')}{' '}
              <span
                className={classNames(
                  data?.user?.twentyFourHourChange?.change > 0
                    ? 'text-secondary'
                    : 'text-red',
                  hideBalance && 'hidden-balance',
                )}
              >
                {twentyFourHourVolume}
              </span>
            </p>
          )}
        </div>
        <motion.button
          className="h-5 w-5 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {!hideBalance ? (
            <EyeIcon onClick={() => dispatch(setHideBalance(true))} />
          ) : (
            <EyeOffIcon onClick={() => dispatch(setHideBalance(false))} />
          )}
        </motion.button>
      </div>
    </div>
  );
}
