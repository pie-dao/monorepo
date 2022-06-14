import { useMemo } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useFindUserQuery } from '../../api/generated/graphql';
import { setHideBalance } from '../../store/preferences/preferences.slice';
import styles from './UserCard.module.scss';

const replaceBalanceWithAsterisks = (balance: string) => {
  return balance.replace(/\d/g, '*');
};

export default function UserCard() {
  const { t } = useTranslation();
  const { account, library } = useWeb3React();
  const ensName = useENSName(library, account);
  const { data } = useFindUserQuery({ userId: account });
  const [copied, copy] = useCopyToClipboard();
  const { hideBalance, defaultCurrency, defaultLocale } = useAppSelector(
    (state) => state.preferences,
  );
  const dispatch = useAppDispatch();
  const balanceAmount = data?.user?.balances.find(
    (b) => b.currency === defaultCurrency,
  ).amount;

  const balance = useMemo(() => {
    if (typeof balanceAmount !== 'undefined') {
      const number = new Intl.NumberFormat(defaultLocale, {
        style: 'currency',
        currency: defaultCurrency,
      }).format(balanceAmount);
      if (hideBalance) {
        return replaceBalanceWithAsterisks(number);
      }
      return number;
    }
    return null;
  }, [balanceAmount, defaultCurrency, defaultLocale, hideBalance]);

  return (
    <div
      className={`flex flex-col w-96 space-y-12 h-56 bg-gradient-dashboard-card dashboard-card rounded-xl relative text-white shadow-md p-6 ${styles.dashboardCard}`}
    >
      <div className="w-full flex justify-between items-center">
        <div className={`font-medium text-xs ${styles.dashboardAddress}`}>
          {ensName ? (
            <div>{ensName}</div>
          ) : account ? (
            <div>{account}</div>
          ) : (
            <div>{t('Your Address')}</div>
          )}
        </div>
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
      </div>
      <div className="w-full flex justify-between items-center">
        <div className={`text-4xl  ${styles.dashboardAddress}`}>{balance}</div>
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
