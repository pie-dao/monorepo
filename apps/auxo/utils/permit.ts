import { BigNumberish, constants, Signature } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import { AUXOAbi, PRVAbi } from '@shared/util-blockchain';
import { EIP1193Provider } from '@web3-onboard/core';

export async function getPermitSignature(
  signer: EIP1193Provider,
  account: string,
  token: AUXOAbi | PRVAbi,
  spender: string,
  value: BigNumberish = constants.MaxUint256,
  deadline: BigNumberish = constants.MaxUint256,
  permitConfig?: {
    name?: string;
    chainId?: number;
    version?: string;
  },
): Promise<Signature> {
  const [nonce, name, version, chainId] = await Promise.all([
    token.nonces(account),
    permitConfig?.name ?? token.name(),
    permitConfig?.version ?? '1',
    signer.request({ method: 'eth_chainId' }) ?? 1,
  ]);

  const msgParams = JSON.stringify({
    domain: {
      chainId,
      name,
      verifyingContract: token.address,
      version,
    },
    primaryType: 'Permit',
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },

    message: {
      owner: account,
      spender: spender,
      value: value,
      nonce: nonce.toString(),
      deadline: deadline,
    },
  });

  const eip712Request = {
    method: 'eth_signTypedData_v4',
    params: [account, msgParams],
  };

  const myReq = (await signer.request(eip712Request)) as string;

  return splitSignature(myReq);
}
