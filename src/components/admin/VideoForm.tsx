import { useState, useEffect, useRef } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/i18n";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, Link as LinkIcon, Video, X } from "lucide-react";
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
  const { createVideo, updateVideo, uploadThumbnail, uploadVideo, saving } = useAdminVideos();
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoType, setVideoType] = useState<'embed' | 'upload'>('embed');
  const [instructors, setInstructors] = useState<{ id: string; full_name: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      // Detect video type based on URL
      if (editingVideo.video_url?.includes('supabase.co/storage')) {
        setVideoType('upload');
      } else {
        setVideoType('embed');
      }
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
      setVideoType('embed');
    }
    setUploadProgress(0);
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
        description: t("admin.video.thumbnailSizeError"),
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
        description: t("admin.video.thumbnailUploaded"),
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

  const handleVideoUpload = async (file: File) => {
    if (!file) return;

    // Check file size (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: t("common.error"),
        description: t("admin.video.videoSizeError"),
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: t("common.error"),
        description: t("admin.video.videoTypeError"),
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingVideo(true);
      setUploadProgress(0);
      
      const url = await uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setFormData(prev => ({ ...prev, video_url: url }));
      toast({
        title: t("common.success"),
        description: t("admin.video.videoUploaded"),
      });
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingVideo(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVideoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoUpload(e.target.files[0]);
    }
  };

  const clearVideoUrl = () => {
    setFormData(prev => ({ ...prev, video_url: "" }));
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

  const getVideoFileName = (url: string) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1] || 'video';
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
              placeholder={t("admin.video.titlePlaceholder")}
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
              placeholder={t("admin.video.descriptionPlaceholder")}
              rows={3}
            />
          </div>

          {/* Video Type Selection */}
          <div>
            <Label className="mb-3 block">{t("admin.video.videoType")}</Label>
            <RadioGroup
              value={videoType}
              onValueChange={(value: 'embed' | 'upload') => {
                setVideoType(value);
                setFormData(prev => ({ ...prev, video_url: "" }));
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="embed" id="embed" />
                <Label htmlFor="embed" className="flex items-center gap-2 cursor-pointer">
                  <LinkIcon className="w-4 h-4" />
                  {t("admin.video.embedLink")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload" className="flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {t("admin.video.uploadFile")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Video URL or Upload */}
          {videoType === 'embed' ? (
            <div>
              <Label htmlFor="video_url">{t("admin.video.videoUrl")}</Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=... hoặc https://vimeo.com/..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("admin.video.supportedPlatforms")}
              </p>
            </div>
          ) : (
            <div>
              <Label>{t("admin.video.uploadFile")}</Label>
              
              {formData.video_url && !uploadingVideo ? (
                <div className="mt-2 p-3 bg-accent/50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" />
                    <span className="text-sm truncate max-w-[200px]">
                      {getVideoFileName(formData.video_url)}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={clearVideoUrl}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  } ${uploadingVideo ? 'pointer-events-none opacity-60' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadingVideo ? (
                    <div className="space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">
                        {t("admin.video.uploading")}
                      </p>
                      <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                      <p className="text-xs text-muted-foreground">
                        {uploadProgress}%
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {t("admin.video.dragDropVideo")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("admin.video.supportedFormats")}
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              )}
            </div>
          )}

          {/* Thumbnail */}
          <div>
            <Label>{t("admin.video.thumbnail")}</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder={t("admin.video.thumbnailPlaceholder")}
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
                  <SelectValue placeholder={t("admin.video.categoryPlaceholder")} />
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
                  <SelectValue placeholder={t("admin.video.levelPlaceholder")} />
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
                placeholder={t("admin.video.institutionPlaceholder")}
              />
            </div>
          </div>

          {/* Instructor */}
          <div>
            <Label>{t("admin.video.instructor")}</Label>
            <Select
              value={formData.instructor_id || "none"}
              onValueChange={(value) => setFormData({ ...formData, instructor_id: value === "none" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("admin.video.instructorPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("common.none") || "Không có"}</SelectItem>
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
            <Button type="submit" disabled={saving || uploadingVideo}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("common.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}