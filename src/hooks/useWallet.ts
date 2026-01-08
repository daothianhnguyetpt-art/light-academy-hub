import { useState, useCallback, useEffect } from "react";

interface WalletState {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  error: string | null;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    isConnecting: false,
    error: null,
  });

  const checkConnection = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
      if (accounts.length > 0) {
        setWallet({
          isConnected: true,
          address: accounts[0],
          isConnecting: false,
          error: null,
        });
      }
    } catch (err) {
      console.error("Error checking wallet connection:", err);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      setWallet((prev) => ({
        ...prev,
        error: "Please install MetaMask or another Web3 wallet",
      }));
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }) as string[];

      if (accounts.length > 0) {
        setWallet({
          isConnected: true,
          address: accounts[0],
          isConnecting: false,
          error: null,
        });
      }
    } catch (err) {
      const error = err as { code?: number; message?: string };
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.code === 4001 ? "Connection rejected by user" : "Failed to connect wallet",
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      isConnecting: false,
      error: null,
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
