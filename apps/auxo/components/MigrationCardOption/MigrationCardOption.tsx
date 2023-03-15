import { ConnectButton } from '@shared/ui-library';
import { useWeb3React } from '@web3-react/core';
import classNames from '../../utils/classnames';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useMemo } from 'react';
import { useAppSelector } from '../../hooks';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import Banner from '../Banner/Banner';
import { isEmpty } from 'lodash';

type Props = {
  token: string;
  title: string;
  icon: React.ReactNode;
  features: {
    title: string | React.ReactNode;
    description: string;
  }[];
  button: {
    text: string;
    url: string;
  };
  banners: {
    icon?: React.ReactNode;
    content: string;
    bgColor?: string;
  }[];
};

const MigrationCardOption: React.FC<Props> = ({
  token,
  title,
  icon,
  features,
  button,
  banners,
}) => {
  const { t } = useTranslation('migration');
  const { account } = useWeb3React();
  const ready = useServerHandoffComplete();
  const { positions } = useAppSelector((state) => state.migration);
  const memoizedPositions = useMemo(() => {
    if (isEmpty(positions)) return [];
    return positions?.filter((position) => position?.lockDuration !== 0) ?? [];
  }, [positions]);

  return (
    <div className="flex flex-col px-4 py-4 rounded-md shadow-md gap-y-3 items-start w-full font-medium transition-all mx-auto max-w-5xl bg-left bg-no-repeat">
      <div className="flex gap-x-2 items-center">
        <div className="flex">{icon}</div>
        <h3 className="text-2xl font-bold text-primary">{token}</h3>
      </div>
      <div className="flex flex-col items-center w-full border-hidden">
        <h3 className="text-base font-medium text-primary">{title}</h3>
      </div>
      <div className="flex w-full gap-x-4 items-center">
        <p className="text-secondary text-base">{t('topFeatures')}</p>
        <hr className="flex-grow border-t border-custom-border" />
      </div>
      <div className="flex w-full flex-col @container gap-y-1">
        {features.map(({ title, description }, i) => (
          <div
            className="flex justify-between text-base w-full flex-col @md:flex-row text-left"
            key={i}
          >
            <dt className="text-primary flex-shrink-0">{title}</dt>
            <dd className="text-secondary font-bold">{t(description)}</dd>
          </div>
        ))}
      </div>
      <div className="flex flex-col w-full pt-4 gap-y-2 mt-auto border-t border-sub-link">
        {banners.map((props, i) => (
          <Banner {...props} key={i} />
        ))}
      </div>
      <div className="flex flex-col w-full text-center pt-2">
        {account && ready ? (
          <Link href={button.url} passHref>
            <button
              disabled={memoizedPositions.length === 0}
              className="w-full px-4 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 disabled:text-sub-light disabled:ring-sub-light flex gap-x-2 items-center justify-center"
            >
              {memoizedPositions.length === 0
                ? t('nothingToMigrate')
                : button.text}
            </button>
          </Link>
        ) : (
          <ConnectButton className="w-full px-4 py-2 text-base !text-secondary bg-transparent !rounded-full ring-inset ring-1 ring-secondary enabled:hover:!bg-secondary enabled:hover:!text-white disabled:opacity-70 flex gap-x-2 items-center justify-center border-0" />
        )}
      </div>
    </div>
  );
};

export default MigrationCardOption;
