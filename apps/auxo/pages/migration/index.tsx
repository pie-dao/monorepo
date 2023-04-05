import Heading from '../../components/Heading/Heading';
import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useEffect } from 'react';
import { Layout } from '../../components';
import { wrapper } from '../../store';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ThunkGetVeDOUGHStakingData } from '../../store/migration/migration.thunks';
import MigrationBanner from '../../components/MigrationBanner/MigrationBanner';
import AuxoToArvPrv from '../../public/images/migration/AuxoToArvPrv.svg';
import DoughToAuxo from '../../public/images/migration/DoughToAuxo.svg';
import VeDoughToDough from '../../public/images/migration/veDoughToDough.svg';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/solid';
import MigrationBackground from '../../components/MigrationBackground/MigrationBackground';
import MigrationFAQ from '../../components/MigrationFAQ/MigrationFAQ';
import DOUGHIcon from '../../public/tokens/DOUGH.png';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

export default function Migration() {
  const { t } = useTranslation('migration');
  const { isMigrationDeployed } = useAppSelector((state) => state.migration);

  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  useEffect(() => {
    if (account) {
      dispatch(ThunkGetVeDOUGHStakingData({ account }));
    }
  }, [account, dispatch]);

  const lifecycleColumns = [
    {
      icon: <Image src={VeDoughToDough} alt="veDOUGHtoDOUGH" />,
      title: t('veDOUGHtoDOUGH'),
    },
    {
      icon: <Image src={DoughToAuxo} alt="DOUGHtoAUXO" />,
      title: t('DOUGHtoAUXO'),
    },
    {
      icon: <Image src={AuxoToArvPrv} alt="AuxoToArvPrv" />,
      title: t('AUXOtoArvPrv'),
    },
  ];

  return (
    <div className="flex flex-col isolate relative">
      <MigrationBackground />
      <MigrationBanner />
      <Heading title={t('timeToMigrate')} subtitle="timeToMigrateArrived" />
      <div className="max-w-5xl mx-auto shadow-sm rounded-lg w-full overflow-hidden mb-8">
        <LiteYouTubeEmbed
          id="NLQhfWcohDQ"
          title="Migration Video"
          aspectHeight={9}
          aspectWidth={16}
        />
      </div>
      <div className="bg-white px-4 py-5 sm:px-6 max-w-5xl mx-auto shadow-sm rounded-lg w-full">
        <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
          <h3 className="w-full text-2xl font-semibold text-primary text-center">
            {t('lifecycle')}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-custom-border">
          {lifecycleColumns.map((column, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center justify-center rounded-full max-w-[140px] mx-auto">
                {column.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-primary text-center">
                {column.title}
              </h3>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center mt-12">
          <Link href="/migration/start" passHref>
            <button
              disabled={!isMigrationDeployed}
              className="w-fit flex items-center gap-x-2 px-12 py-2 text-base font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent hover:text-secondary disabled:opacity-70 disabled:text-sub-light disabled:ring-sub-light disabled:bg-transparent"
            >
              {t('startMigration')}
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
      <MigrationFAQ />
    </div>
  );
}

Migration.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  return {
    props: {
      title: 'migration',
      icon: {
        src: DOUGHIcon,
        alt: 'DOUGH',
        width: 32,
        height: 32,
      },
    },
  };
});
