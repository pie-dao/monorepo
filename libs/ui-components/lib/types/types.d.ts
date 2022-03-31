import { ReactNode, ReactElement } from "react";
declare let __: "1D45E01E-AF44-47C4-988A-19A94EBAF55C";
export declare type __ = typeof __;
export declare type Expand<T> = T extends infer O ? {
    [K in keyof O]: O[K];
} : never;
export declare type PropsOf<TTag = any> = TTag extends React.ElementType ? React.ComponentProps<TTag> : never;
declare type PropsWeControl = "as" | "children" | "refName" | "className";
declare type CleanProps<TTag, TOmitableProps extends keyof any = __> = TOmitableProps extends __ ? Omit<PropsOf<TTag>, PropsWeControl> : Omit<PropsOf<TTag>, TOmitableProps | PropsWeControl>;
declare type OurProps<TTag, TSlot = any> = {
    as?: TTag;
    children?: ReactNode | ((bag: TSlot) => ReactElement);
    refName?: string;
};
declare type ClassNameOverride<TTag, TSlot = any> = PropsOf<TTag> extends {
    className?: any;
} ? {
    className?: string | ((bag: TSlot) => string);
} : {};
export declare type Props<TTag, TSlot = any, TOmitableProps extends keyof any = __> = CleanProps<TTag, TOmitableProps> & OurProps<TTag, TSlot> & ClassNameOverride<TTag, TSlot>;
declare type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export declare type XOR<T, U> = T | U extends __ ? never : T extends __ ? U : U extends __ ? T : T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
export declare const SUPPORTED_CHAINS: {
    readonly FANTOM: 250;
    readonly POLYGON: 137;
    readonly MAINNET: 1;
};
export declare type SUPPORTED_CHAIN_NAMES = keyof typeof SUPPORTED_CHAINS;
export declare type SUPPORTED_CHAIN_ID = typeof SUPPORTED_CHAINS[keyof typeof SUPPORTED_CHAINS];
export declare type NetworkDetail = {
    chainId: string;
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
export interface EthereumProvider {
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    autoRefreshOnNetworkChange?: boolean;
    request: ({ method, params }: {
        method: string;
        params?: any[];
    }) => any;
}
export interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}
declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}
export {};
