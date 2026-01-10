import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { useVideos } from "@/hooks/useVideos";
import { 
  Play, 
  Clock, 
  Users, 
  Star,
  Filter,
  Search,
  BookOpen,
  Award,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  "Tất cả",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Business",
  "Languages",
  "Arts",
];

export default function VideoLibrary() {
  const { isConnected, address, connectWallet } = useWallet();
  const { videos, loading, fetchVideos, incrementViews } = useVideos();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch when category or search changes
  useEffect(() => {
    fetchVideos(activeCategory, debouncedSearch);
  }, [activeCategory, debouncedSearch, fetchVideos]);

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
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onConnectWallet={connectWallet}
        isWalletConnected={isConnected}
        walletAddress={address ?? undefined}
      />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Video Library
            </h1>
            <p className="text-muted-foreground">
              Thư viện video bài giảng chất lượng cao từ các trường đại học hàng đầu thế giới
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm video, giảng viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border focus:border-gold-muted"
              />
            </div>
            <Button variant="outline" className="border-border hover:border-gold-muted">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-8 overflow-x-auto pb-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold-muted"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Đang tải video...</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && videos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 academic-card"
            >
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Chưa có video nào
              </h3>
              <p className="text-muted-foreground">
                Thư viện video đang được cập nhật. Vui lòng quay lại sau!
              </p>
            </motion.div>
          )}

          {/* Video Grid */}
          {!loading && videos.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <motion.article
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="academic-card overflow-hidden group cursor-pointer"
                  onClick={() => incrementViews(video.id)}
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video bg-accent/50 flex items-center justify-center">
                    {video.thumbnail_url ? (
                      <img 
                        src={video.thumbnail_url} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 text-primary-foreground ml-1" />
                      </div>
                    </div>
                    {/* Duration */}
                    <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-foreground/80 text-background text-xs font-medium">
                      {formatDuration(video.duration_minutes)}
                    </span>
                    {/* NFT Badge */}
                    {video.course && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        NFT Certificate
                      </span>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {video.instructor?.full_name || "Giảng viên"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {video.institution || "FUN Academy"}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {formatViews(video.views)}
                        </span>
                        {video.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-secondary" />
                            {video.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
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
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Load More */}
          {!loading && videos.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                className="border-gold-muted hover:bg-accent"
                onClick={() => fetchVideos(activeCategory, debouncedSearch)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Tải lại videos
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
