import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { 
  Heart, 
  Bookmark, 
  Share2, 
  MessageCircle, 
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  FileText,
  GraduationCap,
  Users,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample posts data
const posts = [
  {
    id: 1,
    author: {
      name: "Dr. Nguyễn Minh Tuấn",
      role: "Professor of Computer Science",
      avatar: null,
      initials: "NT",
    },
    type: "Research",
    content: "Nghiên cứu mới về ứng dụng Blockchain trong giáo dục đại học. Soulbound Token có thể thay đổi hoàn toàn cách chúng ta xác thực bằng cấp và chứng chỉ.",
    media: null,
    stats: { appreciates: 234, saves: 56, shares: 12, comments: 28 },
    timestamp: "2 giờ trước",
  },
  {
    id: 2,
    author: {
      name: "MIT OpenCourseWare",
      role: "Educational Institution",
      avatar: null,
      initials: "MIT",
    },
    type: "Course",
    content: "Khóa học mới: Introduction to Machine Learning. 12 tuần học với project thực hành và chứng chỉ NFT khi hoàn thành.",
    media: { type: "video", placeholder: true },
    stats: { appreciates: 1892, saves: 453, shares: 89, comments: 156 },
    timestamp: "5 giờ trước",
  },
  {
    id: 3,
    author: {
      name: "Trần Thị Lan",
      role: "PhD Candidate, Harvard",
      avatar: null,
      initials: "TL",
    },
    type: "Sharing",
    content: "Chia sẻ kinh nghiệm apply học bổng Fulbright thành công. Hi vọng giúp ích cho các bạn đang chuẩn bị hồ sơ năm nay! 📚✨",
    media: { type: "document", placeholder: true },
    stats: { appreciates: 567, saves: 234, shares: 45, comments: 89 },
    timestamp: "1 ngày trước",
  },
];

const contentTypes = [
  { icon: FileText, label: "Tất cả" },
  { icon: GraduationCap, label: "Courses" },
  { icon: FileText, label: "Research" },
  { icon: Video, label: "Lectures" },
  { icon: Users, label: "Sharing" },
];

export default function SocialFeed() {
  const { isConnected, address, connectWallet } = useWallet();
  const [activeFilter, setActiveFilter] = useState("Tất cả");

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

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post, index) => (
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
                        <AvatarImage src={post.author.avatar ?? undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {post.author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{post.author.name}</h3>
                        <p className="text-sm text-muted-foreground">{post.author.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-accent text-xs font-medium text-foreground">
                        {post.type}
                      </span>
                      <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                  {/* Media Placeholder */}
                  {post.media && (
                    <div className="mb-4 rounded-xl bg-accent/50 border border-border h-48 flex items-center justify-center">
                      {post.media.type === "video" ? (
                        <div className="text-center">
                          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <span className="text-sm text-muted-foreground">Video Preview</span>
                        </div>
                      ) : post.media.type === "document" ? (
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <span className="text-sm text-muted-foreground">Document Preview</span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <span className="text-sm text-muted-foreground">Image Preview</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-secondary">
                        <Heart className="w-4 h-4 mr-1" />
                        <span className="text-xs">{post.stats.appreciates}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">{post.stats.comments}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Bookmark className="w-4 h-4 mr-1" />
                        <span className="text-xs">{post.stats.saves}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Share2 className="w-4 h-4 mr-1" />
                        <span className="text-xs">{post.stats.shares}</span>
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" className="border-gold-muted hover:bg-accent">
                <TrendingUp className="w-4 h-4 mr-2" />
                Xem thêm nội dung
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
