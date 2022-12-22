import { Tab } from '@headlessui/react';
import { motion, Variants } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import classNames from '../../utils/classnames';
import { TreasuryContentEntity } from '../../api/generated/graphql';
import ParentSize from '@visx/responsive/lib/components/ParentSizeModern';
import PieChart from '../PieChart';

const variants: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

export function TreasuryTabs(treasuryData: TreasuryContentEntity) {
  const { t } = useTranslation();
  const { about, links, news } = treasuryData;

  return (
    <section className="w-full px-4 md:px-10 pb-16 bg-background pt-8">
      <Tab.Group>
        <Tab.List className="md:flex p-1 md:max-w-xs gap-x-2 grid grid-cols-2 w-full">
          {['About', 'News'].map((title) => (
            <Tab
              className={({ selected }) =>
                classNames(
                  'md:w-fit py-1 text-md font-medium leading-5 focus:outline-none relative text-center',
                  !selected && 'text-sub-light',
                  selected && 'text-secondary',
                )
              }
              key={title}
              data-cy={`product-tab-${title.toLowerCase()}`}
            >
              {({ selected }) => (
                <>
                  {t(title)}
                  {selected ? (
                    <motion.div
                      className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary"
                      layoutId="underlineList"
                    />
                  ) : null}
                </>
              )}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="bg-gradient-primary shadow-md rounded-lg px-3 py-2 overflow-hidden mt-4">
          <SingleProductPanel
            className="divide-y"
            testId="product-tab-description-content"
          >
            <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="flex flex-col gap-y-8">
                  <div className="prose max-w-none prose-headings:text-primary prose-p:text-primary prose-strong:text-primary prose-ul:text-primary prose-li:text-primary">
                    {about}
                  </div>
                  <div>
                    <dl className="divide-y divide-gray-200">
                      {links.map((link) => (
                        <div
                          key={link.title}
                          className="grid grid-cols-2 gap-4 py-5"
                        >
                          <dt className="text-sm font-bold text-primary">
                            {link.title}
                          </dt>
                          <dd className="text-sm font-medium text-secondary mt-0 text-right">
                            <a href={link.url} target="_blank" rel="noreferrer">
                              {link.urlText}
                            </a>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                <div className="w-full h-full">
                  <ParentSize>
                    {({ width }) => <PieChart width={width} height={300} />}
                  </ParentSize>
                </div>
              </div>
            </>
          </SingleProductPanel>
          <SingleProductPanel
            className="divide-y gap-x-2"
            testId="product-tab-description-content"
          >
            {news.map((newsItem) => (
              <div
                key={newsItem.title}
                className="flex items-center gap-x-4 p-2 divide-y divide-y-custom-border"
              >
                <div className="flex flex-col gap-y-3 text-primary">
                  <div className="flex gap-x-2 items-center">
                    <IconSwitcher icon={newsItem.type} />
                    <h2 className="text-lg font-bold">{newsItem.title}</h2>
                  </div>
                  <p className="text-base">{newsItem.description}</p>
                </div>
              </div>
            ))}
          </SingleProductPanel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  );
}

export function SingleProductPanel({
  className,
  children,
  testId,
}: {
  className?: string;
  children: React.ReactNode;
  testId?: string;
}) {
  return (
    <Tab.Panel>
      <motion.div
        layout
        variants={variants}
        initial="initial"
        exit="exit"
        animate="animate"
        className={classNames('max-w-none', className)}
        data-cy={testId}
      >
        {children}
      </motion.div>
    </Tab.Panel>
  );
}

export function KeyFact({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: string;
}) {
  const { t } = useTranslation();
  return (
    <li className="flex justify-between gap-x-2">
      <p className="flex flex-col">
        <span className="font-bold text-primary">{t(title)}</span>
        <span className="text-sub-dark">{t(description)}</span>
      </p>
      <p className="text-sub-dark text-right" data-cy={`key-${title}`}>
        {value ? value : 'N/A'}
      </p>
    </li>
  );
}

export const IconSwitcher = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'hot':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10l2.586-2.586a1 1 0 011.414 0L12 10l5.414-5.414a1 1 0 011.414 0L21 10m-9 4v7a1 1 0 01-1.447.894L9 18H6a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v1zm9 0v7a1 1 0 01-1.447.894L18 18h-3a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v1z"
          />
        </svg>
      );
    case 'flag':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      );
    case 'info':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
          />
        </svg>
      );
  }
};
