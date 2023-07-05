import { useMemo, useState } from 'react';
import Image from 'next/image';
import AuxoIcon from '../../public/tokens/AUXO.svg';
import PRVIcon from '../../public/tokens/32x32/PRV.svg';
import StakeInput from '../Input/InputSlider';
import {
  compareBalances,
  isZero,
  pickBalanceList,
  zeroBalance,
} from '../../utils/balances';
import DepositActions from './ApproveDepositButton';
import StakeButton from './StakeButton';
import useTranslation from 'next-translate/useTranslation';
import {
  useCurrentPrvWithdrawalAmount,
  usePRVEstimation,
  useTokenBalance,
  useUserPrvClaimableAmount,
  useUserStakedPRV,
} from '../../hooks/useToken';
import { TokenConfig } from '../../types/tokensConfig';
import { formatBalance } from '../../utils/formatBalance';
import { useConnectWallet } from '@web3-onboard/react';
import { useAppSelector } from '../../hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { Listbox, Tab } from '@headlessui/react';
import classNames from '../../utils/classnames';
import {
  ChevronDownIcon,
  DocumentTextIcon,
  ExclamationIcon,
} from '@heroicons/react/outline';
import Trans from 'next-translate/Trans';
import { Alert } from '../Alerts/Alerts';
import ModalBox from '../Modals/ModalBox';
import { STEPS } from '../../store/modal/modal.types';
import Banner from '../Banner/Banner';
import AUXO from '../../public/images/icons/AUXO-no-bg.svg';
import { PrvWithdrawalRecipient } from '../../types/merkleTree';
import WithdrawButton from './WithdrawButton';
import Tooltip from '../Tooltip/Tooltip';

type Props = {
  tokenConfig: TokenConfig;
  stakingTokenConfig: TokenConfig;
  claim: PrvWithdrawalRecipient & { account: string };
};

const tokenOptions = [
  {
    title: <Trans i18nKey="stakeAndConvertToken" values={{ token: 'PRV' }} />,
    value: 'convertAndStake',
    image: <Image src={PRVIcon} alt={'PRV'} width={24} height={24} />,
  },
  {
    title: <Trans i18nKey="convertToken" values={{ token: 'PRV' }} />,
    value: 'convert',
    image: <Image src={AuxoIcon} alt={'AUXO Icon'} width={24} height={24} />,
  },
  {
    title: <Trans i18nKey="stakeToken" values={{ token: 'PRV' }} />,
    value: 'stake',
    image: <Image src={PRVIcon} alt={'PRV'} width={24} height={24} />,
  },
];

const Swap: React.FC<Props> = ({ tokenConfig, stakingTokenConfig, claim }) => {
  const [tab, setTab] = useState(tokenOptions[0]);
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { name: originToken } = stakingTokenConfig;
  const { name: stakingToken } = tokenConfig;
  const { t } = useTranslation();
  const [originDepositValue, setOriginDepositValue] = useState(zeroBalance);
  const [stakingDepositValue, setStakingDepositValue] = useState(zeroBalance);
  const [unstakingDepositValue, setUnstakingDepositValue] =
    useState(zeroBalance);
  const [withdrawDepositValue, setWithdrawDepositValue] = useState(zeroBalance);
  const balance = useTokenBalance(originToken);
  const PrvBalance = useTokenBalance(stakingToken);
  const stakedXAUXO = useUserStakedPRV();

  const userWithdrawableAmount = useUserPrvClaimableAmount();
  const prvWithdrawableAmount = useCurrentPrvWithdrawalAmount();
  const withdrawableAmount = useMemo(() => {
    return pickBalanceList(
      [userWithdrawableAmount, prvWithdrawableAmount, PrvBalance],
      'min',
    );
  }, [userWithdrawableAmount, prvWithdrawableAmount, PrvBalance]);

  const canWithdraw = !isZero(withdrawableAmount, 18);

  const withdrawalCalculation = usePRVEstimation(withdrawDepositValue, true);

  const addressList = useMemo(() => {
    return [
      {
        title: t('auxoContract'),
        address: stakingTokenConfig?.addresses?.[1]?.address,
      },
      {
        title: t('prvContract'),
        address: tokenConfig?.addresses?.[1]?.address,
      },
      {
        title: t('rollStakerProxyContract'),
        address: tokenConfig?.addresses?.[1]?.rollStakerAddress,
      },
      {
        title: t('merkleDistributorContract'),
        address: tokenConfig?.addresses?.[1]?.merkleDistributorAddress,
      },
      {
        title: t('merkleVerifierContract'),
        address: tokenConfig?.addresses?.[1]?.PRVMerkleVerifierAddress,
      },
      {
        title: t('PrvRouterContract'),
        address: tokenConfig?.addresses?.[1]?.PRVRouterAddress,
      },
    ];
  }, [t, stakingTokenConfig?.addresses, tokenConfig?.addresses]);

  return (
    <div className="bg-gradient-to-r from-white via-white to-background">
      <div className="flex flex-col px-4 py-3 rounded-lg shadow-md bg-[url('/images/background/prv-bg.png')] bg-left-bottom bg-no-repeat gap-y-2 overflow-hidden h-full">
        <Tab.Group>
          <Tab.List className="flex gap-x-4 rounded-xl p-1 pb-4 whitespace-nowrap overflow-x-auto scrollbar:w-[2px] scrollbar:h-[2px] scrollbar:bg-white scrollbar:border scrollbar:border-sub-dark scrollbar-track:bg-white scrollbar-thumb:bg-sub-light scrollbar-track:[box-shadow:inset_0_0_1px_rgba(0,0,0,0.4)] scrollbar-track:rounded-full scrollbar-thumb:rounded-full">
            {['convertStake', 'unstake', 'info', 'withdraw'].map((tab) => (
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
                      <div className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-secondary" />
                    )}
                  </>
                )}
              </Tab>
            ))}
          </Tab.List>
          <AnimatePresence initial={false}>
            <Tab.Panels className="mt-4 min-h-[15rem] h-full">
              <Tab.Panel className="h-full">
                <ModalBox className="flex flex-col gap-y-4 h-full">
                  <div className="flex items-center justify-between w-full gap-x-4">
                    <p className="text-base text-primary font-medium">
                      {t('amountToStake')}
                    </p>
                    <div className="flex w-72 justify-end">
                      <Listbox value={tab} onChange={setTab}>
                        {({ open }) => (
                          <div className="relative mt-1 w-full">
                            <Listbox.Button className="flex items-center gap-x-2 bg-gradient-primary rounded-full shadow-card self-center w-full px-2 py-0.5 justify-between">
                              <div className="flex gap-x-2 place-items-center">
                                <div className="flex flex-shrink-0">
                                  {tab.image}
                                </div>
                                <h2 className="text-base md:text-lg font-medium text-primary">
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
                  <div className="flex flex-col gap-y-2 h-full">
                    {tab.value === 'convert' && (
                      <>
                        <StakeInput
                          resetOnSteps={[STEPS.CONVERT_COMPLETED]}
                          label={originToken}
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
                              originDepositValue.label,
                              defaultLocale,
                              4,
                              'standard',
                            )}{' '}
                            PRV
                          </p>
                        </div>
                        <DepositActions
                          deposit={originDepositValue}
                          estimation={originDepositValue}
                          tokenConfig={stakingTokenConfig}
                          toToken="PRV"
                          isConvertAndStake={false}
                        >
                          {t('convert')}
                        </DepositActions>
                        <div className="w-full flex justify-center items-center mt-auto mb-0.5">
                          <Banner
                            bgColor="bg-warning"
                            content={
                              <Trans
                                i18nKey="withdrawalMechanism"
                                components={{
                                  a: (
                                    <a
                                      href={
                                        'https://docs.auxo.fi/auxo-docs/rewards-vaults/prv-passive-rewards-vault#withdrawal-mechanics'
                                      }
                                      className="text-primary underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    />
                                  ),
                                }}
                              />
                            }
                            icon={
                              <ExclamationIcon
                                className="h-5 w-5 text-primary"
                                aria-hidden="true"
                              />
                            }
                          />
                        </div>
                      </>
                    )}
                    {tab.value === 'stake' && (
                      <>
                        <StakeInput
                          resetOnSteps={[STEPS.CONVERT_COMPLETED]}
                          label={stakingToken}
                          setValue={setStakingDepositValue}
                          max={PrvBalance}
                        />
                        {account && (
                          <Alert
                            open={compareBalances(
                              PrvBalance,
                              'lt',
                              stakingDepositValue,
                            )}
                          >
                            You can only deposit {PrvBalance.label}{' '}
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
                          isConvertAndStake={false}
                          action="stake"
                        />
                      </>
                    )}
                    {tab.value === 'convertAndStake' && (
                      <>
                        <StakeInput
                          resetOnSteps={[STEPS.CONVERT_COMPLETED]}
                          label={originToken}
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
                            {t('staking')}:
                          </p>
                          <p className="text-secondary font-bold text-lg">
                            {formatBalance(
                              originDepositValue.label,
                              defaultLocale,
                              4,
                              'standard',
                            )}{' '}
                            PRV
                          </p>
                        </div>
                        <DepositActions
                          deposit={originDepositValue}
                          estimation={originDepositValue}
                          tokenConfig={stakingTokenConfig}
                          toToken="PRV"
                          isConvertAndStake={true}
                        >
                          {t('convertAndStake')}
                        </DepositActions>
                        <div className="w-full flex justify-center items-center mt-auto mb-0.5">
                          <Banner
                            bgColor="bg-warning"
                            content={
                              <Trans
                                i18nKey="withdrawalMechanism"
                                components={{
                                  a: (
                                    <a
                                      href={
                                        'https://docs.auxo.fi/auxo-docs/rewards-vaults/prv-passive-rewards-vault#withdrawal-mechanics'
                                      }
                                      className="text-primary underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    />
                                  ),
                                }}
                              />
                            }
                            icon={
                              <ExclamationIcon
                                className="h-5 w-5 text-primary"
                                aria-hidden="true"
                              />
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                </ModalBox>
              </Tab.Panel>
              <Tab.Panel>
                <ModalBox className="flex flex-col gap-y-4 h-full">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-base text-primary font-medium">
                      {t('amountToUnstake')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <StakeInput
                      resetOnSteps={[STEPS.UNSTAKE_COMPLETED]}
                      label={stakingToken}
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
                        {t('unstaking')}:
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
                <ModalBox className="flex flex-col gap-y-4 h-full">
                  <div className="flex flex-col items-center justify-between w-full divide-y">
                    {addressList.map((el, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-y py-1 items-center"
                      >
                        <p className="text-sm text-primary font-medium">
                          {el.title}
                        </p>
                        <a
                          className="text-secondary font-bold text-base truncate"
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
              <Tab.Panel className="h-full">
                <ModalBox className="flex flex-col gap-y-4 h-full">
                  <>
                    {canWithdraw ? (
                      <>
                        <div className="flex items-center justify-between w-full">
                          <p className="text-base text-primary font-medium">
                            {t('amountToBurn')}
                          </p>
                          <div className="flex justify-end">
                            <div className="flex items-center gap-x-2 bg-gradient-primary rounded-full shadow-card self-center w-full px-2 py-0.5 justify-between">
                              <div className="flex gap-x-2 place-items-center">
                                <div className="flex flex-shrink-0">
                                  <Image
                                    src={AUXO}
                                    alt="AUXO"
                                    width={18}
                                    height={18}
                                  />
                                </div>
                                <h2 className="text-lg font-medium text-primary">
                                  {t('redeemAuxo')}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                        <StakeInput
                          resetOnSteps={[STEPS.WITHDRAW_PRV_COMPLETED]}
                          label={'PRV'}
                          setValue={setWithdrawDepositValue}
                          max={withdrawableAmount}
                        />
                        {account && (
                          <Alert
                            open={compareBalances(
                              withdrawDepositValue,
                              'gt',
                              withdrawableAmount,
                            )}
                          >
                            You can only withdraw{' '}
                            {withdrawableAmount?.label ?? 0} PRV
                          </Alert>
                        )}
                        <div className="flex flex-col w-full">
                          <div className="flex justify-between w-full">
                            <p className="text-base text-primary font-medium">
                              {t('youGet')}:
                            </p>
                            <p className="text-secondary font-bold text-lg">
                              {formatBalance(
                                withdrawalCalculation?.value?.label,
                                defaultLocale,
                                4,
                                'standard',
                              )}{' '}
                              AUXO
                            </p>
                          </div>
                          <div className="flex justify-between w-full">
                            <p className="text-base text-primary font-medium">
                              {t('fee')}:
                            </p>
                            <p className="text-secondary font-bold text-lg">
                              {formatBalance(
                                withdrawalCalculation?.subtractedValue?.label,
                                defaultLocale,
                                4,
                                'standard',
                              )}{' '}
                              AUXO
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full place-content-center">
                          <WithdrawButton
                            deposit={withdrawDepositValue}
                            tokenConfig={tokenConfig}
                            disabled={
                              !canWithdraw || withdrawDepositValue?.label === 0
                            }
                            fee={withdrawalCalculation?.subtractedValue}
                            estimation={withdrawalCalculation?.value}
                            claim={claim}
                          >
                            {t('withdraw')}
                          </WithdrawButton>
                        </div>
                        <div className="flex w-full flex-col sm:flex-row gap-3 mt-auto">
                          <div className="flex flex-col p-[2px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-md w-full sm:w-fit">
                            <div className="flex bg-gradient-to-r from-white via-white to-background px-4 py-4 rounded h-full items-center">
                              <p className="flex gap-x-12 font-semibold justify-between text-base text-primary">
                                <span>{t('epoch')}</span>
                                <span>{claim?.windowIndex ?? 'N/A'}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-1 flex-col border-2 border-red rounded-md w-full px-4 py-4 bg-white">
                            <p className="flex gap-x-12 font-semibold justify-between text-base text-primary">
                              <span>{t('youCanWithdraw')}</span>
                              <div className="flex gap-x-2 items-center">
                                <span>
                                  {formatBalance(
                                    withdrawableAmount?.label,
                                    defaultLocale,
                                    4,
                                  )}{' '}
                                  PRV
                                </span>
                                <Tooltip>{t('withdrawExplanation')}</Tooltip>
                              </div>
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold text-center text-xl text-primary capitalize w-full">
                          {t('burningPrvToAuxo')}
                        </h3>
                        <div className="flex flex-col items-center justify-center w-full gap-y-6">
                          <div className="text-center">
                            <p className="text-base text-sub-dark font-medium">
                              {t('burningPrvToAuxoSubtitle')}
                            </p>
                          </div>
                          <div className="flex justify-between w-full gap-2 items-center flex-wrap">
                            <div className="flex gap-x-2">
                              <DocumentTextIcon className="h-5 w-5 text-primary" />
                              <p className="text-base text-primary font-medium">
                                {t('checkDocumentation')}
                              </p>
                            </div>
                            <a
                              rel="noreferrer noopener"
                              target="_blank"
                              className="w-fit px-5 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary hover:bg-secondary hover:text-white flex gap-x-2 items-center"
                              href="https://docs.auxo.fi/auxo-docs/rewards-vaults/prv-passive-rewards-vault#withdrawal-mechanics"
                            >
                              {t('goToDocs')}
                            </a>
                          </div>
                          <div className="flex w-full flex-col sm:flex-row gap-3 mt-auto">
                            <div className="flex flex-col p-[2px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-md w-fit">
                              <div className="flex bg-gradient-to-r from-white via-white to-background px-4 py-4 rounded h-full items-center">
                                <p className="flex gap-x-12 font-semibold justify-between text-base text-primary">
                                  <span>{t('epoch')}</span>
                                  <span>{claim?.windowIndex ?? 'N/A'}</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-1 flex-col border-2 border-red rounded-md w-full px-4 py-4 bg-white">
                              <p className="flex gap-x-12 font-semibold justify-between text-base text-primary">
                                <span>{t('youCanWithdraw')}</span>
                                <div className="flex gap-x-2 items-center">
                                  <span>
                                    {formatBalance(
                                      withdrawableAmount?.label,
                                      defaultLocale,
                                      4,
                                    )}{' '}
                                    PRV
                                  </span>
                                  <Tooltip>{t('withdrawExplanation')}</Tooltip>
                                </div>
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
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
