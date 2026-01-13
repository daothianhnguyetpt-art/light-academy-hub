import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/hooks/useProfile";
import { WalletType } from "@/components/auth/WalletOptions";
import { Pencil, Wallet, Loader2, X, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/i18n/useTranslation";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<boolean>;
  onConnectWallet: (walletType?: WalletType) => Promise<void>;
  currentWalletAddress?: string;
}

export function EditProfileModal({
  open,
  onOpenChange,
  profile,
  onUpdate,
  onConnectWallet,
  currentWalletAddress,
}: EditProfileModalProps) {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [academicTitle, setAcademicTitle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  // Sync form with profile data when modal opens
  useEffect(() => {
    if (profile && open) {
      setFullName(profile.full_name || "");
      setAcademicTitle(profile.academic_title || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatar_url || "");
      setShowAvatarInput(false);
    }
  }, [profile, open]);

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const success = await onUpdate({
        full_name: fullName || null,
        academic_title: academicTitle || null,
        bio: bio || null,
        avatar_url: avatarUrl || null,
      });

      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      toast.error(t("profile.editModal.updateFailed") || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await onConnectWallet();
      toast.success(t("profile.editModal.walletConnected") || "Wallet connected!");
    } catch (error) {
      toast.error(t("auth.walletConnectFailed"));
    }
  };

  const displayWallet = currentWalletAddress || profile?.wallet_address;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            {t("profile.editModal.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24 border-4 border-gold-muted">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl font-bold">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>

            {showAvatarInput ? (
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={t("profile.editModal.avatarUrl")}
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAvatarInput(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {t("profile.editModal.avatarHint") || "Paste image URL (jpg, png, webp)"}
                </p>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAvatarInput(true)}
                className="border-gold-muted hover:bg-accent"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                {t("profile.editModal.changeAvatar") || "Change Avatar"}
              </Button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("profile.editModal.fullName")}</Label>
              <Input
                id="fullName"
                placeholder={t("auth.fullName")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicTitle">{t("profile.editModal.academicTitle")}</Label>
              <Input
                id="academicTitle"
                placeholder={t("profile.pioneer")}
                value={academicTitle}
                onChange={(e) => setAcademicTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t("profile.editModal.bio")}</Label>
              <Textarea
                id="bio"
                placeholder={t("profile.editModal.bioPlaceholder") || "Share your learning journey..."}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {t("profile.editModal.bioTip") || "💡 Tip: List your interests, separated by commas"}
              </p>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="space-y-2 pt-2 border-t border-border">
            <Label>{t("profile.editModal.wallet")}</Label>
            {displayWallet ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/50 border border-border">
                <Wallet className="w-4 h-4 text-secondary" />
                <span className="font-mono text-sm flex-1 truncate">
                  {displayWallet}
                </span>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={handleConnectWallet}
                className="w-full border-gold-muted hover:bg-accent"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {t("profile.editModal.connectWallet")}
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              {t("profile.editModal.walletHint") || "Wallet for receiving and storing Soul Certificates (SBT)"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary-gold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("profile.editModal.saving")}
              </>
            ) : (
              t("common.save")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
