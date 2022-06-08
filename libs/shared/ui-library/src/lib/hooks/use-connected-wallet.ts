import { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { network } from '../connectors';
import { useEagerConnect, useInactiveListener } from './useWeb3';
import { EthereumProvider } from '../types/types';

const useFallBack = () => {
  const { active, activate, chainId } = useWeb3React();
  const listenForChain = useCallback(
    (chainId: string | undefined) => {
      if (chainId) activate(network(Number(chainId)));
    },
    [activate],
  );

  useEffect(() => {
    const ethereum = window.ethereum as EthereumProvider | undefined;
    if (ethereum && ethereum.on && !active) {
      activate(network(Number(ethereum.networkVersion)));
      ethereum.on('chainChanged', listenForChain);
    } else if (!ethereum) {
      activate(network(1));
    }
  }, [active, chainId, activate, listenForChain]);
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
