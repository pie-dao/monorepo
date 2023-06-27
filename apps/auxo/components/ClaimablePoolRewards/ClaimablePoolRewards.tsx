import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { formatBalance } from '../../utils/formatBalance';
import { BanknotesIcon, WalletIcon } from '../Icons/Icons';
import { useEnanchedPools } from '../../hooks/useEnanchedPools';
import { isEqual } from 'lodash';
import { zeroBalance } from '../../utils/balances';
import Tooltip from '../Tooltip/Tooltip';
import ThreeDots from '../../public/images/icons/three-dots.svg';
import { STEPS } from '../../store/lending/lending.types';
import {
  setLendingFlowPool,
  setLendingFlowOpen,
  setLendingStep,
} from '../../store/lending/lending.slice';
import { useConnectWallet } from '@web3-onboard/react';
import { PREFERENCES } from '../../utils/constants';

export const ClaimablePoolRewards = ({
  poolAddress,
}: {
  poolAddress: string;
}) => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const preference = useAppSelector(
    (state) => state.lending.pools?.[poolAddress]?.userData?.preference ?? null,
  );
  const { t } = useTranslation();
  const { data } = useEnanchedPools(poolAddress);
  const dispatch = useAppDispatch();
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;

  const isAlreadyWithdraw = preference === PREFERENCES.WITHDRAW;

  const claimRewards = () => {
    dispatch(setLendingFlowPool(poolAddress));
    dispatch(setLendingFlowOpen(true));
    dispatch(setLendingStep(STEPS.LEND_REWARDS_CLAIM));
  };

  const claimableAmount =
    isEqual(data?.userData?.yield, zeroBalance) ||
    data?.userData?.yield === undefined ||
    data?.userData?.yield === null;

  const requestWithdraw = () => {
    dispatch(setLendingFlowPool(poolAddress));
    dispatch(setLendingFlowOpen(true));
    dispatch(setLendingStep(STEPS.WITHDRAW_REQUEST));
  };

  const withdrawalReady = data?.userData?.canWithdraw;

  const withdraw = () => {
    dispatch(setLendingFlowPool(poolAddress));
    dispatch(setLendingFlowOpen(true));
    dispatch(setLendingStep(STEPS.WITHDRAW_CONFIRM));
  };

  return (
    <div className="flex gap-x-4 gap-y-2 flex-wrap items-center w-full bg-gradient-primary shadow-md rounded-lg px-3 py-2 justify-between">
      <div className="flex gap-x-2 items-center">
        <div className="flex flex-shrink-0 text-primary">
          <WalletIcon />
        </div>
        <p className="text-lg text-primary font-medium">
          {t('claimableRewards', {
            amount: formatBalance(
              data?.userData?.yield?.label,
              defaultLocale,
              2,
              'standard',
            ),
          })}{' '}
          {data?.attributes?.token?.data?.attributes?.name}
        </p>
      </div>
      <div className="flex gap-x-2 items-center ml-auto">
        {withdrawalReady && account ? (
          <button
            type="button"
            className="flex gap-x-2 items-center w-fit px-2 py-1 text-sm font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
            onClick={withdraw}
            disabled={withdrawalReady}
          >
            <BanknotesIcon />
            {t('withdraw')}
          </button>
        ) : null}
        <button
          type="button"
          className="flex gap-x-2 items-center w-fit px-2 py-1 text-sm font-medium text-white bg-green rounded-full ring-inset ring-2 ring-green enabled:hover:bg-transparent enabled:hover:text-green disabled:opacity-70"
          onClick={claimRewards}
          disabled={claimableAmount}
        >
          <BanknotesIcon />
          {t('claimRewards')}
        </button>
        {account && !isAlreadyWithdraw ? (
          <div className="flex order-2 sm:order-3 mx-4">
            <Tooltip
              icon={
                <Image
                  src={ThreeDots}
                  width={18}
                  height={18}
                  priority
                  alt="three dots"
                />
              }
            >
              <div className="flex bg-white rounded-md">
                <button
                  className="flex items-center gap-x-2 hover:bg-background px-4 py-2 rounded-md"
                  onClick={requestWithdraw}
                >
                  <span className="text-primary font-medium text-base">
                    {t('requestWithdraw')}
                  </span>
                </button>
              </div>
            </Tooltip>
          </div>
        ) : null}
      </div>
    </div>
  );
};
