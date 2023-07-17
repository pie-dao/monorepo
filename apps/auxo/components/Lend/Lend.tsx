import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import StakeInput from '../Input/InputSlider';
import {
  compareBalances,
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
  UseMaxEpochCapacityFromPool,
  UseMaxWithdrawableAmountFromPool,
  UsePoolAcceptsDeposits,
  UsePoolState,
} from '../../hooks/useLending';
import { isEmpty, isEqual } from 'lodash';
import { formatBalance } from '../../utils/formatBalance';
import { PREFERENCES } from '../../utils/constants';
import { Preferences, STATES, STEPS } from '../../store/lending/lending.types';
import { RadioGroup, RadioGroupItem } from '../RadioGroup/RadioGroup';
import { Label } from '@radix-ui/react-label';
import { WithdrawIcon } from '../Icons/Icons';
import { thunkCompoundYield } from '../../store/lending/lending.thunks';
import { useLendingPoolContract } from '../../hooks/useContracts';

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
  const loanedAmount = data?.userData?.balance;
  const userActualPreference = data?.userData?.preference;
  const hasBalanceInPool =
    !isEmpty(loanedAmount) && !isEqual(loanedAmount, zeroBalance);
  const isPoolAcceptingDeposits = UsePoolAcceptsDeposits(poolAddress);
  const poolState = UsePoolState(poolAddress);
  const dispatch = useAppDispatch();

  const maxBorrow = UseMaxEpochCapacityFromPool(poolAddress);
  // Let's put here the max deposit value from the contract
  const maxDeposit = useMemo(() => {
    return pickBalanceList([balance, maxBorrow], 'min');
  }, [balance, maxBorrow]);

  const { defaultLocale } = useAppSelector((state) => state.preferences);

  const buttonText = canWithdraw ? (
    t('withdrawalReady')
  ) : userActualPreference === PREFERENCES.WITHDRAW ? (
    <p className="flex items-center gap-x-2">
      <WithdrawIcon />
      <span>{t('withdrawalRequested')}</span>
    </p>
  ) : poolState === STATES.ACTIVE ? (
    t('requestWithdrawal')
  ) : null;

  const textContent =
    canWithdraw ||
    (userActualPreference === PREFERENCES.WITHDRAW && !canWithdraw)
      ? t('fundsAvailableEndEpoch', { token: name })
      : !canWithdraw &&
        userActualPreference !== PREFERENCES.WITHDRAW &&
        poolState === STATES.ACTIVE
      ? t('beforeRequestingWithdraw', { token: name })
      : null;

  const buttonDisabled =
    userActualPreference === PREFERENCES.WITHDRAW ||
    poolState !== STATES.ACTIVE;

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

  const buttonAction = canWithdraw
    ? withdraw
    : userActualPreference !== PREFERENCES.WITHDRAW
    ? requestWithdraw
    : null;

  const changePreference = () => {
    dispatch(setLendingFlowPool(poolAddress));
    dispatch(setLendingFlowOpen(true));
    dispatch(setLendingStep(STEPS.CHANGE_PREFERENCE));
  };

  useEffect(() => {
    dispatch(setPreference(userActualPreference as Preferences));
  }, [dispatch, userActualPreference]);

  const lendingPoolContract = useLendingPoolContract(poolAddress);

  const compound = () => {
    dispatch(
      thunkCompoundYield({
        lendingPool: lendingPoolContract,
      }),
    );
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [
    hasBalanceInPool,
    isPoolAcceptingDeposits,
    hasUnlendableAmount,
    canWithdraw,
  ]);

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
              {hasBalanceInPool ? (
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
              ) : null}
              {hasBalanceInPool && poolState === STATES.ACTIVE ? (
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
              ) : null}
            </Tab.List>
          </div>
          <AnimatePresence initial={false}>
            <Tab.Panels className="mt-4 min-h-[15rem] h-full">
              <Tab.Panel className="h-full relative">
                {!isPoolAcceptingDeposits && (
                  <>
                    <div className="absolute inset-0 backdrop-blur-lg bg-white/30 z-10 -m-2" />
                    <div className="absolute inset-0 items-center justify-center flex flex-col gap-y-2 z-20">
                      <span className="text-base text-white bg-gradient-major-secondary-predominant rounded-lg px-2 py-0.5">
                        {t('notAcceptingDeposits')}
                      </span>
                    </div>
                  </>
                )}
                <ModalBox className="flex flex-col h-full gap-y-2">
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
                    disabled={!isPoolAcceptingDeposits}
                  />
                </ModalBox>
              </Tab.Panel>
              {hasBalanceInPool && (
                <Tab.Panel className="h-full">
                  <ModalBox className="flex flex-col h-full gap-y-2">
                    {hasUnlendableAmount && (
                      <>
                        <div className="flex flex-wrap gap-2 items-center justify-between w-full mb-2">
                          <p className="font-medium text-base text-primary">
                            {t('availableToWithdraw')}
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
                            {hasUnlendableAmount ? (
                              <span className="text-lg font-semibold text-primary">
                                {formatBalance(
                                  maxUnlendAmount.label,
                                  defaultLocale,
                                  4,
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
                              deposit={
                                canWithdraw ? loanedAmount : withdrawValue
                              }
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
                    )}
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
                                  4,
                                  'standard',
                                )}
                              </span>
                              <h2 className="text-lg font-semibold text-primary">
                                {t(name)}
                              </h2>
                            </div>
                          </div>
                          {buttonText && textContent ? (
                            <>
                              <p className="text-xs text-sub-dark font-medium">
                                {textContent}
                              </p>
                              <button
                                disabled={buttonDisabled}
                                onClick={buttonAction}
                                className="w-fit px-10 md:px-20 py-3 my-2 text-sm md:text-base font-medium text-primary bg-transparent rounded-full ring-inset ring-1 ring-primary enabled:hover:bg-primary enabled:hover:text-white disabled:ring-sub-dark disabled:text-sub-dark"
                              >
                                {buttonText}
                              </button>
                            </>
                          ) : null}
                        </div>
                      )}
                    <button onClick={compound} className="w-fit">
                      compound
                    </button>
                  </ModalBox>
                </Tab.Panel>
              )}
              {hasBalanceInPool && (
                <Tab.Panel className="h-full">
                  <ModalBox className="flex flex-col h-full gap-y-2">
                    <>
                      <div className="flex flex-wrap gap-2 items-center justify-between w-full mb-2">
                        <p className="font-medium text-base text-primary">
                          {t('changePreference')}
                        </p>
                      </div>
                      <RadioGroup
                        defaultValue={userActualPreference?.toString()}
                        onValueChange={(value) => {
                          dispatch(
                            setPreference(parseInt(value) as Preferences),
                          );
                        }}
                        className="mb-4 pl-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="1"
                            id="CLAIM"
                            disabled={
                              userActualPreference === PREFERENCES.CLAIM
                            }
                          />
                          <Label htmlFor="CLAIM">{t('claim')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="0"
                            id="AUTOCOMPOUND"
                            disabled={
                              userActualPreference === PREFERENCES.AUTOCOMPOUND
                            }
                          />
                          <Label htmlFor="AUTOCOMPOUND">
                            {t('autocompound')}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="2"
                            id="WITHDRAW"
                            disabled={
                              userActualPreference === PREFERENCES.WITHDRAW
                            }
                          />
                          <Label htmlFor="WITHDRAW">{t('withdraw')}</Label>
                        </div>
                      </RadioGroup>
                      <button
                        onClick={changePreference}
                        disabled={userActualPreference === preference}
                        className="w-fit px-10 md:px-20 py-2 text-sm md:text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                      >
                        {t('changePreference')}
                      </button>
                    </>
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

export default Lend;
