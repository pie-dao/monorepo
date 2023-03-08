import { useWeb3React } from '@web3-react/core';
import {
  useUserLockAmount,
  useUserLockStartingTime,
} from '../../hooks/useToken';
import { formatBalance } from '../../utils/formatBalance';
import useTranslation from 'next-translate/useTranslation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useStakingTokenContract } from '../../hooks/useContracts';
import { getMonthsSinceStake } from '../../utils/dates';
import { useMemo } from 'react';
import { setStep, setSwap, setIsOpen } from '../../store/modal/modal.slice';
import { STEPS } from '../../store/modal/modal.types';

const WithdrawLock = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { account } = useWeb3React();
  const tokenLocker = useStakingTokenContract('ARV');
  const stakedAUXO = useUserLockAmount('ARV');
  const userLockStart = useUserLockStartingTime('ARV');

  const timeSinceStake = useMemo(() => {
    if (!userLockStart) return 0;
    return getMonthsSinceStake(userLockStart);
  }, [userLockStart]);

  const withdraw = () => {
    dispatch(setStep(STEPS.CONFIRM_UNSTAKE_VEAUXO));
    dispatch(setIsOpen(true));
  };

  const userLockAmount = useUserLockAmount('ARV');

  const boostToMax = () => {
    dispatch(setStep(STEPS.BOOST_STAKE_VEAUXO));
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
          spender: tokenLocker.address,
        },
      }),
    );
    dispatch(setIsOpen(true));
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-4 flex-1">
      <div className="flex items-center justify-between w-full">
        <div className="w-full flex flex-col flex-1">
          <h3 className="text-base font-semibold text-primary">
            {t('lockExpired')}
          </h3>
        </div>
        <button
          onClick={withdraw}
          className="flex gap-x-2 items-center px-4 py-1 text-sm font-medium text-primary bg-transparent rounded-2xl ring-inset ring-1 ring-primary enabled:hover:bg-primary enabled:hover:text-white disabled:opacity-70"
        >
          {t('withdraw')}
        </button>
      </div>
      <div className="bg-light-gray grid grid-cols-1 items-center gap-y-2 rounded-xl shadow-card self-center w-full p-3">
        <dl className="flex">
          <dt className="text-base text-primary font-medium flex items-center gap-x-2">
            {t('AUXOStaked')}
          </dt>
          <dd className="flex ml-auto font-semibold text-base text-primary">
            {formatBalance(stakedAUXO.label, defaultLocale)} AUXO
          </dd>
        </dl>
        <dl className="flex">
          <dt className="text-base text-primary font-medium flex items-center gap-x-2">
            {t('timeSinceStake')}:
          </dt>
          <dd className="flex ml-auto font-semibold text-base text-primary">
            {timeSinceStake === 1
              ? `${timeSinceStake} ${t('month')}`
              : `${timeSinceStake} ${t('months')}`}
          </dd>
        </dl>
      </div>
      <button
        onClick={boostToMax}
        className="px-20 py-2 text-base font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70 items-center mt-auto mb-3"
      >
        {t('restakeForMax')}
      </button>
    </div>
  );
};

export default WithdrawLock;
