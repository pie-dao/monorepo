import { Disclosure, Tab } from '@headlessui/react';
import {
  motion,
  Variants,
  AnimateSharedLayout,
  AnimatePresence,
} from 'framer-motion';
import { useMemo } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import useTranslation from 'next-translate/useTranslation';
import { ChevronDownIcon } from '@heroicons/react/solid';
import classNames from '../../utils/classnames';
import { formatAsPercent } from '../../utils/formatBalance';
import { chainMap } from '../../utils/networks';
import { useSelectedVault } from '../../hooks/useSelectedVault';

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

interface tabsData {
  about: {
    network: string;
    contract: string;
    underlyingAsset: {
      symbol: string;
      contract: string;
    };
  };
  strategies: {
    title: string;
    description: string;
    allocationPercentage: number;
    links: {
      title: string;
      url: string;
    }[];
  }[];
}

interface ProductTabs {
  tabsData: tabsData;
  source: {
    compiledSourceAbout: string;
  };
}

export function VaultTabs({ tabsData, source }: ProductTabs) {
  const { about, strategies } = tabsData;
  const { chainId } = useSelectedVault();

  const urls = useMemo(() => {
    const blockExplorer =
      chainId && `${chainMap[chainId].blockExplorerUrls[0]}/address/`;
    return {
      contract: blockExplorer + about.contract,
      token: blockExplorer + about.underlyingAsset.contract,
    };
  }, [chainId, about]);

  const { t } = useTranslation();

  return (
    <div className="w-full px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl p-1 max-w-xs">
          {['about', 'strategyDetails'].map((title) => (
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm font-medium leading-5',
                  'focus:outline-none relative',
                  selected && 'text-secondary',
                )
              }
              key={title}
            >
              {({ selected }) => (
                <>
                  {t(title)}
                  {selected ? (
                    <motion.div
                      className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary"
                      layoutId="underline"
                    />
                  ) : null}
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <SingleVaultPanel className="divide-y">
            <div className="prose max-w-none prose-headings:text-primary prose-p:text-primary prose-strong:text-primary prose-ul:text-primary prose-li:text-primary">
              <MDXRemote compiledSource={source.compiledSourceAbout} />
            </div>
            <div className="mt-4 py-4">
              <ul className="flex flex-col gap-y-2">
                <li className="flex justify-between gap-x-2">
                  <p className="flex flex-col">
                    <span className="font-bold text-primary">
                      {t('network')}
                    </span>
                  </p>
                  <p className="text-sub-dark text-right">{about.network}</p>
                </li>
                <li className="flex justify-between gap-x-2">
                  <p className="flex flex-col">
                    <span className="font-bold text-primary">
                      {t('contract')}
                    </span>
                  </p>
                  <a
                    href={urls.contract}
                    className="text-secondary text-right truncate max-w-[8rem]"
                  >
                    {about.contract}
                  </a>
                </li>
                <li className="flex justify-between gap-x-2">
                  <p className="flex flex-col">
                    <span className="font-bold text-primary">
                      {about.underlyingAsset.symbol}
                    </span>
                  </p>
                  <a
                    href={urls.token}
                    className="text-secondary text-right truncate max-w-[8rem]"
                  >
                    {about.underlyingAsset.contract}
                  </a>
                </li>
              </ul>
            </div>
          </SingleVaultPanel>
          <SingleVaultPanel>
            <div className="flex flex-col gap-y-3 my-4">
              {strategies.map((item, index) => (
                <Disclosure
                  key={`${item.title}-${index}`}
                  as="div"
                  className="bg-gradient-primary shadow-md rounded-lg px-3 py-2 overflow-hidden"
                >
                  {({ open }) => (
                    <>
                      <Disclosure.Button as="div" className="cursor-pointer">
                        <div className="flex items-center gap-x-2">
                          <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: open ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex"
                          >
                            <ChevronDownIcon
                              className="h-5 w-5 text-sub-dark"
                              aria-hidden="true"
                            />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-sm text-primary font-medium leading-5">
                              {item.title}
                            </h3>
                          </div>
                          <div>
                            <p className="text-secondary text-sm">
                              {formatAsPercent(item.allocationPercentage)}
                            </p>
                          </div>
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
                            key={'panel-' + index}
                            variants={{
                              open: { opacity: 1, height: 'auto' },
                              collapsed: { opacity: 0, height: 0 },
                            }}
                            transition={{
                              duration: 0.2,
                            }}
                            className="overflow-hidden"
                          >
                            <motion.div
                              variants={{
                                collapsed: { opacity: 0, y: -20 },
                                open: { opacity: 1, y: 0 },
                              }}
                              transition={{ duration: 0.3 }}
                              className="py-2 space-y-1 border-t border-customBorder mt-2"
                            >
                              <p>{item.description}</p>
                              <div className="flex flex-wrap gap-4 mt-4">
                                {item.links.map((link, index) => (
                                  <a
                                    key={`${link.title}-${index}`}
                                    href={link.url}
                                    className="text-secondary text-sm"
                                  >
                                    {link.title}
                                  </a>
                                ))}
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
          </SingleVaultPanel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export function SingleVaultPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <AnimateSharedLayout>
      <AnimatePresence>
        <Tab.Panel
          as={motion.div}
          className="rounded-lg bg-gradient-primary p-3 shadow-md"
          layout
        >
          <motion.div
            layout
            variants={variants}
            initial="initial"
            exit="exit"
            animate="animate"
            className={classNames('max-w-none', className)}
          >
            {children}
          </motion.div>
        </Tab.Panel>
      </AnimatePresence>
    </AnimateSharedLayout>
  );
}
