import { useEffect, useState } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import type { TokenSymbol } from '@web3-onboard/common';
import Image from 'next/image';
import trimAccount from '../../utils/trimAccount';
import useTranslation from 'next-translate/useTranslation';
import classNames from '../../utils/classnames';

interface Account {
  address: string;
  balance: Record<TokenSymbol, string> | null;
  ens: { name: string | undefined; avatar: string | undefined };
}

export default function ConnectWallet() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [account, setAccount] = useState<Account | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (wallet?.provider) {
      const { name, avatar } = wallet?.accounts[0]?.ens ?? {};
      setAccount({
        address: wallet.accounts[0].address,
        balance: wallet.accounts[0].balance,
        ens: { name, avatar: avatar?.url },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, wallet?.accounts[0]?.ens]);

  return (
    <div
      className={classNames(wallet?.provider && account ? 'invisible' : null)}
    >
      <button
        className="px-4 py-1 text-base font-medium text-text bg-transparent rounded-2xl border border-text hover:bg-text hover:text-white h-[34px]"
        disabled={connecting}
        onClick={() => connect()}
      >
        {t('connectWallet')}
      </button>
    </div>
  );
}
