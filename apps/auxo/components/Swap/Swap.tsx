import { useMemo, useState } from 'react';
import Image from 'next/image';
import AuxoIcon from '../../public/tokens/AUXO.svg';
import xAuxoIcon from '../../public/tokens/xAUXO.svg';
import StakeInput from './StakeInput';
import { compareBalances, zeroBalance } from '../../utils/balances';
import DepositActions from './ApproveDepositButton';
import StakeButton from './StakeButton';
import useTranslation from 'next-translate/useTranslation';
import {
  useChainExplorer,
  useTokenBalance,
  useUserStakedXAUXO,
  useXAUXOEstimation,
} from '../../hooks/useToken';
import { TokenConfig } from '../../types/tokensConfig';
import { formatBalance } from '../../utils/formatBalance';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from '../../hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { Listbox, Tab } from '@headlessui/react';
import classNames from '../../utils/classnames';
import { ChevronDownIcon } from '@heroicons/react/outline';
import Trans from 'next-translate/Trans';
import { Alert } from '../Alerts/Alerts';
import ModalBox from '../Modals/ModalBox';

type Props = {
  tokenConfig: TokenConfig;
  stakingTokenConfig: TokenConfig;
};

const tokenOptions = [
  {
    title: <Trans i18nKey="convertToken" values={{ token: 'PRV' }} />,
    value: 'convert',
    image: <Image src={AuxoIcon} alt={'AUXO Icon'} width={24} height={24} />,
  },
  {
    title: <Trans i18nKey="stakeToken" values={{ token: 'PRV' }} />,
    value: 'convertAndStake',
    image: <Image src={xAuxoIcon} alt={'xAUXO Icon'} width={24} height={24} />,
  },
];

const Swap: React.FC<Props> = ({ tokenConfig, stakingTokenConfig }) => {
  const [tab, setTab] = useState(tokenOptions[0]);
  const [isConvertAndStake, setIsConvertAndStake] = useState(false);
  const { account, chainId } = useWeb3React();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { name: originToken } = stakingTokenConfig;
  const { name: stakingToken } = tokenConfig;
  const { t } = useTranslation();
  const [originDepositValue, setOriginDepositValue] = useState(zeroBalance);
  const [stakingDepositValue, setStakingDepositValue] = useState(zeroBalance);
  const [unstakingDepositValue, setUnstakingDepositValue] =
    useState(zeroBalance);
  const balance = useTokenBalance(originToken);
  const stakingBalance = useTokenBalance(stakingToken);
  const xAUXOEstimation = useXAUXOEstimation(originDepositValue);
  const stakedXAUXO = useUserStakedXAUXO();
  const chainExplorer = useChainExplorer();

  const addressList = useMemo(() => {
    return [
      {
        title: t('auxoContract'),
        address: tokenConfig?.addresses?.[chainId]?.address,
      },
      {
        title: t('xAuxoContract'),
        address: tokenConfig?.addresses?.[chainId]?.stakingAddress,
      },
      {
        title: t('stakingContract'),
        address: tokenConfig?.addresses?.[chainId]?.rollStakerAddress,
      },
    ];
  }, [chainId, tokenConfig?.addresses, t]);

  return (
    <div className="bg-gradient-to-r from-white via-white to-background">
      <div className="flex flex-col px-4 py-3 rounded-lg shadow-md bg-[url('/images/background/prv-bg.png')] bg-left-bottom bg-no-repeat gap-y-2 overflow-hidden h-full">
        <Tab.Group>
          <Tab.List className="flex gap-x-4 rounded-xl p-1">
            {['convertStake', 'unstake', 'info'].map((tab) => (
              <Tab
                className={({ selected }) =>
                  classNames(
                    'text-base font-semibold focus:outline-none relative',
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
            ))}
          </Tab.List>
          <AnimatePresence initial={false}>
            <Tab.Panels className="mt-4 min-h-[15rem]">
              <Tab.Panel>
                <ModalBox className="flex flex-col gap-y-4">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-base text-primary font-medium">
                      {t('amountToStake')}
                    </p>
                    <div className="flex w-48 justify-end">
                      <Listbox value={tab} onChange={setTab}>
                        {({ open }) => (
                          <div className="relative mt-1 w-full">
                            <Listbox.Button className="flex items-center gap-x-2 bg-gradient-primary rounded-full shadow-card self-center w-full px-2 py-0.5 justify-between">
                              <div className="flex gap-x-2 place-items-center">
                                <div className="flex flex-shrink-0">
                                  {tab.image}
                                </div>
                                <h2 className="text-lg font-medium text-primary">
                                  {tab.title}
                                </h2>
                              </div>
                              <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: open ? -180 : 0 }}
                                transition={{
                                  duration: 0.4,
                                  type: 'spring',
                                  bounce: 0.2,
                                }}
                                className="flex items-center"
                              >
                                <ChevronDownIcon
                                  className="h-5 w-5 text-primary"
                                  aria-hidden="true"
                                />
                              </motion.div>
                            </Listbox.Button>
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {tokenOptions.map((token, i) => (
                                <Listbox.Option
                                  key={i}
                                  value={token}
                                  className={({ active }) =>
                                    `relative select-none cursor-pointer group p-2 ${
                                      active && 'text-secondary'
                                    }`
                                  }
                                >
                                  <div className="flex gap-x-2 place-items-center truncate">
                                    <div className="flex flex-shrink-0">
                                      {token.image}
                                    </div>
                                    <h2 className="text-lg font-medium text-primary group-hover:text-secondary">
                                      {token.title}
                                    </h2>
                                  </div>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        )}
                      </Listbox>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    {tab.value === 'convert' && (
                      <>
                        <StakeInput
                          label={originToken}
                          value={originDepositValue}
                          setValue={setOriginDepositValue}
                          max={balance}
                        />
                        {account && (
                          <Alert
                            open={compareBalances(
                              balance,
                              'lt',
                              originDepositValue,
                            )}
                          >
                            You can only deposit {balance.label} {originToken}
                          </Alert>
                        )}
                        <div className="flex place-items-center justify-between w-full">
                          <p className="text-base text-primary font-medium">
                            {t('vaultBalance')}
                          </p>
                          <p className="text-secondary font-bold text-lg">
                            {formatBalance(
                              xAUXOEstimation.label,
                              defaultLocale,
                              4,
                              'standard',
                            )}{' '}
                            PRV
                          </p>
                        </div>
                        <DepositActions
                          deposit={originDepositValue}
                          estimation={xAUXOEstimation}
                          tokenConfig={stakingTokenConfig}
                          toToken="PRV"
                        >
                          {t('convert')}
                        </DepositActions>
                        <div className="w-full flex justify-center items-center">
                          <p className="text-sub-dark text-sm font-medium">
                            ⚠️ {t('irreversible')}
                          </p>
                        </div>
                        {/* <div className="flex flex-col w-full justify-between gap-y-3">
                          <div className="flex w-full justify-between py-2">
                            <label
                              className="pr-2 text-primary font-bold text-base"
                              htmlFor="convertAndStake"
                            >
                              {t('convertAndStake')}
                            </label>
                            <div className="flex gap-x-4 place-items-center">
                              <p className="text-base text-primary font-medium">
                                {isConvertAndStake ? t('yes') : t('no')}
                              </p>
                              <Switch.Root
                                className={classNames(
                                  'group',
                                  'flex bg-sub-dark relative items-center h-[15px] w-[36px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                                  'focus:outline-none focus-visible:ring focus-visible:ring-sub-dark focus-visible:ring-opacity-75',
                                )}
                                id="convertAndStake"
                                onCheckedChange={setIsConvertAndStake}
                                checked={isConvertAndStake}
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
                          </div>
                        </div> */}
                      </>
                    )}
                    {tab.value === 'convertAndStake' && (
                      <>
                        <StakeInput
                          label={stakingToken}
                          value={stakingDepositValue}
                          setValue={setStakingDepositValue}
                          max={stakingBalance}
                        />
                        {account && (
                          <Alert
                            open={compareBalances(
                              stakingBalance,
                              'lt',
                              stakingDepositValue,
                            )}
                          >
                            You can only deposit {stakingBalance.label}{' '}
                            {stakingToken}
                          </Alert>
                        )}
                        <div className="flex place-items-center justify-between w-full">
                          <p className="text-base text-primary font-medium">
                            {t('staking')}:
                          </p>
                          <p className="text-secondary font-bold text-lg">
                            {formatBalance(
                              stakingDepositValue.label,
                              defaultLocale,
                              4,
                              'standard',
                            )}{' '}
                            PRV
                          </p>
                        </div>
                        <StakeButton
                          deposit={stakingDepositValue}
                          tokenConfig={tokenConfig}
                        />
                      </>
                    )}
                  </div>
                </ModalBox>
              </Tab.Panel>
              <Tab.Panel>
                <ModalBox className="flex flex-col gap-y-4">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-base text-primary font-medium">
                      {t('amountToUnstake')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <StakeInput
                      label={stakingToken}
                      value={unstakingDepositValue}
                      setValue={setUnstakingDepositValue}
                      max={stakedXAUXO}
                    />
                    {account && (
                      <Alert
                        open={compareBalances(
                          stakedXAUXO,
                          'lt',
                          unstakingDepositValue,
                        )}
                      >
                        You can only withdraw {stakedXAUXO.label} {stakingToken}
                      </Alert>
                    )}
                    <div className="flex place-items-center justify-between w-full">
                      <p className="text-base text-primary font-medium">
                        {t('staking')}:
                      </p>
                      <p className="text-secondary font-bold text-lg">
                        {formatBalance(
                          unstakingDepositValue.label,
                          defaultLocale,
                          4,
                          'standard',
                        )}{' '}
                        PRV
                      </p>
                    </div>
                    <StakeButton
                      deposit={unstakingDepositValue}
                      tokenConfig={tokenConfig}
                      action="unstake"
                    />
                  </div>
                </ModalBox>
              </Tab.Panel>
              <Tab.Panel>
                <ModalBox className="flex flex-col gap-y-4">
                  <div className="flex flex-col items-center justify-between w-full divide-y">
                    {addressList.map((el, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-y py-2 items-center"
                      >
                        <p className="text-base text-primary font-medium">
                          {el.title}
                        </p>
                        <a
                          className="text-secondary font-bold text-lg truncate"
                          href={`${chainExplorer?.url}/address/${el.address}`}
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
            </Tab.Panels>
          </AnimatePresence>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Swap;
