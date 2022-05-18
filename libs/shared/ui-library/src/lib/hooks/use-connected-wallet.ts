import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { network } from '../connectors';
import { useEagerConnect, useInactiveListener } from './useWeb3';

const useFallBack = () => {
  const { active, activate, chainId } = useWeb3React();
  useEffect(() => {
    if (!active) activate(network);
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
