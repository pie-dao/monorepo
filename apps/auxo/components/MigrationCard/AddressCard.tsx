import useTranslation from 'next-translate/useTranslation';
import { useWeb3React } from '@web3-react/core';
import trimAccount from '../../utils/trimAccount';
import { useCallback, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import {
  useStakingTokenContract,
  useVeDOUGHStakingContract,
} from '../../hooks/useContracts';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Alert } from '../Alerts/Alerts';
import {
  setCurrentStep,
  setDestinationWallet,
  setPreviousStep,
} from '../../store/migration/migration.slice';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import { ConnectButton } from '@shared/ui-library';
import { CheckIcon, ExclamationIcon } from '@heroicons/react/outline';
import Banner from '../Banner/Banner';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Label from '@radix-ui/react-label';
import classNames from '../../utils/classnames';

type Props = {
  isCurrentWallet: boolean;
  token?: 'veAUXO' | 'xAUXO';
};

const AddressCard: React.FC<Props> = ({ isCurrentWallet, token }) => {
  const ready = useServerHandoffComplete();
  const { currentStep } = useAppSelector((state) => state.migration);
  const [anotherWallet, setAnotherWallet] = useState<string>('');
  const [isAnotherWalletValid, setIsAnotherWalletValid] =
    useState<boolean>(true);
  const [invalidReason, setInvalidReason] = useState<string>('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const { t } = useTranslation('migration');
  const { account } = useWeb3React();
  const tokenLocker = useStakingTokenContract('veAUXO');
  const eDOUGHTokenLocker = useVeDOUGHStakingContract();
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
          const hasVeDOUGH = await eDOUGHTokenLocker.getLocksOfLength(
            e.target.value,
          );

          if (hasLock) {
            handleInvalidAddress({
              isValid: false,
              reason: t('alreadyLocked'),
            });
          } else if (!hasVeDOUGH.isZero()) {
            handleInvalidAddress({
              isValid: false,
              reason: t('alreadyLockedVeDOUGH'),
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
    [account, eDOUGHTokenLocker, t, tokenLocker],
  );

  const anotherWalletEnabled = useMemo(() => {
    return ethers.utils.isAddress(anotherWallet);
  }, [anotherWallet]);

  const checkForTerms = useMemo(() => {
    if (token === 'veAUXO') {
      return isTermsAccepted;
    } else {
      return true;
    }
  }, [isTermsAccepted, token]);

  return (
    <div className="flex flex-col px-4 py-4 rounded-md bg-gradient-primary shadow-md bg gap-y-3 items-center w-full font-medium align-middle transition-all mx-auto">
      <div className="flex flex-col items-center w-full border-hidden gap-y-1">
        <h3 className="text-lg font-medium text-secondary">
          {isCurrentWallet ? t('sameWallet') : t('differentWallet')}
        </h3>
      </div>
      <div className="flex w-full flex-col pt-4 text-center gap-y-2 pb-1">
        {isCurrentWallet ? (
          <>
            <div className="flex items-center gap-x-2 p-2 bg-light-gray shadow-md text-sub-dark rounded-sm text-base">
              {t('sameWalletAddress')}
            </div>
            <div className="flex items-center gap-x-2 p-2 text-primary leading-5 text-sm">
              {account ? trimAccount(account, true) : t('walletNotConnected')}
            </div>
            {token === 'veAUXO' && (
              <>
                <div className="text-left pt-2 border-t border-customBorder mt-2 text-white">
                  <Banner
                    bgColor="bg-red"
                    textColor="text-white"
                    content={t('veAUXOWarning')}
                    icon={
                      <ExclamationIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    }
                  />
                </div>
                <div className="flex items-center w-full p-2">
                  <Checkbox.Root
                    id="c1"
                    checked={isTermsAccepted}
                    onCheckedChange={() => setIsTermsAccepted(!isTermsAccepted)}
                    className={classNames(
                      'flex h-4 w-4 items-center justify-center rounded-sm pointer',
                      'radix-state-checked:bg-secondary radix-state-unchecked:bg-light-gray ring-2 ring-offset-2 ring-secondary',
                      'focus:outline-none focus-visible:ring focus-visible:ring-opacity-75',
                    )}
                  >
                    <Checkbox.Indicator>
                      <CheckIcon className="h-4 w-4 self-center text-white" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <Label.Label
                    htmlFor="c1"
                    className="ml-3 select-none text-sm font-medium text-primary cursor-pointer"
                  >
                    {t('termsOfAddress')}
                  </Label.Label>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-x-2 p-2 bg-light-gray shadow-md text-sub-dark rounded-sm text-base">
              {t('differentWalletAddress')}
            </div>
            <div className="flex flex-col items-start focus-within:ring-2 ring-secondary rounded-lg border border-custom-border bg-white">
              <input
                placeholder="0x..."
                type="text"
                className="bg-white shadow-md border-none leading-5 font-medium text-sm text-primary rounded-lg focus:outline-none focus:ring-0 block w-full [appearance:textfield]"
                value={anotherWallet}
                onChange={async (e) => await handleChange(e)}
              />
            </div>
            <Alert open={!isAnotherWalletValid}>{invalidReason}</Alert>
            <Banner
              bgColor="bg-warning"
              content={t('smartContractAddressNotAllowed')}
              icon={
                <ExclamationIcon
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
              }
            />
          </>
        )}
      </div>
      <div className="flex flex-col w-full text-center pt-4 mt-auto">
        {isCurrentWallet &&
          (account && ready ? (
            <button
              disabled={!checkForTerms}
              onClick={goToConfirm}
              className="w-full px-4 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 disabled:text-sub-light disabled:ring-sub-light flex gap-x-2 items-center justify-center"
            >
              {t('sameWalletButton')}
            </button>
          ) : (
            <ConnectButton className="w-full px-4 py-2 text-base !text-secondary bg-transparent !rounded-full ring-inset ring-1 ring-secondary enabled:hover:!bg-secondary enabled:hover:!text-white disabled:opacity-70 flex gap-x-2 items-center justify-center border-0" />
          ))}
        {!isCurrentWallet && (
          <button
            disabled={!anotherWalletEnabled || !isAnotherWalletValid}
            onClick={goToConfirm}
            className="w-full px-4 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 disabled:text-sub-light disabled:ring-sub-light flex gap-x-2 items-center justify-center"
          >
            {t('differentWalletButton')}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
