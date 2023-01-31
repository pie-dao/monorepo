import { MetamaskIcon } from '@shared/ui-library';
import { useWeb3React } from '@web3-react/core';
import useTranslation from 'next-translate/useTranslation';
import { addTokenToWallet } from '../../utils/addTokenToWallet';

type AddToWalletProps = {
  token: string;
  displayName?: string;
};

const AddToWallet: React.FC<AddToWalletProps> = ({ token, displayName }) => {
  const { t } = useTranslation();
  const { chainId } = useWeb3React();
  return (
    <button
      className="flex ml-auto pr-2"
      onClick={async () => await addTokenToWallet(chainId, token)}
    >
      <div className="flex gap-x-2 items-center">
        <div className="flex gap-x-1">
          <span className="text-sub-dark underline text-sm hover:text-sub-light">
            {t('addTokenToWallet', {
              token: displayName ?? token,
            })}
          </span>
        </div>
        <MetamaskIcon className="h-5 w-5" />
      </div>
    </button>
  );
};

export default AddToWallet;
