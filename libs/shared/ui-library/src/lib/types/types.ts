import { ReactNode, ReactElement } from 'react';

// A unique placeholder we can use as a default. This is nice because we can use this instead of
// defaulting to null / never / ... and possibly collide with actual data.
// Ideally we use a unique symbol here.
const __ = '1D45E01E-AF44-47C4-988A-19A94EBAF55C' as const;
export type __ = typeof __;

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type PropsOf<TTag = any> = TTag extends React.ElementType
  ? React.ComponentProps<TTag>
  : never;

type PropsWeControl = 'as' | 'children' | 'refName' | 'className';

// Resolve the props of the component, but ensure to omit certain props that we control
type CleanProps<
  TTag,
  TOmitableProps extends keyof any = __,
> = TOmitableProps extends __
  ? Omit<PropsOf<TTag>, PropsWeControl>
  : Omit<PropsOf<TTag>, TOmitableProps | PropsWeControl>;

// Add certain props that we control
type OurProps<TTag, TSlot = any> = {
  as?: TTag;
  children?: ReactNode | ((bag: TSlot) => ReactElement);
  refName?: string;
};

// Conditionally override the `className`, to also allow for a function
// if and only if the PropsOf<TTag> already define `className`.
// This will allow us to have a TS error on as={Fragment}
type ClassNameOverride<TTag, TSlot = any> = PropsOf<TTag> extends {
  className?: any;
}
  ? { className?: string | ((bag: TSlot) => string) }
  : // eslint-disable-next-line @typescript-eslint/ban-types
    {};

// Provide clean TypeScript props, which exposes some of our custom API's.
export type Props<
  TTag,
  TSlot = any,
  TOmitableProps extends keyof any = __,
> = CleanProps<TTag, TOmitableProps> &
  OurProps<TTag, TSlot> &
  ClassNameOverride<TTag, TSlot>;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends __
  ? never
  : T extends __
  ? U
  : U extends __
  ? T
  : T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export const SUPPORTED_CHAINS = {
  FANTOM: 250,
  POLYGON: 137,
  GOERLI: 5,
  MAINNET: 1,
} as const;

export type SUPPORTED_CHAIN_NAMES = keyof typeof SUPPORTED_CHAINS;

export type SUPPORTED_CHAIN_ID =
  typeof SUPPORTED_CHAINS[keyof typeof SUPPORTED_CHAINS];

export type NetworkDetail = {
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
export type ChainMap = Record<SUPPORTED_CHAIN_ID, NetworkDetail>;

export interface EthereumProvider {
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  autoRefreshOnNetworkChange?: boolean;
  request: ({ method, params }: { method: string; params?: any[] }) => any;
  networkVersion?: string;
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
