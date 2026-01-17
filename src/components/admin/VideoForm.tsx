import { useState, useEffect } from "react";
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
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { useAdminVideos, AdminVideo, VideoFormData } from "@/hooks/useAdminVideos";
import { supabase } from "@/integrations/supabase/client";

interface VideoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingVideo?: AdminVideo | null;
  onSuccess: () => void;
}

const VIDEO_CATEGORIES = [
  "Blockchain",
  "AI & Machine Learning",
  "Web Development",
  "Business",
  "Science",
  "Mathematics",
  "Language",
  "Art & Design",
  "Personal Development",
];

const VIDEO_LEVELS = ["beginner", "intermediate", "advanced"];

export function VideoForm({ open, onOpenChange, editingVideo, onSuccess }: VideoFormProps) {
  const { t } = useTranslation();
  const { createVideo, updateVideo, uploadThumbnail, saving } = useAdminVideos();
  const [uploading, setUploading] = useState(false);
  const [instructors, setInstructors] = useState<{ id: string; full_name: string }[]>([]);
  
  const [formData, setFormData] = useState<VideoFormData>({
    title: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
    duration_minutes: 30,
    category: "",
    level: "beginner",
    institution: "",
    instructor_id: "",
    course_id: "",
  });

  // Reset form when editing video changes
  useEffect(() => {
    if (editingVideo) {
      setFormData({
        title: editingVideo.title || "",
        description: editingVideo.description || "",
        video_url: editingVideo.video_url || "",
        thumbnail_url: editingVideo.thumbnail_url || "",
        duration_minutes: editingVideo.duration_minutes || 30,
        category: editingVideo.category || "",
        level: editingVideo.level || "beginner",
        institution: editingVideo.institution || "",
        instructor_id: editingVideo.instructor_id || "",
        course_id: editingVideo.course_id || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        video_url: "",
        thumbnail_url: "",
        duration_minutes: 30,
        category: "",
        level: "beginner",
        institution: "",
        instructor_id: "",
        course_id: "",
      });
    }
  }, [editingVideo, open]);

  // Fetch instructors (educators)
  useEffect(() => {
    const fetchInstructors = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .not('full_name', 'is', null)
        .order('full_name');
      
      if (data) {
        setInstructors(data.filter(p => p.full_name) as { id: string; full_name: string }[]);
      }
    };
    
    if (open) {
      fetchInstructors();
    }
  }, [open]);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t("common.error"),
        description: "Thumbnail phải nhỏ hơn 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const url = await uploadThumbnail(file);
      setFormData(prev => ({ ...prev, thumbnail_url: url }));
      toast({
        title: t("common.success"),
        description: "Đã tải lên thumbnail",
      });
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: t("common.error"),
        description: t("admin.video.titleRequired"),
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingVideo?.id) {
        await updateVideo(editingVideo.id, formData);
        toast({
          title: t("admin.video.updated"),
          description: t("admin.video.updatedDesc"),
        });
      } else {
        await createVideo(formData);
        toast({
          title: t("admin.video.created"),
          description: t("admin.video.createdDesc"),
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingVideo ? t("admin.video.edit") : t("admin.video.add")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">{t("admin.video.title")} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề video..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">{t("admin.video.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả nội dung video..."
              rows={3}
            />
          </div>

          {/* Video URL */}
          <div>
            <Label htmlFor="video_url">{t("admin.video.videoUrl")}</Label>
            <Input
              id="video_url"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="https://youtube.com/watch?v=... hoặc link video trực tiếp"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <Label>{t("admin.video.thumbnail")}</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="URL ảnh bìa hoặc tải lên..."
                className="flex-1"
              />
              <label className="cursor-pointer">
                <Button type="button" variant="outline" size="icon" disabled={uploading} asChild>
                  <span>
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
              </label>
            </div>
            {formData.thumbnail_url && (
              <div className="mt-2 relative w-32 h-20 rounded-md overflow-hidden border">
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Category & Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("admin.video.category")}</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục..." />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t("admin.video.level")}</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cấp độ..." />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>
                      {t(`videoLibrary.level.${level}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration & Institution */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">{t("admin.video.duration")}</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                min={1}
                max={600}
              />
            </div>

            <div>
              <Label htmlFor="institution">{t("admin.video.institution")}</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="Trường/Tổ chức..."
              />
            </div>
          </div>

          {/* Instructor */}
          <div>
            <Label>{t("admin.video.instructor")}</Label>
            <Select
              value={formData.instructor_id}
              onValueChange={(value) => setFormData({ ...formData, instructor_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giảng viên..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Không có</SelectItem>
                {instructors.map(instructor => (
                  <SelectItem key={instructor.id} value={instructor.id}>
                    {instructor.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("common.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
