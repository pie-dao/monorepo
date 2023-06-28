import { useCallback, useMemo } from 'react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { useConnectWallet } from '@web3-onboard/react';
import {
  useDelegatorAddress,
  useTokenBalance,
  useUserEndDate,
  useUserHasLock,
  useUserIncreasedLevel,
  useUserLevel,
  useUserLockAmount,
  useUserVotingPower,
} from '../../hooks/useToken';
import veAUXOIcon from '../../public/tokens/AUXO.svg';
import triangle from '../../public/images/icons/triangle.svg';
import unlock from '../../public/images/icons/unlock.svg';
import { TokenConfig } from '../../types/tokensConfig';
import { formatAsPercent, formatBalance } from '../../utils/formatBalance';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ParentSize } from '@visx/responsive';
import LevelChart from '../LevelChart/LevelChart';
import { ExclamationIcon } from '@heroicons/react/solid';
import Banner from '../Banner/Banner';
import { thunkDelegateVote } from '../../store/products/thunks';
import { useARVToken } from '../../hooks/useContracts';

type Props = {
  tokenConfig: TokenConfig;
  commitmentValue?: number;
  setCommitmentValue?: (value: number) => void;
};

const Summary: React.FC<Props> = ({ tokenConfig, commitmentValue }) => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { increasedStakingValue } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const { name } = tokenConfig;
  const { t } = useTranslation();
  const veAUXOBalance = useTokenBalance(name);
  const arvConract = useARVToken();
  const stakedAuxo = useUserLockAmount(name);
  const hasLock = useUserHasLock(name);
  const delegator = useDelegatorAddress(name);
  const endDate = useUserEndDate();
  const userLevel = useUserLevel(commitmentValue);
  const increasedLevel = useUserIncreasedLevel(increasedStakingValue);
  const votingPower = useUserVotingPower('ARV');

  const delegateVote = useCallback(() => {
    dispatch(
      thunkDelegateVote({
        ARV: arvConract,
        account,
      }),
    );
  }, [account, arvConract, dispatch]);

  const numEmojis = useMemo(() => {
    const level = hasLock ? increasedLevel : userLevel;
    if (level >= 28) {
      return Math.min(level - 27, 3);
    }
    return 0;
  }, [hasLock, increasedLevel, userLevel]);

  const fireEmojis = useMemo(
    () =>
      Array.from({ length: numEmojis }, (_, index) => (
        <span key={index} role="img" aria-label="fire">
          🔥
        </span>
      )),
    [numEmojis],
  );

  const votingPowerValue = useMemo(() => {
    if (delegator?.toLowerCase() === account?.toLowerCase()) {
      return formatAsPercent(votingPower?.label, defaultLocale, 2);
    }
    if (delegator?.toLowerCase() !== account?.toLowerCase()) {
      return (
        <button
          onClick={delegateVote}
          className="text-base font-bold text-white uppercase bg-gradient-major-secondary-predominant rounded-xl py-1 px-4"
        >
          {t('delegateToSelfForRewards')}
        </button>
      );
    }
    if (!account || !delegator) {
      return t('N/A');
    }
    return '--';
  }, [account, defaultLocale, delegateVote, delegator, t, votingPower?.label]);

  const summaryData = useMemo(() => {
    return [
      {
        icon: <Image src={veAUXOIcon} alt="veAUXO" width={24} height={24} />,
        title: t('AUXOStaked'),
        value: (
          <>
            {wallet?.provider
              ? formatBalance(stakedAuxo?.label, defaultLocale, 2, 'standard')
              : null}{' '}
            AUXO
          </>
        ),
        visibility: true,
      },
      {
        icon: <Image src={triangle} alt="triangle" width={24} height={24} />,
        title: t('vaultBalance'),
        value: (
          <>
            {wallet?.provider
              ? formatBalance(
                  veAUXOBalance?.label,
                  defaultLocale,
                  2,
                  'standard',
                )
              : null}{' '}
            ARV
          </>
        ),
        visibility: true,
      },
      {
        icon: <Image src={triangle} alt="triangle" width={24} height={24} />,
        title: t('governancePower'),
        value: votingPowerValue,
        visibility: hasLock,
      },
      {
        icon: <Image src={unlock} alt="triangle" width={24} height={24} />,
        title: t('unlock'),
        value: hasLock ? endDate : '--/--/----',
        visibility: hasLock,
      },
    ];
  }, [
    t,
    wallet?.provider,
    stakedAuxo?.label,
    defaultLocale,
    veAUXOBalance?.label,
    votingPowerValue,
    hasLock,
    endDate,
  ]);

  return (
    <div className="flex flex-col px-4 py-3 rounded-lg shadow-md bg-white gap-y-2">
      <div className="flex flex-col gap-y-2 w-full items-start">
        <h3 className="text-base font-bold text-primary">
          {t('rewardLevel')}:
        </h3>
        <h4 className="text-base font-bold text-white uppercase bg-gradient-major-secondary-predominant rounded-xl py-1 px-4">
          {t('levelAndReward', {
            level: hasLock ? increasedLevel : userLevel,
          })}
          {fireEmojis?.length > 0 && <span className="ml-2">{fireEmojis}</span>}
        </h4>
      </div>
      <ParentSize className="w-full h-40 relative -top-8">
        {({ width }) => (
          <LevelChart
            width={width}
            height={180}
            level={hasLock ? increasedLevel : userLevel}
          />
        )}
      </ParentSize>
      {account && delegator !== account && (
        <Banner
          bgColor="bg-warning"
          content={t('rememberToDelegate')}
          icon={
            <ExclamationIcon
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />
          }
          className="group-hover:text-underline"
        />
      )}
      {summaryData.map(({ icon, title, value, visibility }, index) => {
        if (!visibility) return null;
        return (
          <div
            className="bg-sidebar flex items-center gap-x-2 rounded-lg shadow-card self-center w-full p-2"
            key={index}
          >
            <dt className="text-base text-primary font-medium flex items-center gap-x-2">
              {icon && icon}
              {title}
            </dt>
            <dd className="flex ml-auto font-semibold text-base text-primary">
              {value}
            </dd>
          </div>
        );
      })}
    </div>
  );
};

export default Summary;
