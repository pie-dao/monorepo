import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import classNames from '../../utils/classnames';
import { motion, AnimatePresence } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import Container from '../Container/Container';

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

const Support: React.FC = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('faq1'),
      answer: <Trans i18nKey="faq1Answer" ns="migration" />,
      label: label('primary', t('faq1Label')),
    },
    {
      question: t('faq2'),
      answer: <Trans i18nKey="faq2Answer" ns="migration" />,
      label: label('violet', t('faq2Label')),
    },
    {
      question: t('faq3'),
      answer: <Trans i18nKey="faq3Answer" ns="migration" />,
      label: label('violet', t('faq3Label')),
    },
  ];
  return (
    <section
      id="support"
      className="scroll-mt-14 pb-16 sm:scroll-mt-24 sm:pb-20 lg:pb-38"
    >
      <Container size="xl">
        <div className="bg-white px-4 py-5 sm:px-6 mx-auto shadow-sm rounded-lg w-full my-12">
          <div className="flex">
            <h3 className="w-full text-lg font-medium leading-6 text-primary">
              {t('faq')}
            </h3>
          </div>
          <div className="flex flex-col mt-6 gap-y-4 w-full">
            {faqs.map((faq) => (
              <Disclosure
                as="div"
                className="bg-gradient-primary shadow-sm rounded-lg py-4 w-full"
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
                          <h3 className="text-primary text-lg">
                            {faq.question}
                          </h3>{' '}
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
      </Container>
    </section>
  );
};

export default Support;
