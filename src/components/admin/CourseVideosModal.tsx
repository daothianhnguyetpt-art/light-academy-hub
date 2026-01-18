import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/i18n";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, X, Video, Clock, Eye } from "lucide-react";
import { useAdminCourses, AdminCourse } from "@/hooks/useAdminCourses";

interface CourseVideo {
  id: string;
  title: string;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  views: number | null;
  instructor?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface AvailableVideo {
  id: string;
  title: string;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  instructor?: {
    id: string;
    full_name: string | null;
  } | null;
}

interface CourseVideosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: AdminCourse | null;
  onRefresh: () => void;
}

export function CourseVideosModal({ open, onOpenChange, course, onRefresh }: CourseVideosModalProps) {
  const { t } = useTranslation();
  const { getCourseVideos, getAvailableVideos, addVideoToCourse, removeVideoFromCourse } = useAdminCourses();
  
  const [courseVideos, setCourseVideos] = useState<CourseVideo[]>([]);
  const [availableVideos, setAvailableVideos] = useState<AvailableVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const [addingVideo, setAddingVideo] = useState(false);
  const [removingVideoId, setRemovingVideoId] = useState<string | null>(null);

  // Load data when modal opens
  useEffect(() => {
    const loadData = async () => {
      if (!open || !course) return;

      try {
        setLoading(true);
        const [videos, available] = await Promise.all([
          getCourseVideos(course.id),
          getAvailableVideos(),
        ]);
        setCourseVideos(videos);
        setAvailableVideos(available);
      } catch (error: any) {
        toast({
          title: t("common.error"),
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [open, course, getCourseVideos, getAvailableVideos, t]);

  const handleAddVideo = async () => {
    if (!selectedVideoId || !course) return;

    try {
      setAddingVideo(true);
      await addVideoToCourse(selectedVideoId, course.id);

      // Move video from available to course videos
      const addedVideo = availableVideos.find(v => v.id === selectedVideoId);
      if (addedVideo) {
        setCourseVideos(prev => [...prev, addedVideo as CourseVideo]);
        setAvailableVideos(prev => prev.filter(v => v.id !== selectedVideoId));
      }

      setSelectedVideoId("");
      onRefresh();

      toast({
        title: t("common.success"),
        description: t("admin.course.videoAdded"),
      });
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAddingVideo(false);
    }
  };

  const handleRemoveVideo = async (videoId: string) => {
    try {
      setRemovingVideoId(videoId);
      await removeVideoFromCourse(videoId);

      // Move video from course to available
      const removedVideo = courseVideos.find(v => v.id === videoId);
      if (removedVideo) {
        setAvailableVideos(prev => [...prev, removedVideo as AvailableVideo]);
        setCourseVideos(prev => prev.filter(v => v.id !== videoId));
      }

      onRefresh();

      toast({
        title: t("common.success"),
        description: t("admin.course.videoRemoved"),
      });
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRemovingVideoId(null);
    }
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "--";
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            {t("admin.course.manageVideos")}: {course?.title}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Add Video Section */}
            <div className="flex gap-2">
              <Select value={selectedVideoId} onValueChange={setSelectedVideoId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={t("admin.course.selectVideoToAdd")} />
                </SelectTrigger>
                <SelectContent>
                  {availableVideos.length === 0 ? (
                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                      {t("admin.course.noAvailableVideos")}
                    </div>
                  ) : (
                    availableVideos.map(video => (
                      <SelectItem key={video.id} value={video.id}>
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[300px]">{video.title}</span>
                          {video.instructor?.full_name && (
                            <span className="text-xs text-muted-foreground">
                              - {video.instructor.full_name}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddVideo}
                disabled={!selectedVideoId || addingVideo}
              >
                {addingVideo ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span className="ml-2 hidden sm:inline">{t("admin.course.addVideo")}</span>
              </Button>
            </div>

            {/* Course Videos List */}
            <div className="flex-1 overflow-y-auto">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                {t("admin.course.videosInCourse")} ({courseVideos.length})
              </div>

              {courseVideos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>{t("admin.course.noVideosInCourse")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {courseVideos.map((video, index) => (
                    <div
                      key={video.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      {/* Order Number */}
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>

                      {/* Thumbnail */}
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-20 h-12 object-cover rounded shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-12 bg-accent rounded flex items-center justify-center shrink-0">
                          <Video className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{video.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          {video.instructor?.full_name && (
                            <span>{video.instructor.full_name}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(video.duration_minutes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {video.views || 0}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveVideo(video.id)}
                        disabled={removingVideoId === video.id}
                        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        {removingVideoId === video.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t("common.back")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
