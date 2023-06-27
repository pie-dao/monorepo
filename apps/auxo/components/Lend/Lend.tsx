import { useMemo, useState } from 'react';
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
import * as Switch from '@radix-ui/react-switch';
import { RefreshIcon } from '@heroicons/react/solid';
import { useEnanchedPools } from '../../hooks/useEnanchedPools';
import LendActions from './InputActions';
import { setPreference } from '../../store/lending/lending.slice';
import {
  UseMaxBorrowableAmountFromPool,
  UseMaxWithdrawableAmountFromPool,
} from '../../hooks/useLending';
import { isEqual } from 'lodash';

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
  const dispatch = useAppDispatch();
  const setAutocompound = (boost: boolean) => {
    dispatch(setPreference(boost ? 0 : 1));
  };
  const maxBorrow = UseMaxBorrowableAmountFromPool(poolAddress);
  // Let's put here the max deposit value from the contract
  const maxDeposit = useMemo(() => {
    return pickBalanceList([balance, maxBorrow], 'min');
  }, [balance, maxBorrow]);

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
              {hasUnlendableAmount && (
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
                      {t('unlend')}
                      {selected && (
                        <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary" />
                      )}
                    </>
                  )}
                </Tab>
              )}
            </Tab.List>
            {selectedIndex === 0 ? (
              <div className="flex gap-x-2 items-center">
                <label
                  className="pr-2 text-sub-dark font-medium text-base flex gap-x-1"
                  htmlFor="autocompound"
                >
                  <RefreshIcon
                    className="h-5 w-5 text-primary rotate-90 -scale-y-100"
                    aria-hidden="true"
                  />
                  <span className="text-primary">{t('autocompound')}</span>
                </label>
                <Switch.Root
                  className={classNames(
                    'group',
                    'flex bg-sub-dark relative items-center h-[15px] w-[36px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    'focus:outline-none focus-visible:ring focus-visible:ring-sub-dark focus-visible:ring-opacity-75',
                  )}
                  id="autocompound"
                  onCheckedChange={setAutocompound}
                  checked={preference === 0 ? true : false}
                >
                  <Switch.Thumb
                    className={classNames(
                      'group-radix-state-checked:translate-x-4 group-radix-state-checked:bg-secondary',
                      'group-radix-state-unchecked:-translate-x-1 group-radix-state-unchecked:bg-sub-light',
                      'pointer-events-none flex h-[23px] w-[23px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out',
                    )}
                  />
                </Switch.Root>
              </div>
            ) : null}
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
                  />
                </ModalBox>
              </Tab.Panel>
              <Tab.Panel className="h-full">
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
                    setValue={setWithdrawValue}
                    max={maxUnlendAmount}
                    disabled={isEqual(maxUnlendAmount, zeroBalance)}
                  />
                  {account && (
                    <Alert
                      open={compareBalances(
                        maxUnlendAmount,
                        'lt',
                        withdrawValue,
                      )}
                    >
                      You can only withdraw {maxUnlendAmount.label} {name}
                    </Alert>
                  )}
                  <LendActions
                    deposit={depositValue}
                    tokenConfig={tokenConfig}
                    poolAddress={poolAddress}
                    action="unlend"
                  />
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
