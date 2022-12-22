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
          <p className="text-lg text-sub-dark">
            Hello there! It seems you want to test the Migration Interface,
            nice!. Yet, to do so, you&apos;ll first need to switch your MetaMask
            RPC URL to the Auxo testnet. Once the RPC is setup and your wallet
            is connected to the Testnet you&apos;ll be able to start testing.
            <span className="block font-bold">
              How to change the RPC? Follow the steps below:
            </span>
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
              <CopyToClipboard text="https://bestnet.alexintosh.com/rpc/d40e8c469c66ab48bd3f759dc1f815d1f2d49dfa" />
              <br /> with a chainID of{' '}
              <code className="p-1 bg-gray-200 rounded">1</code> and currency of{' '}
              <code className="p-1 bg-gray-200 rounded">ETH</code>.
            </li>
            <li>
              Click <span className="font-bold">“Save”.</span>
            </li>
            <li>Refresh the page and you should be good to go!</li>
          </ol>
        </div>
      </div>
    </>
  );
}
