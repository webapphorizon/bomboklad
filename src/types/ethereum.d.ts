export interface EIP1193RequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

export type EthereumEventName =
  | `accountsChanged`
  | `chainChanged`
  | `connect`
  | `disconnect`;

export interface EthereumProvider {
  isMetaMask?: boolean;
  request<T = unknown>(args: EIP1193RequestArguments): Promise<T>;
  on?(event: EthereumEventName, handler: (...args: unknown[]) => void): void;
  removeListener?(
    event: EthereumEventName,
    handler: (...args: unknown[]) => void,
  ): void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};
