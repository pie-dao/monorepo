import {
  MultiChainWrapperConfig,
  MultiChainContractWrapper,
} from '@sdk-utils/multichain';
import { MultiCallWrapper } from '@sdk-utils/multicall';
import {
  Erc20Abi__factory,
  YieldvaultAbi__factory,
} from '@shared/util-blockchain';
import { ethers } from 'ethers';
import { config, SUPPORTED_CHAINS } from '../../utils/networks';
import products from '../../config/products.json';
import { vaults } from '../../config/auxoVaults';
import { FTM } from '../../config/auxoVaults/FTM';
import { Polygon } from '../../config/auxoVaults/POLYGON';

const _config = config as MultiChainWrapperConfig;

const mcw = new MultiChainContractWrapper(_config);
const FTMmulticall = new MultiCallWrapper(
  _config[SUPPORTED_CHAINS.FANTOM.toString()].provider,
);
const PolygonMulticall = new MultiCallWrapper(
  _config[SUPPORTED_CHAINS.POLYGON.toString()].provider,
);

export const productContracts = Object.entries(products).map(
  ([, value]) => value.addresses,
);

export const vaultContracts = Object.entries(vaults).map(
  ([, value]) => value.address,
);

export const FTMContracts = Object.entries(FTM).map(
  ([, value]) => value.address,
);

export const PolygonContracts = Object.entries(Polygon).map(
  ([, value]) => value.address,
);

export const contractWrappers = productContracts.map((addresses) => {
  const contract = Erc20Abi__factory.connect(
    addresses[1].address,
    ethers.getDefaultProvider(),
  );
  return mcw.wrap(contract, addresses);
});

export const FTMContractWrappers = FTMContracts.map((address) => {
  const contract = YieldvaultAbi__factory.connect(
    address,
    ethers.getDefaultProvider(),
  );
  return FTMmulticall.wrap(contract);
});

export const PolygonContractWrappers = PolygonContracts.map((address) => {
  const contract = YieldvaultAbi__factory.connect(
    address,
    ethers.getDefaultProvider(),
  );
  return PolygonMulticall.wrap(contract);
});
