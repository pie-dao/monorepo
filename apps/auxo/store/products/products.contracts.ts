import {
  MultiChainWrapperConfig,
  MultiChainContractWrapper,
} from '@sdk-utils/multichain';
import { MultiCallWrapper } from '@sdk-utils/multicall';
import {
  Erc20Abi__factory,
  TokenLockerAbi__factory,
  VeAUXOAbi__factory,
  SharesTimeLockAbi__factory,
  UpgradoorAbi__factory,
  RollStakerAbi__factory,
  MerkleDistributorAbi__factory,
  PRVAbi__factory,
  PRVMerkleVerifierAbi__factory,
  LendingPoolAbi__factory,
} from '@shared/util-blockchain';
import { ethers } from 'ethers';
import { config, MAINNET_RPC, SUPPORTED_CHAINS } from '../../utils/networks';
import products from '../../config/products.json';
import migration from '../../config/migration.json';
import lendingPools from '../../config/lendingPools.json';

const localRPC = MAINNET_RPC;

const selectedNetwork = 1;

const _config = config as MultiChainWrapperConfig;

const mcw = new MultiChainContractWrapper(_config);

const MAINNETMulticall = new MultiCallWrapper(
  _config[SUPPORTED_CHAINS.MAINNET.toString()].provider,
);

export const productContracts = Object.entries(products).map(
  ([, value]) => value.addresses,
);

export const contractWrappers = productContracts.map((addresses) => {
  const contract = Erc20Abi__factory.connect(
    addresses[selectedNetwork].address,
    new ethers.providers.JsonRpcProvider(localRPC),
  );
  return mcw.wrap(contract, addresses);
});

export const stakingContract = MAINNETMulticall.wrap(
  TokenLockerAbi__factory.connect(
    products['ARV'].addresses[selectedNetwork].stakingAddress,
    new ethers.providers.JsonRpcProvider(localRPC),
  ),
);

export const auxoContract = MAINNETMulticall.wrap(
  Erc20Abi__factory.connect(
    products['AUXO'].addresses[selectedNetwork].address,
    new ethers.providers.JsonRpcProvider(localRPC),
  ),
);

export const veAUXOContract = MAINNETMulticall.wrap(
  VeAUXOAbi__factory.connect(
    products['ARV'].addresses[selectedNetwork].address,
    new ethers.providers.JsonRpcProvider(localRPC),
  ),
);

export const xAUXOContract = MAINNETMulticall.wrap(
  PRVAbi__factory.connect(
    products['PRV'].addresses[selectedNetwork].address,
    new ethers.providers.JsonRpcProvider(localRPC),
  ),
);

export const rollStakerContract = MAINNETMulticall.wrap(
  RollStakerAbi__factory.connect(
    products['PRV'].addresses[selectedNetwork].rollStakerAddress,
    new ethers.providers.JsonRpcProvider(localRPC),
  ),
);

export const veDOUGHSharesTimeLock = MAINNETMulticall.wrap(
  SharesTimeLockAbi__factory.connect(
    migration['veDOUGH'].addresses[selectedNetwork].stakingAddress,
    new ethers.providers.JsonRpcProvider(localRPC),
  ),
);

export const Upgradoor = MAINNETMulticall.wrap(
  UpgradoorAbi__factory.connect(
    migration['veDOUGH'].addresses[selectedNetwork].upgradoorAddress,
    new ethers.providers.JsonRpcProvider(localRPC),
  ),
);

export const merkleDistributorContract = (token: string) =>
  MAINNETMulticall.wrap(
    MerkleDistributorAbi__factory.connect(
      products[token].addresses[selectedNetwork].merkleDistributorAddress,
      new ethers.providers.JsonRpcProvider(localRPC),
    ),
  );

export const PrvMerkleVerifierContract = MAINNETMulticall.wrap(
  PRVMerkleVerifierAbi__factory.connect(
    products['PRV'].addresses[selectedNetwork].PRVMerkleVerifierAddress,
    new ethers.providers.JsonRpcProvider(localRPC),
  ),
);

export const poolAddressesContracts = lendingPools.map((pool) => {
  return MAINNETMulticall.wrap(
    LendingPoolAbi__factory.connect(
      pool,
      new ethers.providers.JsonRpcProvider(localRPC),
    ),
  );
});
