import Image from 'next/image';
import ARV from '../../public/tokens/32x32/ARV.svg';
import PRV from '../../public/tokens/32x32/PRV.svg';
import useTranslation from 'next-translate/useTranslation';
import { formatBalance } from '../../utils/formatBalance';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useActiveRewards } from '../../hooks/useRewards';
import {
  setClaimFlowOpen,
  setClaimStep,
  setClaimToken,
  setTxHash,
} from '../../store/rewards/rewards.slice';
import Trans from 'next-translate/Trans';
import { STEPS, TokenName } from '../../store/rewards/rewards.types';
import { useMemo, useRef } from 'react';
import { useIsAutoCompoundEnabled } from '../../hooks/useToken';
import { isEmpty, isEqual } from 'lodash';
import { zeroBalance } from '../../utils/balances';
import { thunkStopCompoundRewards } from '../../store/rewards/rewards.thunks';
import { useMerkleDistributor } from '../../hooks/useContracts';
import { useConnectWallet } from '@web3-onboard/react';
import { StopIcon } from '@heroicons/react/solid';
import classNames from '../../utils/classnames';
import useSWR from 'swr';
import { fetcher } from '../../utils/fetcher';
import { MerkleTreesByUser } from '../../types/merkleTree';
import { MERKLE_TREES_BY_USER_URL } from '../../utils/constants';

const TotalRewards: React.FC = () => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);

  const totalPRVRewards = useActiveRewards('PRV');
  const totalARVRewards = useActiveRewards('ARV');

  const hasPRVRewards = !isEqual(totalPRVRewards?.total, zeroBalance);
  const hasARVRewards = !isEqual(totalARVRewards?.total, zeroBalance);

  const { t } = useTranslation();
  return (
    <section className="grid grid-cols-1 xl:grid-flow-col xl:grid-cols-2 gap-4 mt-4 w-full items-start">
      <div className="overflow-hidden rounded-lg shadow-sm items-start w-full font-medium transition-all mx-auto bg-left bg-no-repeat bg-[url('/images/background/bg-rewards.png')] bg-cover">
        <div className="flex flex-col px-4 py-4 w-full bg-white/80 gap-y-3 h-full">
          <div className="w-full flex justify-between gap-x-4 mb-2 pb-2 border-b border-custom-border">
            <div className="flex items-center gap-x-2">
              <Image src={ARV} alt="arv" width={24} height={24} priority />
              <h3 className="text-primary text-lg font-semibold flex gap-x-2 items-center">
                {t('totalRewards', { token: 'ARV' })}
              </h3>
            </div>
            <p className="text-primary text-lg font-semibold flex gap-x-2 uppercase items-center">
              {t('WETHAmount', {
                amountLabel: formatBalance(
                  totalARVRewards?.total?.label,
                  defaultLocale,
                  4,
                  'standard',
                ),
              })}
            </p>
          </div>
          {hasARVRewards ? (
            <ActionsBar token="ARV" />
          ) : (
            <NoRewards token="ARV" />
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg shadow-sm items-start w-full font-medium transition-all mx-auto bg-left bg-no-repeat bg-[url('/images/background/bg-rewards.png')] bg-cover">
        <div className="flex flex-col px-4 py-4 w-full bg-white/80 gap-y-3 h-full">
          <div className="w-full flex justify-between gap-x-4 mb-2 pb-2 border-b border-custom-border">
            <div className="flex items-center gap-x-2">
              <Image src={PRV} alt="prv" width={24} height={24} priority />
              <h3 className="text-primary text-lg font-semibold flex gap-x-2 items-center">
                {t('totalRewards', { token: 'PRV' })}
              </h3>
            </div>
            <p className="text-primary text-lg font-semibold flex gap-x-2 uppercase items-center">
              {t('WETHAmount', {
                amountLabel: formatBalance(
                  hasPRVRewards ? totalPRVRewards?.total?.label : 0,
                  defaultLocale,
                  4,
                  'standard',
                ),
              })}
            </p>
          </div>
          {hasPRVRewards ? (
            <ActionsBar token="PRV" />
          ) : (
            <NoRewards token="PRV" />
          )}
        </div>
      </div>
    </section>
  );
};

export default TotalRewards;

const ActionsBar = ({ token }: { token: TokenName }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const merkleDistributor = useMerkleDistributor(token);
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;

  const { data: merkleTreesByUser, isLoading } = useSWR<MerkleTreesByUser>(
    MERKLE_TREES_BY_USER_URL,
    fetcher,
  );

  const openDetailsModal = () => {
    dispatch(setClaimToken(token));
    dispatch(setClaimStep(STEPS.LIST_REWARDS));
    dispatch(setClaimFlowOpen(true));
  };

  const openClaimAllModal = () => {
    dispatch(setClaimToken(token));
    dispatch(setClaimStep(STEPS.CLAIM_MULTI_REWARDS));
    dispatch(setClaimFlowOpen(true));
  };

  const openCompoundModal = () => {
    dispatch(setClaimToken(token));
    dispatch(setClaimStep(STEPS.COMPOUND_REWARDS));
    dispatch(setClaimFlowOpen(true));
  };

  const stopAutoCompound = () => {
    if (isLoading || isEmpty(merkleTreesByUser)) return;
    dispatch(
      thunkStopCompoundRewards({
        token,
        account,
        merkleDistributor,
        userRewards: merkleTreesByUser[account],
      }),
    ).finally(() => {
      dispatch(setTxHash(null));
    });
  };

  const isCompouding = useIsAutoCompoundEnabled(token);
  const hoverRef = useRef(null);

  const compoundButtonText = useMemo(() => {
    if (isCompouding) {
      return (
        <>
          <span>
            <StopIcon className="w-4 h-4" />
          </span>
          <span>{t('stopAutocompound')}</span>
        </>
      );
    }
    return t('autocompound');
  }, [isCompouding, t]);

  return (
    <div className="w-full flex justify-between gap-x-4">
      <div className="flex items-center gap-x-2">
        <button
          onClick={() => openDetailsModal()}
          className="ring-1 ring-primary rounded-full px-2 py-1 text-primary font-medium text-sm bg-transparent enabled:hover:bg-primary enabled:hover:text-white"
        >
          {t('details')}
        </button>
      </div>
      <div className="flex items-center gap-x-2">
        {/* <button
          onClick={() => {
            if (isCompouding) {
              stopAutoCompound();
            } else {
              openCompoundModal();
            }
          }}
          ref={hoverRef}
          className={classNames(
            'ring-2 ring-secondary bg-secondary text-white rounded-full px-2 py-1 text-sm font-medium enabled:hover:bg-transparent enabled:hover:text-secondary flex justify-center items-center gap-x-1',
            !isCompouding && 'min-w-none',
            isCompouding && 'min-w-[190px]',
          )}
        >
          {compoundButtonText}
        </button> */}
        {!isCompouding && (
          <button
            onClick={() => openClaimAllModal()}
            className="flex gap-x-2 items-center w-fit px-2 py-1 text-sm font-medium text-white bg-green rounded-full ring-2 ring-green enabled:hover:bg-transparent enabled:hover:text-green disabled:opacity-70"
          >
            {t('claim')}
          </button>
        )}
      </div>
    </div>
  );
};

const NoRewards = ({ token }: { token: string }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-y-2 py-4">
      <div className="flex flex-col items-center">
        <h3 className="text-primary text-lg font-medium">
          {t('noRewardsAvailable')}
        </h3>
        <h4 className="text-secondary text-sm font-medium">
          {t('buyAUXOToEarnRewards')}
        </h4>
      </div>
      <button className="ring-1 ring-primary rounded-full px-8 py-2 text-primary font-medium text-sm bg-transparent enabled:hover:bg-primary enabled:hover:text-white flex gap-x-2 items-center mt-4">
        <div className="flex flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 16"
            className="h-4 w-4"
          >
            <path
              fill="currentColor"
              d="M10.5062.5H5.78435L0 16h4.04101l2.87811-.9449h2.45232L12.2556 16h3.798L10.5062.5ZM5.16976 12.5835 8.0539 4.01963h.18478c.03816.10935.07431.22694.11247.35692l2.76965 8.20695-1.74735-.9449H6.92113l-1.74936.9449h-.00201Z"
            />
          </svg>
        </div>
        <a
          href="https://app.uniswap.org/#/swap?outputCurrency=0xff030228a046F640143Dab19be00009606C89B1d&inputCurrency=ETH"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Trans
            i18nKey="getAUXOandStake"
            components={{
              b: <span className="font-bold" />,
            }}
            values={{
              token,
            }}
            ns="common"
          />
        </a>
      </button>
    </div>
  );
};
