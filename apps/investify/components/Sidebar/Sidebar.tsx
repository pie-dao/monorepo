import { Dialog } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOpenModal } from '../../store/sidebar/sidebar.slice';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import SidebarContent from './SidebarContent';

export default function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const { modalOpen } = useAppSelector((state) => state.sidebar);
  const dispatch = useAppDispatch();
  const ready = useServerHandoffComplete();

  if (!ready) return null;

  return !isDesktop && modalOpen ? (
    <Dialog
      open={true}
      onClose={() => {
        dispatch(setOpenModal(false));
      }}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
        <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm" />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="w-screen bg-white drop-shadow rounded-t-md p-4">
          <SidebarContent />
        </div>
      </div>
    </Dialog>
  ) : (
    <aside className="h-screen hidden sm:block sm:w-64 md:w-2/5 max-w-sm px-4 py-5 pl-0 overflow-hidden relative">
      <div className="h-full bg-white drop-shadow rounded-md p-4 w-full">
        <SidebarContent />
      </div>
    </aside>
  );
}
