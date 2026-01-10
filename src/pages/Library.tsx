import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { useLibraryResources } from "@/hooks/useLibraryResources";
import { 
  BookOpen, 
  FileText, 
  Image as ImageIcon,
  Video,
  Search,
  Filter,
  Download,
  Star,
  ChevronRight,
  Loader2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { icon: BookOpen, label: "Tất cả", type: null },
  { icon: BookOpen, label: "Sách", type: "Sách" },
  { icon: FileText, label: "Tài liệu", type: "Tài liệu" },
  { icon: ImageIcon, label: "Hình ảnh", type: "Hình ảnh" },
  { icon: Video, label: "Video", type: "Video" },
];

const getTypeIcon = (type: string | null) => {
  switch (type) {
    case "Sách":
      return BookOpen;
    case "Tài liệu":
      return FileText;
    case "Hình ảnh":
      return ImageIcon;
    case "Video":
      return Video;
    default:
      return FileText;
  }
};

// Fallback mock data when no resources in database
const mockResources = [
  {
    id: "1",
    title: "Blockchain Technology Fundamentals",
    author: "Dr. Satoshi Nakamoto",
    resource_type: "Sách",
    category: "Computer Science",
    page_count: 324,
    downloads: 12500,
    rating: 4.9,
    file_url: null,
    thumbnail_url: null,
    description: null,
    created_at: null,
  },
  {
    id: "2",
    title: "Machine Learning Research Papers Collection",
    author: "Stanford AI Lab",
    resource_type: "Tài liệu",
    category: "AI & ML",
    page_count: 156,
    downloads: 8300,
    rating: 4.8,
    file_url: null,
    thumbnail_url: null,
    description: null,
    created_at: null,
  },
  {
    id: "3",
    title: "Academic Infographics - Data Science",
    author: "MIT Media Lab",
    resource_type: "Hình ảnh",
    category: "Data Science",
    page_count: 45,
    downloads: 5200,
    rating: 4.7,
    file_url: null,
    thumbnail_url: null,
    description: null,
    created_at: null,
  },
  {
    id: "4",
    title: "Quantum Computing Lecture Series",
    author: "Prof. Richard Feynman",
    resource_type: "Video",
    category: "Physics",
    page_count: 12,
    downloads: 15800,
    rating: 4.95,
    file_url: null,
    thumbnail_url: null,
    description: null,
    created_at: null,
  },
  {
    id: "5",
    title: "Web3 Development Guide",
    author: "Ethereum Foundation",
    resource_type: "Sách",
    category: "Blockchain",
    page_count: 248,
    downloads: 22100,
    rating: 4.85,
    file_url: null,
    thumbnail_url: null,
    description: null,
    created_at: null,
  },
  {
    id: "6",
    title: "Research Methodology Handbook",
    author: "Harvard University",
    resource_type: "Tài liệu",
    category: "Research",
    page_count: 89,
    downloads: 6700,
    rating: 4.6,
    file_url: null,
    thumbnail_url: null,
    description: null,
    created_at: null,
  },
];

const formatDownloads = (num: number | null) => {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function Library() {
  const { isConnected, address, connectWallet } = useWallet();
  const { resources, loading, error, fetchResources } = useLibraryResources();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  // Use real data if available, otherwise fallback to mock
  const displayResources = resources.length > 0 ? resources : mockResources;

  const filteredResources = displayResources.filter((resource) => {
    const matchesCategory = activeCategory === "Tất cả" || resource.resource_type === activeCategory;
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.author?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (label: string) => {
    setActiveCategory(label);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
              Thư Viện Tri Thức
            </h1>
            <p className="text-muted-foreground">
              Kho tàng sách, tài liệu nghiên cứu và hình ảnh học thuật của nhân loại
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
                placeholder="Tìm kiếm sách, tài liệu..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-card border-border focus:border-gold-muted"
              />
            </div>
            <Button variant="outline" className="border-border hover:border-gold-muted">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
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
                key={category.label}
                onClick={() => handleCategoryChange(category.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === category.label
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold-muted"
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Đang tải tài liệu...</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredResources.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Chưa có tài liệu nào
              </h3>
              <p className="text-muted-foreground">
                Thư viện đang được xây dựng, hãy quay lại sau nhé ✨
              </p>
            </motion.div>
          )}

          {/* Resources Grid */}
          {!loading && filteredResources.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => {
                const TypeIcon = getTypeIcon(resource.resource_type);
                return (
                  <Link key={resource.id} to={`/library/${resource.id}`}>
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="academic-card overflow-hidden group cursor-pointer"
                    >
                    {/* Resource Preview */}
                    <div className="relative aspect-[4/3] bg-accent/50 flex items-center justify-center">
                      {resource.thumbnail_url ? (
                        <img 
                          src={resource.thumbnail_url} 
                          alt={resource.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <TypeIcon className="w-10 h-10 text-primary" />
                        </div>
                      )}
                      {/* Type Badge */}
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-medium">
                        {resource.resource_type || "Tài liệu"}
                      </span>
                    </div>

                    {/* Resource Info */}
                    <div className="p-5">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">{resource.author || "Tác giả"}</p>
                      <p className="text-xs text-muted-foreground mb-4">{resource.category || "Chưa phân loại"}</p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" />
                            {formatDownloads(resource.downloads)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-secondary" />
                            {resource.rating || "—"}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          {resource.page_count || 0} {resource.resource_type === "Video" ? "video" : "trang"}
                        </span>
                      </div>
                    </div>
                    </motion.article>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Load More */}
          {!loading && filteredResources.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" className="border-gold-muted hover:bg-accent">
                <BookOpen className="w-4 h-4 mr-2" />
                Xem thêm tài liệu
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
