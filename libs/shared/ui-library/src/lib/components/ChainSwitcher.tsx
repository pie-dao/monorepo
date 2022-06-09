import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3React } from '@web3-react/core';
import {
  SUPPORTED_CHAIN_ID,
  SUPPORTED_CHAIN_NAMES,
  NetworkDetail,
} from '../types/types';
import { NetworkSwitcher } from './NetworkSwitcher';
import { logoSwitcher } from './ChainIcons/ChainIcons';
import { isChainSupported, filteredChainMap } from '../utils/network';
import { classNames } from '../utils/class-names';
import { useConnectedWallet } from '../hooks/use-connected-wallet';

interface Props {
  allowedChains?: SUPPORTED_CHAIN_NAMES[];
  showNetworkIcon?: boolean;
  showNetworkName?: boolean;
  className?: string;
}

interface ChainProps {
  chain: NetworkDetail | null | undefined;
}

export const ChainAndLogo: FunctionComponent<ChainProps> = ({
  chain,
}: ChainProps) => {
  return (
    <span className="h-6 w-6 block">
      {logoSwitcher(chain?.nativeCurrency?.symbol)}
    </span>
  );
};

export const ChainSwitcher: FunctionComponent<Props> = ({
  showNetworkIcon = true,
  showNetworkName = true,
  allowedChains = ['MAINNET'],
}: Props) => {
  useConnectedWallet();
  const { chainId } = useWeb3React();
  const { t } = useTranslation();

  const availableChains = useMemo(() => {
    return filteredChainMap(allowedChains);
  }, [allowedChains]);

  const supportedChain = useMemo(() => {
    return isChainSupported(chainId)
      ? availableChains[chainId as SUPPORTED_CHAIN_ID]
      : null;
  }, [availableChains, chainId]);

  const [chain, setChain] = useState(supportedChain);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (supportedChain) {
      setChain(supportedChain);
    } else {
      setChain(null);
    }
    setLoading(false);
  }, [supportedChain]);

  if (loading) {
    return <SkeletonUI />;
  }

  return (
    <NetworkSwitcher value={chain} onChange={setChain}>
      {({ open }) => (
        <div className="relative">
          <NetworkSwitcher.Button
            className={classNames(
              'flex justify-start items-center relative w-full text-sm text-text bg-transparent border border-text hover:bg-text hover:text-white',
              showNetworkName
                ? 'pl-2 pr-3 py-1 rounded-2xl'
                : 'p-1 rounded-full',
            )}
          >
            {showNetworkIcon && <ChainAndLogo chain={chain} />}
            {showNetworkName && (
              <span className="block truncate text-base font-medium">
                {chain ? chain.chainName : 'Unsupported Chain'}
              </span>
            )}
          </NetworkSwitcher.Button>
          {open && (
            <NetworkSwitcher.Options
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ duration: 0.1 }}
              static
              className="absolute overflow-hidden right-0 mt-2 p-1 w-48 origin-top-right text-text font-medium rounded-md bg-gradient-primary drop-shadow-sm space-y-2"
            >
              <h3 className="border-b-2 pt-2 mx-2 border-primary mb-3">
                {t('switchNetwork')}
              </h3>
              {Object.entries(availableChains).map(([, chain]) => (
                <NetworkSwitcher.Option
                  as={motion.div}
                  key={chain.chainId}
                  className={({ active, selected }) =>
                    classNames(
                      'cursor-pointer flex justify-start relative py-1 px-2 text-left items-center overflow-hidden',
                      active && 'rounded-full bg-white',
                      selected && 'rounded-full bg-white',
                    )
                  }
                  value={chain}
                >
                  {({ selected }) => {
                    return (
                      <>
                        {showNetworkIcon && <ChainAndLogo chain={chain} />}
                        <span className="block truncate">
                          {chain.chainName}
                        </span>
                        {selected && (
                          <span className="rounded-full h-2 w-2 bg-secondary ml-auto"></span>
                        )}
                      </>
                    );
                  }}
                </NetworkSwitcher.Option>
              ))}
            </NetworkSwitcher.Options>
          )}
        </div>
      )}
    </NetworkSwitcher>
  );
};

const SkeletonUI = () => {
  return (
    <AnimatePresence>
      <motion.section exit={{ opacity: 0 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden"
        >
          <div className="w-40 h-8 bg-gray-200 rounded-lg shadow-md"></div>
          <motion.div
            initial={{ x: -200 }}
            animate={{ x: 400 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="absolute bg-primary bg-opacity-20 top-0 rotate-12 left-0 w-[30%] h-full"
          ></motion.div>
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
};
