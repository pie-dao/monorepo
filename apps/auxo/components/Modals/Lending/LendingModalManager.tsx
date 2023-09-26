import { AnimatePresence } from 'framer-motion';
import ModalBox from '../ModalBox';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Dialog } from '@headlessui/react';
import { STEPS } from '../../../store/lending/lending.types';
import {
  initialState,
  setFlowState,
} from '../../../store/lending/lending.slice';
import { XIcon } from '@heroicons/react/solid';
import LendDeposit from './LendDeposit';
import ApproveLendToken from './ApproveLendToken';
import LendClaimRewards from './LendRewardsClaim';
import Unlend from './Unlend';
import WithdrawRequest from './WithdrawRequest';
import LendingSuccess from './LendingSuccess';
import WithdrawConfirm from './WIthdrawConfirm';
import ChangePreference from './ChangePreference';

export default function LendingModalManager() {
  const { open, step } = useAppSelector((state) => state.lending.lendingFlow);
  const dispatch = useAppDispatch();
  const closeModal = () => {
    dispatch(setFlowState(initialState.lendingFlow));
  };

  return (
    <AnimatePresence initial={false}>
      <Dialog
        as="div"
        className="relative z-30"
        onClose={closeModal}
        open={open}
      >
        <div className="fixed inset-0 bg-sub-light bg-opacity-90" />
        <div className="fixed inset-0 overflow-y-auto">
          <XIcon
            className="absolute top-4 right-4 w-5 h-5 cursor-pointer"
            onClick={closeModal}
          />
          <div className="flex min-h-full items-center justify-center p-2 text-center">
            <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:max-w-2xl">
              <>
                <ModalBox>
                  {step === STEPS.APPROVE_LEND && <ApproveLendToken />}
                  {step === STEPS.LEND_DEPOSIT && <LendDeposit />}
                  {step === STEPS.LEND_DEPOSIT_COMPLETED && (
                    <LendingSuccess action="deposit" />
                  )}
                  {step === STEPS.LEND_REWARDS_CLAIM && <LendClaimRewards />}
                  {step === STEPS.CHANGE_PREFERENCE && <ChangePreference />}
                  {step === STEPS.CHANGE_PREFERENCE_COMPLETED && (
                    <LendingSuccess action={'changePreference'} />
                  )}
                  {step === STEPS.UNLEND && <Unlend />}
                  {step === STEPS.WITHDRAW_REQUEST && <WithdrawRequest />}
                  {step === STEPS.WITHDRAW_CONFIRM && <WithdrawConfirm />}
                  {step === STEPS.WITHDRAW_REQUEST_COMPLETED && (
                    <LendingSuccess action={'withdrawRequest'} />
                  )}
                  {step === STEPS.UNLEND_COMPLETED && (
                    <LendingSuccess action={'unlend'} />
                  )}
                  {step === STEPS.LEND_REWARDS_CLAIM_COMPLETED && (
                    <LendingSuccess action={'claim'} />
                  )}

                  {step === STEPS.WITHDRAW_CONFIRM_COMPLETED && (
                    <LendingSuccess action={'withdrawConfirm'} />
                  )}
                </ModalBox>
              </>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
}
