import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { 
  BookOpen, 
  FileText, 
  Image as ImageIcon,
  Video,
  Search,
  Filter,
  Download,
  Eye,
  Star,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { icon: BookOpen, label: "Tất cả" },
  { icon: BookOpen, label: "Sách" },
  { icon: FileText, label: "Tài liệu" },
  { icon: ImageIcon, label: "Hình ảnh" },
  { icon: Video, label: "Video" },
];

const resources = [
  {
    id: 1,
    title: "Blockchain Technology Fundamentals",
    author: "Dr. Satoshi Nakamoto",
    type: "Sách",
    format: "PDF",
    pages: 324,
    downloads: "12.5K",
    rating: 4.9,
    category: "Computer Science",
  },
  {
    id: 2,
    title: "Machine Learning Research Papers Collection",
    author: "Stanford AI Lab",
    type: "Tài liệu",
    format: "PDF",
    pages: 156,
    downloads: "8.3K",
    rating: 4.8,
    category: "AI & ML",
  },
  {
    id: 3,
    title: "Academic Infographics - Data Science",
    author: "MIT Media Lab",
    type: "Hình ảnh",
    format: "PNG",
    pages: 45,
    downloads: "5.2K",
    rating: 4.7,
    category: "Data Science",
  },
  {
    id: 4,
    title: "Quantum Computing Lecture Series",
    author: "Prof. Richard Feynman",
    type: "Video",
    format: "MP4",
    pages: 12,
    downloads: "15.8K",
    rating: 4.95,
    category: "Physics",
  },
  {
    id: 5,
    title: "Web3 Development Guide",
    author: "Ethereum Foundation",
    type: "Sách",
    format: "PDF",
    pages: 248,
    downloads: "22.1K",
    rating: 4.85,
    category: "Blockchain",
  },
  {
    id: 6,
    title: "Research Methodology Handbook",
    author: "Harvard University",
    type: "Tài liệu",
    format: "PDF",
    pages: 89,
    downloads: "6.7K",
    rating: 4.6,
    category: "Research",
  },
];

const getTypeIcon = (type: string) => {
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

export default function Library() {
  const { isConnected, address, connectWallet } = useWallet();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = activeCategory === "Tất cả" || resource.type === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.author.toLowerCase().includes(searchQuery.toLowerCase());
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
              Library
            </h1>
            <p className="text-muted-foreground">
              Thư viện tri thức với sách, tài liệu nghiên cứu và hình ảnh học thuật
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
                key={category.label}
                onClick={() => setActiveCategory(category.label)}
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

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <motion.article
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="academic-card overflow-hidden group cursor-pointer"
                >
                  {/* Resource Preview */}
                  <div className="relative aspect-[4/3] bg-accent/50 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TypeIcon className="w-10 h-10 text-primary" />
                    </div>
                    {/* Format Badge */}
                    <span className="absolute top-3 right-3 px-2 py-1 rounded bg-foreground/80 text-background text-xs font-medium">
                      {resource.format}
                    </span>
                    {/* Type Badge */}
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-medium">
                      {resource.type}
                    </span>
                  </div>

                  {/* Resource Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">{resource.author}</p>
                    <p className="text-xs text-muted-foreground mb-4">{resource.category}</p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" />
                          {resource.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-secondary" />
                          {resource.rating}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {resource.pages} {resource.type === "Video" ? "videos" : "pages"}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" className="border-gold-muted hover:bg-accent">
              <BookOpen className="w-4 h-4 mr-2" />
              Xem thêm tài liệu
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
