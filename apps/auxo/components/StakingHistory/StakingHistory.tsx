import { useWeb3React } from '@web3-react/core';
import useTranslation from 'next-translate/useTranslation';
import Lock from '../Lock/Lock';
import {
  useUserLockAmount,
  useUserLockDurationInSeconds,
  useUserLockStartingTime,
} from '../../hooks/useToken';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useCallback } from 'react';
import classNames from '../../utils/classnames';
import { thunkWithdrawFromVeAUXO } from '../../store/products/thunks';
import { useStakingTokenContract } from '../../hooks/useContracts';
import { setStep, setSwap, setIsOpen } from '../../store/modal/modal.slice';
import { STEPS } from '../../store/modal/modal.types';
import { stakingContract } from '../../store/products/products.contracts';

const StakingHistory: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const tokenLocker = useStakingTokenContract('ARV');
  const userLockStartingTime = useUserLockStartingTime('ARV');
  const userLockDuration = useUserLockDurationInSeconds('ARV');
  const userLockAmount = useUserLockAmount('ARV');
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

  const boostToMax = () => {
    dispatch(setStep(STEPS.BOOST_STAKE_ARV));
    dispatch(
      setSwap({
        swap: {
          from: {
            token: 'AUXO',
            amount: userLockAmount,
          },
          to: {
            token: 'ARV',
            amount: userLockAmount,
          },
          stakingTime: 36,
          spender: stakingContract.address,
        },
      }),
    );
    dispatch(setIsOpen(true));
  };

  return (
    <>
      <div className="w-full flex flex-col space-between border-t border-custom-border">
        <div className="flex items-center gap-x-2 self-center w-full p-2">
          <dt className="text-base text-sub-dark font-medium flex items-center gap-x-2">
            {t('stakingDate')}:
          </dt>
          <dd className="flex ml-auto font-semibold text-base text-primary">
            {userStartStakingDate}
          </dd>
        </div>
        <div className="flex items-center gap-x-2 self-center w-full p-2">
          <div className="flex flex-1 items-center gap-x-2">
            <div className="flex flex-shrink-0 w-4 h-4">
              <Lock isCompleted={percentage === 100} />
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
          <div className="flex justify-center w-full my-2 items-center gap-x-3">
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
            <button
              onClick={boostToMax}
              className="w-fit px-4 py-0.5 text-base text-secondary bg-transparent rounded-2xl ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 flex gap-x-2 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="fill-current w-3 h-3"
                viewBox="0 0 16 16"
              >
                <path d="M8.70772.766568 11.0701 3.1199c.128.13188.128.34146 0 .47333L8.70772 5.94657c-.06266.0631-.14794.0986-.23691.0986-.08897 0-.17426-.0355-.23691-.0986l-.13347-.13333c-.06517-.06272-.10142-.14961-.1001-.24001V3.9999c-2.21141 0-4.00411 1.79086-4.00411 4-.00123.64831.15689 1.287.46047 1.86.0691.12998.04469.2898-.06006.3933l-.48716.4867c-.0738.073-.17741.1075-.28029.0933-.10321-.0156-.1939-.0768-.24692-.1666-.9532-1.64933-.95372-3.68122-.00137-5.331.95235-1.64978 2.71304-2.66708 4.61944-2.66903V1.1399c-.00132-.09039.03493-.177281.1001-.239998L8.2339.766568c.06265-.063104.14794-.098599.23691-.098599.08897 0 .17425.035495.23691.098599ZM7.29293 10.0532l-2.36242 2.3534c-.12798.1318-.12798.3414 0 .4733l2.36242 2.3533c.06266.0631.14794.0986.23691.0986.08897 0 .17426-.0355.23691-.0986l.13347-.1333c.06517-.0627.10142-.1496.10011-.24v-1.5267c1.90639-.0019 3.66707-1.0192 4.61947-2.669.9523-1.64978.9518-3.68167-.0014-5.33097-.0545-.08728-.1449-.1459-.2469-.16-.1029-.01415-.2065.02035-.2803.09334l-.4939.49333c-.1027.1045-.1269.26299-.06.39333.3066.56733.4671 1.20194.4671 1.84667 0 2.2091-1.7927 4-4.00407 4v-1.5733c.00131-.0904-.03494-.1773-.10011-.24l-.13347-.1334c-.06265-.06307-.14794-.09856-.23691-.09856-.08897 0-.17425.03549-.23691.09856Z" />
              </svg>
              {t('restake')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default StakingHistory;
