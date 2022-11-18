import { useMemo } from 'react';
import Image from 'next/image';
import AuxoIcon from '../../public/tokens/AUXO.svg';
import veAUXOIcon from '../../public/tokens/veAUXO.svg';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {
  useDecimals,
  useTokenBalance,
  useTotalSupply,
} from '../../hooks/useToken';
import { TokenConfig } from '../../types/tokensConfig';
import { formatAsPercent, formatBalance } from '../../utils/formatBalance';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
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
  const veAUXOBalance = useTokenBalance(name);
  const totalSupply = useTotalSupply(name);
  const veAUXODecimals = useDecimals(name);
  const auxoDecimals = useDecimals('AUXO');

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
              2,
              'standard',
            )} AUXO`
          ) : (
            <p className="underline text-secondary font-medium">
              <Link href="#">{t('getAUXO')}</Link>
            </p>
          ),
      },
      {
        icon: <Image src={veAUXOIcon} alt="veAUXO" width={24} height={24} />,
        title: t('stakedBalance', { token: 'veAUXO' }),
        value: `${
          account && veAUXOBalance
            ? formatBalance(veAUXOBalance.label, defaultLocale, 2, 'standard')
            : '0'
        } veAUXO`,
      },
      {
        title: t('votingPower'),
        value: `${
          account
            ? formatAsPercent(
                Number(
                  ethers.utils.formatUnits(veAUXOBalance.value, auxoDecimals),
                ) /
                  Number(
                    ethers.utils.formatUnits(totalSupply.value, veAUXODecimals),
                  ),
              )
            : '0'
        }`,
      },
    ];
  }, [
    account,
    auxoBalance,
    auxoDecimals,
    defaultLocale,
    t,
    totalSupply.value,
    veAUXOBalance,
    veAUXODecimals,
  ]);

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
          <dt className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
            {icon && icon}
            {t(title)}:
          </dt>
          <dd className="flex ml-auto pr-2 text-sm text-sub-dark">{value}</dd>
        </div>
      ))}
    </div>
  );
};

export default Summary;