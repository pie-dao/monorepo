import { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { useWeb3React } from '@web3-react/core';
import { motion } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import classNames from '../../utils/classnames';
import { useSelectedVault } from '../../hooks/useSelectedVault';
import { getProof } from '../../utils/merkleProof';
import Image from 'next/image';
import VaultWidthdraw from './VaultWithdraw';
import VaultDeposit from './VaultDeposit';
import { useAppDispatch } from '../../hooks';
import { thunkAuthorizeDepositor } from '../../store/products/thunks';
import { useMerkleAuthContract } from '../../hooks/useContracts';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export default function Vault() {
  const { account, chainId } = useWeb3React();
  const activeVault = useSelectedVault();
  const dispatch = useAppDispatch();
  const isDepositor = activeVault?.auth.isDepositor;
  const authContract = useMerkleAuthContract(activeVault?.auth.address);
  const { t } = useTranslation();
  const proof = getProof(account);
  const [authorizing, setAuthorizing] = useState(false);
  const isDisabled = (() => {
    const wrongNetwork = chainId !== activeVault?.chainId;
    return authorizing || wrongNetwork || !proof;
  })();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const submitProof = () => {
    setAuthorizing(true);
    dispatch(
      thunkAuthorizeDepositor({
        account,
        auth: authContract,
      }),
    ).finally(() => setAuthorizing(false));
  };

  useEffect(() => {
    if (isDepositor && proof) {
      setSelectedIndex(1);
    }
  }, [account, isDepositor, proof]);

  if (!activeVault) return null;
  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="flex gap-x-4 rounded-xl p-1 flex-1 justify-between w-full">
        <Tab
          className={({ selected }) =>
            classNames(
              'w-full py-2.5 text-sm font-medium',
              'relative',
              selected && 'text-secondary',
              isDepositor && proof && 'hidden',
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
        <Tab
          className={({ selected }) =>
            classNames(
              'w-full py-2.5 text-sm font-medium',
              'focus:outline-none relative',
              selected && ' text-secondary',
              'disabled:opacity-20',
            )
          }
          disabled={!isDepositor}
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
          disabled={!isDepositor}
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
        <Tab.Panel className={classNames(isDepositor && proof && 'hidden')}>
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
            {!isDepositor && proof && (
              <button
                className="w-full px-8 py-3 text-lg font-medium text-white bg-secondary rounded-2xl ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                onClick={submitProof}
                disabled={isDisabled}
              >
                {authorizing ? <LoadingSpinner /> : 'Opt In'}
              </button>
            )}
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <VaultDeposit />
        </Tab.Panel>
        <Tab.Panel>
          <VaultWidthdraw />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
