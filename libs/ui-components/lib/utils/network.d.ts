import { ChainMap, SUPPORTED_CHAIN_NAMES } from "../types/types";
export declare const chainMap: ChainMap;
export declare const supportedChains: string[];
export declare const supportedChainIds: number[];
export declare const isChainSupported: (chainId: number | undefined) => boolean;
export declare const filteredChainMap: (allowedChains: SUPPORTED_CHAIN_NAMES[]) => {
    250?: import("../types/types").NetworkDetail | undefined;
    137?: import("../types/types").NetworkDetail | undefined;
    1?: import("../types/types").NetworkDetail | undefined;
};
/**
 * You cannot add mainnet as a network, so first we attempt to switch, then check the error code
 * At time of writing this works fine for the user but metamask logs its own error, which is messy.
 */
export declare const addNetwork: ({ chainId, }: {
    chainId: number | null | undefined;
}) => Promise<unknown>;
export declare const switchNetwork: ({ chainId, }: {
    chainId: number | null | undefined;
}) => Promise<unknown>;
export declare const changeNetwork: ({ chainId, }: {
    chainId: number | null | undefined;
}) => Promise<unknown>;
