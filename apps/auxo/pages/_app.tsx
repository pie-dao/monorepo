import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AppProps, NextWebVitalsMetric } from 'next/app';
import { Provider } from 'react-redux';
import { GoogleAnalytics, usePagesViews, event } from 'nextjs-google-analytics';
import { Web3ReactProvider } from '@web3-react/core';
import { init, Web3OnboardProvider } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import getLibrary from '../connectors';
import { Web3ContextProvider } from '../components/MultichainProvider/MultichainProvider';
import { wrapper } from '../store';
import { NotificationDisplay } from '../components/Notifications/Notifications';
import ModalManager from '../components/Modals/ModalManager';
import ModalStakingSuccess from '../components/Modals/ModalSuccess';
import './styles.css';
import './app.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import RewardsModalManager from '../components/Modals/Rewards/RewardsModalManager';
import ClaimSuccess from '../components/Modals/Rewards/ClaimSuccess';
import { MAINNET_RPC } from '../utils/networks';

const wcV2InitOptions = {
  version: 2 as const,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
  requiredChains: [1],
};

const injected = injectedModule();
const walletConnect = walletConnectModule(wcV2InitOptions);

const web3Onboard = init({
  wallets: [injected, walletConnect],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: MAINNET_RPC,
    },
  ],
  appMetadata: {
    name: 'AuxoDAO',
    description:
      'Auxo is a DeFi platform that offers trust-minimized farming, rewards in ETH, and non-dilutive tokenomics.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24"><rect width="24" height="24" x=".5" fill="url(#a)" rx="12"/><path fill="#1F0860" d="M14.8167 4.5h-4.412L5 18.75h3.7758l2.6892-.8687h2.2914l2.6949.8687H20L14.8167 4.5ZM9.83048 15.609l2.69482-7.87321h.1727c.0356.10053.0694.20864.1051.32813L15.391 15.609l-1.6327-.8687h-2.2914l-1.63455.8687h-.00187Z"/><defs><linearGradient id="a" x1=".5" x2="23.8222" y1="4.63158" y2="5.04303" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#F6F7FF"/></linearGradient></defs></svg>',
  },
  connect: {
    autoConnectAllPreviousWallet: true,
  },
  theme: {
    '--w3o-background-color': '#f6f7ff',
    '--w3o-foreground-color': '#f6f7ff',
    '--w3o-text-color': '#1f0860',
    '--w3o-border-color': '#babddc',
    '--w3o-action-color': '#248be0',
  },
  accountCenter: {
    desktop: {
      enabled: true,
      position: 'topRight',
    },
    mobile: {
      enabled: true,
      position: 'bottomRight',
    },
  },
});

export function reportWebVitals({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) {
  event(name, {
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    label: id,
    nonInteraction: true,
  });
}

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({ Component, ...rest }: AppPropsWithLayout) {
  const queryClient = new QueryClient();
  const { props, store } = wrapper.useWrappedStore(rest);
  usePagesViews();
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <Web3ContextProvider>
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <Head>
                <title>Welcome to AUXO</title>
              </Head>
              <GoogleAnalytics />
              <div className="h-full">
                <NotificationDisplay />
                <ModalManager />
                <ModalStakingSuccess />
                <RewardsModalManager />
                <ClaimSuccess />
                {getLayout(<Component {...props.pageProps} />)}
              </div>
            </Provider>
          </QueryClientProvider>
        </Web3ReactProvider>
      </Web3OnboardProvider>
    </Web3ContextProvider>
  );
}

export default CustomApp;
