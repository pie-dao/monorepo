import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import AuxoIcon from '../../public/tokens/AUXO.svg';
import StakeInput from './StakeInput';
import {
  addNumberToBnReference,
  compareBalances,
  zeroBalance,
} from '../../utils/balances';
import DepositActions from './ApproveDepositButton';
import useTranslation from 'next-translate/useTranslation';
import {
  useDecimals,
  useIsUserLockExpired,
  useTokenBalance,
  useUserEndDate,
  useUserLockAmount,
  useUserLockDurationInSeconds,
  useUserLockStartingTime,
  useUserNewEndDateFromToday,
  useUserRemainingStakingTimeInMonths,
} from '../../hooks/useToken';
import { TokenConfig } from '../../types/tokensConfig';
import { formatBalance } from '../../utils/formatBalance';
import StakeSlider from './StakeSlider';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from '../../hooks';
import veAUXOConversionCalculator from '../../utils/veAUXOConversionCalculator';
import { Tab } from '@headlessui/react';
import classNames from '../../utils/classnames';
import { AnimatePresence } from 'framer-motion';
import ModalBox from '../Modals/ModalBox';
import { Alert } from '../Alerts/Alerts';
import { getMonthsSinceStake } from '../../utils/dates';
import IncreaseLock from '../IncreaseLock/IncreaseLock';
import WithdrawLock from '../WithdrawLock/WithdrawLock';

type Props = {
  tokenConfig: TokenConfig;
  destinationToken?: TokenConfig;
  commitmentValue?: number;
  setCommitmentValue?: (value: number) => void;
};

const Stake: React.FC<Props> = ({
  tokenConfig,
  commitmentValue,
  setCommitmentValue,
}) => {
  const { account } = useWeb3React();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { name } = tokenConfig;
  const { t } = useTranslation();
  const [depositValue, setDepositValue] = useState(zeroBalance);
  const balance = useTokenBalance(name);
  const decimals = useDecimals(name);
  const userLockDuration = useUserLockDurationInSeconds('veAUXO');
  const veAUXOBalance = useTokenBalance('veAUXO');
  const remainingCommitment = useUserRemainingStakingTimeInMonths();
  const endDate = useUserEndDate();
  const newEndDate = useUserNewEndDateFromToday();
  const hasLock = !!useUserLockDurationInSeconds('veAUXO');
  const userLockStart = useUserLockStartingTime('veAUXO');
  const isUserLockExpired = useIsUserLockExpired();
  const stakedAUXO = useUserLockAmount('veAUXO');

  const timeSinceStake = useMemo(() => {
    if (!userLockStart) return 0;
    return getMonthsSinceStake(userLockStart);
  }, [userLockStart]);

  const veAuxoEstimationCalc = useCallback(() => {
    return veAUXOConversionCalculator(
      depositValue,
      remainingCommitment !== 0 ? remainingCommitment : commitmentValue,
      decimals,
    );
  }, [commitmentValue, decimals, depositValue, remainingCommitment]);

  const veAUXOEstimation = veAuxoEstimationCalc();

  const userProjectedTotalStakingAmount = useMemo(() => {
    const convertNewAmount = veAUXOConversionCalculator(
      depositValue,
      remainingCommitment,
      decimals,
    );
    return addNumberToBnReference(veAUXOBalance, convertNewAmount, decimals);
  }, [depositValue, remainingCommitment, veAUXOBalance, decimals]);

  return (
    <div className="bg-gradient-to-r from-white via-white to-background">
      <div className="flex flex-col px-4 py-3 rounded-md shadow-md bg-[url('/images/background/veAUXO.png')] bg-left-bottom bg-no-repeat gap-y-2 h-full">
        <Tab.Group>
          <Tab.List className="flex gap-x-4 rounded-xl p-1">
            {['stake', 'manageLock'].map((tab) => {
              if (!hasLock && tab === 'manageLock') return null;
              return (
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'py-2.5 text-base font-medium focus:outline-none relative',
                      selected ? ' text-secondary' : ' text-sub-light',
                      'disabled:opacity-20',
                    )
                  }
                  key={tab}
                >
                  {({ selected }) => (
                    <>
                      {t(tab)}
                      {selected && (
                        <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary" />
                      )}
                    </>
                  )}
                </Tab>
              );
            })}
          </Tab.List>
          <AnimatePresence initial={false}>
            <Tab.Panels className="mt-4 min-h-[15rem] h-full">
              <Tab.Panel>
                <ModalBox className="flex flex-col gap-y-1">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-medium text-base text-primary">
                      {t('amountToStake')}
                    </p>
                    <div className="flex items-center gap-x-2 bg-white rounded-full shadow-card self-center w-fit px-2 py-0.5">
                      <Image
                        src={AuxoIcon}
                        alt={'AUXO Icon'}
                        width={24}
                        height={24}
                      />
                      <h2
                        className="text-lg font-bold text-primary"
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
                    <Alert open={compareBalances(balance, 'lt', depositValue)}>
                      You can only deposit {balance.label} {name}
                    </Alert>
                  )}
                  <hr className="border-custom-border border my-2" />
                  {!userLockDuration ? (
                    <StakeSlider
                      commitmentValue={commitmentValue}
                      setCommitmentValue={setCommitmentValue}
                    />
                  ) : null}
                  <div className="flex items-center justify-between w-full mt-2">
                    <p className="text-base font-medium text-primary">
                      {!userLockDuration
                        ? t('vaultBalance')
                        : t('newVaultBalance')}
                    </p>
                    {!userLockDuration ? (
                      <p className="text-primary font-bold text-base">
                        {formatBalance(
                          veAUXOEstimation,
                          defaultLocale,
                          4,
                          'standard',
                        )}{' '}
                      </p>
                    ) : (
                      <p className="flex gap-x-2 items-end">
                        {depositValue.label !== 0 && (
                          <span className="line-through text-sub-light text-sm">
                            {formatBalance(
                              veAUXOBalance.label,
                              defaultLocale,
                              4,
                              'standard',
                            )}{' '}
                            ARV
                          </span>
                        )}
                        <span className="text-primary text-base font-bold">
                          {formatBalance(
                            userProjectedTotalStakingAmount.label,
                            defaultLocale,
                            4,
                            'standard',
                          )}{' '}
                          ARV
                        </span>
                      </p>
                    )}
                  </div>
                  {userLockDuration && (
                    <div className="flex items-center justify-between w-full mt-1">
                      <p className="text-base font-medium text-primary">
                        {t('newLockDuration')}
                      </p>
                      <div className="text-primary font-bold text-base">
                        <p className="flex gap-x-2 items-end">
                          <span className="line-through text-sub-light text-sm">
                            {endDate}
                          </span>
                          <span className="text-primary text-base font-bold">
                            {newEndDate}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                  <DepositActions
                    deposit={depositValue}
                    estimation={veAUXOEstimation}
                    stakingTime={!userLockDuration ? commitmentValue : null}
                    tokenConfig={tokenConfig}
                    toToken="veAUXO"
                  />
                </ModalBox>
              </Tab.Panel>
              {hasLock && (
                <Tab.Panel className="h-full">
                  <ModalBox className="flex flex-col gap-y-1 h-full">
                    {!isUserLockExpired ? (
                      <WithdrawLock />
                    ) : (
                      <>
                        <div className="bg-light-gray grid grid-cols-1 items-center gap-y-2 rounded-xl shadow-card self-center w-full p-3">
                          <dl className="flex">
                            <dt className="text-base text-primary font-medium flex items-center gap-x-2">
                              {t('AUXOStaked')}
                            </dt>
                            <dd className="flex ml-auto font-medium text-base text-primary">
                              {formatBalance(stakedAUXO.label, defaultLocale)}{' '}
                              AUXO
                            </dd>
                          </dl>
                          <dl className="flex">
                            <dt className="text-base text-primary font-medium flex items-center gap-x-2">
                              {t('timeSinceStake')}
                            </dt>
                            <dd className="flex ml-auto font-medium text-base text-primary">
                              {timeSinceStake === 1
                                ? `${timeSinceStake} ${t('month')}`
                                : `${timeSinceStake} ${t('months')}`}
                            </dd>
                          </dl>
                        </div>
                        <IncreaseLock />
                      </>
                    )}
                  </ModalBox>
                </Tab.Panel>
              )}
            </Tab.Panels>
          </AnimatePresence>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Stake;
