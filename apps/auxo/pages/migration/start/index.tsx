import Heading from '../../../components/Heading/Heading';
import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useEffect, useMemo } from 'react';
import { Layout } from '../../../components';
import { wrapper } from '../../../store';
import MigrationCardOption from '../../../components/MigrationCardOption/MigrationCardOption';
import ARV from '../../../public/tokens/32x32/ARV.svg';
import PRV from '../../../public/tokens/32x32/PRV.svg';
import Image from 'next/image';
import { useConnectWallet } from '@web3-onboard/react';
import { useAppDispatch } from '../../../hooks';
import { ThunkGetVeDOUGHStakingData } from '../../../store/migration/migration.thunks';
import MigrationBanner from '../../../components/MigrationBanner/MigrationBanner';
import { ExclamationIcon } from '@heroicons/react/outline';
import BackBar from '../../../components/BackBar/BackBar';
import MigrationBackground from '../../../components/MigrationBackground/MigrationBackground';
import { setCleanupFlow } from '../../../store/migration/migration.slice';
import MigrationFAQ from '../../../components/MigrationFAQ/MigrationFAQ';
import Trans from 'next-translate/Trans';

//extract title component
type TitleProps = {
  a: string;
};

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

export const Title: React.FC<TitleProps> = ({ a }) => {
  const { t } = useTranslation('migration');
  return <>{t(a)}</>;
};

const migrationHeadings = [
  {
    title: 'whatToExpectARV',
    description: 'whatToExpectARVDescription',
  },
  {
    title: 'whatToExpectPRV',
    description: 'whatToExpectPRVDescription',
  },
];

export default function Migration() {
  const { t } = useTranslation('migration');

  const dispatch = useAppDispatch();
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;

  useEffect(() => {
    dispatch(setCleanupFlow());
  }, [dispatch]);

  useEffect(() => {
    if (account) {
      dispatch(ThunkGetVeDOUGHStakingData({ account }));
    }
  }, [account, dispatch]);

  const migrationCardsContent = useMemo(() => {
    return [
      {
        token: t('activeRewardVault'),
        title: t('activeRewardVaultDescription'),
        icon: <Image src={ARV} alt="veAUXO" width={32} height={32} />,
        features: [
          {
            title: <Title a="governance" />,
            description: 'onChainOffChain',
          },
          {
            title: <Title a="reward" />,
            description: 'maxAtThirty',
          },
          {
            title: <Title a="redemption" />,
            description: 'atLockExpiration',
          },
          {
            title: <Title a="switchToPRV" />,
            description: 'available',
          },
        ],
        button: {
          text: t('upgrade'),
          url: '/migration/ARV',
        },
        banners: [
          {
            content: t('earlyTerminationFee'),
            bgColor: 'bg-transparent -mx-2',
          },
          {
            content: t('ARVConversionBanner'),
            bgColor: 'bg-info',
          },
        ],
      },
      {
        token: t('passiveRewardVault'),
        title: t('passiveRewardVaultDescription'),
        icon: <Image src={PRV} alt="PRV" width={32} height={32} />,
        features: [
          {
            title: <Title a="worryFree" />,
            description: 'noAction',
          },
          {
            title: <Title a="transferability" />,
            description: 'enabled',
          },
          {
            title: <Title a="redemption" />,
            description: 'anyTime',
          },
          {
            title: <Title a="unstakeAnyTime" />,
            description: 'noLock',
          },
        ],
        button: {
          text: t('upgrade'),
          url: '/migration/PRV',
        },
        banners: [
          {
            content: t('conversionIrreversible'),
            bgColor: 'bg-transparent -mx-2',
          },
          {
            content: t('PRVConversionBanner'),
            bgColor: 'bg-info',
          },
        ],
      },
    ];
  }, [t]);

  return (
    <div className="flex flex-col isolate relative">
      <MigrationBackground />
      <MigrationBanner />
      <section className="grid grid-cols-1 xl:grid-flow-col xl:auto-cols-fr gap-4 text-xs md:text-inherit md:max-w-5xl w-fit my-12 mx-auto">
        {migrationHeadings.map((heading, i) => (
          <div
            key={i}
            className="flex flex-col px-4 py-4 rounded-md shadow-md items-center w-full align-middle bg-gradient-primary"
          >
            <h2 className="text-xl text-primary mb-1.5 pb-1.5 border-b border-custom-border w-full">
              <Trans
                i18nKey={`migration:${heading.title}`}
                components={{
                  b: <span className="font-semibold" />,
                  br: <br />,
                }}
              />
            </h2>
            <p className="text-base text-primary">{t(heading.description)}</p>
          </div>
        ))}
      </section>
      <BackBar title={t('selectToken')} singleCard={false}>
        <section className="grid grid-cols-1 xl:grid-flow-col xl:auto-cols-fr gap-4 text-xs md:text-inherit mt-6 max-w-5xl">
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
