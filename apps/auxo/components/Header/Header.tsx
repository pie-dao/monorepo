import { ChainSwitcher, ConnectButton } from '@shared/ui-library';
import useTranslation from 'next-translate/useTranslation';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import { useMediaQuery } from 'usehooks-ts';
import GasPrice from '../GasPrice/GasPrice';
import Image, { StaticImageData } from 'next/image';

type HeaderProps = {
  title: string;
  icon?: {
    src: StaticImageData;
    alt: string;
    width: number;
    height: number;
  };
};

export default function Header({ title, icon }: HeaderProps) {
  const { t } = useTranslation();
  const ready = useServerHandoffComplete();
  const mqXl = useMediaQuery('(min-width: 1280px)');

  return (
    <header className="flex-shrink-0 z-10 w-full">
      <div className="flex items-center justify-between py-5">
        <div className="w-full flex items-center gap-x-3 flex-wrap">
          {icon && (
            <div className="flex flex-shrink-0 self-center">
              <Image
                src={icon.src}
                alt={icon.alt}
                width={icon.width}
                height={icon.height}
              />
            </div>
          )}
          <h1 className="hidden sm:flex text-2xl font-semibold text-primary w-auto drop-shadow-md">
            {t(title)}
          </h1>
          <div className="ml-auto flex gap-x-3 items-center">
            {ready && (
              <>
                <GasPrice />
                <ChainSwitcher
                  allowedChains={['MAINNET']}
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
