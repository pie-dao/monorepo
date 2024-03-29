import { useSetChain } from '@web3-onboard/react';
import useTranslation from 'next-translate/useTranslation';
import { addTokenToWallet } from '../../utils/addTokenToWallet';

type AddToWalletProps = {
  token: string;
  displayName?: string;
};

const AddToWallet: React.FC<AddToWalletProps> = ({ token, displayName }) => {
  const { t } = useTranslation();
  const [{ connectedChain }] = useSetChain();

  return (
    <button
      className="flex ml-auto pr-2"
      onClick={async () =>
        await addTokenToWallet(
          isNaN(Number(connectedChain?.id)) ? 1 : Number(connectedChain?.id),
          token,
          displayName,
        )
      }
    >
      <div className="flex gap-x-2 items-center">
        <div className="hidden sm:flex gap-x-1">
          <span className="text-sub-dark underline text-sm hover:text-secondary">
            {t('addTokenToWallet', {
              token: displayName ?? token,
            })}
          </span>
        </div>
      </div>
    </button>
  );
};

export default AddToWallet;
