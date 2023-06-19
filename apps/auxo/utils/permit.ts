import { BigNumberish, constants, Signature } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import { AUXOAbi, PRVAbi } from '@shared/util-blockchain';
import { WalletState } from '@web3-onboard/core';
import { _TypedDataEncoder } from '@ethersproject/hash';

export async function getPermitSignature(
  wallet: WalletState,
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
    wallet?.provider.request({ method: 'eth_chainId' }) ?? 1,
  ]);

  const msgParams = {
    domain: {
      chainId,
      name,
      verifyingContract: token.address,
      version,
    },
    types: {
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
  };

  const eip712Encoded = JSON.stringify(
    _TypedDataEncoder.getPayload(
      msgParams.domain,
      msgParams.types,
      msgParams.message,
    ),
  );

  const eip712Request = {
    method: 'eth_signTypedData_v4',
    params: [account.toLowerCase(), eip712Encoded],
  };

  const signatureRequest = (await wallet?.provider.request(
    eip712Request,
  )) as string;

  return splitSignature(signatureRequest);
}
