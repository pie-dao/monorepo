import { AnimatePresence } from 'framer-motion';
import ModalBox from './ModalBox';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Dialog } from '@headlessui/react';
import { STEPS } from '../../store/modal/modal.types';
import { initialState, setState } from '../../store/modal/modal.slice';
import StakeComplete from './ModalSteps/StakeComplete';
import StakeConfirm from './ModalSteps/StakeConfirm';
import SwapConfirm from './ModalSteps/xAUXO/SwapConfirm';
import StakeXAUXOConfirm from './ModalSteps/xAUXO/StakeConfirm';
import { XIcon } from '@heroicons/react/solid';
import BoostStakeModal from './ModalSteps/BoostStakeModal';
import Approve from './ModalSteps/Approve';
import UnstakeConfirm from './ModalSteps/UnstakeConfirm';
import UnstakeArv from './ModalSteps/UnstakeArv';
import UnstakeCompleted from './ModalSteps/UnstakeCompleted';
import EarlyTermination from './ModalSteps/EarlyTermination/EarlyTermination';
import EarlyTerminationComplete from './ModalSteps/EarlyTermination/EarlyTerminationComplete';
import WithdrawPrv from './ModalSteps/xAUXO/WithdrawPrv';
import WithdrawPrvCompleted from './ModalSteps/xAUXO/WithdrawPrvCompleted';

export default function ModalManager() {
  const { step, isOpen } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const closeModal = () => {
    dispatch(setState(initialState));
  };

  return (
    <AnimatePresence initial={false}>
      <Dialog
        as="div"
        className="relative z-30"
        onClose={closeModal}
        open={isOpen}
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
                  {step === STEPS.APPROVE_TOKEN && <Approve />}
                  {step === STEPS.CONFIRM_STAKE_ARV && <StakeConfirm />}
                  {step === STEPS.BOOST_STAKE_ARV && <BoostStakeModal />}
                  {step === STEPS.CONFIRM_CONVERT_PRV && <SwapConfirm />}
                  {step === STEPS.CONFIRM_STAKE_PRV && <StakeXAUXOConfirm />}
                  {step === STEPS.CONFIRM_UNSTAKE_PRV && (
                    <StakeXAUXOConfirm action="unstake" />
                  )}
                  {step === STEPS.CONFIRM_WITHDRAW_ARV && <UnstakeConfirm />}
                  {step === STEPS.WITHDRAW_ARV && (
                    <UnstakeArv closeModal={closeModal} />
                  )}
                  {step === STEPS.WITHDRAW_ARV_COMPLETED && (
                    <UnstakeCompleted />
                  )}
                  {step === STEPS.STAKE_COMPLETED && (
                    <StakeComplete action="stake" />
                  )}
                  {step === STEPS.UNSTAKE_COMPLETED && (
                    <StakeComplete action="unstake" />
                  )}
                  {step === STEPS.CONVERT_COMPLETED && (
                    <StakeComplete action="convert" />
                  )}
                  {step === STEPS.EARLY_TERMINATION && <EarlyTermination />}
                  {step === STEPS.EARLY_TERMINATION_COMPLETED && (
                    <EarlyTerminationComplete />
                  )}
                  {step === STEPS.WITHDRAW_PRV && <WithdrawPrv />}
                  {step === STEPS.WITHDRAW_PRV_COMPLETED && (
                    <WithdrawPrvCompleted />
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
