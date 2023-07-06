import useTranslation from 'next-translate/useTranslation';
import { useCallback, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import {
  useStakingTokenContract,
  useUpgradoor,
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

import { CheckIcon, ExclamationIcon } from '@heroicons/react/outline';
import Banner from '../Banner/Banner';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Label from '@radix-ui/react-label';
import classNames from '../../utils/classnames';
import { useConnectWallet } from '@web3-onboard/react';

type Props = {
  isCurrentWallet: boolean;
  token?: 'ARV' | 'PRV';
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
  const [{ wallet }, connect] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const tokenLocker = useStakingTokenContract('ARV');
  const upgradoor = useUpgradoor();
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
      if (
        !isAddress ||
        e.target.value.toLowerCase() ===
          ethers.constants.AddressZero.toLowerCase()
      ) {
        handleInvalidAddress({
          isValid: false,
          reason: t('invalidAddress'),
        });
        return;
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
            return;
          } else if (!hasVeDOUGH.isZero()) {
            handleInvalidAddress({
              isValid: false,
              reason: t('alreadyLockedVeDOUGH'),
            });
            return;
          } else {
            handleInvalidAddress({
              isValid: true,
              reason: '',
            });
            return;
          }
        } catch (error) {
          console.error(error);
        }

        try {
          await upgradoor.callStatic.upgradeSingleLockARV(e.target.value);
        } catch (error) {
          if (error.reason === 'Invalid receiver') {
            handleInvalidAddress({
              isValid: false,
              reason: t('notEOAorWL'),
            });
            console.debug('Address is not EOA or not whitelisted');
          } else {
            console.error(error);
          }
        }
      }
    },
    [account, eDOUGHTokenLocker, t, tokenLocker, upgradoor],
  );

  const anotherWalletEnabled = useMemo(() => {
    return ethers.utils.isAddress(anotherWallet);
  }, [anotherWallet]);

  const checkForTerms = useMemo(() => {
    if (token === 'ARV') {
      return isTermsAccepted;
    } else {
      return true;
    }
  }, [isTermsAccepted, token]);

  return (
    <div className="flex flex-col px-4 py-4 rounded-md bg-gradient-primary shadow-sm bg gap-y-3 items-center w-full font-medium align-middle transition-all mx-auto max-w-2xl">
      <div className="flex flex-col items-center w-full border-hidden gap-y-1">
        <h3 className="text-lg font-semibold text-secondary">
          {isCurrentWallet ? t('sameWallet') : t('differentWallet')}
        </h3>
      </div>
      <div className="flex w-full flex-col text-center border-t border-custom-border pt-2">
        {isCurrentWallet ? (
          <>
            <div className="flex items-center gap-x-2 p-2 text-sub-dark rounded-sm text-base font-medium">
              {t('sameWalletAddress')}
            </div>
            <div className="flex items-center gap-x-2 p-2 text-primary leading-5 font-medium text-sm mb-[2px]">
              {account ?? t('walletNotConnected')}
            </div>
            {token === 'ARV' && (
              <>
                <div className="text-left pt-4 border-t border-custom-border mt-4 text-white">
                  <Banner
                    bgColor="bg-red"
                    textColor="text-white"
                    content={t('ARVWarning')}
                    icon={
                      <ExclamationIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    }
                  />
                </div>
                <div className="flex items-center w-full px-2 pt-4">
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
            <div className="flex items-center gap-x-2 p-2 text-sub-dark rounded-sm text-base font-medium">
              {t('differentWalletAddress')}
            </div>
            <div className="flex flex-col items-start focus-within:ring-2 ring-secondary rounded-lg border border-custom-border bg-white">
              <input
                placeholder="0x..."
                type="text"
                className="bg-white shadow-sm border-none leading-5 font-medium text-sm text-primary rounded-lg focus:outline-none focus:ring-0 block w-full [appearance:textfield]"
                value={anotherWallet}
                onChange={async (e) => await handleChange(e)}
              />
            </div>
            <div
              className={classNames(
                'flex w-full flex-col gap-y-2 mt-4 pt-4 border-t border-custom-border',
              )}
            >
              <Alert style="error" open={!isAnotherWalletValid}>
                {invalidReason}
              </Alert>
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
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col w-full text-center mt-auto">
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
            <button
              onClick={() => connect()}
              className="w-fit px-10 md:px-20 py-2 text-sm md:text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
            >
              {t('connectWallet')}
            </button>
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
