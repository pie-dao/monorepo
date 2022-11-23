import { useWeb3React } from '@web3-react/core';
import useTranslation from 'next-translate/useTranslation';
import Lock from '../Lock/Lock';
import {
  useUserLockDurationInSeconds,
  useUserLockStartingTime,
} from '../../hooks/useToken';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useCallback } from 'react';
import classNames from '../../utils/classnames';
import { thunkWithdrawFromVeAUXO } from '../../store/products/thunks';
import { useStakingTokenContract } from '../../hooks/useContracts';

const StakingHistory: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const tokenLocker = useStakingTokenContract('veAUXO');
  const userLockStartingTime = useUserLockStartingTime('veAUXO');
  const userLockDuration = useUserLockDurationInSeconds('veAUXO');
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();

  const userStartStakingDate = new Date(
    userLockStartingTime * 1000,
  ).toLocaleDateString(defaultLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const endDate = new Date(
    (userLockStartingTime + userLockDuration) * 1000,
  ).toLocaleDateString(defaultLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const todayPercentageBetweenTwoDates = useCallback(
    (startDate: number, endDate: number) => {
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
      const daysPassed =
        (today.getTime() - start.getTime()) / (1000 * 3600 * 24);
      const percentage = (daysPassed / totalDays) * 100;
      return percentage;
    },
    [],
  );

  const percentage = todayPercentageBetweenTwoDates(
    userLockStartingTime * 1000,
    userLockStartingTime * 1000 + userLockDuration * 1000,
  );

  const withdraw = () =>
    dispatch(thunkWithdrawFromVeAUXO({ account, tokenLocker }));

  return (
    <>
      <div className="w-full flex flex-col space-between border-t border-custom-border">
        <div className="flex items-center gap-x-2 self-center w-full p-2">
          <dt className="text-base text-sub-dark font-medium flex items-center gap-x-2">
            {t('stakingDate')}:
          </dt>
          <dd className="flex ml-auto font-medium text-base text-primary">
            {userStartStakingDate}
          </dd>
        </div>
        <div className="flex items-center gap-x-2 self-center w-full p-2">
          <div className="flex flex-1 items-center gap-x-2">
            <div className="flex flex-shrink-0 w-4 h-4">
              <Lock isCompleted={percentage >= 100} />
            </div>
            <div className="flex flex-1 bg-gray-200 rounded-full h-1.5">
              <div
                className={classNames(
                  'bg-secondary h-1.5 rounded-full',
                  percentage === 100 && 'bg-green',
                )}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-primary">
              {t('completedIn', { date: endDate })}
            </div>
          </div>
        </div>
        {percentage === 100 && (
          <div className="flex flex-col justify-center w-full my-2 items-center">
            <button
              onClick={withdraw}
              className="flex gap-x-2 items-center w-fit px-4 py-1 text-sm font-medium text-green bg-transparent rounded-2xl ring-inset ring-1 ring-green enabled:hover:bg-green enabled:hover:text-white disabled:opacity-70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 16"
                className="fill-current w-3 h-3"
              >
                <path d="M1.83301 4.00033v1.66666c0 .55229.44771 1 1 1 .0884 0 .17319-.03512.2357-.09763.06251-.06251.09763-.1473.09763-.2357V4.00033h1.33333v7.99997c0 .7364.59696 1.3334 1.33334 1.3334h5.33329c.7364 0 1.3334-.597 1.3334-1.3334V4.00033h1.3333v2.33333c0 .18409.1492.33333.3333.33333.5523 0 1-.44771 1-1V4.00033c0-.73638-.5969-1.33334-1.3333-1.33334H3.16634c-.73638 0-1.33333.59696-1.33333 1.33334Zm4 7.99997V4.00033h2v7.99997h-2Zm5.33329 0H9.83301V4.00033h1.33329v7.99997Z" />
              </svg>
              {t('withdrawToken', { token: 'AUXO' })}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default StakingHistory;
