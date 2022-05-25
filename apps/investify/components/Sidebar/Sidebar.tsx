import { AnimatePresence } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import SidebarBox from './SidebarBox';
import { useAppSelector } from '../../hooks';

export default function Sidebar() {
  const { t } = useTranslation();
  const { step } = useAppSelector((state) => state.sidebar);

  return (
    <aside className="h-screen hidden md:block md:w-2/5 max-w-sm px-4 py-5 pl-0 overflow-hidden relative">
      <div className="h-full bg-white drop-shadow rounded-md p-4">
        <h3 className="font-bold text-xl text-text capitalize w-full border-b-2 border-primary pb-2">
          {t(step)}
        </h3>
        <AnimatePresence initial={false}>
          <div className="flex">
            {step === 'quote' && (
              <SidebarBox key="quote" className="py-4">
                <p className="text-text text-2xl">Tasty test</p>
              </SidebarBox>
            )}
            {step === 'swap' && (
              <SidebarBox key="swap" className="py-4">
                <p className="text-text text-2xl">Very Tasty test</p>
              </SidebarBox>
            )}
          </div>
        </AnimatePresence>
      </div>
    </aside>
  );
}
