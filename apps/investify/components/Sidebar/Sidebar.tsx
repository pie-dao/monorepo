import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../hooks';

export default function Sidebar() {
  const { t } = useTranslation();
  const { step } = useAppSelector((state) => state.sidebar);

  return (
    <aside className="h-screen hidden md:block md:w-2/5 lg:w-1/4 p-6 overflow-hidden">
      <div className="h-full bg-white drop-shadow-md rounded-md p-4">
        <h3 className="font-bold text-xl text-text capitalize w-full border-b-2 border-primary pb-2">
          {t(step)}
        </h3>
      </div>
    </aside>
  );
}
