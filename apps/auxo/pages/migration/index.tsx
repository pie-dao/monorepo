import Heading from '../../components/Heading/Heading';
import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useEffect } from 'react';
import { Layout } from '../../components';
import { wrapper } from '../../store';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '../../hooks';
import { ThunkGetVeDOUGHStakingData } from '../../store/migration/migration.thunks';
import MigrationBanner from '../../components/MigrationBanner/MigrationBanner';
import AUXOtoVeAUXOxAUXO from '../../public/images/migration/AUXOtoVeAUXOxAUXO.png';
import DOUGHtoAUXO from '../../public/images/migration/DOUGHtoAUXO.png';
import veDOUGHtoDOUGH from '../../public/images/migration/veDOUGHtoDOUGH.png';
import Link from 'next/link';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { Disclosure } from '@headlessui/react';
import classNames from '../../utils/classnames';
import { motion, AnimatePresence } from 'framer-motion';
import MigrationBackground from '../../components/MigrationBackground/MigrationBackground';
import Trans from 'next-translate/Trans';
import stakingTimeImage from '../../public/images/migration/stakingTime.png';

export const Break = <span className="block" />;
export const p = <p className="text-primary text-base block last:mb-0 mb-2" />;
export const b = <span className="font-bold" />;
export const LinkTo = (href: string, text: string) => (
  <a
    className="text-secondary underline"
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {text}
  </a>
);

export const label = (color: string, label: string) => (
  <span
    className={`md:inline-flex rounded-full flex-shrink-0 bg-transparent px-2.5 py-0.5 text-xs font-medium border hidden`}
    style={{
      color: `rgb(var(--color-${color}))`,
      borderColor: `rgb(var(--color-${color}))`,
    }}
  >
    {label}
  </span>
);

export const Blockquote = (
  <blockquote className="p-4 my-4 bg-gray-50 border-l-4 border-gray-300 text-primary text-base  block" />
);

export const Code = <code className="p-1 bg-gray-200 text-base rounded" />;

export const Ul = (
  <ul className="list-disc list-inside text-base text-primary" />
);

export const Li = <li className="mb-2 last:mb-0" />;

export default function Migration() {
  const { t } = useTranslation('migration');

  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  useEffect(() => {
    if (account) {
      dispatch(ThunkGetVeDOUGHStakingData({ account }));
    }
  }, [account, dispatch]);

  const lifecycleColumns = [
    {
      icon: <Image src={veDOUGHtoDOUGH} alt="veDOUGHtoDOUGH" />,
      title: t('veDOUGHtoDOUGH'),
    },
    {
      icon: <Image src={DOUGHtoAUXO} alt="DOUGHtoAUXO" />,
      title: t('DOUGHtoAUXO'),
    },
    {
      icon: <Image src={AUXOtoVeAUXOxAUXO} alt="AUXOtoVeAUXOxAUXO" />,
      title: t('AUXOtoVeAUXOxAUXO'),
    },
  ];

  const faqs = [
    {
      question: t('faq1'),
      answer: (
        <Trans
          i18nKey="faq1Answer"
          components={{
            Break,
            p,
            Link: LinkTo(
              'https://piedaoorg.on.fleek.co/#/buyback',
              'https://piedaoorg.on.fleek.co/#/buyback',
            ),
            Blockquote,
          }}
          ns="migration"
        />
      ),
      label: label('primary', t('faq1Label')),
    },
    {
      question: t('faq2'),
      answer: (
        <Trans
          i18nKey="faq2Answer"
          components={{ Break, p, Ul, Li }}
          ns="migration"
        />
      ),
      label: label('violet', t('faq2Label')),
    },
    {
      question: t('faq3'),
      answer: (
        <Trans
          i18nKey="faq3Answer"
          components={{ Break, p, b, Blockquote, Ul, Li }}
          ns="migration"
        />
      ),
      label: label('violet', t('faq3Label')),
    },
    {
      question: t('faq4'),
      answer: (
        <Trans
          i18nKey="faq4Answer"
          components={{ Break, p, b }}
          ns="migration"
        />
      ),
      label: label('secondary', t('faq4Label')),
    },
    {
      question: t('faq5'),
      answer: (
        <Trans
          i18nKey="faq5Answer"
          components={{ Break, p, b, Blockquote }}
          ns="migration"
        />
      ),
      label: label('purple', t('faq5Label')),
    },
    {
      question: t('faq6'),
      answer: (
        <Trans
          i18nKey="faq6Answer"
          components={{ Break, p, b, Blockquote }}
          ns="migration"
        />
      ),
      label: label('purple', t('faq6Label')),
    },
    {
      question: t('faq7'),
      answer: (
        <Trans
          i18nKey="faq7Answer"
          components={{ Break, p, b, Ul, Li }}
          ns="migration"
        />
      ),
      label: label('purple', t('faq7Label')),
    },
    {
      question: t('faq8'),
      answer: (
        <Trans
          i18nKey="faq8Answer"
          components={{ Break, p, b }}
          ns="migration"
        />
      ),
      label: label('purple', t('faq8Label')),
    },
    {
      question: t('faq9'),
      answer: (
        <Trans
          i18nKey="faq9Answer"
          components={{
            Break,
            p,
            b,
            Link: LinkTo('https://discord.gg/CScCqkcBPR', 'Discord'),
          }}
          ns="migration"
        />
      ),
      label: label('green', t('faq9Label')),
    },
    {
      question: t('faq10'),
      answer: (
        <Trans
          i18nKey="faq10Answer"
          components={{
            p,
            Break,
            b,
            img: <Image src={stakingTimeImage} alt="DOUGHtoAUXO" />,
            imgWrapper: <div className="flex max-w-md" />,
            Code,
            Ul,
            Li,
          }}
          ns="migration"
        />
      ),
      label: label('green', t('faq10Label')),
    },
    {
      question: t('faq11'),
      answer: (
        <Trans
          i18nKey="faq11Answer"
          components={{
            Break,
            p,
            b,
            Link: LinkTo('https://discord.gg/CScCqkcBPR', 'Discord'),
          }}
          ns="migration"
        />
      ),
      label: label('green', t('faq11Label')),
    },
    {
      question: t('faq12'),
      answer: (
        <Trans
          i18nKey="faq12Answer"
          components={{ Break, p, b, Blockquote }}
          ns="migration"
        />
      ),
      label: label('yellow', t('faq12Label')),
    },
    {
      question: t('faq13'),
      answer: (
        <Trans
          i18nKey="faq13Answer"
          components={{ Break, p, b }}
          ns="migration"
        />
      ),
      label: label('sub-dark', t('faq13Label')),
    },
    {
      question: t('faq14'),
      answer: (
        <Trans
          i18nKey="faq14Answer"
          components={{ Break, p, b }}
          ns="migration"
        />
      ),
      label: label('secondary', t('faq14Label')),
    },
  ];

  return (
    <div className="flex flex-col isolate relative">
      <MigrationBackground />
      <MigrationBanner />
      <Heading
        title={t('timeToMigrate')}
        subtitle={t('timeToMigrateArrived')}
      />
      <div className="bg-white px-4 py-5 sm:px-6 max-w-4xl mx-auto shadow-md rounded-lg w-full">
        <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
          <h3 className="w-full text-lg font-medium leading-6 text-primary text-center">
            {t('lifecycle')}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-custom-border">
          {lifecycleColumns.map((column, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center justify-center rounded-full max-w-[126px] mx-auto">
                {column.icon}
              </div>
              <h3 className="mt-4 text-sm font-medium text-primary text-center">
                {column.title}
              </h3>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center mt-12">
          <Link href="/migration/start" passHref>
            <button className="w-fit flex items-center gap-x-2 px-8 py-2 text-md font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary hover:bg-transparent hover:text-secondary">
              {t('startMigration')}
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
      <div className="bg-white px-4 py-5 sm:px-6 max-w-4xl mx-auto shadow-md rounded-lg w-full my-12">
        <div className="flex">
          <h3 className="w-full text-lg font-medium leading-6 text-primary">
            {t('faq')}
          </h3>
        </div>
        <div className="flex flex-col mt-6 gap-y-4 w-full">
          {faqs.map((faq) => (
            <Disclosure
              as="div"
              className="bg-gradient-primary shadow-md rounded-lg py-4 w-full"
              key={faq.question}
            >
              {({ open }) => (
                <>
                  <Disclosure.Button
                    as="div"
                    className={classNames('cursor-pointer w-full px-2')}
                  >
                    <div className="flex">
                      <div className="w-full flex-1 flex items-center gap-x-2 text-primary font-medium text-xl">
                        <h3 className="text-primary text-lg">{faq.question}</h3>{' '}
                        {faq.label}
                      </div>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center"
                      >
                        <ChevronDownIcon
                          className="h-5 w-5 text-primary"
                          aria-hidden="true"
                        />
                      </motion.div>
                    </div>
                  </Disclosure.Button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <Disclosure.Panel
                        as={motion.div}
                        initial="collapsed"
                        animate="open"
                        static
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: 'auto' },
                          collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="bg-transparent rounded-b-lg overflow-hidden w-full"
                      >
                        <motion.div
                          variants={{
                            collapsed: { scale: 0.8 },
                            open: { scale: 1 },
                          }}
                          transition={{ duration: 0.3 }}
                          className="origin-top-center space-y-3 overflow-y-auto p-4"
                        >
                          <div className="text-primary text-base">
                            {faq.answer}
                          </div>
                        </motion.div>
                      </Disclosure.Panel>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
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
