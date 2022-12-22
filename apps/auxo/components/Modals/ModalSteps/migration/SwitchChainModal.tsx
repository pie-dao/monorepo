import { Dialog } from '@headlessui/react';
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
            We are currently in testing mode, so, before proceeding, you&apos;ll
            have to switch your MetaMask RPC url to the Auxo testnet to
            continue. Until you do so, you will not be able to interact with
            migration portal.
            <span className="block">
              In order to do so, please follow the steps below:
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
            <li>
              Add the RPC URL you want to use, with a chainID of{' '}
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
