import { ChainSwitcher, ConnectButton } from '@shared/ui-library';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, SetStateAction } from 'react';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import { useMediaQuery } from 'usehooks-ts';
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
  const mqLg = useMediaQuery('(min-width: 1024px)');
  const mqXl = useMediaQuery('(min-width: 1280px)');

  return (
    <header className="flex-shrink-0 sticky z-10 w-full">
      <div className="flex items-center justify-between pr-7 py-5">
        <div className="w-full flex items-center gap-x-3 flex-wrap">
          <button
            type="button"
            className="focus:outline-none p-2 relative z-10 ml-0 sm:-ml-5"
            onClick={() => setOpen(!open)}
          >
            <MenuIcon open={open} />
          </button>
          {mqLg && ready && (
            <h1 className="text-2xl font-bold text-primary w-auto">
              {t(title)}
            </h1>
          )}
          <div className="ml-auto flex gap-x-3 items-center">
            {ready && (
              <>
                <GasPrice />
                <ChainSwitcher
                  allowedChains={['MAINNET', 'FANTOM', 'POLYGON']}
                  showNetworkName={mqXl}
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
