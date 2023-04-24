import { BigNumberish, constants, Signature } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import { JsonRpcSigner } from '@ethersproject/providers';
import { AUXOAbi, PRVAbi } from '@shared/util-blockchain';

export async function getPermitSignature(
  signer: JsonRpcSigner,
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
    token.nonces(signer._address),
    permitConfig?.name ?? token.name(),
    permitConfig?.version ?? '1',
    permitConfig?.chainId ?? signer.getChainId(),
  ]);

  return splitSignature(
    await signer._signTypedData(
      {
        name,
        version,
        chainId,
        verifyingContract: token.address,
      },
      {
        Permit: [
          {
            name: 'owner',
            type: 'address',
          },
          {
            name: 'spender',
            type: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
          },
          {
            name: 'nonce',
            type: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
          },
        ],
      },
      {
        owner: signer._address,
        spender,
        value,
        nonce,
        deadline,
      },
    ),
  );
}
