import { motion } from "framer-motion";
import { Mail, UserPlus, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletOptions, WalletType } from "./WalletOptions";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/i18n/useTranslation";

interface AuthMethodSelectorProps {
  onEmailLogin: () => void;
  onEmailRegister: () => void;
  onGoogleLogin: () => void;
  onWalletConnect: (walletType: WalletType) => void;
  isLoading: boolean;
  isConnectingWallet: boolean;
  connectingWalletType: WalletType | null;
}

export function AuthMethodSelector({
  onEmailLogin,
  onEmailRegister,
  onGoogleLogin,
  onWalletConnect,
  isLoading,
  isConnectingWallet,
  connectingWalletType,
}: AuthMethodSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="font-display text-xl font-semibold text-foreground mb-1">
          {t('auth.chooseMethod')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('auth.loginOrRegister')}
        </p>
      </div>

      {/* Email Options */}
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="outline"
            className="w-full justify-start h-12 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
            onClick={onEmailLogin}
            disabled={isLoading}
          >
            <Mail className="w-5 h-5 mr-3 text-primary" />
            <span className="font-medium">{t('auth.emailLogin')}</span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="outline"
            className="w-full justify-start h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5"
            onClick={onEmailRegister}
            disabled={isLoading}
          >
            <UserPlus className="w-5 h-5 mr-3 text-muted-foreground" />
            <span className="font-medium">{t('auth.emailRegister')}</span>
          </Button>
        </motion.div>
      </div>

      <div className="relative py-2">
        <Separator className="bg-border/50" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
          {t('auth.orSeparator')}
        </span>
      </div>

      {/* Google Login */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="outline"
          className="w-full justify-start h-12 border-border/50 hover:border-red-300 hover:bg-red-50/50"
          onClick={onGoogleLogin}
          disabled={isLoading}
        >
          <Chrome className="w-5 h-5 mr-3 text-red-500" />
          <span className="font-medium">{t('auth.loginWithGoogle')}</span>
        </Button>
      </motion.div>

      <div className="relative py-2">
        <Separator className="bg-border/50" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
          {t('auth.connectWalletSeparator')}
        </span>
      </div>

      {/* Wallet Options */}
      <WalletOptions
        onConnect={onWalletConnect}
        isConnecting={isConnectingWallet}
        connectingWallet={connectingWalletType}
      />
    </div>
  );
}
