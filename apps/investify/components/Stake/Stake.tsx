import { useCallback, useState } from 'react';
import Image from 'next/image';
import AuxoIcon from '../../public/tokens/AUXO.svg';
import StakeInput from './StakeInput';
import { compareBalances, zeroBalance } from '../../utils/balances';
import DepositActions from './ApproveDepositButton';
import { BalanceWarning } from './Alerts';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {
  useDecimals,
  useTokenBalance,
  useUserLockDurationInSeconds,
} from '../../hooks/useToken';
import { TokenConfig } from '../../types/tokensConfig';
import { formatBalance } from '../../utils/formatBalance';
import { ethers } from 'ethers';
import StakeSlider from './StakeSlider';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from '../../hooks';

type Props = {
  tokenConfig: TokenConfig;
  destinationToken?: TokenConfig;
};

const Stake: React.FC<Props> = ({ tokenConfig }) => {
  const { account } = useWeb3React();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { name } = tokenConfig;
  const { t } = useTranslation();
  const [commitmentValue, setCommitmentValue] = useState(36);
  const [depositValue, setDepositValue] = useState(zeroBalance);
  const balance = useTokenBalance(name);
  const decimals = useDecimals(name);
  const userLockDuration = useUserLockDurationInSeconds('veAUXO');

  const veAuxoEstimationCalc = useCallback(() => {
    const veAuxoEstimation = () => {
      if (
        !Number.isNaN(Number(depositValue.value.toString())) &&
        commitmentValue
      ) {
        const k = 56.0268900276223;
        const commitmentMultiplier =
          (commitmentValue / k) * Math.log10(commitmentValue);

        return (
          Number(ethers.utils.formatUnits(depositValue.value, decimals)) *
          commitmentMultiplier
        );
      } else {
        return 0;
      }
    };
    return veAuxoEstimation();
  }, [commitmentValue, decimals, depositValue.value]);

  const veAUXOEstimation = veAuxoEstimationCalc();

  return (
    <div className="bg-gradient-to-r from-white via-white to-background">
      <div className="flex flex-col px-4 py-3 rounded-md shadow-md bg-[url('/images/background/veAUXO.png')] bg-left-bottom bg-no-repeat gap-y-2 h-full">
        <div className="flex items-center justify-between w-full ">
          <h3 className="text-xl font-medium text-primary">{t('stake')}</h3>
          <p className="underline text-sub-dark">
            <Link href="#">{t('howToGetAuxo')}</Link>
          </p>
        </div>
        <div className="flex items-center justify-between w-full">
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
            {formatBalance(veAUXOEstimation, defaultLocale, 2, 'standard')}{' '}
            veAUXO
          </p>
        </div>
        <DepositActions
          deposit={depositValue}
          estimation={veAUXOEstimation}
          stakingTime={!userLockDuration ? commitmentValue : null}
          tokenConfig={tokenConfig}
          toToken="veAUXO"
        />
        {!userLockDuration ? (
          <StakeSlider
            tokenConfig={tokenConfig}
            commitmentValue={commitmentValue}
            setCommitmentValue={setCommitmentValue}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Stake;
