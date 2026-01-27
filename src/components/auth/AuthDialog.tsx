import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthMethodSelector } from "./AuthMethodSelector";
import { WalletType } from "./WalletOptions";
import { Particles } from "@/components/effects/Particles";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWalletConnect: (walletType: WalletType) => Promise<void>;
  isConnectingWallet: boolean;
  connectingWalletType: WalletType | null;
}

export function AuthDialog({
  open,
  onOpenChange,
  onWalletConnect,
  isConnectingWallet,
  connectingWalletType,
}: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleEmailLogin = () => {
    onOpenChange(false);
    navigate("/auth");
  };

  const handleEmailRegister = () => {
    onOpenChange(false);
    navigate("/auth?tab=register");
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Set flag for celebration after redirect
      localStorage.setItem("pending_celebration", "true");
      const { error } = await signInWithGoogle();
      if (error) {
        localStorage.removeItem("pending_celebration");
        toast.error("Không thể đăng nhập với Google");
      }
    } catch (err) {
      localStorage.removeItem("pending_celebration");
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async (walletType: WalletType) => {
    await onWalletConnect(walletType);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl max-w-[95vw] relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
        
        {/* Particles */}
        <Particles count={10} />
        
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-xl font-display">
            <Sparkles className="w-5 h-5 text-secondary" />
            Chọn Phương Thức Đăng Nhập
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10">
          <AuthMethodSelector
            onEmailLogin={handleEmailLogin}
            onEmailRegister={handleEmailRegister}
            onGoogleLogin={handleGoogleLogin}
            onWalletConnect={handleWalletConnect}
            isLoading={isLoading}
            isConnectingWallet={isConnectingWallet}
            connectingWalletType={connectingWalletType}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
