import Heading from '../../components/Heading/Heading';
import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useMemo } from 'react';
import { Layout } from '../../components';
import { wrapper } from '../../store';
import MigrationCardOption from '../../components/MigrationCardOption/MigrationCardOption';
import veAUXOIcon from '../../public/tokens/veAUXO.svg';
import XAUXOIcon from '../../public/tokens/xAUXO.svg';
import Image from 'next/image';

export default function Migration() {
  const { t } = useTranslation('migration');

  const migrationCardsContent = useMemo(() => {
    return [
      {
        title: t('aggregate', { token: 'veAUXO' }),
        description: t('aggregateDescription', { token: 'veAUXO' }),
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
      },
      {
        title: t('aggregate', { token: 'xAUXO' }),
        description: t('aggregateDescription', { token: 'xAUXO' }),
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
      },
    ];
  }, [t]);

  return (
    <div className="flex flex-col h-screen">
      <Heading
        title={t('timeToMigrate')}
        subtitle={t('timeToMigrateSubtitle')}
      />
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-xs md:text-inherit mt-6">
        {migrationCardsContent.map((card) => (
          <MigrationCardOption key={card.title} {...card} />
        ))}
      </section>
    </div>
  );
}

Migration.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  return {
    // does not seem to work with key `initialState`
    props: {
      title: 'Migration',
    },
  };
});
