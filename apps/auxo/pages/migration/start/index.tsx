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

  const goToElement = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = e.currentTarget.getAttribute('href');
    if (target) {
      const element = document.querySelector(target) as HTMLElement | null;
      const button = element?.querySelector('button');
      if (element) {
        element.focus();
        if (button.getAttribute('aria-expanded') === 'false') {
          button.click();
        }
      }
    }
  };

  const migrationCardsContent = useMemo(() => {
    return [
      {
        token: 'veAUXO',
        title: t('aggregate', { token: 'veAUXO' }),
        description: t('aggregateDescription'),
        icon: <Image src={veAUXOIcon} alt="veAUXO" width={26} height={26} />,
        features: [
          {
            title: (
              <a
                href="#rewards"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('rewards')}
              </a>
            ),
            description: 'maxPossible',
          },
          {
            title: (
              <a
                href="#governance"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('governance')}
              </a>
            ),
            description: 'directOnChain',
          },
          {
            title: (
              <a
                href="#transfer"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('transfer')}
              </a>
            ),
            description: 'nonTransferable',
          },
          {
            title: (
              <a
                href="#lock"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('lock')}
              </a>
            ),
            description: 'userPreference',
          },
          {
            title: (
              <a
                href="#lock"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('redemption')}
              </a>
            ),
            description: 'atLockExpiration',
          },
          {
            title: (
              <a
                href="#bonding"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('bonding')}
              </a>
            ),
            description: 'guaranteedAtNAV',
          },
          {
            title: (
              <a
                href="#mintFee"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('mintFee')}
              </a>
            ),
            description: 'noFee',
          },
          {
            title: (
              <a
                href="#exit"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('exit')}
              </a>
            ),
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
        token: 'xAUXO',
        title: t('aggregate', { token: 'xAUXO' }),
        description: t('beLiquid'),
        icon: <Image src={XAUXOIcon} alt="xAUXO" width={26} height={26} />,
        features: [
          {
            title: (
              <a
                href="#rewards"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('rewards')}
              </a>
            ),
            description: 'taxed',
          },
          {
            title: (
              <a
                href="#governance"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('governance')}
              </a>
            ),
            description: 'noVotingRights',
          },
          {
            title: (
              <a
                href="#transfer"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('transfer')}
              </a>
            ),
            description: 'transferable',
          },
          {
            title: (
              <a
                href="#lock"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('lock')}
              </a>
            ),
            description: 'forever',
          },
          {
            title: (
              <a
                href="#lock"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('redemption')}
              </a>
            ),
            description: 'none',
          },
          {
            title: (
              <a
                href="#bonding"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('bonding')}
              </a>
            ),
            description: 'premium',
          },
          {
            title: (
              <a
                href="#mintFee"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('mintFee')}
              </a>
            ),
            description: 'yes',
          },
          {
            title: (
              <a
                href="#exit"
                onClick={goToElement}
                className="text-secondary/80 hover:text-secondary/100"
              >
                {t('exit')}
              </a>
            ),
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
