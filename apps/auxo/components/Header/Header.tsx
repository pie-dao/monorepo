import useTranslation from 'next-translate/useTranslation';

import Image, { StaticImageData } from 'next/image';
import ConnectedUserCard from '../ConnectedUserCard/ConnectedUserCard';

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
          <h1 className="hidden sm:flex text-2xl font-semibold text-primary w-auto drop-shadow-md ml-12 lg:ml-0 ">
            {t(title)}
          </h1>
          <div className="ml-auto flex gap-x-3 items-center">
            <ConnectedUserCard />
          </div>
        </div>
      </div>
    </header>
  );
}
