import { AnimatePresence } from 'framer-motion';
import SidebarBox from './SidebarBox';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../hooks';

export default function SidebarContent() {
  const { t } = useTranslation();
  const { step } = useAppSelector((state) => state.sidebar);
  return (
    <>
      <h3 className="font-medium text-left text-xl text-text capitalize w-full border-b-2 border-primary pb-2">
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
    </>
  );
}
