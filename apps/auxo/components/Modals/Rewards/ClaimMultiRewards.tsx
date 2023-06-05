import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import Image from 'next/image';
import { useMerkleDistributor } from '../../../hooks/useContracts';
import { useChainExplorer } from '../../../hooks/useToken';
import { formatBalance } from '../../../utils/formatBalance';
import { useWeb3React } from '@web3-react/core';
import ARVImage from '../../../public/tokens/32x32/ARV.svg';
import PRVImage from '../../../public/tokens/32x32/PRV.svg';
import PendingTransaction from '../../PendingTransaction/PendingTransaction';
import { thunkClaimRewards } from '../../../store/rewards/rewards.thunks';
import {
  MERKLE_TREES_BY_USER_URL,
  WETH_ADDRESS,
} from '../../../utils/constants';
import wEthImage from '../../../public/tokens/24x24/ETH.svg';
import {
  useActiveRewards,
  useUnclaimedRewards,
} from '../../../hooks/useRewards';
import { setTotalClaiming } from '../../../store/rewards/rewards.slice';
import useSWR from 'swr';
import { fetcher } from '../../../utils/fetcher';
import { MerkleTreesByUser } from '../../../types/merkleTree';
import { isEmpty } from 'lodash';

const imageMap = {
  ARV: ARVImage,
  PRV: PRVImage,
};
export type Token = 'PRV' | 'ARV';

export default function ClaimRewards() {
  const { t } = useTranslation();
  const { name } = useAppSelector((state) => state.rewards.claimFlow.token);
  const { tx } = useAppSelector((state) => state.rewards.claimFlow);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const merkleDistributor = useMerkleDistributor(name);
  const [claimRewardLoading, setClaimRewardLoading] = useState(false);
  const unclaimedRewards = useUnclaimedRewards(name);
  const unclaimedRewardsTotal = useActiveRewards(name);

  const { data: merkleTreesByUser, isLoading } = useSWR<MerkleTreesByUser>(
    MERKLE_TREES_BY_USER_URL,
    fetcher,
  );

  const claimRewards = () => {
    if (isLoading || isEmpty(merkleTreesByUser)) return;
    setClaimRewardLoading(true);
    dispatch(setTotalClaiming(unclaimedRewardsTotal?.total));
    dispatch(
      thunkClaimRewards({
        claim: unclaimedRewards.map((reward) => ({
          windowIndex: reward.windowIndex,
          merkleProof: reward.proof,
          amount: reward.rewards.value,
          accountIndex: reward.accountIndex,
          account,
          token: WETH_ADDRESS,
        })),
        merkleDistributor,
        account,
        isSingleClaim: false,
        userRewards: merkleTreesByUser[account],
      }),
    ).finally(() => setClaimRewardLoading(false));
  };

  return (
    <>
      {!tx?.hash ? (
        <>
          <div className="flex flex-col items-center justify-center w-full gap-y-2">
            <Image
              src={imageMap[name]}
              alt={name}
              width={32}
              height={32}
              priority
            />

            <Dialog.Title
              as="h3"
              className="font-bold text-center text-xl text-primary capitalize w-full"
            >
              {t('claimingRewardsFor', {
                token: name,
              })}
            </Dialog.Title>
          </div>
          <div className="overflow-hidden rounded-lg shadow-sm items-start w-full font-medium transition-all mx-auto bg-left bg-no-repeat bg-[url('/images/background/bg-rewards.png')] bg-cover">
            <div className="flex flex-col px-4 py-4 w-full bg-white/80 gap-y-3 h-full">
              <div className="flex justify-center w-full">
                <div className="text-2xl w-fit text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant pl-4 pr-6 py-2 rounded-lg z-10">
                  <Image src={wEthImage} alt={'weth'} width={24} height={24} />
                  <span>
                    {formatBalance(
                      unclaimedRewardsTotal?.total?.label,
                      defaultLocale,
                      4,
                      'standard',
                    )}{' '}
                    <span className="uppercase">{t('weth')}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-y-4 items-center mt-4">
            <div className="w-full flex justify-center items-center gap-x-2">
              <Image
                src={imageMap[name]}
                alt={name}
                width={24}
                height={24}
                priority
              />
              <p className="font-semibold text-primary text-lg">
                {name}: {unclaimedRewards.length} {t('epochs')}
              </p>
            </div>
            {!claimRewardLoading ? (
              <button
                type="button"
                className="w-fit px-16 py-2.5 text-lg font-medium uppercase text-white bg-green rounded-full ring-inset ring-2 ring-green enabled:hover:bg-transparent enabled:hover:text-green disabled:opacity-70"
                onClick={claimRewards}
              >
                {t('claimAllRewards')}
              </button>
            ) : (
              <div className="w-full flex justify-center">
                <p className="bg-clip-text bg-gradient-major-colors text-transparent ">
                  {t('confirmInWallet')}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <PendingTransactionContent />
      )}
    </>
  );
}

export const PendingTransactionContent = () => {
  const { t } = useTranslation();
  const chainExplorer = useChainExplorer();
  const { tx } = useAppSelector((state) => state.rewards.claimFlow);

  return (
    <>
      <Dialog.Title
        as="h3"
        className="font-bold text-center text-xl text-primary capitalize w-full"
      >
        {t('pendingTransaction')}
      </Dialog.Title>
      <div className="flex flex-col items-center justify-center w-full gap-y-6">
        <div className="flex items-center self-center justify-between w-full py-2">
          <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
            <Image
              src={'/images/icons/etherscan.svg'}
              alt={'etherscan'}
              width={24}
              height={24}
            />
            <span className="text-xl font-semibold text-primary">
              {t('blockExplorer')}
            </span>
          </div>
          <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
            <a
              href={
                chainExplorer?.url
                  ? `${chainExplorer?.url}/tx/${tx?.hash}`
                  : '#'
              }
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-primary truncate underline max-w-xs"
            >
              {tx?.hash}
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center self-center gap-y-4 w-full py-2">
          <PendingTransaction />
        </div>
      </div>
    </>
  );
};
