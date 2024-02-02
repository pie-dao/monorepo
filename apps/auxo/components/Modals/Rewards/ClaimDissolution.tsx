import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import Image from 'next/image';
import { useMerkleDistributor } from '../../../hooks/useContracts';
import { useChainExplorer } from '../../../hooks/useToken';
import { formatBalance } from '../../../utils/formatBalance';
import { useConnectWallet } from '@web3-onboard/react';
import ARVImage from '../../../public/tokens/32x32/ARV.svg';
import PRVImage from '../../../public/tokens/32x32/PRV.svg';
import AUXOImage from '../../../public/tokens/32x32/AUXO.svg';
import PendingTransaction from '../../PendingTransaction/PendingTransaction';
import { thunkClaimDissolution } from '../../../store/rewards/rewards.thunks';
import { WETH_ADDRESS } from '../../../utils/constants';
import wEthImage from '../../../public/tokens/24x24/ETH.svg';
import { setTotalClaiming } from '../../../store/rewards/rewards.slice';
import useSWR from 'swr';
import { fetcher } from '../../../utils/fetcher';
import { MerkleTreesDissolution } from '../../../types/merkleTree';
import { MERKLE_TREES_BY_USER_DISSOLUTION_URL } from '../../../utils/constants';
import { getUserDissolutionMerkeTree } from '../../../utils/getUserMerkleTree';
import { useActiveClaimDissolution } from '../../../hooks/useRewards';
import { addBalances, zeroBalance } from '../../../utils/balances';
import { MerkleDistributorAbi } from '@shared/util-blockchain';

const imageMap = {
  ARV: ARVImage,
  PRV: PRVImage,
  AUXO: AUXOImage,
};
export type Token = 'AUXO';

export default function ClaimRewards() {
  const { t } = useTranslation();
  const { tx, phase } = useAppSelector((state) => state.rewards.claimFlow);
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const merkleDistributor = useMerkleDistributor('AUXO');
  const [claimRewardLoading, setClaimRewardLoading] = useState(false);
  const dissolutions = useActiveClaimDissolution();

  const { data } = useSWR<MerkleTreesDissolution>(
    MERKLE_TREES_BY_USER_DISSOLUTION_URL,
    fetcher,
  );

  const amountToClaim = dissolutions[phase - 1]?.monthClaimed
    ? zeroBalance
    : dissolutions[phase - 1]?.rewards;

  const claimSingleReward = () => {
    const dissolution = dissolutions[phase - 1];
    const prepareClaim = {
      windowIndex: dissolution.windowIndex,
      merkleProof: dissolution.proof,
      amount: dissolution.rewards.value,
      accountIndex: dissolution.accountIndex,
      account,
      token: WETH_ADDRESS,
    };

    setClaimRewardLoading(true);
    dispatch(setTotalClaiming(amountToClaim));
    dispatch(
      thunkClaimDissolution({
        claims: prepareClaim,
        merkleDistributor,
        account,
        userRewards: getUserDissolutionMerkeTree(data, account),
      }),
    ).finally(() => setClaimRewardLoading(false));
  };

  return (
    <>
      {!tx?.hash ? (
        <>
          <div className="flex flex-col items-center justify-center w-full">
            <Image
              src={imageMap['AUXO']}
              alt={'AUXO'}
              width={32}
              height={32}
              priority
            />
          </div>
          <Dialog.Title
            as="h3"
            className="font-bold text-center text-xl text-primary capitalize w-full"
          >
            {t('claimingDissolution')}
          </Dialog.Title>
          <div className="overflow-hidden rounded-lg shadow-sm items-start w-full font-medium transition-all mx-auto">
            <div className="flex flex-col px-4 py-4 w-full bg-white/80 gap-y-3 h-full">
              <div className="flex justify-center w-full">
                <div className="text-2xl w-fit text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant pl-4 pr-6 py-2 rounded-lg z-10">
                  <Image src={wEthImage} alt={'weth'} width={24} height={24} />
                  <span>
                    {formatBalance(
                      amountToClaim?.label,
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
            {!claimRewardLoading ? (
              <button
                type="button"
                className="w-full px-16 py-2.5 text-lg font-medium uppercase text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                onClick={claimSingleReward}
              >
                {t('claimRewards')}
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
