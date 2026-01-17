import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/useTranslation";
import { LiveClass } from "@/hooks/useLiveClasses";
import { joinMeeting } from "@/lib/meeting-utils";
import { toast } from "sonner";

interface ZoomInfoPanelProps {
  classItem: LiveClass;
}

export function ZoomInfoPanel({ classItem }: ZoomInfoPanelProps) {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const handleCopy = async (text: string, type: 'id' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'id') {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      } else {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      }
      toast.success(t("liveClasses.zoomPanel.copied"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleJoinZoom = () => {
    joinMeeting(classItem.meeting_url);
  };

  if (classItem.meeting_platform !== 'zoom') return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
          Z
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{t("liveClasses.zoomPanel.title")}</h3>
          <p className="text-sm text-muted-foreground">{classItem.title}</p>
        </div>
      </div>

      {/* Meeting Info Cards */}
      <div className="space-y-3 mb-6">
        {classItem.meeting_id && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-background/80 border border-border">
            <div>
              <span className="text-xs text-muted-foreground block mb-1">
                🆔 {t("liveClasses.zoomPanel.roomId")}
              </span>
              <span className="font-mono text-lg font-semibold text-foreground tracking-wider">
                {classItem.meeting_id}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(classItem.meeting_id || '', 'id')}
              className="shrink-0"
            >
              {copiedId ? (
                <Check className="w-4 h-4 text-secondary" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}

        {classItem.meeting_password && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-background/80 border border-border">
            <div>
              <span className="text-xs text-muted-foreground block mb-1">
                🔐 {t("liveClasses.zoomPanel.password")}
              </span>
              <span className="font-mono text-lg font-semibold text-foreground tracking-wider">
                {classItem.meeting_password}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(classItem.meeting_password || '', 'password')}
              className="shrink-0"
            >
              {copiedPassword ? (
                <Check className="w-4 h-4 text-secondary" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Join Button */}
      {classItem.meeting_url && (
        <Button 
          variant="gold" 
          size="lg" 
          className="w-full text-lg font-semibold gap-2 shadow-lg shadow-gold/30"
          onClick={handleJoinZoom}
        >
          <Video className="w-5 h-5" />
          {t("liveClasses.zoomPanel.joinNow")}
          <ExternalLink className="w-4 h-4" />
        </Button>
      )}

      {/* Tip */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        💡 {t("liveClasses.zoomPanel.tip")}
      </p>
    </motion.div>
  );
}
