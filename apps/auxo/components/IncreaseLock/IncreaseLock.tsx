import useTranslation from 'next-translate/useTranslation';
import { addMonths } from '../../utils/dates';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { thunkIncreaseLockVeAUXO } from '../../store/products/thunks';
import { useStakingTokenContract } from '../../hooks/useContracts';
import IncreaseSlider from './IncreaseSlider';
import { useMemo } from 'react';
import {
  useDecimals,
  useTokenBalance,
  useUserIncreasedLevel,
  useUserLevel,
  useUserLockAmount,
  useUserLockDuration,
  useUserLockDurationInSeconds,
  useUserLockStartingTime,
  useUserRemainingStakingTimeInMonths,
} from '../../hooks/useToken';
import ARVConversionCalculator from '../../utils/ARVConversionCalculator';
import { addNumberToBnReference, zeroBalance } from '../../utils/balances';
import { formatBalance } from '../../utils/formatBalance';
import { useConnectWallet } from '@web3-onboard/react';

const IncreaseLock: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { increasedStakingValue } = useAppSelector((state) => state.dashboard);
  const tokenLocker = useStakingTokenContract('ARV');
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const actualLock = useUserLockDuration('ARV');
  const userStartingLock = useUserLockStartingTime('ARV');
  const userLockStartingTime = useUserLockStartingTime('ARV');
  const userLockDuration = useUserLockDurationInSeconds('ARV');
  const userLevel = useUserLevel(actualLock);
  const newLevel = useUserIncreasedLevel(increasedStakingValue);
  const veAUXOBalance = useTokenBalance('ARV');
  const stakedAUXOBalance = useUserLockAmount('ARV');
  const remainingCommitment = useUserRemainingStakingTimeInMonths();
  const decimals = useDecimals('ARV');
  const sumCommitment = useMemo(() => {
    return increasedStakingValue + remainingCommitment;
  }, [increasedStakingValue, remainingCommitment]);

  const maxLock = useMemo(() => {
    return 36 - actualLock;
  }, [actualLock]);

  const userProjectedTotalStakingAmount = useMemo(() => {
    const convertNewAmount = ARVConversionCalculator(
      stakedAUXOBalance,
      sumCommitment,
      decimals,
    );
    return addNumberToBnReference(zeroBalance, convertNewAmount, decimals);
  }, [stakedAUXOBalance, sumCommitment, decimals]);

  const start = new Date(userStartingLock * 1000).toLocaleDateString(
    defaultLocale,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  );

  const newEnd = addMonths(
    increasedStakingValue,
    new Date(userLockStartingTime * 1000 + userLockDuration * 1000),
  ).toLocaleDateString(defaultLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const increaseLock = () => {
    dispatch(
      thunkIncreaseLockVeAUXO({
        account,
        tokenLocker,
        months: increasedStakingValue,
      }),
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="flex items-center justify-between w-full">
        <div className="w-full flex flex-col">
          <h3 className="text-base font-bold text-primary">
            {t('increaseTime')}
          </h3>
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-2 w-full pt-2">
        <div className="w-full flex justify-between flex-col gap-y-4">
          <div className="w-full text-center items-center">
            <IncreaseSlider maxLock={maxLock} />
          </div>
          <div className="flex flex-col gap-y-2 p-2 rounded-xl bg-background">
            <h4 className="text-base font-semibold text-secondary">
              {t('afterIncrease')}
            </h4>
            <div className="flex">
              <dt className="text-base text-primary font-medium flex items-center gap-x-2">
                {t('stakingTime')}:
              </dt>
              <dd className="flex ml-auto pr-2 font-medium text-base text-primary items-end gap-x-2">
                <span className="text-sub-light line-through text-sm">
                  {actualLock} {actualLock > 1 ? t('months') : t('month')}
                </span>{' '}
                <span className="font-semibold text-primary text-base">
                  {sumCommitment} {t('months')}
                </span>
              </dd>
            </div>
            <div className="flex">
              <dt className="text-base text-primary font-medium flex items-center gap-x-2">
                {t('unlock')}
              </dt>
              <dd className="flex ml-auto pr-2 font-medium text-base text-primary items-end gap-x-2">
                <span className="text-sub-light line-through text-sm">
                  {start}
                </span>{' '}
                <span className="font-semibold text-primary text-base">
                  {newEnd}
                </span>
              </dd>
            </div>
            <div className="flex">
              <dt className="text-base text-primary font-medium flex items-center gap-x-2">
                {t('rewardLevel')}:
              </dt>
              <dd className="flex ml-auto pr-2 font-medium text-base text-primary items-end gap-x-2">
                <span className="text-sub-light line-through text-sm">
                  {t('level', { level: userLevel })}
                </span>{' '}
                <span className="font-semibold text-secondary text-base">
                  {t('levelOf', { level: newLevel })}
                </span>
              </dd>
            </div>
            <div className="flex">
              <dt className="text-base text-primary font-medium flex items-center gap-x-2">
                {t('newVaultBalance')}
              </dt>
              <dd className="flex ml-auto pr-2 font-medium text-base text-primary items-end gap-x-2">
                <span className="text-sub-light line-through text-sm">
                  {formatBalance(veAUXOBalance.label, defaultLocale, 4)} ARV
                </span>{' '}
                <span className="font-semibold text-primary text-base">
                  {formatBalance(
                    userProjectedTotalStakingAmount.label,
                    defaultLocale,
                    4,
                  )}{' '}
                  ARV
                </span>
              </dd>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center pt-4">
        <button
          onClick={increaseLock}
          disabled={increasedStakingValue === 0}
          className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
        >
          {t('increaseLock')}
        </button>
      </div>
    </div>
  );
};

export default IncreaseLock;
