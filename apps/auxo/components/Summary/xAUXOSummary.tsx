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
        value: (
          <span className="font-bold text-base text-primary">
            {account && auxoBalance
              ? formatBalance(auxoBalance.label, defaultLocale, 4, 'standard')
              : '0'}{' '}
            AUXO
          </span>
        ),
      },
      {
        icon: <Image src={xAUXOIcon} alt="xAUXO" width={24} height={24} />,
        title: t('tokenBalance', { token: 'PRV' }),
        value: (
          <span className="font-bold text-base text-primary">
            {account && xAUXOBalance
              ? formatBalance(xAUXOBalance.label, defaultLocale, 4, 'standard')
              : '0'}{' '}
            PRV
          </span>
        ),
      },
      {
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
        title: t('yourPendingStakedBalance', { token: 'PRV' }),
        value: (
          <div className="flex items-center gap-x-2">
            <span className="font-bold text-base text-primary flex leading-5">
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
            </span>
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
    <div className="flex flex-col px-4 py-3 rounded-lg shadow-md bg-white gap-y-2">
      <div className="flex flex-col w-full gap-y-4">
        <h3 className="text-xl font-semibold text-primary">{t('summary')}</h3>
      </div>
      <div className="flex flex-col bg-sidebar lg:bg-transparent px-3 lg:px-0 lg:py-0 py-2 rounded-lg lg:space-y-2">
        {summaryData.map(({ icon, title, value }, index) => (
          <div
            className="bg-sidebar flex flex-col lg:flex-row lg:items-center gap-x-4 gap-y-1 lg:rounded-md lg:shadow-card self-center w-full p-2"
            key={index}
          >
            <dt className="text-base text-primary font-medium flex lg:items-center gap-x-2">
              {icon && <div className="hidden lg:flex">{icon}</div>}
              {title}:
            </dt>
            <dd className="flex lg:ml-auto pr-2 font-bold lg:font-semibold text-base text-primary">
              {value}
            </dd>
          </div>
        ))}
      </div>
      <div className="flex mt-4">
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
    </div>
  );
};

export default Summary;
