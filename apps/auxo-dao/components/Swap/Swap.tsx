import { useState } from 'react';
import Image from 'next/image';
import AuxoIcon from '../../public/tokens/AUXO.svg';
import StakeInput from './StakeInput';
import { compareBalances, zeroBalance } from '../../utils/balances';
import DepositActions from './ApproveDepositButton';
import { BalanceWarning } from './Alerts';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useTokenBalance, useXAUXOEstimation } from '../../hooks/useToken';
import { TokenConfig } from '../../types/tokensConfig';
import { formatBalance } from '../../utils/formatBalance';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from '../../hooks';

type Props = {
  tokenConfig: TokenConfig;
  destinationToken?: TokenConfig;
};

const Swap: React.FC<Props> = ({ tokenConfig }) => {
  const { account } = useWeb3React();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { name } = tokenConfig;
  const { t } = useTranslation();
  const [depositValue, setDepositValue] = useState(zeroBalance);
  const balance = useTokenBalance(name);
  const xAUXOEstimation = useXAUXOEstimation(depositValue);

  return (
    <div className="bg-gradient-to-r from-white via-white to-background">
      <div className="flex flex-col px-4 py-3 rounded-md shadow-md bg-[url('/images/background/xAUXO.png')] bg-left-bottom bg-no-repeat gap-y-2">
        <div className="flex items-center justify-between w-full ">
          <h3 className="text-xl font-medium text-primary">{t('stake')}</h3>
          <p className="underline text-sub-dark">
            <Link href="#">{t('howToGetAuxo')}</Link>
          </p>
        </div>
        <div className="flex items-center justify-between w-full ">
          <p>{t('amountToStake')}</p>
          <div className="flex items-center gap-x-2 bg-gradient-primary rounded-full shadow-card self-center w-fit px-2 py-0.5">
            <Image src={AuxoIcon} alt={'AUXO Icon'} width={24} height={24} />
            <h2
              className="text-lg font-medium text-primary"
              data-cy="product-name"
            >
              AUXO
            </h2>
          </div>
        </div>
        <StakeInput
          label={name}
          value={depositValue}
          setValue={setDepositValue}
          max={balance}
        />
        {account && (
          <BalanceWarning open={compareBalances(balance, 'lt', depositValue)}>
            You can only deposit {balance.label} {name}
          </BalanceWarning>
        )}
        <div className="flex items-center justify-between w-full">
          <p>{t('youGet')}</p>
          <p className="text-secondary font-bold text-lg">
            {formatBalance(xAUXOEstimation.label, defaultLocale, 2, 'standard')}{' '}
            xAUXO
          </p>
        </div>
        <DepositActions
          deposit={depositValue}
          estimation={xAUXOEstimation}
          tokenConfig={tokenConfig}
          toToken="xAUXO"
        />
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-center w-full gap-x-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current text-primary"
            >
              <path d="M12 2C7.02944 2 3 6.02944 3 11V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V11C21 6.02944 16.9706 2 12 2ZM12 4C15.3137 4 18 6.68629 18 10V11H6V10C6 6.68629 8.68629 4 12 4ZM12 16C10.8954 16 10 15.1046 10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16Z" />
            </svg>
            <p>{t('noStakeTime')}</p>
            <div className="flex items-center justify-start gap-x-2 w-full">
              <p className="text-secondary font-medium text-md">
                {t('keepLiquidity')}
              </p>
            </div>
          </div>
          <div>
            <p className="underline text-sub-dark">
              <Link href="#">{t('whyLocked')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
