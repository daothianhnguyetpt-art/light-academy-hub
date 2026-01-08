import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LightLawContent } from "./LightLawContent";
import { AuthMethodSelector } from "./AuthMethodSelector";
import { WalletType } from "./WalletOptions";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWalletConnect: (walletType: WalletType) => Promise<void>;
  isConnectingWallet: boolean;
  connectingWalletType: WalletType | null;
}

type DialogStep = "light-law" | "auth-methods";

export function AuthDialog({
  open,
  onOpenChange,
  onWalletConnect,
  isConnectingWallet,
  connectingWalletType,
}: AuthDialogProps) {
  const [step, setStep] = useState<DialogStep>("light-law");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleAcceptLightLaw = () => {
    // Store acceptance
    localStorage.setItem("light_law_accepted", "true");
    localStorage.setItem("light_law_accepted_at", new Date().toISOString());
    setStep("auth-methods");
  };

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
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error("Không thể đăng nhập với Google");
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async (walletType: WalletType) => {
    await onWalletConnect(walletType);
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep("light-law");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset to first step when closing
      setTimeout(() => setStep("light-law"), 300);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {step === "light-law" ? "Luật Ánh Sáng" : "Chọn Phương Thức Đăng Nhập"}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "light-law" ? (
            <motion.div
              key="light-law"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <LightLawContent />
              
              <div className="mt-6">
                <Button
                  onClick={handleAcceptLightLaw}
                  className="w-full btn-primary-gold h-12 text-base"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Con Đồng Ý & Tiếp Tục
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth-methods"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Quay lại
              </Button>

              <AuthMethodSelector
                onEmailLogin={handleEmailLogin}
                onEmailRegister={handleEmailRegister}
                onGoogleLogin={handleGoogleLogin}
                onWalletConnect={handleWalletConnect}
                isLoading={isLoading}
                isConnectingWallet={isConnectingWallet}
                connectingWalletType={connectingWalletType}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
