import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import Image from 'next/image';
import { thunkUnlend } from '../../../store/lending/lending.thunks';
import { formatBalance } from '../../../utils/formatBalance';
import { useEnanchedPools } from '../../../hooks/useEnanchedPools';
import { useLendingPoolContract } from '../../../hooks/useContracts';
import { PendingTransactionContent } from './PendingTransactionContent';

export default function Unlend() {
  const { t } = useTranslation();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();
  const [lendClaim, setLendClaim] = useState(false);
  const { amount, selectedPool, tx } = useAppSelector(
    (state) => state.lending.lendingFlow,
  );
  const { data: poolData } = useEnanchedPools(selectedPool);
  const lendingPoolContract = useLendingPoolContract(selectedPool);

  const unLendRewards = () => {
    setLendClaim(true);
    dispatch(
      thunkUnlend({
        lendingPool: lendingPoolContract,
        amount,
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
            {t('unlendTitle', {
              token: poolData?.attributes?.token?.data?.attributes?.name,
            })}
          </Dialog.Title>
          <div className="overflow-hidden rounded-lg items-start w-full font-medium transition-all mx-auto">
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
                  <span>
                    {formatBalance(amount?.label, defaultLocale, 6, 'standard')}{' '}
                    {poolData?.attributes?.token?.data?.attributes?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-y-4 items-center mt-4">
            {!lendClaim ? (
              <button
                type="button"
                className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                onClick={unLendRewards}
              >
                {t('withdraw')}
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
