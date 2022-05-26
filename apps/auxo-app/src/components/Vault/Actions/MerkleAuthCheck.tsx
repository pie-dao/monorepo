import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useAppDispatch } from '../../../hooks';
import { useWeb3Cache } from '../../../hooks/useCachedWeb3';
import { useMerkleAuthContract } from '../../../hooks/multichain/useMultichainContract';
import { Vault } from '../../../store/vault/Vault';
import { thunkAuthorizeDepositor } from '../../../store/vault/vault.thunks';
import { AUXO_HELP_URL } from '../../../utils';
import { getProof } from '../../../utils/merkleProof';
import StyledButton from '../../UI/button';
import LoadingSpinner from '../../UI/loadingSpinner';
import ExternalUrl from '../../UI/url';

const veDoughLogo = process.env.PUBLIC_URL + '/veDough-only.png';

const MerkleVerify = ({ vault }: { vault: Vault }): JSX.Element => {
  const needsToVerifyString =
    'You need to verify before you can use this vault';
  const verifiedString = 'Account has been verfied';
  const notAuthorizedString =
    'This vault is restricted to veDOUGH holders only';

  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { chainId } = useWeb3Cache();
  const authContract = useMerkleAuthContract(vault.auth.address);
  const isDepositor = vault.auth.isDepositor;
  const [authorizing, setAuthorizing] = useState(false);

  const proof = getProof(account);
  const isDisabled = (): boolean => {
    const wrongNetwork = chainId !== vault.network.chainId;
    return authorizing || wrongNetwork || !proof;
  };

  const submitProof = () => {
    setAuthorizing(true);
    dispatch(
      thunkAuthorizeDepositor({
        account,
        auth: authContract,
      }),
    ).finally(() => setAuthorizing(false));
  };

  return (
    <div className="p-5 flex flex-col items-center justify-center">
      {false ? (
        <LoadingSpinner className="text-gray-600" spinnerClass="text-red" />
      ) : (
        <>
          {!isDepositor && (
            <div className="m-auto w-1/2">
              <img src={veDoughLogo} alt="veDough-holders-only" />
            </div>
          )}
          <p className="my-3 text-lg text-gray-700">
            {isDepositor
              ? proof
                ? verifiedString
                : needsToVerifyString
              : notAuthorizedString}
          </p>
          {isDepositor && (
            <FaCheckCircle size={28} className="fill-baby-blue-dark" />
          )}
          {!isDepositor && proof && (
            <StyledButton
              className="md:w-1/2"
              onClick={submitProof}
              disabled={isDisabled()}
            >
              {authorizing ? <LoadingSpinner /> : 'Opt In'}
            </StyledButton>
          )}
          {!isDepositor && (
            <ExternalUrl to={AUXO_HELP_URL}>
              <p className="underline text-baby-blue-dark underline-offset-2 text-semibold">
                More Info
              </p>
            </ExternalUrl>
          )}
        </>
      )}
    </div>
  );
};

export default MerkleVerify;
