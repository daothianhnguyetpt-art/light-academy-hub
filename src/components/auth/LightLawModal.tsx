import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LightLawContent } from "./LightLawContent";

const CHECKLIST_ITEMS = ["honest", "responsible", "growth", "love", "light"];

interface LightLawModalProps {
  open: boolean;
  onAccept: () => void;
  onContinueAsGuest: () => void;
  onClose: () => void;
}

export function LightLawModal({
  open,
  onAccept,
  onContinueAsGuest,
  onClose,
}: LightLawModalProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset checked items when modal opens
  useEffect(() => {
    if (open) {
      setCheckedItems({});
    }
  }, [open]);

  const handleCheckChange = (id: string, checked: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const allChecked = CHECKLIST_ITEMS.every((id) => checkedItems[id]);

  const handleAccept = async () => {
    if (!allChecked || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAccept();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueAsGuest = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onContinueAsGuest();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="sr-only">Luật Ánh Sáng</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <LightLawContent
            checkedItems={checkedItems}
            onCheckChange={handleCheckChange}
          />
        </ScrollArea>

        <div className="pt-4 space-y-3 border-t border-border/30">
          {/* Accept Button */}
          <Button
            onClick={handleAccept}
            disabled={!allChecked || isSubmitting}
            className="w-full bg-gradient-to-r from-gold via-secondary to-gold hover:from-gold/90 hover:via-secondary/90 hover:to-gold/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-base"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isSubmitting ? "Đang xử lý..." : "CON ĐỒNG Ý & BƯỚC VÀO ÁNH SÁNG"}
          </Button>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
                hoặc
              </span>
            </div>
          </div>

          {/* Continue as Guest Button */}
          <Button
            variant="ghost"
            onClick={handleContinueAsGuest}
            disabled={isSubmitting}
            className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            Tiếp tục chế độ khách (Guest)
          </Button>

          <p className="text-xs text-muted-foreground text-center pb-2">
            Chế độ khách chỉ có thể xem nội dung công khai
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
