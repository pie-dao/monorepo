import { AnimatePresence } from 'framer-motion';
import ModalBox from '../ModalBox';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Dialog } from '@headlessui/react';
import { STEPS } from '../../../store/rewards/rewards.types';
import {
  setClaimFlowOpen,
  setClaimToken,
  setTx,
  setClaim,
} from '../../../store/rewards/rewards.slice';
import { XIcon } from '@heroicons/react/solid';
import ListRewards from './ListRewards';
import ClaimRewards from './ClaimRewards';
import ClaimMultiRewards from './ClaimMultiRewards';
import ClaimAllRewards from './ClaimAllRewards';
import CompoundRewards from './CompoundRewards';
import CompoundSuccess from './CompoundSuccess';

export default function RewardsModalManager() {
  const { open, step } = useAppSelector((state) => state.rewards.claimFlow);
  const dispatch = useAppDispatch();
  const closeModal = () => {
    dispatch(setClaim(null));
    dispatch(setClaimFlowOpen(false));
    dispatch(setClaimToken(null));
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
                  {step === STEPS.LIST_REWARDS && <ListRewards />}
                  {step === STEPS.CLAIM_REWARDS && <ClaimRewards />}
                  {step === STEPS.CLAIM_MULTI_REWARDS && <ClaimMultiRewards />}
                  {step === STEPS.CLAIM_ALL_REWARDS && <ClaimAllRewards />}
                  {step === STEPS.COMPOUND_REWARDS && <CompoundRewards />}
                  {step === STEPS.COMPOUND_COMPLETED && <CompoundSuccess />}
                </ModalBox>
              </>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
}
