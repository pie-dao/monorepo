import { MultiChainContractWrapper } from '@sdk-utils/multichain';
import { Erc20Abi__factory } from '@shared/util-blockchain';
import { ethers } from 'ethers';
import { config } from '../../utils/networks';
import products from '../../config/products.json';

const mcw = new MultiChainContractWrapper(config);

export const productContracts = Object.entries(products).map(
  ([, value]) => value.addresses,
);

export const contractWrappers = productContracts.map((addresses) => {
  const contract = Erc20Abi__factory.connect(
    addresses[1].address,
    ethers.getDefaultProvider(),
  );
  return mcw.wrap(contract, addresses);
});
