import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import AuxoIcon from '../../public/tokens/AUXO.svg';
import StakeInput from '../Input/InputSlider';
import {
  addNumberToBnReference,
  compareBalances,
  isZero,
  zeroBalance,
} from '../../utils/balances';
import DepositActions from './ApproveDepositButton';
import useTranslation from 'next-translate/useTranslation';
import {
  useCheckUserIsMaxBoosted,
  useDecimals,
  useIsUserLockExpired,
  useIsUserMaxLockDuration,
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
import { useConnectWallet } from '@web3-onboard/react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import ARVConversionCalculator from '../../utils/ARVConversionCalculator';
import { Tab } from '@headlessui/react';
import classNames from '../../utils/classnames';
import { AnimatePresence } from 'framer-motion';
import ModalBox from '../Modals/ModalBox';
import { Alert } from '../Alerts/Alerts';
import { getMonthsSinceStake } from '../../utils/dates';
import IncreaseLock from '../IncreaseLock/IncreaseLock';
import WithdrawLock from '../WithdrawLock/WithdrawLock';
import { STEPS } from '../../store/modal/modal.types';
import { useStakingTokenContract } from '../../hooks/useContracts';
import { setStep, setSwap, setIsOpen } from '../../store/modal/modal.slice';
import { useSelectedIndexFromQuery } from '../../hooks/useSelectedIndexFromQuery';
import Highlight from '../WithHighlight/WithHighlight';

type Props = {
  tokenConfig: TokenConfig;
  destinationToken?: TokenConfig;
  commitmentValue?: number;
  setCommitmentValue?: (value: number) => void;
};

export const TABS_MAP = {
  stake: 0,
  info: 1,
  manage_lock: 2,
};

const Stake: React.FC<Props> = ({
  tokenConfig,
  destinationToken,
  commitmentValue,
  setCommitmentValue,
}) => {
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { name } = tokenConfig;
  const { t } = useTranslation();
  const [depositValue, setDepositValue] = useState(zeroBalance);
  const balance = useTokenBalance(name);
  const decimals = useDecimals(name);
  const userLockDuration = useUserLockDurationInSeconds('ARV');
  const veAUXOBalance = useTokenBalance('ARV');
  const remainingCommitment = useUserRemainingStakingTimeInMonths();
  const endDate = useUserEndDate();
  const newEndDate = useUserNewEndDateFromToday();
  const hasLock = !!useUserLockDurationInSeconds('ARV');
  const userLockStart = useUserLockStartingTime('ARV');
  const isUserLockExpired = useIsUserLockExpired();
  const stakedAUXO = useUserLockAmount('ARV');
  const isMaxLock = useIsUserMaxLockDuration('ARV');
  const isMaxxed = useCheckUserIsMaxBoosted();

  const userLockAmount = useUserLockAmount('ARV');
  const tokenLocker = useStakingTokenContract('ARV');
  const dispatch = useAppDispatch();

  const boostToMax = () => {
    dispatch(setStep(STEPS.BOOST_STAKE_ARV));
    dispatch(
      setSwap({
        swap: {
          from: {
            token: 'AUXO',
            amount: userLockAmount,
          },
          to: {
            token: 'ARV',
            amount: userLockAmount,
          },
          stakingTime: 36,
          spender: tokenLocker.address,
        },
      }),
    );
    dispatch(setIsOpen(true));
  };

  const [selectedIndex, setSelectedIndex] = useSelectedIndexFromQuery(
    'selectedIndex',
    TABS_MAP,
  );

  const timeSinceStake = useMemo(() => {
    if (!userLockStart) return 0;
    return getMonthsSinceStake(userLockStart);
  }, [userLockStart]);

  const ARVEstimationCalc = useCallback(() => {
    return ARVConversionCalculator(
      depositValue,
      remainingCommitment !== 0 && remainingCommitment !== null
        ? remainingCommitment
        : commitmentValue,
      decimals,
    );
  }, [commitmentValue, decimals, depositValue, remainingCommitment]);

  const ARVEstimation = ARVEstimationCalc();

  const userProjectedTotalStakingAmount = useMemo(() => {
    const convertNewAmount = ARVConversionCalculator(
      depositValue,
      remainingCommitment,
      decimals,
    );
    return addNumberToBnReference(veAUXOBalance, convertNewAmount, decimals);
  }, [depositValue, remainingCommitment, veAUXOBalance, decimals]);

  const addressList = useMemo(() => {
    return [
      {
        title: t('auxoContract'),
        address: tokenConfig?.addresses?.[1]?.address,
      },
      {
        title: t('arvContract'),
        address: destinationToken?.addresses?.[1]?.address,
      },
      {
        title: t('tokenLockerContract'),
        address: destinationToken?.addresses?.[1]?.stakingAddress,
      },
      {
        title: t('merkleDistributorContract', {
          token: 'ARV',
        }),
        address: destinationToken?.addresses?.[1]?.merkleDistributorAddress,
      },
    ];
  }, [t, tokenConfig?.addresses, destinationToken?.addresses]);

  return (
    <Highlight id="stake">
      <div className="bg-gradient-to-r from-white via-white to-background">
        <div className="flex flex-col px-4 py-3 rounded-lg shadow-md bg-[url('/images/background/arv-bg.png')] bg-left-bottom bg-no-repeat gap-y-2 h-full overflow-hidden">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <div className="flex justify-between items-center gap-x-4 mb-2">
              <Tab.List className="flex gap-x-4 rounded-xl p-1 whitespace-nowrap overflow-x-auto scrollbar:w-[2px] scrollbar:h-[2px] scrollbar:bg-white scrollbar:border scrollbar:border-sub-dark scrollbar-track:bg-white scrollbar-thumb:bg-sub-light scrollbar-track:[box-shadow:inset_0_0_1px_rgba(0,0,0,0.4)] scrollbar-track:rounded-full scrollbar-thumb:rounded-full">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'text-base font-semibold focus:outline-none relative',
                      selected ? ' text-secondary' : ' text-sub-light',
                      'disabled:opacity-20',
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      {t('stake')}
                      {selected && (
                        <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary" />
                      )}
                    </>
                  )}
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'text-base font-semibold focus:outline-none relative',
                      selected ? ' text-secondary' : ' text-sub-light',
                      'disabled:opacity-20',
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      {t('info')}
                      {selected && (
                        <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary" />
                      )}
                    </>
                  )}
                </Tab>
                {hasLock && (
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'text-base font-semibold focus:outline-none relative',
                        selected ? ' text-secondary' : ' text-sub-light',
                        'disabled:opacity-20',
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        {t('manageLock')}
                        {selected && (
                          <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary" />
                        )}
                      </>
                    )}
                  </Tab>
                )}
              </Tab.List>
              <a
                rel="noreferrer noopener"
                target="_blank"
                href="https://app.uniswap.org/#/swap?outputCurrency=0xff030228a046F640143Dab19be00009606C89B1d&inputCurrency=ETH"
              >
                <button className="px-4 py-0.5 text-base text-sub-dark bg-transparent rounded-2xl ring-inset ring-1 ring-sub-dark enabled:hover:ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 flex gap-x-2 items-center">
                  {t('getAUXO')}
                </button>
              </a>
            </div>
            <AnimatePresence initial={false}>
              <Tab.Panels className="mt-4 min-h-[15rem] h-full">
                <Tab.Panel className="h-full">
                  <ModalBox className="flex flex-col h-full gap-y-2">
                    <div className="flex items-center justify-between w-full mb-2">
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
                        <h2 className="text-lg font-semibold text-primary">
                          {t('AUXO')}
                        </h2>
                      </div>
                    </div>
                    <StakeInput
                      resetOnSteps={[STEPS.STAKE_COMPLETED]}
                      label={name}
                      setValue={setDepositValue}
                      max={balance}
                    />
                    {account && (
                      <Alert
                        open={compareBalances(balance, 'lt', depositValue)}
                      >
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
                    {!isZero(depositValue, decimals) && (
                      <div className="flex items-center justify-between w-full">
                        <p className="text-base font-medium text-primary">
                          {!userLockDuration
                            ? t('vaultBalance')
                            : t('newVaultBalance')}
                        </p>
                        {!userLockDuration ? (
                          <p className="text-primary font-bold text-base">
                            {formatBalance(
                              ARVEstimation,
                              defaultLocale,
                              4,
                              'standard',
                            )}{' '}
                            ARV
                          </p>
                        ) : (
                          <p className="flex gap-x-2 items-center">
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
                    )}
                    {userLockDuration && !isZero(depositValue, decimals) && (
                      <div className="flex items-center justify-between w-full">
                        <p className="text-base font-medium text-primary">
                          {t('newLockDuration')}
                        </p>
                        <div className="text-primary font-bold text-base">
                          <p className="flex gap-x-2 items-center">
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
                      estimation={ARVEstimation}
                      stakingTime={!userLockDuration ? commitmentValue : null}
                      tokenConfig={tokenConfig}
                      toToken="ARV"
                    />
                  </ModalBox>
                </Tab.Panel>
                <Tab.Panel className="h-full">
                  <ModalBox className="flex flex-col h-full gap-y-2">
                    <div className="flex flex-col items-center justify-between w-full divide-y">
                      {addressList?.map((el, index) => (
                        <div
                          key={index}
                          className={classNames(
                            'grid grid-cols-2 gap-y py-2 items-center w-full',
                            index === 0 && 'pt-0',
                            index === addressList?.length - 1 && 'pb-0',
                          )}
                        >
                          <p className="text-base text-primary font-medium">
                            {el.title}
                          </p>
                          <a
                            className="text-primary hover:text-secondary font-bold text-base truncate"
                            href={`https://etherscan.io/address/${el.address}`}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {el.address}
                          </a>
                        </div>
                      ))}
                    </div>
                  </ModalBox>
                </Tab.Panel>
                {hasLock && (
                  <Tab.Panel className="h-full">
                    <ModalBox className="flex flex-col gap-y-1 h-full">
                      {isUserLockExpired ? (
                        <WithdrawLock />
                      ) : (
                        <>
                          <div className="bg-light-gray grid grid-cols-1 items-center gap-y-2 rounded-xl shadow-card self-center w-full p-3">
                            <dl className="flex">
                              <dt className="text-base text-primary font-medium flex items-center gap-x-2">
                                {t('AUXOStaked')}
                              </dt>
                              <dd className="flex ml-auto font-semibold text-base text-primary">
                                {formatBalance(stakedAUXO.label, defaultLocale)}{' '}
                                AUXO
                              </dd>
                            </dl>
                            <dl className="flex">
                              <dt className="text-base text-primary font-medium flex items-center gap-x-2">
                                {t('timeSinceStake')}
                              </dt>
                              <dd className="flex ml-auto font-semibold text-base text-primary">
                                {timeSinceStake === 1
                                  ? `${timeSinceStake} ${t('month')}`
                                  : `${timeSinceStake} ${t('months')}`}
                              </dd>
                            </dl>
                          </div>
                          {!isMaxxed && (
                            <div className="flex items-center justify-center mt-4 w-full">
                              <button
                                onClick={boostToMax}
                                disabled
                                className="w-fit px-10 md:px-20 py-2 text-sm md:text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                              >
                                {t('restake')}
                              </button>
                            </div>
                          )}
                          {!isMaxLock && <IncreaseLock />}
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
    </Highlight>
  );
};

export default Stake;
