/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import StakeInput from '../Input/InputSlider';
import {
  compareBalances,
  isZeroBalance,
  pickBalanceList,
  zeroBalance,
} from '../../utils/balances';
import useTranslation from 'next-translate/useTranslation';
import { useTokenBalance } from '../../hooks/useToken';
import { TokenConfig } from '../../types/tokensConfig';
import { useConnectWallet } from '@web3-onboard/react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Tab } from '@headlessui/react';
import classNames from '../../utils/classnames';
import { AnimatePresence } from 'framer-motion';
import ModalBox from '../Modals/ModalBox';
import { Alert } from '../Alerts/Alerts';
import { useEnanchedPools } from '../../hooks/useEnanchedPools';
import LendActions from './InputActions';
import {
  setLendingFlowOpen,
  setLendingFlowPool,
  setLendingStep,
  setPreference,
} from '../../store/lending/lending.slice';
import {
  UseCanUserWithdrawFromPool,
  UseMaxUserDepositLimit,
  UseMaxWithdrawableAmountFromPool,
  UsePoolAcceptsDeposits,
  UsePoolIsClosed,
  UsePoolState,
  UseUserCanClaim,
  UseUserIsWhitelisted,
} from '../../hooks/useLending';
import { isEmpty, isEqual } from 'lodash';
import { formatBalance } from '../../utils/formatBalance';
import { PREFERENCES } from '../../utils/constants';
import { Preferences, STATES, STEPS } from '../../store/lending/lending.types';
import { RadioGroup, RadioGroupItem } from '../RadioGroup/RadioGroup';
import { Label } from '@radix-ui/react-label';
import { WithdrawIcon } from '../Icons/Icons';
import { CurrencyDollarIcon, RefreshIcon } from '@heroicons/react/solid';

type Props = {
  tokenConfig: TokenConfig;
  poolAddress: string;
};

const Lend: React.FC<Props> = ({ tokenConfig, poolAddress }) => {
  const [{ wallet }] = useConnectWallet();
  const { preference } = useAppSelector((state) => state.lending.lendingFlow);
  const { data } = useEnanchedPools(poolAddress);
  const account = wallet?.accounts[0]?.address;
  const { name } = tokenConfig;
  const { t } = useTranslation();
  const [depositValue, setDepositValue] = useState(zeroBalance);
  const [withdrawValue, setWithdrawValue] = useState(zeroBalance);
  const balance = useTokenBalance(name);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const maxUnlendAmount = UseMaxWithdrawableAmountFromPool(poolAddress);
  const hasUnlendableAmount = !isEqual(maxUnlendAmount, zeroBalance);
  const canWithdraw = UseCanUserWithdrawFromPool(poolAddress);
  const canClaim = UseUserCanClaim(poolAddress);
  const loanedAmount = data?.userData?.balance ?? zeroBalance;
  const userActualPreference = data?.userData?.preference as Preferences;
  const hasBalanceInPool =
    !isEmpty(loanedAmount) && !isEqual(loanedAmount, zeroBalance);
  const isPoolClosed = UsePoolIsClosed(poolAddress);
  const isPoolAcceptingDeposits = UsePoolAcceptsDeposits(poolAddress);
  const isUserWhitelisted = UseUserIsWhitelisted(poolAddress);
  const poolState = UsePoolState(poolAddress);
  const dispatch = useAppDispatch();

  const maxCapacity = UseMaxUserDepositLimit(poolAddress);
  // Let's put here the max deposit value from the contract
  const maxDeposit = useMemo(() => {
    return pickBalanceList([balance, maxCapacity], 'min');
  }, [balance, maxCapacity]);

  const { defaultLocale } = useAppSelector((state) => state.preferences);

  let buttonText = null;

  if (canWithdraw && canClaim) {
    buttonText = t('withdrawAndClaim');
  } else if (canWithdraw) {
    buttonText = t('withdrawalReady');
  } else if (userActualPreference === PREFERENCES.WITHDRAW) {
    buttonText = (
      <p className="flex items-center gap-x-2">
        <WithdrawIcon />
        <span>{t('withdrawalRequested')}</span>
      </p>
    );
  } else if (poolState === STATES.ACTIVE) {
    buttonText = t('requestWithdrawal');
  }

  const textContent =
    userActualPreference === PREFERENCES.WITHDRAW && !canWithdraw
      ? t('fundsAvailableEndEpoch', { token: name })
      : !canWithdraw &&
        userActualPreference !== PREFERENCES.WITHDRAW &&
        poolState === STATES.ACTIVE
      ? t('beforeRequestingWithdraw', { token: name })
      : null;

  const requestWithdraw = () => {
    dispatch(setLendingFlowPool(poolAddress));
    dispatch(setLendingFlowOpen(true));
    dispatch(setLendingStep(STEPS.WITHDRAW_REQUEST));
  };

  const withdraw = () => {
    dispatch(setLendingFlowPool(poolAddress));
    dispatch(setLendingFlowOpen(true));
    dispatch(setLendingStep(STEPS.WITHDRAW_CONFIRM));
  };

  const buttonAction =
    canWithdraw || (isPoolClosed && !isZeroBalance(loanedAmount))
      ? withdraw
      : userActualPreference !== PREFERENCES.WITHDRAW &&
        poolState === STATES.ACTIVE
      ? requestWithdraw
      : null;

  const changePreference = () => {
    dispatch(setLendingFlowPool(poolAddress));
    dispatch(setLendingFlowOpen(true));
    dispatch(setLendingStep(STEPS.CHANGE_PREFERENCE));
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [
    hasBalanceInPool,
    isPoolAcceptingDeposits,
    hasUnlendableAmount,
    canWithdraw,
  ]);

  const textForPreference = useMemo(() => {
    switch (preference) {
      case PREFERENCES.CLAIM:
        return t('interestOnlyPreferenceDescription');
      case PREFERENCES.AUTOCOMPOUND:
        return t('autocompoundPreferenceDescription');
      case PREFERENCES.WITHDRAW:
        return t('withdrawPreferenceDescription');
      default:
        return '';
    }
  }, [preference, t]);

  return (
    <div className="bg-gradient-to-r from-white via-white to-background h-full">
      <div className="flex flex-col px-4 py-3 rounded-lg shadow-md bg-left-bottom bg-no-repeat gap-y-2 h-full overflow-hidden">
        <Tab.Group defaultIndex={selectedIndex} onChange={setSelectedIndex}>
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <Tab.List className="flex gap-x-4 rounded-xl p-1">
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
                    {t('lend')}
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
                    {t('withdraw')}
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
                    {t('preference')}
                    {selected && (
                      <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary" />
                    )}
                  </>
                )}
              </Tab>
            </Tab.List>
          </div>
          <AnimatePresence initial={false}>
            <Tab.Panels className="mt-4 min-h-[18rem] h-full">
              <Tab.Panel className="h-full relative">
                <ModalBox className="flex flex-col h-full gap-y-2">
                  {(!isPoolAcceptingDeposits ||
                    canWithdraw ||
                    !isUserWhitelisted ||
                    isPoolClosed) && (
                    <>
                      <div className="absolute inset-0 bg-white/90 z-10 -m-2" />
                      <div className="absolute inset-0 items-center justify-center flex flex-col gap-y-2 z-20">
                        {(!isPoolAcceptingDeposits && (
                          <span className="text-base text-white bg-gradient-major-secondary-predominant rounded-lg px-2 py-0.5">
                            {t('notAcceptingDeposits')}
                          </span>
                        )) ||
                          (canWithdraw && (
                            <span className="text-base text-white bg-gradient-major-secondary-predominant rounded-lg px-2 py-0.5">
                              {t('youNeedToWithdraw')}
                            </span>
                          )) ||
                          (!isUserWhitelisted && (
                            <span className="text-base text-white bg-gradient-major-secondary-predominant rounded-lg px-2 py-0.5">
                              {t('notWhitelisted')}
                            </span>
                          )) ||
                          (isPoolClosed && (
                            <span className="text-base text-white bg-gradient-major-secondary-predominant rounded-lg px-2 py-0.5">
                              {t('poolClosed')}
                            </span>
                          ))}
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between w-full mb-2">
                    <p className="font-medium text-base text-primary">
                      {t('amountToStake')}
                    </p>
                    <div className="flex items-center gap-x-2 bg-white rounded-full shadow-card self-center w-fit px-2 py-0.5">
                      {data?.attributes?.token?.data?.attributes?.icon?.data
                        ?.attributes?.url ? (
                        <Image
                          src={
                            data?.attributes?.token?.data?.attributes?.icon
                              ?.data?.attributes?.url
                          }
                          alt={data?.attributes?.token?.data?.attributes?.name}
                          width={24}
                          height={24}
                        />
                      ) : null}
                      <h2 className="text-lg font-semibold text-primary">
                        {t(name)}
                      </h2>
                    </div>
                  </div>
                  <StakeInput
                    label={name}
                    setValue={setDepositValue}
                    max={maxDeposit}
                    disabled={userActualPreference === PREFERENCES.WITHDRAW}
                    resetOnSteps={[STEPS.LEND_DEPOSIT_COMPLETED]}
                  />
                  {account && (
                    <Alert open={compareBalances(balance, 'lt', depositValue)}>
                      You can only deposit {balance.label} {name}
                    </Alert>
                  )}
                  <LendActions
                    deposit={depositValue}
                    tokenConfig={tokenConfig}
                    poolAddress={poolAddress}
                    disabled={
                      !isPoolAcceptingDeposits ||
                      !isUserWhitelisted ||
                      isPoolClosed
                    }
                  />
                </ModalBox>
              </Tab.Panel>
              <Tab.Panel className="h-full relative">
                <ModalBox className="flex flex-col h-full gap-y-2 relative">
                  {isZeroBalance(maxUnlendAmount) &&
                  isZeroBalance(loanedAmount) ? (
                    <>
                      <div className="absolute inset-0 bg-white/90 z-10 -m-2 rounded-lg" />
                      <div className="absolute inset-0 items-center justify-center flex flex-col gap-y-2 z-20">
                        <span className="text-base text-white bg-gradient-major-secondary-predominant rounded-lg px-2 py-0.5">
                          {t('nothingToWithdraw')}
                        </span>
                      </div>
                    </>
                  ) : null}
                  {hasUnlendableAmount ? (
                    <>
                      <div className="flex flex-wrap gap-2 items-center justify-between w-full mb-2">
                        <p className="font-medium text-base text-primary">
                          {t('availableToWithdraw')}
                        </p>
                        <div className="flex items-center gap-x-2 bg-white rounded-full shadow-card self-center w-fit px-2 py-0.5">
                          {data?.attributes?.token?.data?.attributes?.icon?.data
                            ?.attributes?.url ? (
                            <div className="flex flex-shrink-0">
                              <Image
                                src={
                                  data?.attributes?.token?.data?.attributes
                                    ?.icon?.data?.attributes?.url
                                }
                                alt={
                                  data?.attributes?.token?.data?.attributes
                                    ?.name
                                }
                                width={24}
                                height={24}
                              />
                            </div>
                          ) : null}
                          {hasUnlendableAmount ? (
                            <span className="text-lg font-semibold text-primary">
                              {formatBalance(
                                maxUnlendAmount.label,
                                defaultLocale,
                                6,
                                'standard',
                              )}
                            </span>
                          ) : null}
                          <h2 className="text-lg font-semibold text-primary">
                            {t(name)}
                          </h2>
                        </div>
                      </div>
                      <div className="flex w-full gap-2">
                        <div className="flex items-center mr-2 w-full gap-2">
                          <StakeInput
                            label={name}
                            setValue={setWithdrawValue}
                            max={canWithdraw ? loanedAmount : maxUnlendAmount}
                            resetOnSteps={[STEPS.UNLEND_COMPLETED]}
                            disabled={!(canWithdraw || hasUnlendableAmount)}
                          />
                        </div>
                        <div className="flex items-center">
                          <LendActions
                            deposit={canWithdraw ? loanedAmount : withdrawValue}
                            tokenConfig={tokenConfig}
                            poolAddress={poolAddress}
                            action="withdraw"
                            disabled={!(canWithdraw || hasUnlendableAmount)}
                          />
                        </div>
                      </div>
                      {account && (
                        <Alert
                          open={compareBalances(
                            canWithdraw
                              ? loanedAmount
                                ? loanedAmount
                                : zeroBalance
                              : maxUnlendAmount,
                            'lt',
                            withdrawValue,
                          )}
                          className="w-full"
                        >
                          You can only withdraw{' '}
                          {canWithdraw
                            ? loanedAmount?.label
                            : maxUnlendAmount?.label}{' '}
                          {name}
                        </Alert>
                      )}
                    </>
                  ) : null}
                  {!isEmpty(maxUnlendAmount) &&
                    !isEmpty(loanedAmount) &&
                    !isEqual(maxUnlendAmount, loanedAmount) && (
                      <div className="flex flex-col gap-y-2">
                        <div className="flex flex-wrap gap-2 items-center justify-between w-full">
                          <p className="font-medium text-base text-primary">
                            {t('yourCurrentLendingFunds')}
                          </p>
                          <div className="flex items-center gap-x-2 bg-white rounded-full shadow-card self-center w-fit px-2 py-0.5">
                            {data?.attributes?.token?.data?.attributes?.icon
                              ?.data?.attributes?.url ? (
                              <div className="flex flex-shrink-0">
                                <Image
                                  src={
                                    data?.attributes?.token?.data?.attributes
                                      ?.icon?.data?.attributes?.url
                                  }
                                  alt={
                                    data?.attributes?.token?.data?.attributes
                                      ?.name
                                  }
                                  width={24}
                                  height={24}
                                />
                              </div>
                            ) : null}
                            <span className="text-lg font-semibold text-primary">
                              {formatBalance(
                                loanedAmount.label,
                                defaultLocale,
                                6,
                                'standard',
                              )}
                            </span>
                            <h2 className="text-lg font-semibold text-primary">
                              {t(name)}
                            </h2>
                          </div>
                        </div>
                        {buttonText && (
                          <>
                            <p className="text-xs text-sub-dark font-medium">
                              {textContent}
                            </p>
                            <button
                              onClick={buttonAction}
                              disabled={buttonAction === null}
                              className="w-fit px-10 md:px-20 py-3 my-2 text-sm md:text-base font-medium text-primary bg-transparent rounded-full ring-inset ring-1 ring-primary enabled:hover:bg-primary enabled:hover:text-white disabled:ring-sub-dark disabled:text-sub-dark"
                            >
                              {buttonText}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                </ModalBox>
              </Tab.Panel>

              <Tab.Panel className="h-full relative">
                <ModalBox className="flex flex-col h-full gap-y-2 relative place-items-center">
                  {canWithdraw || isPoolClosed ? (
                    <DisplayMessage
                      messageKey={t('youCannotChangePreference')}
                    />
                  ) : !hasBalanceInPool || poolState !== STATES.ACTIVE ? (
                    <DisplayMessage
                      messageKey={t('nothingToChangePreference')}
                    />
                  ) : (
                    <>
                      <div className="flex flex-col gap-2 w-full mb-2">
                        <p className="font-medium text-base text-primary">
                          {t('changePreference')}
                        </p>
                        <p className="text-sm text-sub-dark font-medium">
                          {t('changePreferenceDescription')}
                        </p>
                      </div>
                      <RadioGroup
                        className="grid grid-cols-3 gap-4 w-full sm:w-fit"
                        defaultValue={userActualPreference?.toString()}
                        onValueChange={(value) => {
                          dispatch(
                            setPreference(parseInt(value) as Preferences),
                          );
                        }}
                        disabled={poolState !== STATES.ACTIVE}
                      >
                        <PreferenceOption
                          userActualPreference={userActualPreference}
                          preference={PREFERENCES.CLAIM}
                          id="CLAIM"
                          icon={CurrencyDollarIcon}
                        />
                        <PreferenceOption
                          preference={PREFERENCES.AUTOCOMPOUND}
                          id="AUTOCOMPOUND"
                          icon={RefreshIcon}
                          userActualPreference={userActualPreference}
                        />
                        <PreferenceOption
                          preference={PREFERENCES.WITHDRAW}
                          id="WITHDRAW"
                          icon={WithdrawIcon}
                          userActualPreference={userActualPreference}
                        />
                      </RadioGroup>
                      <p className="text-xs text-sub-dark font-medium">
                        {textForPreference}
                      </p>
                      <button
                        onClick={changePreference}
                        disabled={
                          userActualPreference === preference ||
                          poolState !== STATES.ACTIVE ||
                          isPoolClosed
                        }
                        className="w-fit px-10 py-2 mt-auto text-sm font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                      >
                        {t('changePreference')}
                      </button>
                    </>
                  )}
                </ModalBox>
              </Tab.Panel>
            </Tab.Panels>
          </AnimatePresence>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Lend;

export const PreferenceOption = ({
  preference,
  id,
  icon: Icon,
}: {
  preference: Preferences;
  id: string;
  icon: React.FC<{ className?: string }>;
  userActualPreference: Preferences;
}) => {
  const { t } = useTranslation();
  return (
    <Label
      htmlFor={id}
      className={classNames(
        'flex flex-col items-center text-xs md:text-base justify-between rounded-md border-2 border-transparent bg-transparent p-1 md:p-4 [&:has(&:not(disabled))]hover:bg-secondary/5 [&:has(&:not(disabled))]:hover:text-secondary [&:has([data-state=checked])]:text-secondary [&:has([data-state=checked])]:shadow-md [&:has([data-state=checked])]:border-secondary [&:has(disabled)]:bg-sub-dark [&:has(disabled)]:text-sub-dark [&:not(:has(disabled))]:cursor-pointer',
      )}
    >
      <RadioGroupItem value={String(preference)} id={id} className="sr-only" />
      <Icon className="mb-3 h-6 w-6" />
      {t(
        `lending${Object.keys(PREFERENCES)
          .find(
            (key) =>
              PREFERENCES[key as keyof typeof PREFERENCES] === preference,
          )
          .toLowerCase()}`,
      )}
    </Label>
  );
};

export const DisplayMessage = ({ messageKey }) => (
  <>
    <div className="absolute inset-0 bg-white/90 z-10 -m-2 rounded-lg" />
    <div className="absolute inset-0 items-center justify-center flex flex-col gap-y-2 z-20">
      <span className="text-base text-white bg-gradient-major-secondary-predominant rounded-lg px-2 py-0.5">
        {messageKey}
      </span>
    </div>
  </>
);
