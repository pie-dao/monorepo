import { MetamaskIcon } from '@shared/ui-library';
import { useWeb3React } from '@web3-react/core';
import useTranslation from 'next-translate/useTranslation';
import { addTokenToWallet, tokenName } from '../../utils/addTokenToWallet';

type AddToWalletProps = {
  token: tokenName;
};

const AddToWallet: React.FC<AddToWalletProps> = ({ token }) => {
  const { t } = useTranslation();
  const { chainId } = useWeb3React();
  return (
    <button
      className="flex ml-auto pr-2"
      onClick={async () => await addTokenToWallet(chainId, token)}
    >
      <div className="flex gap-x-2 items-center">
        <div className="hidden lg:flex gap-x-1">
          <span className="text-sub-dark underline text-sm hover:text-sub-light">
            {t('addTokenToWallet', {
              token,
            })}
          </span>
        </div>
        <MetamaskIcon className="h-5 w-5" />
      </div>
    </button>
  );
};

export default AddToWallet;
