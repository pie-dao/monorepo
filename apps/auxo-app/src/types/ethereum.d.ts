export interface EthereumProvider {
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  autoRefreshOnNetworkChange?: boolean;
  request: ({ method, params }: { method: string; params?: any[] }) => any;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
