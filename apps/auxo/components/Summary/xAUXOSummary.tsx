import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuxoIcon from '../../public/tokens/AUXO.svg';
import xAUXOIcon from '../../public/tokens/32x32/PRV.svg';
import xAUXOIconCircle from '../../public/tokens/xAUXO.svg';
import useTranslation from 'next-translate/useTranslation';
import {
  useTokenBalance,
  useUserStakedXAUXO,
  useXAUXOFee,
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
  const stakedXAUXO = useUserStakedXAUXO();
  const fee = useXAUXOFee();

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
        } xAUXO`,
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
          xAUXO
        `,
      },
      {
        icon: null,
        title: t('xAUXOFee'),
        value: formatAsPercent(fee?.label ?? 0),
      },
    ];
  }, [account, auxoBalance, defaultLocale, fee, t, xAUXOBalance, stakedXAUXO]);

  return (
    <div className="flex flex-col px-4 py-3 rounded-md shadow-md bg-white gap-y-4">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-medium text-primary">{t('summary')}</h3>
      </div>
      {summaryData.map(({ icon, title, value }, index) => (
        <div
          className="bg-sidebar flex items-center gap-x-2 rounded-md shadow-card self-center w-full p-2"
          key={index}
        >
          <dt className="text-base text-sub-dark font-medium flex items-center gap-x-2">
            {icon && icon}
            {title}:
          </dt>
          <dd className="flex ml-auto pr-2 font-medium text-base text-primary">
            {value}
          </dd>
        </div>
      ))}
    </div>
  );
};

export default Summary;
