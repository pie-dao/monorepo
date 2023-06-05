import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import Image from 'next/image';
import { formatBalance } from '../../../utils/formatBalance';
import { useWeb3React } from '@web3-react/core';
import ARVImage from '../../../public/tokens/32x32/ARV.svg';
import PRVImage from '../../../public/tokens/32x32/PRV.svg';
import {
  useActiveRewards,
  useUnclaimedRewards,
} from '../../../hooks/useRewards';
import { Month, STEPS } from '../../../store/rewards/rewards.types';
import { findMonthsByProof } from '../../../utils/findClaims';
import { setClaim, setClaimStep } from '../../../store/rewards/rewards.slice';
import { isEmpty } from 'lodash';
import { useIsAutoCompoundEnabled } from '../../../hooks/useToken';
import classNames from '../../../utils/classnames';

const imageMap = {
  ARV: ARVImage,
  PRV: PRVImage,
};
export type Token = 'PRV' | 'ARV';

export default function ListRewards() {
  const { t } = useTranslation();
  const { name } = useAppSelector((state) => state.rewards.claimFlow.token);
  const { rewardPositions } = useAppSelector((state) => state.rewards.data);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  const totalActiveRewards = useActiveRewards(name);
  const totalActiveRewardsList = useUnclaimedRewards(name);

  const claimSingleReward = (singleClaim: Month) => {
    const { proof } = singleClaim;
    const claim = findMonthsByProof(proof, rewardPositions, account);
    const choosenClaim = Object.assign({}, ...claim[name]) as Month;
    dispatch(setClaim(choosenClaim));
    dispatch(setClaimStep(STEPS.CLAIM_REWARDS));
  };

  const isCompounding = useIsAutoCompoundEnabled(name);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        <Image
          src={imageMap[name]}
          alt={name}
          width={32}
          height={32}
          priority
        />
      </div>
      <Dialog.Title
        as="h3"
        className="font-bold text-center text-xl text-primary capitalize w-full"
      >
        {t('tokenRewardsByMonth', {
          token: name,
        })}
      </Dialog.Title>
      <Dialog.Description className="text-center text-base text-sub-dark w-full">
        {t('tokenRewardsByMonthDescription', {
          token: name,
        })}
      </Dialog.Description>
      <div className="overflow-hidden rounded-lg shadow-sm items-start w-full font-medium transition-all mx-auto bg-left bg-no-repeat bg-[url('/images/background/bg-rewards.png')] bg-cover">
        <div className="flex flex-col px-4 py-4 w-full bg-white/80 gap-y-3 h-full">
          <div className="w-full flex justify-between gap-x-4 mb-2 pb-2 border-b border-custom-border">
            <div className="flex items-center gap-x-2">
              <Image
                src={imageMap[name]}
                alt={name}
                width={24}
                height={24}
                priority
              />
              <h3 className="text-primary text-lg font-semibold flex gap-x-2 items-center">
                {t('totalRewards', { token: name })}
              </h3>
            </div>
            <p className="text-primary text-lg font-semibold flex gap-x-2 uppercase items-center">
              {t('WETHAmount', {
                amountLabel: formatBalance(
                  totalActiveRewards?.total?.label,
                  defaultLocale,
                  4,
                  'standard',
                ),
              })}
            </p>
          </div>
          <div className="w-full flex flex-col gap-y-2">
            {!isEmpty(totalActiveRewardsList) &&
              totalActiveRewardsList.map((reward) => (
                <div
                  key={reward.month}
                  className="w-full flex justify-between gap-x-4 bg-gradient-primary-inverse rounded-md"
                >
                  <div className="flex items-center">
                    <p className=" text-primary text-sm font-medium px-2 py-1">
                      {new Date(reward.month).toLocaleString(defaultLocale, {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <p className="text-primary text-sm font-medium">
                      {t('WETHAmount', {
                        amountLabel: formatBalance(
                          reward.rewards.label,
                          defaultLocale,
                          4,
                        ),
                      })}
                    </p>
                    <button
                      onClick={() => {
                        claimSingleReward(reward);
                      }}
                      disabled={isCompounding}
                      className={classNames(
                        'flex gap-x-2 items-center w-fit px-2 py-1 text-sm font-medium text-white bg-green rounded-full ring-inset ring-1 ring-green enabled:hover:bg-transparent enabled:hover:text-green disabled:opacity-70',
                        isCompounding &&
                          'background-animate  disabled:bg-secondary disabled:ring-0 bg-gradient-to-r from-primary to-secondary',
                      )}
                    >
                      {isCompounding ? t('compounding') : t('claim')}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
