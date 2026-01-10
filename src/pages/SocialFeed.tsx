import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { usePosts } from "@/hooks/usePosts";
import { 
  Sparkles, 
  Bookmark, 
  Share2, 
  MessageCircle, 
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  FileText,
  GraduationCap,
  Users,
  TrendingUp,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const contentTypes = [
  { icon: FileText, label: "Tất cả" },
  { icon: GraduationCap, label: "Course" },
  { icon: FileText, label: "Research" },
  { icon: Video, label: "Lecture" },
  { icon: Users, label: "Sharing" },
];

export default function SocialFeed() {
  const { isConnected, address, connectWallet } = useWallet();
  const { posts, loading, toggleAppreciate, toggleBookmark, fetchPosts } = usePosts();
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  const filteredPosts = posts.filter(post => {
    if (activeFilter === "Tất cả") return true;
    return post.post_type === activeFilter;
  });

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
    } catch {
      return dateStr;
    }
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
          <div className="max-w-3xl mx-auto">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Academic Feed
              </h1>
              <p className="text-muted-foreground">
                Kết nối và chia sẻ tri thức với cộng đồng học thuật toàn cầu
              </p>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-8 overflow-x-auto pb-2"
            >
              {contentTypes.map((type) => (
                <button
                  key={type.label}
                  onClick={() => setActiveFilter(type.label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeFilter === type.label
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold-muted"
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </button>
              ))}
            </motion.div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Đang tải bài viết...</span>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 academic-card"
              >
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Chưa có bài viết nào
                </h3>
                <p className="text-muted-foreground">
                  Hãy là người đầu tiên chia sẻ tri thức với cộng đồng!
                </p>
              </motion.div>
            )}

            {/* Posts */}
            <div className="space-y-6">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="academic-card p-6"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-gold-muted">
                        <AvatarImage src={post.author.avatar_url ?? undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(post.author.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {post.author.full_name || "Ẩn danh"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {post.author.academic_title || "FUN Academy Member"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.post_type && (
                        <span className="px-3 py-1 rounded-full bg-accent text-xs font-medium text-foreground">
                          {post.post_type}
                        </span>
                      )}
                      <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-foreground mb-4 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Media Placeholder */}
                  {post.media_url && (
                    <div className="mb-4 rounded-xl bg-accent/50 border border-border overflow-hidden">
                      {post.media_type === "video" ? (
                        <div className="aspect-video flex items-center justify-center">
                          <Video className="w-12 h-12 text-muted-foreground" />
                        </div>
                      ) : post.media_type === "image" ? (
                        <img 
                          src={post.media_url} 
                          alt="Post media" 
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      ) : (
                        <div className="h-48 flex items-center justify-center">
                          <FileText className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleAppreciate(post.id)}
                        className={post.user_appreciated 
                          ? "text-secondary" 
                          : "text-muted-foreground hover:text-secondary"
                        }
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        <span className="text-xs">
                          {post.appreciates_count > 0 ? post.appreciates_count : "Appreciate"}
                        </span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">{post.comments_count || ""}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleBookmark(post.id)}
                        className={post.user_bookmarked 
                          ? "text-primary" 
                          : "text-muted-foreground hover:text-primary"
                        }
                      >
                        <Bookmark className={`w-4 h-4 mr-1 ${post.user_bookmarked ? "fill-current" : ""}`} />
                        <span className="text-xs">{post.bookmarks_count || ""}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Share2 className="w-4 h-4 mr-1" />
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatTime(post.created_at)}</span>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            {!loading && posts.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  className="border-gold-muted hover:bg-accent"
                  onClick={() => fetchPosts()}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Tải lại bài viết
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
