import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuxoIcon from '../../public/tokens/AUXO.svg';
import xAUXOIcon from '../../public/tokens/32x32/PRV.svg';
import xAUXOIconCircle from '../../public/tokens/32x32/PRV.svg';
import useTranslation from 'next-translate/useTranslation';
import {
  useTokenBalance,
  useUserStakedPRV,
  usePRVFee,
} from '../../hooks/useToken';
import { TokenConfig } from '../../types/tokensConfig';
import { formatAsPercent, formatBalance } from '../../utils/formatBalance';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from '../../hooks';

type Props = {
  tokenConfig: TokenConfig;
};

const Summary: React.FC<Props> = ({ tokenConfig }) => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { account } = useWeb3React();
  const { name } = tokenConfig;
  const { t } = useTranslation();
  const auxoBalance = useTokenBalance('AUXO');
  const xAUXOBalance = useTokenBalance(name);
  const stakedXAUXO = useUserStakedPRV();
  const fee = usePRVFee();

  const summaryData = useMemo(() => {
    return [
      {
        icon: <Image src={AuxoIcon} alt="AUXO" width={24} height={24} />,
        title: t('tokenBalance', { token: 'AUXO' }),
        value:
          account && auxoBalance ? (
            `${formatBalance(
              auxoBalance.label,
              defaultLocale,
              4,
              'standard',
            )} AUXO`
          ) : (
            <p className="underline text-secondary font-medium">
              <Link href="#">{t('getAUXO')}</Link>
            </p>
          ),
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
        value: `
          ${
            account
              ? formatBalance(stakedXAUXO.label, defaultLocale, 4, 'standard')
              : '0'
          }
          PRV
        `,
      },
      {
        icon: null,
        title: t('PRVFee'),
        value: formatAsPercent(fee?.label ?? 0),
      },
    ];
  }, [account, auxoBalance, defaultLocale, fee, t, xAUXOBalance, stakedXAUXO]);

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
    </div>
  );
};

export default Summary;
