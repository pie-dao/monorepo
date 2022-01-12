import { useWeb3React } from "@web3-react/core";
import { InsufficientBalanceError } from "../errors";
import { useContract, useMonoVaultContract } from "./useContract";

const useEnterBatchBurn = (vaultAddress: string, amount: number): void => {
  /**
   * Withdrawal requires first entering the batch burn process, then waiting a certain period.
   * @param monoToken is the ERC20 of the monoVault burnable token
   */
  const { account } = useWeb3React();
  const contract = useMonoVaultContract(vaultAddress);

  // this we can fetch from the store
  // const _userHasBalance = await userHasBalance(monoToken, userAddress, amount);

  // if (_userHasBalance) {
    // const decimals = await monoToken.decimals();
    // await contract.enterBatchBurn(toScale(amount, decimals));
  // } else {
    // throw new InsufficientBalanceError();
  // }
}