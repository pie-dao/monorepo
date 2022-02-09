import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks";
import { useMerkleAuthContract } from "../../hooks/useContract"
import { setAlert } from "../../store/app/app.slice";
import { Vault } from "../../store/vault/Vault";
import { setIsDepositor } from "../../store/vault/vault.slice";
import { AUXO_HELP_URL } from "../../utils";
import { getProof } from "../../utils/merkleProof";
import StyledButton from "../UI/button";
import LoadingSpinner from "../UI/loadingSpinner";
import ExternalUrl from "../UI/url";


export const useDepositor = (authAddress?: string, vaultAddress?: string) => {
  const [loading, setLoading] = useState(false);
  const [depositor, setDespositor] = useState(false);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const authContract = useMerkleAuthContract(authAddress);
  useEffect(() => {
    if (account && vaultAddress) {
      setLoading(true);
      authContract?.isDepositor(vaultAddress, account)
        .then(res => {
          dispatch(
            setIsDepositor({
              address: vaultAddress,
              isDepositor: res
            }))
            setDespositor(res);
        })
        .catch(() => console.warn('isDepositor failed'))
        .finally(() => setLoading(false))
    }
  }, [account, vaultAddress, authContract, dispatch]);
  return { loading, depositor }
}

const MerkleVerify = ({ vault }: { vault: Vault }): JSX.Element => {
  const { loading } = useDepositor(vault.auth.address, vault.address);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const authContract = useMerkleAuthContract(vault.auth.address);
  const isDepositor =  vault.auth.isDepositor;

  const proof = getProof(account);

  const submitProof = useCallback(async () => {
    if (proof && account) {
      try {
        const tx = await authContract?.authorizeDepositor(account, proof);
        await tx?.wait();
        const confirm = await authContract?.isDepositor(vault.address, account);
        if (confirm) {
          dispatch(
            setIsDepositor({
            address: vault.address,
            isDepositor: confirm
            })
          );

          dispatch(
            setAlert({
              message: 'Proof submitted, waiting to confirm',
              show: true,
              type: 'PENDING'
            })
          );
        }
      } catch (err) {
        dispatch(
          setAlert({
            message: 'There was a problem submitting the transaction',
            show: true,
            type: 'ERROR'
          })
        )
      }
    } else {
      console.warn('Proof or account missing')
    }
  }, [account, proof, authContract, dispatch, vault.address]);

  const needsToVerifyString = 'You need to verify before you can take this action'
  const verifiedString = 'Account has been verfied';
  const notAuthorizedString = 'This vault is restricted to veDOUGH holders only';
  
  return (
    <div className="p-5">{ 
      loading 
      ? <LoadingSpinner />
      :
      <>
      <p className="my-2 text-xl">{proof ? (isDepositor ? verifiedString : needsToVerifyString) : notAuthorizedString}</p>
      { 
        (!isDepositor && proof) && 
        <StyledButton onClick={() => submitProof()}>Opt In</StyledButton>
      }
      { 
        !isDepositor && 
        <ExternalUrl to={AUXO_HELP_URL}>
          <p className="underline text-purple-700 underline-offset-2 text-semibold">More Info</p>
        </ExternalUrl>
      }
      </>
    }</div>
  )
}

export default MerkleVerify