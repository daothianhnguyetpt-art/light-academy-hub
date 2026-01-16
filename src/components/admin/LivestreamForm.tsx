import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface LivestreamFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingClass?: any;
  onSuccess: () => void;
}

export function LivestreamForm({ open, onOpenChange, editingClass, onSuccess }: LivestreamFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: editingClass?.title || "",
    description: editingClass?.description || "",
    meeting_platform: editingClass?.meeting_platform || "youtube",
    meeting_url: editingClass?.meeting_url || "",
    livestream_url: editingClass?.livestream_url || "",
    scheduled_at: editingClass?.scheduled_at 
      ? new Date(editingClass.scheduled_at).toISOString().slice(0, 16) 
      : "",
    duration_minutes: editingClass?.duration_minutes || 60,
    status: editingClass?.status || "scheduled",
    category: editingClass?.category || "",
    max_participants: editingClass?.max_participants || 100,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        scheduled_at: new Date(formData.scheduled_at).toISOString(),
      };

      if (editingClass?.id) {
        // Update existing
        const { error } = await supabase
          .from('live_classes')
          .update(dataToSave)
          .eq('id', editingClass.id);

        if (error) throw error;
        toast({
          title: t("admin.livestreamUpdated"),
          description: t("admin.livestreamUpdatedDesc"),
        });
      } else {
        // Create new
        const { error } = await supabase
          .from('live_classes')
          .insert([dataToSave]);

        if (error) throw error;
        toast({
          title: t("admin.livestreamCreated"),
          description: t("admin.livestreamCreatedDesc"),
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving livestream:', error);
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingClass ? t("admin.editLivestream") : t("admin.addLivestream")}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{t("admin.title")}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">{t("admin.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">{t("admin.platform")}</Label>
              <Select
                value={formData.meeting_platform}
                onValueChange={(value) => setFormData({ ...formData, meeting_platform: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube Live</SelectItem>
                  <SelectItem value="facebook">Facebook Live</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="google_meet">Google Meet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">{t("admin.status")}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">{t("admin.scheduled")}</SelectItem>
                  <SelectItem value="live">{t("admin.liveNow")}</SelectItem>
                  <SelectItem value="completed">{t("admin.completed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="meeting_url">{t("admin.meetingUrl")}</Label>
            <Input
              id="meeting_url"
              value={formData.meeting_url}
              onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
              placeholder="https://zoom.us/j/... hoặc https://meet.google.com/..."
            />
          </div>

          <div>
            <Label htmlFor="livestream_url">{t("admin.livestreamUrl")}</Label>
            <Input
              id="livestream_url"
              value={formData.livestream_url}
              onChange={(e) => setFormData({ ...formData, livestream_url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduled_at">{t("admin.scheduledAt")}</Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">{t("admin.durationMinutes")}</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                min={15}
                max={480}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">{t("admin.category")}</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Blockchain, AI, ..."
              />
            </div>

            <div>
              <Label htmlFor="max_participants">{t("admin.maxParticipants")}</Label>
              <Input
                id="max_participants"
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                min={1}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("common.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
