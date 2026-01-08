import { motion } from "framer-motion";
import { Wallet, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export type WalletType = "metamask" | "bitget" | "trust";

interface WalletOptionsProps {
  onConnect: (walletType: WalletType) => void;
  isConnecting: boolean;
  connectingWallet: WalletType | null;
}

const wallets = [
  {
    type: "metamask" as WalletType,
    name: "MetaMask",
    icon: "🦊",
    downloadUrl: "https://metamask.io/download/",
    detect: () => typeof window !== "undefined" && !!(window as any).ethereum?.isMetaMask,
  },
  {
    type: "bitget" as WalletType,
    name: "Bitget Wallet",
    icon: "💼",
    downloadUrl: "https://web3.bitget.com/",
    detect: () => typeof window !== "undefined" && !!(window as any).bitkeep,
  },
  {
    type: "trust" as WalletType,
    name: "Trust Wallet",
    icon: "🛡️",
    downloadUrl: "https://trustwallet.com/",
    detect: () => typeof window !== "undefined" && !!(window as any).trustwallet,
  },
];

export function WalletOptions({ onConnect, isConnecting, connectingWallet }: WalletOptionsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Kết Nối Ví Web3</span>
      </div>
      
      {wallets.map((wallet, index) => {
        const isInstalled = wallet.detect();
        const isThisConnecting = isConnecting && connectingWallet === wallet.type;
        
        return (
          <motion.div
            key={wallet.type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              className="w-full justify-between h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5"
              onClick={() => {
                if (isInstalled) {
                  onConnect(wallet.type);
                } else {
                  window.open(wallet.downloadUrl, "_blank");
                }
              }}
              disabled={isConnecting}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{wallet.icon}</span>
                <span className="font-medium">{wallet.name}</span>
              </div>
              
              {isThisConnecting ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : isInstalled ? (
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  Đã cài
                </span>
              ) : (
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </motion.div>
        );
      })}
      
      <p className="text-xs text-muted-foreground text-center pt-2">
        Chưa có ví? Bấm vào để tải về
      </p>
    </div>
  );
}
