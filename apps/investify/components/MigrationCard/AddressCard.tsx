import useTranslation from 'next-translate/useTranslation';
import { useWeb3React } from '@web3-react/core';
import trimAccount from '../../utils/trimAccount';
import { useCallback, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { useStakingTokenContract } from '../../hooks/useContracts';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Alert } from '../Alerts/Alerts';
import {
  setCurrentStep,
  setDestinationWallet,
  setPreviousStep,
} from '../../store/migration/migration.slice';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import { ConnectButton } from '@shared/ui-library';

type Props = {
  isCurrentWallet: boolean;
};

const AddressCard: React.FC<Props> = ({ isCurrentWallet }) => {
  const ready = useServerHandoffComplete();
  const { migrateTo, currentStep } = useAppSelector((state) => state.migration);
  const [anotherWallet, setAnotherWallet] = useState<string>('');
  const [isAnotherWalletValid, setIsAnotherWalletValid] =
    useState<boolean>(true);
  const [invalidReason, setInvalidReason] = useState<string>('');
  const { t } = useTranslation('migration');
  const { account } = useWeb3React();
  const tokenLocker = useStakingTokenContract('veAUXO');
  const dispatch = useAppDispatch();

  const goToConfirm = useCallback(() => {
    dispatch(setDestinationWallet(isCurrentWallet ? account : anotherWallet));
    dispatch(setPreviousStep(currentStep));
    dispatch(setCurrentStep(currentStep + 1));
  }, [account, anotherWallet, currentStep, dispatch, isCurrentWallet]);

  const handleInvalidAddress = ({
    isValid,
    reason,
  }: {
    isValid: boolean;
    reason: string;
  }) => {
    setIsAnotherWalletValid(isValid);
    setInvalidReason(reason);
  };

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const isAddress = ethers.utils.isAddress(e.target.value);
      setAnotherWallet(e.target.value);
      if (e.target.value.length < 42) {
        handleInvalidAddress({
          isValid: true,
          reason: null,
        });
        return;
      }
      if (!isAddress) {
        handleInvalidAddress({
          isValid: false,
          reason: t('invalidAddress'),
        });
      }

      if (isAddress && e.target.value.toLowerCase() === account.toLowerCase()) {
        handleInvalidAddress({ isValid: false, reason: t('sameWallet') });
      }

      if (isAddress && e.target.value.toLowerCase() !== account.toLowerCase()) {
        try {
          const hasLock = await tokenLocker.hasLock(e.target.value);
          if (hasLock) {
            handleInvalidAddress({
              isValid: false,
              reason: t('alreadyLocked'),
            });
          } else {
            handleInvalidAddress({
              isValid: true,
              reason: '',
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    [account, t, tokenLocker],
  );

  const anotherWalletEnabled = useMemo(() => {
    return ethers.utils.isAddress(anotherWallet);
  }, [anotherWallet]);

  return (
    <div className="flex flex-col px-4 py-4 rounded-md bg-gradient-primary shadow-md bg gap-y-3 items-center divide-y w-full font-medium">
      <div className="flex flex-col items-center w-full border-hidden gap-y-1">
        <h3 className="text-lg font-medium text-secondary">
          {isCurrentWallet ? t('sameWallet') : t('differentWallet')}
        </h3>
        <p className="text-sm text-primary">
          {isCurrentWallet
            ? t('sameWalletSubtitle')
            : t('differentWalletSubtitle')}
        </p>
      </div>
      <div className="flex w-full flex-col pt-4 text-center gap-y-2 pb-1">
        {isCurrentWallet ? (
          <>
            <div className="flex items-center gap-x-2 p-2 bg-light-gray shadow-md text-sub-dark rounded-sm">
              {t('sameWalletAddress')}
            </div>
            <div className="flex items-center gap-x-2 p-2 bg-light-gray shadow-md text-sub-dark rounded-sm leading-5">
              {account ? trimAccount(account, true) : t('walletNotConnected')}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-x-2 p-2 bg-light-gray shadow-md text-sub-dark rounded-sm">
              {t('differentWalletAddress')}
            </div>
            <div className="flex flex-col items-start focus-within:ring-2 ring-secondary rounded-lg border border-custom-border bg-white">
              <input
                placeholder="0x..."
                type="text"
                className="border-none leading-5 font-medium text-sm text-primary rounded-lg focus:outline-none focus:ring-0 block w-full [appearance:textfield]"
                value={anotherWallet}
                onChange={async (e) => await handleChange(e)}
              />
            </div>
            <Alert open={!isAnotherWalletValid}>{invalidReason}</Alert>
          </>
        )}
      </div>

      <div className="flex flex-col w-full text-center pt-4">
        {isCurrentWallet &&
          (account && ready ? (
            <button
              onClick={goToConfirm}
              className="w-full px-4 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 flex gap-x-2 items-center justify-center"
            >
              {t('sameWalletButton')}
            </button>
          ) : (
            <ConnectButton className="w-full px-4 py-2 text-base !text-secondary bg-transparent !rounded-full ring-inset ring-1 ring-secondary enabled:hover:!bg-secondary enabled:hover:!text-white disabled:opacity-70 flex gap-x-2 items-center justify-center border-0" />
          ))}
        {!isCurrentWallet && (
          <button
            disabled={!anotherWalletEnabled}
            onClick={goToConfirm}
            className="w-full px-4 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 flex gap-x-2 items-center justify-center"
          >
            {t('differentWalletButton')}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
