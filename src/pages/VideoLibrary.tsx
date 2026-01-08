import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { 
  Play, 
  Clock, 
  Users, 
  Star,
  Filter,
  Search,
  BookOpen,
  Award,
  ChevronRight
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

const videos = [
  {
    id: 1,
    title: "Introduction to Blockchain Technology",
    instructor: "Prof. Sarah Johnson",
    institution: "Stanford University",
    duration: "45:30",
    level: "Beginner",
    category: "Computer Science",
    views: "12.5K",
    rating: 4.9,
    hasCertificate: true,
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    instructor: "Dr. Andrew Ng",
    institution: "Stanford / Coursera",
    duration: "1:23:45",
    level: "Intermediate",
    category: "Computer Science",
    views: "45.2K",
    rating: 4.95,
    hasCertificate: true,
  },
  {
    id: 3,
    title: "Quantum Physics for Beginners",
    instructor: "Prof. Richard Feynman",
    institution: "MIT OpenCourseWare",
    duration: "52:10",
    level: "Beginner",
    category: "Physics",
    views: "28.3K",
    rating: 4.8,
    hasCertificate: false,
  },
  {
    id: 4,
    title: "Calculus: Single Variable",
    instructor: "Prof. Robert Ghrist",
    institution: "University of Pennsylvania",
    duration: "38:20",
    level: "Beginner",
    category: "Mathematics",
    views: "18.7K",
    rating: 4.85,
    hasCertificate: true,
  },
  {
    id: 5,
    title: "Web3 Development Masterclass",
    instructor: "Vitalik Buterin",
    institution: "Ethereum Foundation",
    duration: "2:15:00",
    level: "Advanced",
    category: "Computer Science",
    views: "67.8K",
    rating: 4.92,
    hasCertificate: true,
  },
  {
    id: 6,
    title: "Business Strategy Essentials",
    instructor: "Prof. Michael Porter",
    institution: "Harvard Business School",
    duration: "1:05:30",
    level: "Intermediate",
    category: "Business",
    views: "34.1K",
    rating: 4.88,
    hasCertificate: true,
  },
];

export default function VideoLibrary() {
  const { isConnected, address, connectWallet } = useWallet();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = videos.filter((video) => {
    const matchesCategory = activeCategory === "Tất cả" || video.category === activeCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

          {/* Video Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => (
              <motion.article
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="academic-card overflow-hidden group cursor-pointer"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-accent/50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-primary-foreground ml-1" />
                  </div>
                  {/* Duration */}
                  <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-foreground/80 text-background text-xs font-medium">
                    {video.duration}
                  </span>
                  {/* NFT Badge */}
                  {video.hasCertificate && (
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
                  <p className="text-sm text-muted-foreground mb-1">{video.instructor}</p>
                  <p className="text-xs text-muted-foreground mb-4">{video.institution}</p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {video.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-secondary" />
                        {video.rating}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      video.level === "Beginner" 
                        ? "bg-green-100 text-green-700" 
                        : video.level === "Intermediate"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {video.level === "Beginner" ? "Cơ bản" : video.level === "Intermediate" ? "Trung cấp" : "Nâng cao"}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" className="border-gold-muted hover:bg-accent">
              <BookOpen className="w-4 h-4 mr-2" />
              Xem thêm videos
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
