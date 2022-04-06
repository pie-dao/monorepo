export declare const SUPPORTED_CHAINS: {
    readonly FANTOM: 250;
    readonly POLYGON: 137;
    readonly MAINNET: 1;
};
export declare type SUPPORTED_CHAIN_NAMES = keyof typeof SUPPORTED_CHAINS;
export declare type SUPPORTED_CHAIN_ID = typeof SUPPORTED_CHAINS[keyof typeof SUPPORTED_CHAINS];
export declare type NetworkDetail = {
    chainId: string;
    blockTime: number;
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
};
export declare type ChainMap = Record<SUPPORTED_CHAIN_ID, NetworkDetail>;
