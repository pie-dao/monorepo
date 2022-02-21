import { useWeb3React } from "@web3-react/core";
import { useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useAppDispatch } from "../../../hooks";
import { useMerkleAuthContract } from "../../../hooks/useContract"
import { usePendingTransaction } from "../../../hooks/useTransactionHandler";
import { setAlert } from "../../../store/app/app.slice";
import { Vault } from "../../../store/vault/Vault";
import { setIsDepositor } from "../../../store/vault/vault.slice";
import { AUXO_HELP_URL } from "../../../utils";
import { getProof } from "../../../utils/merkleProof";
import StyledButton from "../../UI/button";
import LoadingSpinner from "../../UI/loadingSpinner";
import ExternalUrl from "../../UI/url";

const veDoughLogo = process.env.PUBLIC_URL + '/veDough-only.png'

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
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const authContract = useMerkleAuthContract(vault.auth.address);
  const isDepositor =  vault.auth.isDepositor;
  const txPending = usePendingTransaction();

  const first = useRef(false);

  useEffect(() => {
    if (!first) {
      dispatch(setAlert({
        message: 'Authorization confirmed',
        type: 'SUCCESS'
      }))
    }
  }, [isDepositor, dispatch])

  const proof = getProof(account);

  const submitProof = useCallback(async () => {
    if (proof && account) {
      try {
        const tx = await authContract?.authorizeDepositor(account, proof);
        await tx?.wait();

        const confirm = await authContract?.isDepositor(vault.address, account);
        console.debug({ confirm })
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
              type: 'PENDING'
            })
          );
        }
      } catch (err) {
        dispatch(
          setAlert({
            message: 'There was a problem submitting the transaction',
            type: 'ERROR'
          })
        )
      }
    } else {
      console.warn('Proof or account missing')
    }
  }, [account, proof, authContract, dispatch, vault.address]);

  const needsToVerifyString = 'You need to verify before you can use this vault'
  const verifiedString = 'Account has been verfied';
  const notAuthorizedString = 'This vault is restricted to veDOUGH holders only';

  return (
    <div className="p-5 flex flex-col items-center justify-center">{ 
      false 
      ? <LoadingSpinner className="text-gray-600" spinnerClass="text-red"/>
      :
      <>
      { !isDepositor &&
        <div className="m-auto w-1/2">
          <img src={veDoughLogo} alt="veDough-holders-only"/>
        </div>
      }
      <p className="my-3 text-lg text-gray-700">{isDepositor ? (proof ? verifiedString : needsToVerifyString) : notAuthorizedString}</p>
      {
        isDepositor && <FaCheckCircle size={28} className="fill-baby-blue-dark" />
      }
      { 
        (!isDepositor && proof) && 
        <StyledButton className="md:w-1/2" onClick={() => submitProof()} disabled={txPending}>Opt In</StyledButton>
      }
      { 
        !isDepositor && 
        <ExternalUrl to={AUXO_HELP_URL}>
          <p className="underline text-baby-blue-dark underline-offset-2 text-semibold">More Info</p>
        </ExternalUrl>
      }
      </>
    }</div>
  )
}

export default MerkleVerify