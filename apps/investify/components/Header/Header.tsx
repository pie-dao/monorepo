import { ChainSwitcher, ConnectButton } from '@shared/ui-library';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, SetStateAction } from 'react';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import useMediaQuery from '../../hooks/useMediaQuery';
import GasPrice from '../GasPrice/GasPrice';
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
  const mq = useMediaQuery('(min-width: 1024px)');

  return (
    <header className="flex-shrink-0 sticky">
      <div className="flex items-center justify-between pr-4 py-5">
        <div className="w-full flex items-center gap-x-3 flex-wrap">
          <button
            type="button"
            className="focus:outline-none p-2 relative z-10"
            onClick={() => setOpen(!open)}
          >
            <MenuIcon open={open} />
          </button>
          {mq && ready && (
            <h1 className="text-2xl font-bold main-title w-auto">{t(title)}</h1>
          )}
          <div className="ml-auto flex gap-x-3 items-center">
            {ready && (
              <>
                <GasPrice />
                <ChainSwitcher
                  allowedChains={['MAINNET', 'FANTOM', 'POLYGON']}
                />
                <ConnectButton />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
