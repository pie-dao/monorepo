import { AnimatePresence } from 'framer-motion';
import ModalBox from './ModalBox';
import { useAppSelector } from '../../hooks';
import { Dialog } from '@headlessui/react';
import useCheckUpgradoorDeployed from '../../hooks/useCheckUpgradoorDeployed';
import SwitchChainModal from './ModalSteps/migration/SwitchChainModal';

export default function ModalMigration() {
  const { isMigrationDeployed } = useAppSelector((state) => state.migration);
  useCheckUpgradoorDeployed();

  return (
    <AnimatePresence initial={false}>
      <Dialog
        as="div"
        className="relative z-30"
        open={typeof isMigrationDeployed === 'boolean' && !isMigrationDeployed}
        onClose={() => null}
      >
        <div className="fixed inset-0 bg-sub-light bg-opacity-90" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 text-center">
            <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:max-w-4xl">
              <ModalBox>
                <SwitchChainModal />
              </ModalBox>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
}
