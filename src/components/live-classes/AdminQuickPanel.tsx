import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";
import { LivestreamForm } from "@/components/admin/LivestreamForm";
import { EndLivestreamModal } from "./EndLivestreamModal";
import { LiveClass } from "@/hooks/useLiveClasses";
import { Plus, Settings, StopCircle, Edit, Radio } from "lucide-react";
import { motion } from "framer-motion";

interface AdminQuickPanelProps {
  liveClass?: LiveClass | null;
  onRefresh: () => void;
}

export function AdminQuickPanel({ liveClass, onRefresh }: AdminQuickPanelProps) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<LiveClass | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);

  const handleAddNew = () => {
    setEditingClass(null);
    setShowForm(true);
  };

  const handleEdit = () => {
    if (liveClass) {
      setEditingClass(liveClass);
      setShowForm(true);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingClass(null);
    onRefresh();
  };

  const handleEndSuccess = () => {
    setShowEndModal(false);
    onRefresh();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 academic-card border-gold-muted bg-accent/30"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gold" />
            <h3 className="font-semibold text-foreground">{t("liveClasses.admin.panelTitle")}</h3>
            <Badge variant="outline" className="text-xs border-gold/50 text-gold">
              Admin
            </Badge>
          </div>
          <Button onClick={handleAddNew} size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            {t("liveClasses.admin.addNew")}
          </Button>
        </div>

        {liveClass && liveClass.status === "live" ? (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-destructive animate-pulse" />
                  <Badge variant="destructive" className="text-xs">
                    {t("liveClasses.liveBadge")}
                  </Badge>
                </div>
                <span className="font-medium text-foreground text-sm">{liveClass.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleEdit} className="gap-1">
                  <Edit className="w-3.5 h-3.5" />
                  {t("common.edit")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowEndModal(true)}
                  className="gap-1"
                >
                  <StopCircle className="w-3.5 h-3.5" />
                  {t("liveClasses.admin.endLive")}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("liveClasses.admin.noActiveLive")}</p>
        )}
      </motion.div>

      <LivestreamForm
        open={showForm}
        onOpenChange={setShowForm}
        editingClass={editingClass}
        onSuccess={handleFormSuccess}
      />

      {liveClass && (
        <EndLivestreamModal
          open={showEndModal}
          onOpenChange={setShowEndModal}
          classId={liveClass.id}
          classTitle={liveClass.title}
          onSuccess={handleEndSuccess}
        />
      )}
    </>
  );
}
