import { ChainSwitcher, ConnectButton } from '@shared/ui-library';
import useTranslation from 'next-translate/useTranslation';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import { useMediaQuery } from 'usehooks-ts';
import GasPrice from '../GasPrice/GasPrice';

export default function Header({ title }: { title: string }) {
  const { t } = useTranslation();
  const ready = useServerHandoffComplete();
  const mqXl = useMediaQuery('(min-width: 1280px)');

  return (
    <header className="flex-shrink-0 z-10 w-full px-7">
      <div className="flex items-center justify-between py-5">
        <div className="w-full flex items-center gap-x-3 flex-wrap">
          <h1 className="hidden sm:flex text-2xl font-semibold text-primary w-auto">
            {t(title)}
          </h1>
          <div className="ml-auto flex gap-x-3 items-center">
            {ready && (
              <>
                <GasPrice />
                <ChainSwitcher
                  allowedChains={['MAINNET', 'FANTOM', 'POLYGON', 'GOERLI']}
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
