import { useMemo } from 'react';
import Image from 'next/image';
import { ethers } from 'ethers';
import useTranslation from 'next-translate/useTranslation';
import { useWeb3React } from '@web3-react/core';
import {
  useDelegatorAddress,
  useTokenBalance,
  useUserEndDate,
  useUserHasLock,
  useUserIncreasedLevel,
  useUserLevel,
  useUserLevelPercetageReward,
  useUserLockAmount,
  useUserVotingPower,
} from '../../hooks/useToken';
import veAUXOIcon from '../../public/tokens/AUXO.svg';
import triangle from '../../public/images/icons/triangle.svg';
import unlock from '../../public/images/icons/unlock.svg';
import { TokenConfig } from '../../types/tokensConfig';
import { formatAsPercent, formatBalance } from '../../utils/formatBalance';
import { useAppSelector } from '../../hooks';
import trimAccount from '../../utils/trimAccount';
import { ParentSize } from '@visx/responsive';
import LevelChart from '../LevelChart/LevelChart';

type Props = {
  tokenConfig: TokenConfig;
  commitmentValue?: number;
  setCommitmentValue?: (value: number) => void;
};

const Summary: React.FC<Props> = ({ tokenConfig, commitmentValue }) => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { increasedStakingValue } = useAppSelector((state) => state.dashboard);
  const { account } = useWeb3React();
  const { name } = tokenConfig;
  const { t } = useTranslation();
  const veAUXOBalance = useTokenBalance(name);
  const votingPower = useUserVotingPower(name);
  const stakedAuxo = useUserLockAmount(name);
  const hasLock = useUserHasLock(name);
  const delegator = useDelegatorAddress(name);
  const endDate = useUserEndDate();
  const userLevel = useUserLevel(commitmentValue);
  const increasedLevel = useUserIncreasedLevel(increasedStakingValue);
  const userLevelPercetageReward = useUserLevelPercetageReward(userLevel);

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

  const votingPowerValue = useMemo(
    (): JSX.Element =>
      (account && votingPower?.label !== 0) || veAUXOBalance?.label === 0 ? (
        <p>{formatAsPercent(votingPower.label)}</p>
      ) : account && delegator && delegator === ethers.constants.AddressZero ? (
        <a
          target="_blank"
          href={process.env.NEXT_PUBLIC_TALLY_URL}
          rel="noreferrer noopener"
          className="text-secondary underline"
        >
          {t('notDelegated')}
        </a>
      ) : account && delegator && delegator !== account ? (
        <a
          target="_blank"
          href={`https://tally.xyz/profile/${delegator}`}
          rel="noreferrer noopener"
          className="text-secondary underline"
        >
          {t('delegatedTo', { account: trimAccount(delegator, true) })}
        </a>
      ) : null,
    [account, votingPower?.label, veAUXOBalance?.label, delegator, t],
  );

  const summaryData = useMemo(() => {
    return [
      {
        icon: <Image src={veAUXOIcon} alt="veAUXO" width={24} height={24} />,
        title: t('AUXOStaked'),
        value: (
          <>
            {account &&
              formatBalance(
                stakedAuxo.label,
                defaultLocale,
                2,
                'standard',
              )}{' '}
            AUXO
          </>
        ),
      },
      {
        icon: <Image src={triangle} alt="triangle" width={24} height={24} />,
        title: t('vaultBalance'),
        value: (
          <>
            {account &&
              formatBalance(
                veAUXOBalance.label,
                defaultLocale,
                2,
                'standard',
              )}{' '}
            ARV
          </>
        ),
      },
      {
        icon: <Image src={triangle} alt="triangle" width={24} height={24} />,
        title: t('governancePower'),
        value: votingPowerValue,
      },
      {
        icon: <Image src={unlock} alt="triangle" width={24} height={24} />,
        title: t('unlock'),
        value: hasLock ? endDate : '--/--/----',
      },
    ];
  }, [
    account,
    defaultLocale,
    stakedAuxo,
    t,
    veAUXOBalance,
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
            reward: userLevelPercetageReward,
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
      {summaryData.map(({ icon, title, value }, index) => (
        <div
          className="bg-sidebar flex items-center gap-x-2 rounded-lg shadow-card self-center w-full p-2"
          key={index}
        >
          <dt className="text-base text-primary font-medium flex items-center gap-x-2">
            {icon && icon}
            {t(title)}
          </dt>
          <dd className="flex ml-auto font-semibold text-base text-primary">
            {value}
          </dd>
        </div>
      ))}
    </div>
  );
};

export default Summary;
