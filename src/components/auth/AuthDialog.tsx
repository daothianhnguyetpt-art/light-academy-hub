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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
        
        {/* Particles */}
        <Particles count={10} />
        
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
              className="relative z-10"
            >
              <LightLawContent />
              
              <div className="mt-6">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 15px hsl(var(--gold) / 0.2)",
                      "0 0 30px hsl(var(--gold) / 0.4)",
                      "0 0 15px hsl(var(--gold) / 0.2)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-md"
                >
                  <Button
                    onClick={handleAcceptLightLaw}
                    className="w-full btn-primary-gold h-12 text-base"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Con Đồng Ý & Tiếp Tục
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth-methods"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
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
