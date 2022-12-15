import Heading from '../../../components/Heading/Heading';
import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useEffect, useMemo } from 'react';
import { Layout } from '../../../components';
import { wrapper } from '../../../store';
import MigrationCardOption from '../../../components/MigrationCardOption/MigrationCardOption';
import veAUXOIcon from '../../../public/tokens/veAUXO.svg';
import XAUXOIcon from '../../../public/tokens/xAUXO.svg';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '../../../hooks';
import { ThunkGetVeDOUGHStakingData } from '../../../store/migration/migration.thunks';
import MigrationBanner from '../../../components/MigrationBanner/MigrationBanner';
import { ExclamationIcon } from '@heroicons/react/outline';
import BackBar from '../../../components/BackBar/BackBar';
import MigrationBackground from '../../../components/MigrationBackground/MigrationBackground';

export default function Migration() {
  const { t } = useTranslation('migration');

  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  useEffect(() => {
    if (account) {
      dispatch(ThunkGetVeDOUGHStakingData({ account }));
    }
  }, [account, dispatch]);

  const migrationCardsContent = useMemo(() => {
    return [
      {
        title: t('aggregate', { token: 'veAUXO' }),
        description: t('aggregateDescription'),
        icon: <Image src={veAUXOIcon} alt="veAUXO" width={26} height={26} />,
        features: [
          {
            title: 'rewards',
            description: 'maxPossible',
          },
          {
            title: 'governance',
            description: 'directOnChain',
          },
          {
            title: 'transfer',
            description: 'nonTransferable',
          },
          {
            title: 'lock',
            description: 'userPreference',
          },
          {
            title: 'redemption',
            description: 'atLockExpiration',
          },
          {
            title: 'bonding',
            description: 'guaranteedAtNAV',
          },
          {
            title: 'mintFee',
            description: 'noFee',
          },
          {
            title: 'exit',
            description: 'migrateToXAUXO',
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
        title: t('aggregate', { token: 'xAUXO' }),
        description: t('beLiquid'),
        icon: <Image src={XAUXOIcon} alt="xAUXO" width={26} height={26} />,
        features: [
          {
            title: 'rewards',
            description: 'taxed',
          },
          {
            title: 'governance',
            description: 'noVotingRights',
          },
          {
            title: 'transfer',
            description: 'transferable',
          },
          {
            title: 'lock',
            description: 'forever',
          },
          {
            title: 'redemption',
            description: 'none',
          },
          {
            title: 'bonding',
            description: 'premium',
          },
          {
            title: 'mintFee',
            description: 'yes',
          },
          {
            title: 'exit',
            description: 'none',
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
    <div className="flex flex-col h-screen isolate">
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