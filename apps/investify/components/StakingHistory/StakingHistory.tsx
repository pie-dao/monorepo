import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import useTranslation from 'next-translate/useTranslation';
import { ConnectButton } from '@shared/ui-library';
import finder from '../../public/images/icons/finder.svg';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import { formatAsPercent, formatBalance } from '../../utils/formatBalance';
import {
  useUserLockAmount,
  useUserLockDurationInSeconds,
  useUserLockStartingTime,
} from '../../hooks/useToken';
import { useAppSelector } from '../../hooks';
import { useCallback } from 'react';
import classNames from '../../utils/classnames';

const StakingHistory: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const ready = useServerHandoffComplete();
  const userLockStartingTime = useUserLockStartingTime('veAUXO');
  const userLockAmount = useUserLockAmount('veAUXO');
  const userLockDuration = useUserLockDurationInSeconds('veAUXO');
  const { defaultLocale, defaultCurrency } = useAppSelector(
    (state) => state.preferences,
  );

  const userStartStakingDate = new Date(
    userLockStartingTime * 1000,
  ).toLocaleDateString(defaultLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const endDate = new Date(
    (userLockStartingTime + userLockDuration) * 1000,
  ).toLocaleDateString(defaultLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const todayPercentageBetweenTwoDates = useCallback((startDate, endDate) => {
    if (!startDate || !endDate) {
      return 0;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const hasFinished = today > end;

    if (hasFinished) {
      return 100;
    }

    const totalDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    const daysPassed = (today.getTime() - start.getTime()) / (1000 * 3600 * 24);
    const percentage = (daysPassed / totalDays) * 100;
    return percentage;
  }, []);

  const percentage = todayPercentageBetweenTwoDates(
    userLockStartingTime * 1000,
    userLockStartingTime * 1000 + userLockDuration * 1000,
  );

  return (
    <>
      <div className="w-fit text-secondary py-1 text-md font-medium leading-5 focus:outline-none relative text-center">
        <h3>{t('myStakedAUXO')}</h3>
        <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary" />
      </div>
      {account && userLockDuration ? (
        <div className="w-full flex flex-col space-between">
          <div className="hidden items-center mb-2 lg:flex">
            <div className="min-w-0 flex-1 flex items-start px-3">
              <div className="flex-shrink-0 w-[12px]"></div>
              <div className="min-w-0 flex-1 px-4 sm:px-0 sm:grid sm:grid-cols-8 sm:gap-4 ">
                <div className="flex flex-col justify-between col-span-1 -ml-[55px] md:ml-0">
                  <p className="text-sub-dark text-xs">{t('stakingDate')}</p>
                </div>
                <div className="flex flex-col justify-between col-span-1">
                  <p className="text-sub-dark text-xs">{t('amount')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 bg-gradient-primary shadow-md rounded-lg px-3 py-2 overflow-hidden">
            <div className="flex items-center">
              <div className="min-w-0 flex-1 flex items-center">
                <div className="flex flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current text-primary"
                  >
                    <path d="M12 2C7.02944 2 3 6.02944 3 11V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V11C21 6.02944 16.9706 2 12 2ZM12 4C15.3137 4 18 6.68629 18 10V11H6V10C6 6.68629 8.68629 4 12 4ZM12 16C10.8954 16 10 15.1046 10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16Z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1 px-2 flex sm:gap-4 items-center justify-between lg:justify-start lg:grid lg:grid-cols-8">
                  <div className="flex flex-col justify-between col-span-1">
                    <p className="text-sub-dark font-medium">
                      {userStartStakingDate}
                    </p>
                  </div>
                  <div className="flex-col justify-center block col-span-6">
                    <p
                      className="text-base text-primary"
                      data-cy="principalAmount"
                    >
                      {formatBalance(
                        userLockAmount.label,
                        defaultCurrency,
                        2,
                        'standard',
                      )}{' '}
                      AUXO
                    </p>
                  </div>
                  <div className="flex flex-col justify-center text-right">
                    <button className="w-full px-4 py-0.5 text-lg font-medium text-secondary bg-transparent rounded-2xl ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70">
                      {t('restake')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="min-w-0 flex-1 flex gap-4 flex-col sm:flex-row">
              <div className="flex flex-1 items-center gap-x-4">
                <div className="flex flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={classNames(
                      'bg-secondary h-1.5 rounded-full',
                      percentage === 100 && 'bg-green',
                    )}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm" data-cy="percentage">
                  {percentage === 100
                    ? t('completedIn', { date: endDate })
                    : formatAsPercent(percentage)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-md shadow-md bg-cover bg-[url('/images/background/bg-positions.png')] bg-center bg-no-repeat relative">
          <div className="opacity-50 bg-white w-full h-full absolute top-0 left-0 z-0"></div>
          <div className="flex flex-col px-4 py-8 gap-y-4 items-center z-10 relative">
            <div className="rounded-full bg-light-gray flex p-4 shadow-sm">
              <Image src={finder} alt="diamond" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-secondary">
                {t('keepTrack')}
              </h3>
              <p className="text-sm text-sub-dark">
                {t('keepTrackDescription')}
              </p>
            </div>
            <div className="flex gap-x-4 items-center justify-center">
              {ready && <ConnectButton />}
              <button className="w-full px-8 py-0.5 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70">
                {t('howToStake')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StakingHistory;
