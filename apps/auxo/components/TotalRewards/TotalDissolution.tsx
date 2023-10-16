import Image from 'next/image';
import wETHImage from '../../public/tokens/24x24/ETH.svg';
import useTranslation from 'next-translate/useTranslation';
import { formatBalance } from '../../utils/formatBalance';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  setClaimFlowOpen,
  setClaimStep,
  setClaimToken,
} from '../../store/rewards/rewards.slice';
import { STEPS } from '../../store/rewards/rewards.types';
import {
  useActiveClaimDissolution,
  useHasActiveClaimDissolution,
} from '../../hooks/useRewards';
import { useConnectWallet } from '@web3-onboard/react';
import { addBalances, zeroBalance } from '../../utils/balances';

const TotalDissolution: React.FC = () => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const hasDissolutionToClaim = useHasActiveClaimDissolution();
  const dissolutions = useActiveClaimDissolution();

  const amountToClaim = dissolutions?.reduce((acc, curr) => {
    return addBalances(acc, curr.rewards);
  }, zeroBalance);

  const shouldShowClaim = hasDissolutionToClaim && !!account;

  const { t } = useTranslation();
  return (
    <section className="grid grid-cols-1 gap-4 mt-4 w-full items-start">
      <div className="overflow-hidden rounded-lg shadow-sm items-start w-full font-medium transition-all mx-auto bg-left bg-no-repeat bg-[url('/images/background/bg-rewards.png')] bg-cover">
        <div className="flex flex-col px-4 py-4 w-full bg-white/80 gap-y-3 h-full">
          <div className="w-full flex justify-between gap-x-4 mb-2 pb-2 border-b border-custom-border">
            <div className="flex items-center gap-x-2 ">
              <div className="flex flex-shrink-0 w-fit bg-primary rounded-full p-0.5">
                <Image
                  src={wETHImage}
                  alt="arv"
                  width={24}
                  height={24}
                  priority
                />
              </div>
              <h3 className="text-primary text-base font-semibold flex gap-x-2 items-center">
                {t('totalDissolutionAmount')}
              </h3>
            </div>
            <p className="text-primary text-base font-semibold flex gap-x-2 uppercase items-center">
              {t('WETHAmount', {
                amountLabel: formatBalance(
                  amountToClaim.label,
                  defaultLocale,
                  12,
                  'standard',
                ),
              })}
            </p>
          </div>
          {shouldShowClaim ? <ActionsBar /> : <NoRewards />}
        </div>
      </div>
    </section>
  );
};

export default TotalDissolution;

const ActionsBar = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const openClaimAllModal = () => {
    dispatch(setClaimToken('AUXO'));
    dispatch(setClaimStep(STEPS.CLAIM_DISSOLUTION));
    dispatch(setClaimFlowOpen(true));
  };

  return (
    <div className="w-full flex justify-center">
      <button
        onClick={() => openClaimAllModal()}
        className="flex gap-x-2 items-center w-32 px-2 py-1 place-content-center text-lg font-medium text-white bg-green rounded-full ring-2 ring-green enabled:hover:bg-transparent enabled:hover:text-green disabled:opacity-70"
      >
        {t('claim')}
      </button>
    </div>
  );
};

const NoRewards = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-y-2 py-4">
      <div className="flex flex-col items-center">
        <h3 className="text-primary text-lg font-medium">
          {t('noDissolutionMoney')}
        </h3>
      </div>
    </div>
  );
};
