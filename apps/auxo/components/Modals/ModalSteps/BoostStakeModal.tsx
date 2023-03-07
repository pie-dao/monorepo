import { useMemo, useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import Image from 'next/image';
import { useStakingTokenContract } from '../../../hooks/useContracts';
import { thunkBoostToMaxVeAUXO } from '../../../store/products/thunks';
import ArrowRight from '../../../public/images/icons/arrow-right.svg';
import { formatBalance } from '../../../utils/formatBalance';
import { useWeb3React } from '@web3-react/core';
import { addMonths } from '../../../utils/dates';
import {
  useDecimals,
  useUserLevel,
  useUserLevelPercetageReward,
  useUserLockAmount,
  useUserLockDuration,
} from '../../../hooks/useToken';
import { ParentSize } from '@visx/responsive';
import veAUXOConversionCalculator from '../../../utils/veAUXOConversionCalculator';

export default function BoostStakeModal() {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { tx, swap } = useAppSelector((state) => state.modal);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { hash } = tx;
  const dispatch = useAppDispatch();
  const [depositLoading, setDepositLoading] = useState(false);
  const stakingContract = useStakingTokenContract(swap.to.token);
  const actualLock = useUserLockDuration('ARV');
  const userLevel = useUserLevel(actualLock);
  const userLevelPercetageReward = useUserLevelPercetageReward(userLevel);
  const stakedAUXOBalance = useUserLockAmount('ARV');
  const decimals = useDecimals('ARV');

  const boostToMax = () => {
    setDepositLoading(true);
    dispatch(
      thunkBoostToMaxVeAUXO({ account, tokenLocker: stakingContract }),
    ).finally(() => setDepositLoading(false));
  };

  const userProjectedTotalStakingAmount = useMemo(() => {
    const convertNewAmount = veAUXOConversionCalculator(
      stakedAUXOBalance,
      36,
      decimals,
    );
    return convertNewAmount;
  }, [stakedAUXOBalance, decimals]);

  return (
    <>
      <Dialog.Title
        as="h3"
        className="font-bold text-center text-xl text-primary capitalize w-full"
      >
        {t('restakeToMax')}
      </Dialog.Title>
      <div className="flex flex-col items-center justify-center w-full gap-y-6">
        <div className="mt-2">
          <p className="text-lg text-sub-dark font-medium">
            {t('boostStakeModalDescription', {
              token: swap.from.token,
            })}
          </p>
        </div>
        <div className="divide-y border-y flex flex-col items-center gap-x-2 self-center justify-between w-full">
          {swap && (
            <div className="w-full flex flex-col">
              <div className="grid grid-cols-[1fr_max-content_1fr] place-content-center py-6 gap-x-2">
                <div className="text-xl text-primary font-medium flex items-center gap-x-2 justify-self-end">
                  <span className="text-xl font-medium text-primary">
                    {t('levelAndReward', {
                      level: userLevel,
                      reward: userLevelPercetageReward,
                    })}
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
                <div className="text-2xl text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant px-4 py-2 rounded-lg justify-self-start">
                  <span>
                    {t('levelAndReward', {
                      level: 30,
                      reward: '100%',
                    })}{' '}
                    🔥
                  </span>
                </div>
              </div>
              {/* {userLevel && (
                <ParentSize className="w-full h-40 relative -top-6">
                  {({ width }) => (
                    <LevelChart width={width} height={160} level={30} />
                  )}
                </ParentSize>
              )} */}
            </div>
          )}
          {swap?.stakingTime && (
            <div className="w-full flex flex-col py-2">
              <div className="flex items-center self-center justify-between w-full">
                <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                  <span className="text-xl font-medium text-primary">
                    {t('youAreRestaking')}:
                  </span>
                </div>
                <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                  <span className="text-xl font-medium text-primary">
                    {formatBalance(
                      userProjectedTotalStakingAmount,
                      defaultLocale,
                    )}{' '}
                    ARV
                  </span>
                </div>
              </div>
              <div className="flex items-center self-center justify-between w-full">
                <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                  <span className="text-sm font-medium text-primary">
                    {t('unlock')}
                  </span>
                </div>
                <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                  <span className="text-sm font-medium text-primary">
                    {addMonths(36).toLocaleDateString(defaultLocale, {
                      year: 'numeric',
                      month: '2-digit',
                      day: 'numeric',
                    })}
                  </span>
                </div>
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
                  {t('blockExplorer')}
                </span>
              </div>
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                <a
                  href={`https://goerli.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-primary truncate underline max-w-xs"
                >
                  {hash}
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="w-full">
          {!depositLoading ? (
            <button
              type="button"
              className="w-full px-8 py-1 text-lg font-medium text-white bg-secondary rounded-2xl ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
              onClick={boostToMax}
            >
              {t('restakeToken', { token: swap?.to?.token })}
            </button>
          ) : (
            <div className="w-full flex justify-center">
              <p className="bg-clip-text bg-gradient-major-colors text-transparent ">
                {t('confirmInWallet')}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
