import { useMemo } from 'react';
import Image from 'next/image';
import AuxoIcon from '../../public/tokens/AUXO.svg';
import xAUXOIcon from '../../public/tokens/32x32/PRV.svg';
import xAUXOIconCircle from '../../public/tokens/32x32/PRV.svg';
import useTranslation from 'next-translate/useTranslation';
import {
  useTokenBalance,
  usePRVFee,
  useUserPendingBalancePRV,
  useUserCurrentEpochStakedPRV,
} from '../../hooks/useToken';
import { TokenConfig } from '../../types/tokensConfig';
import { formatAsPercent, formatBalance } from '../../utils/formatBalance';
import { useConnectWallet } from '@web3-onboard/react';
import { useAppSelector } from '../../hooks';
import { InformationCircleIcon } from '@heroicons/react/outline';
import Trans from 'next-translate/Trans';
import Banner from '../Banner/Banner';

type Props = {
  tokenConfig: TokenConfig;
};

const Summary: React.FC<Props> = ({ tokenConfig }) => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const { name } = tokenConfig;
  const { t } = useTranslation();
  const auxoBalance = useTokenBalance('AUXO');
  const xAUXOBalance = useTokenBalance(name);
  const pendingStakedPRV = useUserPendingBalancePRV();
  const currentStakedPrv = useUserCurrentEpochStakedPRV();
  const fee = usePRVFee();

  const summaryData = useMemo(() => {
    return [
      {
        icon: <Image src={AuxoIcon} alt="AUXO" width={24} height={24} />,
        title: t('tokenBalance', { token: 'AUXO' }),
        value:
          account && auxoBalance
            ? `${formatBalance(
                auxoBalance.label,
                defaultLocale,
                4,
                'standard',
              )} AUXO`
            : 'N/A',
      },
      {
        icon: <Image src={xAUXOIcon} alt="xAUXO" width={24} height={24} />,
        title: t('tokenBalance', { token: 'PRV' }),
        value: `${
          account && xAUXOBalance
            ? formatBalance(xAUXOBalance.label, defaultLocale, 4, 'standard')
            : '0'
        } PRV`,
      },
      {
        icon: (
          <Image src={xAUXOIconCircle} alt="xAUXO" width={24} height={24} />
        ),
        title: t('stakedBalance', { token: 'PRV' }),
        value: (
          <Trans
            i18nKey="activeStakedBalance"
            values={{
              activeBalance: formatBalance(
                currentStakedPrv.label,
                defaultLocale,
                4,
                'standard',
              ),
            }}
          />
        ),
      },
      {
        icon: (
          <Image src={xAUXOIconCircle} alt="xAUXO" width={24} height={24} />
        ),
        title: t('yourPendingStakedBalance', { token: 'PRV' }),
        value: (
          <div className="flex items-center gap-x-2">
            <Trans
              i18nKey="pendingStakedBalance"
              values={{
                pendingBalance: formatBalance(
                  pendingStakedPRV.label,
                  defaultLocale,
                  4,
                  'standard',
                ),
              }}
            />
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
              href="https://docs.auxo.fi/auxo-docs/rewards-vaults/prv-passive-rewards-vault#how-staking-works-in-prv"
            >
              <InformationCircleIcon className="h-5 w-5 text-primary" />
            </a>
          </div>
        ),
      },
      {
        icon: null,
        title: t('PRVFee'),
        value: formatAsPercent(fee?.label ?? 0),
      },
    ];
  }, [
    t,
    account,
    auxoBalance,
    defaultLocale,
    xAUXOBalance,
    currentStakedPrv?.label,
    pendingStakedPRV?.label,
    fee?.label,
  ]);

  return (
    <div className="flex flex-col px-4 py-3 rounded-lg shadow-md bg-white gap-y-5">
      <div className="flex flex-col w-full gap-y-4">
        <h3 className="text-xl font-semibold text-primary">{t('summary')}</h3>
      </div>
      {summaryData.map(({ icon, title, value }, index) => (
        <div
          className="bg-sidebar flex items-center gap-x-4 rounded-md shadow-card self-center w-full p-2"
          key={index}
        >
          <dt className="text-base text-primary font-medium flex items-center gap-x-2">
            {icon && icon}
            {title}:
          </dt>
          <dd className="flex ml-auto pr-2 font-semibold text-base text-primary">
            {value}
          </dd>
        </div>
      ))}
      <Banner
        bgColor="bg-info"
        content={
          <Trans
            i18nKey="stakingStabilisesRewards"
            components={{
              a: (
                <a
                  href={
                    'https://docs.auxo.fi/auxo-docs/rewards-vaults/prv-passive-rewards-vault'
                  }
                  className="text-primary underline"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
          />
        }
        icon={
          <InformationCircleIcon
            className="h-5 w-5 text-primary"
            aria-hidden="true"
          />
        }
      />
    </div>
  );
};

export default Summary;
