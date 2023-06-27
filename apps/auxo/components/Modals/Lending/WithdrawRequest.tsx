import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import { thunkRequestWithdrawal } from '../../../store/lending/lending.thunks';
import { useLendingPoolContract } from '../../../hooks/useContracts';
import { PendingTransactionContent } from './PendingTransactionContent';

export default function RequestWithdraw() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [lendClaim, setLendClaim] = useState(false);
  const { selectedPool, tx } = useAppSelector(
    (state) => state.lending.lendingFlow,
  );
  const lendingPoolContract = useLendingPoolContract(selectedPool);

  const unLendRewards = () => {
    setLendClaim(true);
    dispatch(
      thunkRequestWithdrawal({
        lendingPool: lendingPoolContract,
      }),
    ).finally(() => setLendClaim(false));
  };

  return (
    <>
      {!tx?.hash ? (
        <>
          <Dialog.Title
            as="h3"
            className="font-bold text-center text-xl text-primary capitalize w-full"
          >
            {t('requestWithdrawPrincipal')}
          </Dialog.Title>
          {/* <div className="overflow-hidden rounded-lg shadow-sm items-start w-full font-medium transition-all mx-auto bg-left bg-no-repeat bg-[url('/images/background/bg-rewards.png')] bg-cover">
            <div className="flex flex-col px-4 py-4 w-full bg-white/80 gap-y-3 h-full">
              <div className="flex justify-center w-full">
                <div className="text-2xl w-fit text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant pl-4 pr-6 py-2 rounded-lg z-10">
                  {poolData?.attributes?.token?.data?.attributes?.icon?.data
                    ?.attributes?.url ? (
                    <Image
                      src={
                        poolData?.attributes?.token?.data?.attributes?.icon
                          ?.data?.attributes?.url
                      }
                      alt={poolData?.attributes?.token?.data?.attributes?.name}
                      width={24}
                      height={24}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div> */}
          <div className="w-full flex flex-col gap-y-4 items-center mt-4">
            {!lendClaim ? (
              <button
                type="button"
                className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                onClick={unLendRewards}
              >
                {t('claimRewards')}
              </button>
            ) : (
              <div className="w-full flex justify-center">
                <p className="bg-clip-text bg-gradient-major-colors text-transparent ">
                  {t('confirmInWallet')}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <PendingTransactionContent />
      )}
    </>
  );
}
