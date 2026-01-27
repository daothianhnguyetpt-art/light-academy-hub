import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LightLawRedirectModalProps {
  open: boolean;
  onConfirm: () => void;
  onContinueAsGuest: () => void;
}

export function LightLawRedirectModal({
  open,
  onConfirm,
  onContinueAsGuest,
}: LightLawRedirectModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md border-primary/20 bg-gradient-to-b from-background to-primary/5"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        // Hide close button by not rendering it
        hideCloseButton
      >
        {/* Header with emojis */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-3 animate-pulse">🌟 ✨ 🌟</div>
          <DialogTitle className="text-xl font-display leading-relaxed">
            Chào mừng bạn đến với
            <br />
            <span className="bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent font-bold">
              FUN Ecosystem!
            </span>{" "}
            💫
          </DialogTitle>
        </div>

        {/* Content */}
        <div className="text-center space-y-3 text-muted-foreground px-2">
          <p className="text-base">
            Để trở thành thành viên chính thức, bạn cần đồng ý với{" "}
            <span className="text-foreground font-semibold">Luật Ánh Sáng</span>{" "}
            của chúng tôi.
          </p>
          <p className="text-sm opacity-80">
            Bạn sẽ được chuyển đến trang Luật Ánh Sáng để tìm hiểu và xác nhận. 🕊️
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={onConfirm}
            variant="gold"
            className="w-full text-base py-5 font-semibold"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            OK, Đưa con đến Ánh Sáng
          </Button>

          <button
            onClick={onContinueAsGuest}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2 hover:underline"
          >
            Đăng xuất & Tiếp tục ở chế độ Khách
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
