import { BytesLike } from "@ethersproject/bytes";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks";
import { useMerkleAuthContract, useMonoVaultContract } from "../../hooks/useContract"
import { useSelectedVault } from "../../hooks/useSelectedVault"
import MerkleProofs from '../../static/stakers-merkle-tree.json';
import { useProxySelector } from "../../store";
import { Vault } from "../../store/vault/Vault";
import { setIsDepositor } from "../../store/vault/vault.slice";
import { checkForEvent } from "../../utils/event";
import StyledButton from "../UI/button";

const getProof = (account?: string | null): BytesLike[] | undefined => {
  const input = MerkleProofs[account as keyof typeof MerkleProofs];
  return input;
}

export const useDepositor = (authAddress?: string, vaultAddress?: string) => {
  const [loading, setLoading] = useState(false);
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
        })
        .catch(() => console.warn('isDepositor failed'))
        .finally(() => setLoading(false))
    }
  }, [account, vaultAddress]);
  return loading
}

const MerkleVerify = ({ vault }: { vault: Vault }): JSX.Element => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const authContract = useMerkleAuthContract(vault.auth.address);
  const isDepositor = vault.auth.isDepositor;
  const proof = getProof(account)
  const submitProof = useCallback(async () => {
    if (proof && account) {
      try {
        const tx = await authContract?.authorizeDepositor(account, proof);
        await tx?.wait();
        const confirm = await authContract?.isDepositor(vault.address, account);
        if (confirm) dispatch(
          setIsDepositor({
            address: vault.address,
            isDepositor: confirm
          })
        )
      } catch (err) {
        console.warn(err);
      }
    } else {
      console.warn('Proof or account missing')
    }
  }, [account, proof])
  const needsToVerifyString = 'You Need to verify before you can take this action'
  const verifiedString = 'Account has been verfied';
  const notAuthorizedString = 'This vault is restricted to veDOUGH holders only';
  return (
    <div className="border-2 border-red-400 p-5">
      <p className="my-2 text-xl">{proof ? (isDepositor ? verifiedString : needsToVerifyString) : notAuthorizedString}</p>
      { proof && <StyledButton onClick={() => submitProof()}>Opt In</StyledButton>}
    </div>
  )
}

export default MerkleVerify