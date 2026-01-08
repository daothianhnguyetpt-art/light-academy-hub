import { useState, useCallback, useEffect } from "react";

export type WalletType = "metamask" | "bitget" | "trust";

interface WalletState {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  connectingWallet: WalletType | null;
  error: string | null;
  walletType: WalletType | null;
}

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    bitkeep?: {
      ethereum?: EthereumProvider;
    };
    trustwallet?: {
      ethereum?: EthereumProvider;
    };
  }
}

const getProvider = (walletType: WalletType): EthereumProvider | undefined => {
  switch (walletType) {
    case "metamask":
      return window.ethereum?.isMetaMask ? window.ethereum : undefined;
    case "bitget":
      return window.bitkeep?.ethereum;
    case "trust":
      return window.trustwallet?.ethereum || window.ethereum;
    default:
      return window.ethereum;
  }
};

const getDownloadUrl = (walletType: WalletType): string => {
  switch (walletType) {
    case "metamask":
      return "https://metamask.io/download/";
    case "bitget":
      return "https://web3.bitget.com/";
    case "trust":
      return "https://trustwallet.com/";
    default:
      return "https://metamask.io/download/";
  }
};

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    isConnecting: false,
    connectingWallet: null,
    error: null,
    walletType: null,
  });

  const checkConnection = useCallback(async () => {
    // Try to find any connected wallet
    const providers: { type: WalletType; provider: EthereumProvider | undefined }[] = [
      { type: "metamask", provider: window.ethereum?.isMetaMask ? window.ethereum : undefined },
      { type: "bitget", provider: window.bitkeep?.ethereum },
      { type: "trust", provider: window.trustwallet?.ethereum },
    ];

    for (const { type, provider } of providers) {
      if (provider) {
        try {
          const accounts = await provider.request({ method: "eth_accounts" }) as string[];
          if (accounts.length > 0) {
            setWallet({
              isConnected: true,
              address: accounts[0],
              isConnecting: false,
              connectingWallet: null,
              error: null,
              walletType: type,
            });
            return;
          }
        } catch (err) {
          console.error(`Error checking ${type} connection:`, err);
        }
      }
    }
  }, []);

  const connectWallet = useCallback(async (walletType: WalletType = "metamask") => {
    const provider = getProvider(walletType);
    
    if (!provider) {
      setWallet((prev) => ({
        ...prev,
        error: `Vui lòng cài đặt ${walletType === "metamask" ? "MetaMask" : walletType === "bitget" ? "Bitget Wallet" : "Trust Wallet"}`,
      }));
      window.open(getDownloadUrl(walletType), "_blank");
      return;
    }

    setWallet((prev) => ({ 
      ...prev, 
      isConnecting: true, 
      connectingWallet: walletType,
      error: null 
    }));

    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      }) as string[];

      if (accounts.length > 0) {
        setWallet({
          isConnected: true,
          address: accounts[0],
          isConnecting: false,
          connectingWallet: null,
          error: null,
          walletType,
        });
      }
    } catch (err) {
      const error = err as { code?: number; message?: string };
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        connectingWallet: null,
        error: error.code === 4001 ? "Người dùng từ chối kết nối" : "Không thể kết nối ví",
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      isConnecting: false,
      connectingWallet: null,
      error: null,
      walletType: null,
    });
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum === "undefined") return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accountsArray = accounts as string[];
      if (accountsArray.length === 0) {
        disconnectWallet();
      } else {
        setWallet((prev) => ({
          ...prev,
          address: accountsArray[0],
        }));
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    checkConnection();

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [checkConnection, disconnectWallet]);

  return {
    ...wallet,
    connectWallet,
    disconnectWallet,
  };
}
