import { Tab } from '@headlessui/react';
import { useWeb3React } from '@web3-react/core';
import { motion } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import classNames from '../../utils/classnames';
import { useSelectedVault } from '../../hooks/useSelectedVault';
import { getProof } from '../../utils/merkleProof';
import Image from 'next/image';

export default function Vault() {
  const { account } = useWeb3React();
  const activeVault = useSelectedVault();
  const isAuth = activeVault?.auth;
  const { t } = useTranslation();
  const hasVedough = getProof(account);

  if (!activeVault) return null;
  return (
    <Tab.Group>
      <Tab.List className="flex gap-x-4 rounded-xl p-1 flex-1 justify-between w-full">
        {!isAuth && !hasVedough && (
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm font-medium',
                'relative',
                selected && 'text-secondary',
              )
            }
          >
            {({ selected }) => (
              <>
                {t('optin')}
                {selected ? (
                  <motion.div
                    className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary"
                    layoutId="underlineVault"
                  />
                ) : null}
              </>
            )}
          </Tab>
        )}
        <Tab
          className={({ selected }) =>
            classNames(
              'w-full py-2.5 text-sm font-medium',
              'focus:outline-none relative',
              selected && ' text-secondary',
              'disabled:opacity-20',
            )
          }
          disabled={!isAuth}
        >
          {({ selected }) => (
            <>
              {t('deposit')}
              {selected ? (
                <motion.div
                  className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary"
                  layoutId="underlineVault"
                />
              ) : null}
            </>
          )}
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames(
              'w-full py-2.5 text-sm font-medium',
              'focus:outline-none relative',
              selected ? ' text-secondary' : '',
              'disabled:opacity-20',
            )
          }
          disabled={!isAuth}
        >
          {({ selected }) => (
            <>
              {t('withdraw')}
              {selected ? (
                <motion.div
                  className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-secondary"
                  layoutId="underlineVault"
                />
              ) : null}
            </>
          )}
        </Tab>
      </Tab.List>
      <Tab.Panels className="mt-4">
        {!isAuth && !hasVedough && (
          <Tab.Panel>
            <div className="w-full max-w-[12rem] mx-auto flex flex-col items-center gap-y-4 text-center">
              <div className="w-full">
                <Image
                  src="/images/veDough-only.png"
                  alt="optin"
                  height={108}
                  width={331}
                  layout="responsive"
                />
              </div>

              <p className="leading-5 text-sm">{t('restricted')}</p>
              <a
                href="https://www.notion.so/piedao/Auxo-Vaults-12adac7ebc1e43eeb0c5db4c7cd828e2"
                target="_blank"
                rel="noreferrer noopener"
                className="uppercase text-sub-dark text-xs"
              >
                {t('learnMore')}
              </a>
            </div>
          </Tab.Panel>
        )}
        <Tab.Panel></Tab.Panel>
        <Tab.Panel></Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
