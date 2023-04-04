import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import weth from '../../public/images/icons/weth.svg';
import yellowCoin from '../../public/images/icons/yellow-coin.svg';
import { formatBalance } from '../../utils/formatBalance';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useTotalActiveRewards } from '../../hooks/useRewards';
import { STEPS } from '../../store/rewards/rewards.types';
import {
  setClaimFlowOpen,
  setClaimStep,
} from '../../store/rewards/rewards.slice';

const TotalRewardsBar = () => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const totalRewards = useTotalActiveRewards();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const openClaimAllModal = () => {
    dispatch(setClaimStep(STEPS.CLAIM_ALL_REWARDS));
    dispatch(setClaimFlowOpen(true));
  };

  return (
    <section className="w-full mt-6 flex">
      <div className="w-full flex shadow-sm rounded-lg bg-[url('/images/background/bg-rewards.png')] bg-cover overflow-hidden">
        <div className="bg-white bg-opacity-80 items-center justify-between w-full px-4 py-2 flex">
          <div className="flex items-center gap-x-2">
            <Image
              src={yellowCoin}
              alt="ethereum"
              width={24}
              height={24}
              priority
            />
            <h3 className="text-primary text-lg font-semibold flex gap-x-2 uppercase items-center">
              {t('totalClaimableRewards')}
            </h3>
          </div>
          <div className="flex items-center gap-x-8">
            <div className="flex gap-x-2 items-center">
              <Image
                src={weth}
                alt="ethereum"
                width={24}
                height={24}
                priority
              />
              <p className="text-primary text-lg font-semibold flex gap-x-2 uppercase items-center">
                {t('WETHAmount', {
                  amountLabel: formatBalance(
                    totalRewards?.label,
                    defaultLocale,
                    4,
                    'standard',
                  ),
                })}
              </p>
            </div>
            <button
              onClick={openClaimAllModal}
              className="flex gap-x-2 items-center w-fit px-4 py-2 text-sm font-medium text-white bg-green rounded-full ring-inset ring-2 ring-green enabled:hover:bg-transparent enabled:hover:text-green disabled:opacity-70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 16"
                className="fill-current w-3 h-3"
              >
                <path d="M1.83301 4.00033v1.66666c0 .55229.44771 1 1 1 .0884 0 .17319-.03512.2357-.09763.06251-.06251.09763-.1473.09763-.2357V4.00033h1.33333v7.99997c0 .7364.59696 1.3334 1.33334 1.3334h5.33329c.7364 0 1.3334-.597 1.3334-1.3334V4.00033h1.3333v2.33333c0 .18409.1492.33333.3333.33333.5523 0 1-.44771 1-1V4.00033c0-.73638-.5969-1.33334-1.3333-1.33334H3.16634c-.73638 0-1.33333.59696-1.33333 1.33334Zm4 7.99997V4.00033h2v7.99997h-2Zm5.33329 0H9.83301V4.00033h1.33329v7.99997Z" />
              </svg>
              {t('claimAllRewards')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalRewardsBar;
