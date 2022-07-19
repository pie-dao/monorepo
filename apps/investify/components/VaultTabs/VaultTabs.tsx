import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import classNames from '../../utils/classnames';
import { VaultData } from '../../hooks/useFormatDataForSingleVault';

export default function VaultTabs({ tabs }: { tabs: VaultData['tabs'] }) {
  const { t } = useTranslation();
  const { about, strategyDetails } = tabs;
  const { content, network, contract, underlyingAsset } = about;
  return (
    <div className="w-full px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl p-1 max-w-xs">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm font-medium leading-5',
                'focus:outline-none relative',
                selected ? ' text-secondary' : '',
              )
            }
          >
            {({ selected }) => (
              <>
                {t(Object.keys(tabs)[0])}
                {selected ? (
                  <motion.div
                    className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary"
                    layoutId="underline"
                  />
                ) : null}
              </>
            )}
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm font-medium leading-5',
                'focus:outline-none relative',
                selected ? ' text-secondary' : '',
              )
            }
          >
            {({ selected }) => (
              <>
                {t(Object.keys(tabs)[1])}
                {selected ? (
                  <motion.div
                    className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary"
                    layoutId="underline"
                  />
                ) : null}
              </>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel
            className={classNames(
              'rounded-lg bg-gradient-primary p-3 shadow-md',
            )}
          >
            <p className="prose">{content}</p>
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-lg bg-gradient-primary p-3 shadow-md',
            )}
          >
            ciao inooo
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
