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
      toast.error("Không thể cập nhật hồ sơ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await onConnectWallet();
      toast.success("Đã kết nối ví thành công!");
    } catch (error) {
      toast.error("Không thể kết nối ví");
    }
  };

  const displayWallet = currentWalletAddress || profile?.wallet_address;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Chỉnh Sửa Hồ Sơ
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
                    placeholder="Nhập URL ảnh đại diện..."
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
                  Dán URL ảnh từ internet (jpg, png, webp)
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
                Thay Đổi Ảnh
              </Button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Tên Hiển Thị</Label>
              <Input
                id="fullName"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicTitle">Danh Hiệu Học Thuật</Label>
              <Input
                id="academicTitle"
                placeholder="Tiên Phong Web3, Học Giả Blockchain..."
                value={academicTitle}
                onChange={(e) => setAcademicTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Giới Thiệu Bản Thân</Label>
              <Textarea
                id="bio"
                placeholder="Chia sẻ về hành trình học tập và đam mê của bạn..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                💡 Mẹo: Liệt kê các lĩnh vực quan tâm, cách nhau bằng dấu phẩy
              </p>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="space-y-2 pt-2 border-t border-border">
            <Label>Địa Chỉ Ví</Label>
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
                Kết Nối Ví Web3
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Ví dùng để nhận và lưu trữ Chứng Chỉ Linh Hồn (SBT)
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
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary-gold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu Thay Đổi"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
