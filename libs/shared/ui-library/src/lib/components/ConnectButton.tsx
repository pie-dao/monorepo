import { FunctionComponent, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWeb3React } from '@web3-react/core';
import useTranslation from 'next-translate/useTranslation';
import { Connect } from './Connect';
import { useENSName } from '../hooks/use-ens-name';
import { MetamaskIcon, WalletConnectIcon } from '../shared/external-icons';
import { classNames } from '../utils/class-names';

interface Props {
  className?: string;
}

const trimAccount = (account: string, long = false): string => {
  if (long) return account.slice(0, 5) + '...' + account.slice(36);
  return account.slice(0, 2) + '...' + account.slice(39);
};

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const loadingCircleVariants = {
  start: {
    y: 0,
  },
  end: {
    y: -15,
  },
};

const bounceTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: 'easeInOut',
};

export const ConnectButton: FunctionComponent<Props> = ({ className }) => {
  const { account, active, library } = useWeb3React();
  const ensName = useENSName(library, account);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={classNames(
          'px-4 py-1 text-base font-medium text-text bg-transparent rounded-2xl border border-text hover:bg-text hover:text-white',
          className,
        )}
        id="connect-button"
      >
        {active && account && ensName}
        {!account && t('connect')}
        {active && account && !ensName && trimAccount(account)}
      </button>

      <AnimatePresence>
        {isOpen && (
          <Connect
            static
            as="div"
            open={isOpen}
            className="fixed inset-0 z-10 overflow-y-hidden"
            onClose={closeModal}
          >
            {({ connected, connecting, waiting }) => (
              <div className="flex items-end justify-center min-h-screen text-center sm:block sm:p-0 text-text">
                <Connect.Overlay className="fixed inset-0 bg-gradient-overlay" />
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <div className="lg:inline-block w-screen lg:w-full lg:max-w-md p-4 lg:my-8 overflow-hidden text-left lg:align-middle bg-gradient-primary drop-shadow-sm rounded-t-md lg:rounded-md">
                  <Connect.Title
                    as="h3"
                    className="text-lg font-medium text-text border-b-2 border-primary mb-1 pb-2"
                  >
                    <>
                      {!connected &&
                        !connecting &&
                        !waiting &&
                        t('connectWallet')}
                      {connected && !connecting && t('Account')}
                      {(waiting || connecting) && t('connectingWallet')}
                    </>
                  </Connect.Title>
                  <div className="mt-4 flex flex-col gap-y-3">
                    {!connected && !connecting && !waiting && (
                      <>
                        <Connect.MetamaskButton className="flex items-center px-4 py-2 text-sm font-medium text-left border-transparent rounded-full hover:bg-white">
                          <>
                            {!connected && <span>Metamask</span>}
                            {connecting && <span>{t('connectingWallet')}</span>}
                            <MetamaskIcon className="h-6 w-6 ml-auto" />
                          </>
                        </Connect.MetamaskButton>
                        <Connect.WalletConnectButton className="flex items-center px-4 py-2 text-sm font-medium text-left border border-transparent rounded-full hover:bg-white">
                          <>
                            {!connected && <span>WalletConnect</span>}
                            {connecting && <span>{t('connectingWallet')}</span>}
                            <WalletConnectIcon className="h-6 w-6 ml-auto" />
                          </>
                        </Connect.WalletConnectButton>
                      </>
                    )}
                    {(waiting || connecting) && (
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <Rotate />
                        <p className="text-text">{t('waitingWallet')}</p>
                      </div>
                    )}
                    {connected && account && (
                      <div className="flex px-2 py-4 border-primary justify-between items-center">
                        <div>
                          <p className="text-base font-medium">
                            {trimAccount(account, true)}
                          </p>
                        </div>
                        <Connect.DisconnectButton className="px-4 py-1 text-base font-medium text-text bg-transparent rounded-2xl border border-text hover:bg-text hover:text-white">
                          {t('Disconnect')}
                        </Connect.DisconnectButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Connect>
        )}
      </AnimatePresence>
    </>
  );
};

export const Rotate = () => (
  <motion.div
    className="flex items-center justify-center gap-x-2 my-8"
    variants={loadingContainerVariants}
    animate="end"
    initial="start"
  >
    <motion.span
      className="bg-primary rounded-full h-6 w-6"
      transition={bounceTransition}
      variants={loadingCircleVariants}
    />
    <motion.span
      className="bg-secondary rounded-full h-6 w-6"
      transition={bounceTransition}
      variants={loadingCircleVariants}
    />
    <motion.span
      className="bg-text rounded-full h-6 w-6"
      transition={bounceTransition}
      variants={loadingCircleVariants}
    />
  </motion.div>
);
