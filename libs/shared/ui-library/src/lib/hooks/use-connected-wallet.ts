import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { network } from '../connectors';
import { useEagerConnect, useInactiveListener } from './useWeb3';
import { EthereumProvider, SUPPORTED_CHAIN_ID } from '../types/types';

const useFallBack = () => {
  const { active, activate, chainId } = useWeb3React();
  useEffect(() => {
    const ethereum = window.ethereum as EthereumProvider | undefined;
    if (ethereum && ethereum.on && !active) {
      activate(network());
      ethereum.on(
        'networkChanged',
        (chainId: SUPPORTED_CHAIN_ID | undefined) => {
          if (chainId) activate(network(chainId));
        },
      );
    }
  }, [active, chainId, activate]);
};

export const useConnectedWallet = () => {
  const { connector } = useWeb3React();
  const [activatingConnector, setActivatingConnector] = useState<any>();
  const triedEager = useEagerConnect();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  useFallBack();
  useInactiveListener(!triedEager || !!activatingConnector);
};
