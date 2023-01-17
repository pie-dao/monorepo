import { AnimatePresence } from 'framer-motion';
import ModalBox from './ModalBox';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Dialog } from '@headlessui/react';
import { STEPS } from '../../store/modal/modal.types';
import { setIsOpen, setTx } from '../../store/modal/modal.slice';
import StakeComplete from './ModalSteps/StakeComplete';
import StakeConfirm from './ModalSteps/StakeConfirm';
import SwapConfirm from './ModalSteps/xAUXO/SwapConfirm';
import StakeXAUXOConfirm from './ModalSteps/xAUXO/StakeConfirm';
import { XIcon } from '@heroicons/react/solid';
import BoostStakeModal from './ModalSteps/BoostStakeModal';
import Approve from './ModalSteps/Approve';

export default function ModalManager() {
  const { step, isOpen } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(setIsOpen(false));
    dispatch(
      setTx({
        hash: '',
        status: null,
      }),
    );
  };

  return (
    <AnimatePresence initial={false}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={closeModal}
        open={isOpen}
      >
        <div className="fixed inset-0 bg-sub-light bg-opacity-90" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 text-center">
            <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:max-w-2xl">
              <>
                <XIcon
                  className="absolute top-4 right-4 w-5 h-5 cursor-pointer"
                  onClick={closeModal}
                />
                <ModalBox>
                  {step === STEPS.APPROVE_TOKEN && <Approve />}
                  {step === STEPS.CONFIRM_STAKE_VEAUXO && <StakeConfirm />}
                  {step === STEPS.BOOST_STAKE_VEAUXO && <BoostStakeModal />}
                  {step === STEPS.CONFIRM_CONVERT_XAUXO && <SwapConfirm />}
                  {step === STEPS.CONFIRM_STAKE_XAUXO && <StakeXAUXOConfirm />}
                  {step === STEPS.CONFIRM_UNSTAKE_XAUXO && (
                    <StakeXAUXOConfirm action="unstake" />
                  )}
                  {step === STEPS.STAKE_COMPLETED && <StakeComplete />}
                </ModalBox>
              </>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
}
