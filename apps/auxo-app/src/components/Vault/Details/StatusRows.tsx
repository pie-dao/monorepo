import { useWeb3React } from '@web3-react/core';
import { IoChevronBack, IoWarningOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useApy } from '../../../hooks/useApy';
import { Vault } from '../../../store/vault/Vault';
import { logoSwitcher } from '../../../utils/logos';
import { getProof } from '../../../utils/merkleProof';
import { chainMap, SUPPORTED_CHAIN_ID } from '../../../utils/networks';

export const VEDoughChecker = (): JSX.Element => {
  const { account } = useWeb3React();
  const hasVedough = getProof(account);
  return (
    <div className="bg-white rounded-md p-2 text-xs sm:text-sm lg:text-base">
      {hasVedough ? (
        <div className="font-bold px-2 text-baby-blue-dark">
          Account is a veDOUGH holder
        </div>
      ) : (
        <div className="flex items-center mx-5 bg-white font-bold rounded-md ">
          <IoWarningOutline className="text-return-100" />
          <p className="ml-2 text-return-100">veDOUGH access only</p>
        </div>
      )}
    </div>
  );
};

export const VEDoughStatusRow = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap items-center justify-between mt-5 px-1 sm:px-0 sm:mt-0">
      <div className="flex items-center text-baby-blue-dark">
        <button
          onClick={() => {
            navigate('/');
          }}
          className="bg-white rounded-md shadow-sm sm:shadow-md p-2 sm:p-3"
        >
          <IoChevronBack />
        </button>
      </div>
      <VEDoughChecker />
    </div>
  );
};

export const FloatingBackground = (): JSX.Element => {
  return (
    <div className="relative pt-1 mt-5 z-0 w-full">
      <div className="bg-baby-blue-light rounded-xl h-48 w-full absolute top-0 -z-20" />
      <div className="flex items-center justify-between w-full sm:justify-between m-3"></div>
    </div>
  );
};

export const VaultPoolAPY = ({ vault }: { vault: Vault | undefined }) => {
  let message = useApy(vault);
  if (message !== 'New Vault') message = message + ' APY';
  return (
    <div className="hidden lg:flex h-6 justify-start mb-5 items-center z-20">
      <div className="mr-2 h-8 w-8 relative flex justify-start">
        {logoSwitcher(vault?.symbol)}
        <div className="h-4 w-4 absolute -bottom-1 -right-1">
          {logoSwitcher(
            chainMap[vault?.network.chainId as SUPPORTED_CHAIN_ID]
              ?.nativeCurrency.symbol,
          )}
        </div>
      </div>
      <p className="ml-3 md:font-bold md:text-2xl text-gray-700">
        {vault?.symbol} pool{' '}
        <span className="font-extrabold text-return-100 mr-3">{message}</span>
      </p>
    </div>
  );
};
