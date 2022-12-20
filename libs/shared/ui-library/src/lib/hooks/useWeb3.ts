import { useWeb3React } from '@web3-react/core';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { injected } from '../connectors';
import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import { EthereumProvider } from '../types/types';

export function useEagerConnect() {
  const { activate, active } = useWeb3React();
  const [tried, setTried] = useState(false);

  // gnosisSafe.isSafeApp() races a timeout against postMessage, so it delays pageload if we are not in a safe app;
  // if we are not embedded in an iframe, it is not worth checking

  // then, if that fails, try connecting to an injected connector
  useEffect(() => {
    const parser = new UAParser(window.navigator.userAgent);
    const { type } = parser.getDevice();
    const isMobile = type === 'mobile' || type === 'tablet';
    if (!active && !tried) {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          if (isMobile && window.ethereum) {
            activate(injected, undefined, true).catch(() => {
              setTried(true);
            });
          } else {
            setTried(true);
          }
        }
      });
    }
  }, [activate, active, tried]);

  // wait until we get confirmation of a connection to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const ethereum = window.ethereum as EthereumProvider | undefined;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        activate(injected, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error);
        });
      };

      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error) => {
            console.error('Failed to activate after accounts changed', error);
          });
        }
      };

      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(injected);
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
    return undefined;
  }, [active, error, suppress, activate]);
}
