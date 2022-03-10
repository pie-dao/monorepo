import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { useMemo } from "react";
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { providers } from "@0xsequence/multicall";
import { Erc20 } from "../../types/artifacts/abi/Erc20";
import ERC20ABI from "../../abi/erc20.json";
import MonoABI from "../../abi/mono.json";
import MerkleAuthABI from "../../abi/MerkleAuth.json";
import VaultABI from "../../abi/Vault.json";
import { MerkleAuth, Mono, Vault as Auxo } from "../../types/artifacts/abi";
import { ProviderNotActivatedError } from "../../errors";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { useWeb3Cache } from "../useCachedWeb3";
import {
    useMerkleAuthAddresses,
    useTokenAddresses,
    useVaultAddresses,
    useVaultCapAddresses,
} from "../useAddresses";
import { LibraryProvider } from "../../types/utilities";
import { SUPPORTED_CHAIN_ID } from "../../utils/networks";
import { useMultipleProvider } from "./useMultipleWeb3Provider";
import { useProxySelector } from "../../store";


function getMulticallProvider(provider: LibraryProvider, multicallContract?: string | null): MulticallProvider {
    /**
     * Route multicalls through the deployed multicall contract
     */
    if (!multicallContract) return new providers.MulticallProvider(provider);
    return new providers.MulticallProvider(provider, {
        contract: multicallContract,
    });
}

function getSigner(library: LibraryProvider, account: string): JsonRpcSigner {
    return library.getSigner(account).connectUnchecked();
}

function getProviderOrSigner(
    provider: LibraryProvider,
    account?: string | null,
    multicallAddress?: string | null
): MulticallProvider | JsonRpcSigner {
    /**
     * We currently batch multiple reads through multicall contract
     */
    return !multicallAddress && account
        ? getSigner(provider, account)
        : getMulticallProvider(provider, multicallAddress);
}

const getContract = <T extends Contract>({
    provider, address, ABI, account, multicallAddress
}: {
    provider: LibraryProvider,
    address: string,
    ABI: any,
    account?: string | null
    multicallAddress?: string | null
}): T | undefined => {
    try {
        const providerSigner = getProviderOrSigner(
            provider,
            account,
            multicallAddress
        );
        return new Contract(address, ABI, providerSigner) as T;
    } catch (error) {
        console.error("Failed to get contract", error, address, ABI);
    }
};


type MultipleMulticallContractArgs = {
    address: string;
    multicallAddress: string | null;
    chainId: number;
    ABI: any
}

export const useMultipleContracts = <T extends Contract>(
    contractArgs: MultipleMulticallContractArgs[]
) => {
    const { account, library, chainId: currentChainId } = useWeb3React();
    const { getProviderForNetwork } = useMultipleProvider();

    return useMemo(() => {
        return contractArgs.map((args) => {
            // default to using the library provider
            let provider: LibraryProvider = library;

            if (currentChainId !== args.chainId) {
                // we need to use a backup provider
                provider = getProviderForNetwork(args.chainId);
            };

            const { address, ABI, multicallAddress } = args;
            return getContract<T>({
                provider, address, account, ABI, multicallAddress
            });
        });
    }, [contractArgs, getContract, currentChainId, account, library])
};


export function useMultipleMerkleAuthContract(
    args: Array<Omit<MultipleMulticallContractArgs, 'ABI'>>
): MerkleAuth[] {
    const merkleAuthArgs: MultipleMulticallContractArgs[] = args.map(a => ({ ...a, ABI: MerkleAuthABI }));
    return useMultipleContracts(merkleAuthArgs) as MerkleAuth[];
}

export function useMultipleAuxoContract(
    args: Array<Omit<MultipleMulticallContractArgs, 'ABI'>>
): Auxo[] {
    const auxoArgs: MultipleMulticallContractArgs[] = args.map(a => ({ ...a, ABI: VaultABI }));
    return useMultipleContracts(auxoArgs) as Auxo[];
}

export function useMultipleErc20Contract(
    args: Array<Omit<MultipleMulticallContractArgs, 'ABI'>>
): Erc20[] {
    const erc20Args: MultipleMulticallContractArgs[] = args.map(a => ({ ...a, ABI: ERC20ABI }));
    return useMultipleContracts(erc20Args) as Erc20[];
}

const useAuxoParams = (): Array<Omit<MultipleMulticallContractArgs, 'ABI'>> => {
    return useProxySelector(state => state.vault.vaults.map(v => ({
        address: v.address,
        chainId: v.network.chainId,
        multicallAddress: v.network.multicall
    })))
};

const useTokenParams = (): Array<Omit<MultipleMulticallContractArgs, 'ABI'>> => {
    const args = useProxySelector(state => state.vault.vaults.map(v => ({
        address: v.token.address,
        chainId: v.network.chainId,
        multicallAddress: v.network.multicall
    })));
    return args
}

const useAuthParams = (): Array<Omit<MultipleMulticallContractArgs, 'ABI'>> => {
    return useProxySelector(state => state.vault.vaults.map(v => ({
        address: v.auth.address,
        chainId: v.network.chainId,
        multicallAddress: v.network.multicall
    })))
}



export const useContracts = () => {
    const auxoParams = useAuxoParams();
    const tokenParams = useTokenParams();
    const authParams = useAuthParams();

    const tokenContracts = useMultipleErc20Contract(tokenParams);
    const auxoContracts = useMultipleAuxoContract(auxoParams);
    const authContracts = useMultipleMerkleAuthContract(authParams);
    return {
        auxoContracts,
        authContracts,
        tokenContracts,
    };
};