import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { useTranslation } from "@/i18n/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Play,
  Clock,
  Users,
  BookOpen,
  Star,
  Loader2,
  Video,
} from "lucide-react";

interface CourseVideo {
  id: string;
  title: string;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  views: number | null;
  rating: number | null;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  thumbnail_url: string | null;
  duration_hours: number | null;
  instructor?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    academic_title: string | null;
  } | null;
}

export default function CourseDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isConnected, address, connectWallet } = useWallet();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select(`
            *,
            instructor:profiles!courses_instructor_id_fkey(id, full_name, avatar_url, academic_title)
          `)
          .eq('id', id)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Fetch videos in this course
        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select('id, title, thumbnail_url, duration_minutes, views, rating')
          .eq('course_id', id)
          .order('created_at', { ascending: true });

        if (videosError) throw videosError;
        setVideos(videosData || []);

      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "0:00";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:00`;
    }
    return `${mins}:00`;
  };

  const formatViews = (views: number | null) => {
    if (!views) return "0";
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const totalDuration = videos.reduce((sum, v) => sum + (v.duration_minutes || 0), 0);
  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);

  const getLevelLabel = (level: string | null) => {
    if (!level) return "";
    switch (level) {
      case "beginner": return t("videoLibrary.level.beginner");
      case "intermediate": return t("videoLibrary.level.intermediate");
      case "advanced": return t("videoLibrary.level.advanced");
      default: return level;
    }
  };

  const getLevelBadgeClass = (level: string | null) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-amber-100 text-amber-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onConnectWallet={connectWallet}
          isWalletConnected={isConnected}
          walletAddress={address ?? undefined}
        />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onConnectWallet={connectWallet}
          isWalletConnected={isConnected}
          walletAddress={address ?? undefined}
        />
        <div className="flex flex-col items-center justify-center py-32">
          <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t("courseDetail.notFound")}</h2>
          <Button variant="outline" onClick={() => navigate('/video-library')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back")}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onConnectWallet={connectWallet}
        isWalletConnected={isConnected}
        walletAddress={address ?? undefined}
      />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/video-library')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("common.back")}
            </Button>
          </motion.div>

          {/* Course Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-8 mb-10"
          >
            {/* Thumbnail */}
            <div className="lg:col-span-1">
              <div className="aspect-video rounded-xl overflow-hidden bg-accent">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-3">
                {course.category && (
                  <Badge variant="secondary">{course.category}</Badge>
                )}
                {course.level && (
                  <Badge className={getLevelBadgeClass(course.level)}>
                    {getLevelLabel(course.level)}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                {course.title}
              </h1>

              {course.description && (
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {course.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Video className="w-4 h-4" />
                  <span>{videos.length} {t("courseDetail.videos")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{formatViews(totalViews)} {t("videoLibrary.views")}</span>
                </div>
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.instructor.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {course.instructor.full_name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("courseDetail.instructor")}</p>
                    <p className="font-semibold">{course.instructor.full_name}</p>
                    {course.instructor.academic_title && (
                      <p className="text-xs text-muted-foreground">{course.instructor.academic_title}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Start Learning Button */}
              {videos.length > 0 && (
                <div className="mt-6">
                  <Link to={`/video/${videos[0].id}`}>
                    <Button size="lg" className="gap-2">
                      <Play className="w-5 h-5" />
                      {t("courseDetail.startLearning")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Video List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              {t("courseDetail.videoList")} ({videos.length})
            </h2>

            {videos.length === 0 ? (
              <div className="text-center py-12 academic-card">
                <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("courseDetail.noVideos")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {videos.map((video, index) => (
                  <Link key={video.id} to={`/video/${video.id}`}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                    >
                      {/* Order Number */}
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>

                      {/* Thumbnail */}
                      <div className="relative w-28 sm:w-36 aspect-video rounded-md overflow-hidden bg-accent shrink-0">
                        {video.thumbnail_url ? (
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/10 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-foreground/80 text-background text-xs">
                          {formatDuration(video.duration_minutes)}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {formatViews(video.views)}
                          </span>
                          {video.rating && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-secondary" />
                              {video.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
