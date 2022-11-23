import { useMemo } from 'react';
import Image from 'next/image';
import { ethers } from 'ethers';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core';
import {
  useDelegatorAddress,
  useTokenBalance,
  useUserLockAmount,
  useUserLockDuration,
  useUserVotingPower,
} from '../../hooks/useToken';
import veAUXOIcon from '../../public/tokens/veAUXO.svg';
import triangle from '../../public/images/icons/triangle.svg';
import { TokenConfig } from '../../types/tokensConfig';
import { formatAsPercent, formatBalance } from '../../utils/formatBalance';
import { useAppSelector } from '../../hooks';
import StakingHistory from '../StakingHistory/StakingHistory';
import trimAccount from '../../utils/trimAccount';

type Props = {
  tokenConfig: TokenConfig;
};

const Summary: React.FC<Props> = ({ tokenConfig }) => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { account } = useWeb3React();
  const { name } = tokenConfig;
  const { t } = useTranslation();
  const auxoBalance = useTokenBalance('AUXO');
  const veAUXOBalance = useTokenBalance(name);
  const votingPower = useUserVotingPower(name);
  const stakedAuxo = useUserLockAmount(name);
  const hasLock = !!useUserLockDuration(name);
  const delegator = useDelegatorAddress(name);

  const votingPowerValue = useMemo(
    (): JSX.Element =>
      (account && votingPower?.label !== 0) || veAUXOBalance.label === 0 ? (
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
    [account, delegator, votingPower, t],
  );

  const summaryData = useMemo(() => {
    return [
      {
        icon: <Image src={veAUXOIcon} alt="veAUXO" width={24} height={24} />,
        title: t('tokenBalance', { token: 'veAUXO' }),
        value: (
          <>
            {account && veAUXOBalance
              ? formatBalance(veAUXOBalance.label, defaultLocale, 2, 'standard')
              : '0'}{' '}
            veAUXO
          </>
        ),
      },
      {
        icon: <Image src={triangle} alt="triangle" width={24} height={24} />,
        title: t('votingPower'),
        value: votingPowerValue,
      },
    ];
  }, [account, defaultLocale, t, veAUXOBalance, votingPowerValue]);

  return (
    <div className="flex flex-col px-4 py-3 rounded-md shadow-md bg-gradient-primary gap-y-2">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-medium text-primary">{t('summary')}</h3>
      </div>
      {hasLock ? (
        <>
          <div className="flex items-center gap-x-2 self-center w-full p-2">
            <dt className="text-base text-sub-dark font-medium flex items-center gap-x-2">
              {t('stakedBalance', { token: 'AUXO' })}:
            </dt>
            <dd className="flex ml-auto font-medium text-base text-primary">
              {account && auxoBalance ? (
                `${formatBalance(
                  stakedAuxo.label,
                  defaultLocale,
                  2,
                  'standard',
                )} AUXO`
              ) : (
                <span className="underline text-secondary font-medium">
                  <Link href="#">{t('getAUXO')}</Link>
                </span>
              )}
            </dd>
          </div>
          <StakingHistory />
        </>
      ) : null}
      {summaryData.map(({ icon, title, value }, index) => (
        <div
          className="bg-sidebar flex items-center gap-x-2 rounded-md shadow-card self-center w-full p-2"
          key={index}
        >
          <dt className="text-base text-primary font-medium flex items-center gap-x-2">
            {icon && icon}
            {t(title)}:
          </dt>
          <dd className="flex ml-auto font-medium text-base text-primary">
            {value}
          </dd>
        </div>
      ))}
    </div>
  );
};

export default Summary;
