import type { EthereumProvider } from "~/types/ethereum";

export interface WalletConnectionResult {
  address: string;
  chainIdHex: string;
}

function pickBestProvider(
  ethereum: EthereumProvider | undefined,
): EthereumProvider | null {
  if (!ethereum) return null;
  const multi = (ethereum as unknown as { providers?: EthereumProvider[] })
    .providers;
  if (Array.isArray(multi) && multi.length > 0) {
    const metaMaskProvider = multi.find(
      (p) => Boolean(p) && p.isMetaMask === true,
    );
    return metaMaskProvider ?? multi[0] ?? null;
  }
  return ethereum;
}

export function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  return pickBestProvider(window.ethereum);
}

export async function connectMetaMask(): Promise<WalletConnectionResult> {
  const provider = getEthereumProvider();
  if (!provider) {
    throw new Error("Ethereum provider not found. Please install MetaMask.");
  }

  const accounts = await provider.request<string[]>({
    method: "eth_requestAccounts",
  });

  const [address] = accounts;
  if (!address) {
    throw new Error("No accounts returned by MetaMask");
  }

  const chainIdHex = await provider.request<string>({ method: "eth_chainId" });

  return { address, chainIdHex };
}

export function shortenAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
