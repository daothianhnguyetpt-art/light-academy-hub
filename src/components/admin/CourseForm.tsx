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
import { Loader2, Upload } from "lucide-react";
import { useAdminCourses, AdminCourse, CourseFormData } from "@/hooks/useAdminCourses";
import { supabase } from "@/integrations/supabase/client";

interface CourseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCourse?: AdminCourse | null;
  onSuccess: () => void;
}

const COURSE_CATEGORIES = [
  "Blockchain",
  "AI & Machine Learning",
  "Web Development",
  "Business",
  "Science",
  "Mathematics",
  "Language",
  "Art & Design",
  "Personal Development",
  "Computer Science",
];

const COURSE_LEVELS = ["beginner", "intermediate", "advanced"];

export function CourseForm({ open, onOpenChange, editingCourse, onSuccess }: CourseFormProps) {
  const { t } = useTranslation();
  const { createCourse, updateCourse, uploadThumbnail, saving } = useAdminCourses();
  const [uploading, setUploading] = useState(false);
  const [instructors, setInstructors] = useState<{ id: string; full_name: string }[]>([]);
  
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    instructor_id: "",
    institution: "",
    thumbnail_url: "",
    duration_hours: 10,
  });

  // Reset form when editing course changes
  useEffect(() => {
    if (editingCourse) {
      setFormData({
        title: editingCourse.title || "",
        description: editingCourse.description || "",
        category: editingCourse.category || "",
        level: editingCourse.level || "beginner",
        instructor_id: editingCourse.instructor_id || "",
        institution: "",
        thumbnail_url: editingCourse.thumbnail_url || "",
        duration_hours: editingCourse.duration_hours || 10,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        level: "beginner",
        instructor_id: "",
        institution: "",
        thumbnail_url: "",
        duration_hours: 10,
      });
    }
  }, [editingCourse, open]);

  // Fetch instructors
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
        description: t("admin.course.thumbnailSizeError"),
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
        description: t("admin.course.thumbnailUploaded"),
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
        description: t("admin.course.titleRequired"),
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCourse?.id) {
        await updateCourse(editingCourse.id, formData);
        toast({
          title: t("admin.course.updated"),
          description: t("admin.course.updatedDesc"),
        });
      } else {
        await createCourse(formData);
        toast({
          title: t("admin.course.created"),
          description: t("admin.course.createdDesc"),
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
            {editingCourse ? t("admin.course.edit") : t("admin.course.add")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">{t("admin.course.title")} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t("admin.course.titlePlaceholder")}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">{t("admin.course.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("admin.course.descriptionPlaceholder")}
              rows={3}
            />
          </div>

          {/* Thumbnail */}
          <div>
            <Label>{t("admin.course.thumbnail")}</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder={t("admin.course.thumbnailPlaceholder")}
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
              <div className="mt-2 relative w-40 h-24 rounded-md overflow-hidden border">
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
              <Label>{t("admin.course.category")}</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.course.categoryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t("admin.course.level")}</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.course.levelPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>
                      {t(`videoLibrary.level.${level}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration & Instructor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">{t("admin.course.durationHours")}</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="1000"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) || 10 })}
              />
            </div>

            <div>
              <Label>{t("admin.video.instructor")}</Label>
              <Select
                value={formData.instructor_id}
                onValueChange={(value) => setFormData({ ...formData, instructor_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.video.instructorPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map(instructor => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
