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
import UnstakeConfirm from './ModalSteps/UnstakeConfirm';
import UnstakeArv from './ModalSteps/UnstakeArv';
import UnstakeCompleted from './ModalSteps/UnstakeCompleted';

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

  const stepsMap = {
    [STEPS.APPROVE_TOKEN]: <Approve />,
    [STEPS.CONFIRM_STAKE_VEAUXO]: <StakeConfirm />,
    [STEPS.BOOST_STAKE_VEAUXO]: <BoostStakeModal />,
    [STEPS.CONFIRM_CONVERT_XAUXO]: <SwapConfirm />,
    [STEPS.CONFIRM_STAKE_XAUXO]: <StakeXAUXOConfirm />,
    [STEPS.CONFIRM_UNSTAKE_XAUXO]: <StakeXAUXOConfirm action="unstake" />,
    [STEPS.CONFIRM_UNSTAKE_VEAUXO]: <UnstakeConfirm />,
    [STEPS.UNSTAKE_VEAUXO]: <UnstakeArv closeModal={closeModal} />,
    [STEPS.UNSTAKE_VEAUXO_COMPLETED]: <UnstakeCompleted />,
    [STEPS.STAKE_COMPLETED]: <StakeComplete action="stake" />,
    [STEPS.UNSTAKE_COMPLETED]: <StakeComplete action="unstake" />,
    [STEPS.CONVERT_COMPLETED]: <StakeComplete action="convert" />,
  };

  const ComponentToRender = stepsMap[step];

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
          <XIcon
            className="absolute top-4 right-4 w-5 h-5 cursor-pointer"
            onClick={closeModal}
          />
          <div className="flex min-h-full items-center justify-center p-2 text-center">
            <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:max-w-2xl">
              <>
                <ModalBox>
                  {step === STEPS.APPROVE_TOKEN && <Approve />}
                  {step === STEPS.CONFIRM_STAKE_VEAUXO && <StakeConfirm />}
                  {step === STEPS.BOOST_STAKE_VEAUXO && <BoostStakeModal />}
                  {step === STEPS.CONFIRM_CONVERT_XAUXO && <SwapConfirm />}
                  {step === STEPS.CONFIRM_STAKE_XAUXO && <StakeXAUXOConfirm />}
                  {step === STEPS.CONFIRM_UNSTAKE_XAUXO && (
                    <StakeXAUXOConfirm action="unstake" />
                  )}
                  {step === STEPS.CONFIRM_UNSTAKE_VEAUXO && <UnstakeConfirm />}
                  {step === STEPS.UNSTAKE_VEAUXO && (
                    <UnstakeArv closeModal={closeModal} />
                  )}
                  {step === STEPS.UNSTAKE_VEAUXO_COMPLETED && (
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
                  {/* {step === STEPS.EARLY_TERMINATION && <EarlyTermination />}
                  {step === STEPS.CONFIRM_EARLY_TERMINATION && (
                    <EarlyTerminationConfirm />
                  )}
                  {step === STEPS.EARLY_TERMINATION_COMPLETED && (
                    <EarlyTerminationCompleted />
                  )} */}
                </ModalBox>
              </>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
}
