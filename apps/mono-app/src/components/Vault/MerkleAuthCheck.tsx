import { useMonoVaultContract } from "../../hooks/useContract"
import { useSelectedVault } from "../../hooks/useSelectedVault"

const MerkleVerify = (): JSX.Element => {
  const vault = useSelectedVault();
  const tokenAddresses = useMonoVaultContract(vault?.address);
  return (
    <div>{JSON.stringify(vault)}</div>
  )
}

export default MerkleVerify