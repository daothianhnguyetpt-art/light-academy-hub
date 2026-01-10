import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { supabase } from "@/integrations/supabase/client";
import { 
  Play,
  Clock, 
  Users, 
  Star,
  ArrowLeft,
  Loader2,
  BookOpen,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  views: number | null;
  rating: number | null;
  level: string | null;
  category: string | null;
  institution: string | null;
  instructor: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    academic_title: string | null;
  } | null;
}

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const { isConnected, address, connectWallet } = useWallet();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('videos')
          .select(`
            id,
            title,
            description,
            video_url,
            thumbnail_url,
            duration_minutes,
            views,
            rating,
            level,
            category,
            institution,
            instructor:profiles!videos_instructor_id_fkey (
              id,
              full_name,
              avatar_url,
              academic_title
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setVideo(data as Video);

        // Increment views
        await supabase
          .from('videos')
          .update({ views: (data?.views || 0) + 1 })
          .eq('id', id);

        // Fetch related videos
        const { data: related } = await supabase
          .from('videos')
          .select(`
            id,
            title,
            thumbnail_url,
            duration_minutes,
            views,
            instructor:profiles!videos_instructor_id_fkey (
              id,
              full_name,
              avatar_url,
              academic_title
            )
          `)
          .neq('id', id)
          .eq('category', data?.category)
          .limit(4);

        setRelatedVideos((related || []) as Video[]);
      } catch (err) {
        console.error('Error fetching video:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "00:00";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:00`;
    }
    return `${mins}:00`;
  };

  const formatViews = (views: number | null) => {
    if (!views) return "0";
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getVideoEmbedUrl = (url: string | null) => {
    if (!url) return null;
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return url;
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onConnectWallet={connectWallet}
          isWalletConnected={isConnected}
          walletAddress={address ?? undefined}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onConnectWallet={connectWallet}
          isWalletConnected={isConnected}
          walletAddress={address ?? undefined}
        />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Video không tồn tại</h2>
          <Link to="/video-library">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại thư viện
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const embedUrl = getVideoEmbedUrl(video.video_url);

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
          <Link to="/video-library">
            <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại thư viện
            </Button>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Video Player */}
                <div className="aspect-video bg-foreground/5 rounded-xl overflow-hidden mb-6">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {video.thumbnail_url ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={video.thumbnail_url} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center">
                              <Play className="w-9 h-9 text-primary-foreground ml-1" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Video chưa có sẵn</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <h1 className="font-display text-2xl font-bold text-foreground mb-4">
                  {video.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {formatViews(video.views)} lượt xem
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(video.duration_minutes)}
                  </span>
                  {video.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-secondary" />
                      {video.rating.toFixed(1)}
                    </span>
                  )}
                  {video.level && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      video.level === "Beginner" 
                        ? "bg-green-100 text-green-700" 
                        : video.level === "Intermediate"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {video.level === "Beginner" ? "Cơ bản" : video.level === "Intermediate" ? "Trung cấp" : "Nâng cao"}
                    </span>
                  )}
                </div>

                {/* Instructor */}
                {video.instructor && (
                  <div className="flex items-center gap-4 p-4 academic-card mb-6">
                    <Avatar className="w-14 h-14 border-2 border-gold-muted">
                      <AvatarImage src={video.instructor.avatar_url ?? undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(video.instructor.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {video.instructor.full_name || "Giảng viên"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {video.instructor.academic_title || video.institution || "FUN Academy"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Description */}
                {video.description && (
                  <div className="academic-card p-6">
                    <h3 className="font-semibold text-foreground mb-3">Mô tả</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {video.description}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar - Related Videos */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  Video liên quan
                </h2>

                {relatedVideos.length === 0 ? (
                  <div className="academic-card p-6 text-center">
                    <Award className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Chưa có video liên quan
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {relatedVideos.map((related) => (
                      <Link key={related.id} to={`/video/${related.id}`}>
                        <div className="academic-card overflow-hidden group cursor-pointer hover:border-gold-muted">
                          <div className="flex gap-3 p-3">
                            <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-accent/50 flex-shrink-0">
                              {related.thumbnail_url ? (
                                <img 
                                  src={related.thumbnail_url}
                                  alt={related.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Play className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-xs">
                                {formatDuration(related.duration_minutes)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                {related.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                {related.instructor?.full_name || "Giảng viên"}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {formatViews(related.views)} lượt xem
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
