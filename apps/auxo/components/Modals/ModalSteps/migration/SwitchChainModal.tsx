import { Dialog } from '@headlessui/react';
import CopyToClipboard from '../../../../components/CopyText/CopyText';
import useTranslation from 'next-translate/useTranslation';

export default function SwitchChainModal() {
  const { t } = useTranslation('migration');

  return (
    <>
      <Dialog.Title
        as="h3"
        className="font-bold text-center text-xl text-primary capitalize w-full"
      >
        {t('notInTestnet')}
      </Dialog.Title>
      <div className="flex flex-col items-center justify-center w-full gap-y-6">
        <div className="mt-2">
          <p className="text-lg text-sub-dark mb-4">
            Hello there! It seems you want to test the Migration Interface,
            nice!. Yet, to do so, you&apos;ll first need to switch your MetaMask
            RPC URL to the Auxo testnet. Once the RPC is setup and your wallet
            is connected to the Testnet you&apos;ll be able to start testing.
          </p>
          <p className="text-lg text-sub-dark font-bold">
            How to change the RPC? Follow the steps below:
          </p>
          <ol className="list-decimal pl-5 text-lg text-sub-dark my-2">
            <li>
              Enter your MetaMask and click on your RPC endpoint at the top of
              your MetaMask. By default it says{' '}
              <span className="font-bold">“Ethereum Mainnet”</span>.
            </li>
            <li>
              Click <span className="font-bold">“Add Network”</span>.
            </li>
            <li className="leading-9">
              Add as RPC URL{' '}
              <CopyToClipboard text="https://bestnet.alexintosh.com/rpc/coccobello" />
              <br /> with a chainID of{' '}
              <code className="p-1 bg-gray-200 rounded">1</code> and currency of{' '}
              <code className="p-1 bg-gray-200 rounded">ETH</code>.
            </li>
            <li>
              Click <span className="font-bold">“Save”.</span>
            </li>
            <li>
              Now you should reset your MetaMask account. No worries this will
              only reset your MetaMask transaction history and nonce, a{' '}
              <span className="font-bold">completely safe operation.</span>
              <a
                className="text-primary underline inline-block"
                href="https://metamask.zendesk.com/hc/en-us/articles/360015488891-How-to-reset-an-account#:~:text=On%20Mobile%2C%20tap%20the%20hamburger,down%20and%20click%20Reset%20Account"
                target="_blank"
                rel="noopener noreferrer"
              >
                Here you can find how to do it.
              </a>
            </li>
            <li>Refresh the page and you should be good to go!</li>
          </ol>
        </div>
      </div>
    </>
  );
}
