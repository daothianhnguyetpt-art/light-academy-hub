import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslation } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Video } from "lucide-react";

interface EndLivestreamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  classTitle: string;
  onSuccess: () => void;
}

export function EndLivestreamModal({
  open,
  onOpenChange,
  classId,
  classTitle,
  onSuccess,
}: EndLivestreamModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [noRecording, setNoRecording] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("live_classes")
        .update({
          status: "completed",
          recording_url: noRecording ? null : recordingUrl || null,
        })
        .eq("id", classId);

      if (error) throw error;

      toast({
        title: t("liveClasses.admin.endSuccess"),
        description: t("liveClasses.admin.endSuccessDesc"),
      });

      onSuccess();
      onOpenChange(false);
      setRecordingUrl("");
      setNoRecording(false);
    } catch (error: any) {
      console.error("Error ending livestream:", error);
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            {t("liveClasses.admin.endLivestream")}
          </DialogTitle>
          <DialogDescription>
            {t("liveClasses.admin.endLivestreamDesc", { title: classTitle })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="recording_url">{t("liveClasses.admin.recordingUrl")}</Label>
            <Input
              id="recording_url"
              value={recordingUrl}
              onChange={(e) => setRecordingUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              disabled={noRecording}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("liveClasses.admin.recordingUrlHint")}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="noRecording"
              checked={noRecording}
              onCheckedChange={(checked) => {
                setNoRecording(checked as boolean);
                if (checked) setRecordingUrl("");
              }}
            />
            <Label htmlFor="noRecording" className="text-sm text-muted-foreground cursor-pointer">
              {t("liveClasses.admin.noRecording")}
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading} variant="destructive">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("liveClasses.admin.confirmEnd")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
