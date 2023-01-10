import Heading from '../../../components/Heading/Heading';
import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useEffect, useMemo } from 'react';
import { Layout } from '../../../components';
import { wrapper } from '../../../store';
import MigrationCardOption from '../../../components/MigrationCardOption/MigrationCardOption';
import veAUXOIcon from '../../../public/tokens/32x32/veAUXO.svg';
import XAUXOIcon from '../../../public/tokens/32x32/xAUXO.svg';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '../../../hooks';
import { ThunkGetVeDOUGHStakingData } from '../../../store/migration/migration.thunks';
import MigrationBanner from '../../../components/MigrationBanner/MigrationBanner';
import { ExclamationIcon } from '@heroicons/react/outline';
import BackBar from '../../../components/BackBar/BackBar';
import MigrationBackground from '../../../components/MigrationBackground/MigrationBackground';
import { setCleanupFlow } from '../../../store/migration/migration.slice';
import { useUpgradoor } from '../../../hooks/useContracts';
import MigrationFAQ from '../../../components/MigrationFAQ/MigrationFAQ';

export default function Migration() {
  const { t } = useTranslation('migration');

  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const upgradoor = useUpgradoor();

  useEffect(() => {
    dispatch(setCleanupFlow());
  }, [dispatch]);

  useEffect(() => {
    if (account && upgradoor) {
      dispatch(ThunkGetVeDOUGHStakingData({ account, upgradoor }));
    }
  }, [account, dispatch, upgradoor]);

  const migrationCardsContent = useMemo(() => {
    return [
      {
        token: 'veAUXO',
        title: t('aggregate', { token: 'veAUXO' }),
        description: t('aggregateDescription'),
        icon: <Image src={veAUXOIcon} alt="veAUXO" width={26} height={26} />,
        features: [
          {
            title: 'rewards',
            description: t('maxPossible'),
          },
          {
            title: 'governance',
            description: t('directOnChain'),
          },
          {
            title: 'transfer',
            description: t('nonTransferable'),
          },
          {
            title: 'lock',
            description: t('userPreference'),
          },
          {
            title: 'redemption',
            description: t('atLockExpiration'),
          },
          {
            title: 'bonding',
            description: t('guaranteedAtNAV'),
          },
          {
            title: 'mintFee',
            description: t('noFee'),
          },
          {
            title: 'exit',
            description: t('migrateToXAUXO'),
          },
        ],
        button: {
          text: t('upgradeTo', { token: 'veAUXO' }),
          url: '/migration/veAUXO',
        },
        banners: [
          {
            content: t('veAUXOConversionBanner'),
            bgColor: 'bg-info',
          },
          {
            icon: (
              <ExclamationIcon
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            ),
            content: t('veAUXODisclaimerBanner'),
            bgColor: 'bg-warning',
          },
        ],
      },
      {
        token: 'xAUXO',
        title: t('aggregate', { token: 'xAUXO' }),
        description: t('beLiquid'),
        icon: <Image src={XAUXOIcon} alt="xAUXO" width={26} height={26} />,
        features: [
          {
            title: 'rewards',
            description: <a href="#taxed">{t('taxed')}</a>,
          },
          {
            title: 'governance',
            description: t('noVotingRights'),
          },
          {
            title: 'transfer',
            description: t('transferable'),
          },
          {
            title: 'lock',
            description: t('forever'),
          },
          {
            title: 'redemption',
            description: t('none'),
          },
          {
            title: 'bonding',
            description: t('premium'),
          },
          {
            title: 'mintFee',
            description: t('yes'),
          },
          {
            title: 'exit',
            description: t('none'),
          },
        ],
        button: {
          text: t('upgradeTo', { token: 'xAUXO' }),
          url: '/migration/xAUXO',
        },
        banners: [
          {
            content: t('xAUXOConversionBanner'),
            bgColor: 'bg-info',
          },
          {
            icon: (
              <ExclamationIcon
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            ),
            content: t('xAUXODisclaimerBanner'),
            bgColor: 'bg-warning',
          },
        ],
      },
    ];
  }, [t]);

  return (
    <div className="flex flex-col isolate relative">
      <MigrationBackground />
      <MigrationBanner />
      <Heading
        title={t('timeToMigrate')}
        subtitle={t('timeToMigrateArrived')}
      />
      <BackBar title={t('selectToken')} singleCard={true}>
        <section className="grid grid-cols-1 xl:grid-flow-col xl:auto-cols-fr gap-4 text-xs md:text-inherit mt-6">
          {migrationCardsContent.map((card) => (
            <MigrationCardOption key={card.title} {...card} />
          ))}
        </section>
      </BackBar>
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
    },
  };
});
