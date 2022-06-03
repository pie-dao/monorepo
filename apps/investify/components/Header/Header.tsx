import { ConnectButton } from '@shared/ui-library';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, SetStateAction } from 'react';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import MenuIcon from './MenuIcon';

export default function Header({
  open,
  setOpen,
  title,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
}) {
  const { t } = useTranslation();
  const ready = useServerHandoffComplete();

  return (
    <header className="flex-shrink-0">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="focus:outline-none p-2"
            onClick={() => setOpen(!open)}
          >
            <MenuIcon open={open} />
          </button>
          <h1 className="text-2xl font-bold text-text">{t(title)}</h1>
          {ready && <ConnectButton />}
        </div>
      </div>
    </header>
  );
}
