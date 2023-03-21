import Trans from 'next-translate/Trans';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import classNames from '../../utils/classnames';
import stakingTimeImage from '../../public/images/migration/stakingTime.png';

export const Break = <span className="block" />;
export const p = (
  <p className="text-primary text-sm font-medium block last:mb-0 mb-2" />
);
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
    className={`md:inline-flex rounded-full flex-shrink-0 bg-transparent px-2.5 py-0.5 text-xs font-medium border hidden capitalize`}
    style={{
      color: `rgb(var(--color-${color}))`,
      borderColor: `rgb(var(--color-${color}))`,
    }}
  >
    {label}
  </span>
);

export const Blockquote = (
  <blockquote className="p-4 my-4 bg-gray-50 border-l-4 border-gray-300 text-primary text-sm font-medium block" />
);

export const Code = <code className="p-1 bg-gray-200 rounded" />;

export const Ul = (
  <ul className="list-disc list-inside text-sm text-primary font-medium" />
);

export const Li = <li className="mb-2 last:mb-0" />;

export const br = <br />;

const MigrationFAQ: React.FC = () => {
  const { t } = useTranslation('migration');
  const faqs = [
    {
      id: 'faq1',
      question: t('faq1'),
      answer: (
        <Trans
          i18nKey="faq1Answer"
          components={{
            p,
          }}
          ns="migration"
        />
      ),
      label: label('primary', t('faq1Label')),
    },
    {
      id: 'faq2',
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
      id: 'faq3',
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
      id: 'faq4',
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
      id: 'faq5',
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
      id: 'faq6',
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
      id: 'faq7',
      question: t('faq7'),
      answer: (
        <Trans i18nKey="faq7Answer" components={{ p, br }} ns="migration" />
      ),
      label: label('purple', t('faq7Label')),
    },
    {
      id: 'faq8',
      question: t('faq8'),
      answer: (
        <Trans i18nKey="faq8Answer" components={{ Ul, Li }} ns="migration" />
      ),
      label: label('purple', t('faq8Label')),
    },
    {
      id: 'faq9',
      question: t('faq9'),
      answer: (
        <Trans
          i18nKey="faq9Answer"
          components={{
            p,
          }}
          ns="migration"
        />
      ),
      label: label('purple', t('faq9Label')),
    },
    {
      id: 'faq10',
      question: t('faq10'),
      answer: (
        <Trans
          i18nKey="faq10Answer"
          components={{
            Break,
            p,
            b,
            Link: LinkTo('https://discord.gg/vqM6Ys8urQ', 'Discord'),
          }}
          ns="migration"
        />
      ),
      label: label('green', t('faq10Label')),
    },
    {
      id: 'faq11',
      question: t('faq11'),
      answer: (
        <Trans
          i18nKey="faq11Answer"
          components={{
            p,
            Break,
            b,
            img: <Image src={stakingTimeImage} alt="DOUGHtoAUXO" />,
            imgWrapper: <div className="flex max-w-md my-4" />,
            Code,
            Ul,
            Li,
          }}
          ns="migration"
        />
      ),
      label: label('green', t('faq11Label')),
    },
    {
      id: 'faq12',
      question: t('faq12'),
      answer: (
        <Trans
          i18nKey="faq12Answer"
          components={{
            Break,
            p,
            b,
            Link: LinkTo('https://discord.gg/vqM6Ys8urQ', 'Discord'),
            Code,
          }}
          ns="migration"
        />
      ),
      label: label('green', t('faq12Label')),
    },
    {
      id: 'faq13',
      question: t('faq13'),
      answer: (
        <Trans
          i18nKey="faq13Answer"
          components={{ Break, p, b, Blockquote }}
          ns="migration"
        />
      ),
      label: label('yellow', t('faq13Label')),
    },
    {
      id: 'faq14',
      question: t('faq14'),
      answer: (
        <Trans
          i18nKey="faq14Answer"
          components={{ Break, p, b }}
          ns="migration"
        />
      ),
      label: label('sub-dark', t('faq14Label')),
    },
    {
      id: 'faq15',
      question: t('faq15'),
      answer: (
        <Trans
          i18nKey="faq15Answer"
          components={{ Break, p, b, Blockquote }}
          ns="migration"
        />
      ),
      label: label('azure', t('faq15Label')),
    },
    {
      id: 'faq16',
      question: t('faq16'),
      answer: <Trans i18nKey="faq16Answer" components={{ p }} ns="migration" />,
      label: label('light-red', t('faq16Label')),
    },
    {
      id: 'faq17',
      question: t('faq17'),
      answer: <Trans i18nKey="faq17Answer" components={{ p }} ns="migration" />,
      label: label('light-red', t('faq17Label')),
    },
    {
      id: 'faq18',
      question: t('faq18'),
      answer: <Trans i18nKey="faq18Answer" components={{ p }} ns="migration" />,
      label: label('light-red', t('faq18Label')),
    },
    {
      id: 'faq19',
      question: t('faq19'),
      answer: (
        <Trans
          i18nKey="faq19Answer"
          components={{ Break, p, Blockquote }}
          ns="migration"
        />
      ),
      label: label('light-red', t('faq19Label')),
    },
    {
      id: 'faq20',
      question: t('faq20'),
      answer: (
        <Trans i18nKey="faq20Answer" components={{ p, b }} ns="migration" />
      ),
      label: label('light-red', t('faq20Label')),
    },
    {
      id: 'faq21',
      question: t('faq21'),
      answer: (
        <Trans
          i18nKey="faq21Answer"
          components={{ p, Ul, Li }}
          ns="migration"
        />
      ),
      label: label('light-red', t('faq21Label')),
    },
    {
      id: 'faq22',
      question: t('faq22'),
      answer: <Trans i18nKey="faq22Answer" components={{ p }} ns="migration" />,
      label: label('light-red', t('faq22Label')),
    },
  ];

  return (
    <div className="bg-white divide-y px-4 py-5 sm:px-6 max-w-5xl mx-auto shadow-sm rounded-lg w-full my-12">
      <div className="flex">
        <h3 className="w-full text-lg font-semibold text-primary">
          {t('faq')}
        </h3>
      </div>
      <div className="flex flex-col mt-4 gap-y-4 w-full pt-4">
        {faqs.map((faq) => (
          <Disclosure
            as="div"
            id={faq?.id}
            className="bg-gradient-primary shadow-sm rounded-lg py-2 w-full focus:ring-4 scroll-mt-10"
            key={faq.question}
            tabIndex={0}
          >
            {({ open }) => (
              <>
                <Disclosure.Button
                  as="button"
                  className={classNames('cursor-pointer w-full px-4')}
                >
                  <div className="flex">
                    <div className="w-full flex-1 flex items-center gap-x-2 text-primary font-medium text-xl">
                      <h3 className="text-primary text-base">{faq.question}</h3>{' '}
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
                        <hr className="border-custom-border" />
                        <div className="text-primary text-base font-medium">
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
  );
};

export default MigrationFAQ;
