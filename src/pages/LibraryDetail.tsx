import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { supabase } from "@/integrations/supabase/client";
import { 
  BookOpen, 
  FileText, 
  Image as ImageIcon,
  Video,
  Download,
  Star,
  ArrowLeft,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  author: string | null;
  resource_type: string | null;
  category: string | null;
  page_count: number | null;
  downloads: number | null;
  rating: number | null;
  file_url: string | null;
  thumbnail_url: string | null;
}

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

export default function LibraryDetail() {
  const { id } = useParams<{ id: string }>();
  const { isConnected, address, connectWallet } = useWallet();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchResource = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('library_resources')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setResource(data);

        // Fetch related resources
        const { data: related } = await supabase
          .from('library_resources')
          .select('*')
          .neq('id', id)
          .eq('category', data?.category)
          .limit(4);

        setRelatedResources(related || []);
      } catch (err) {
        console.error('Error fetching resource:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleDownload = async () => {
    if (!resource) return;

    // Increment download count
    await supabase
      .from('library_resources')
      .update({ downloads: (resource.downloads || 0) + 1 })
      .eq('id', resource.id);

    setResource(prev => prev ? { ...prev, downloads: (prev.downloads || 0) + 1 } : null);

    if (resource.file_url) {
      window.open(resource.file_url, '_blank');
      toast.success("Đang tải xuống...");
    } else {
      toast.info("Tài liệu chưa có sẵn để tải");
    }
  };

  const formatDownloads = (num: number | null) => {
    if (!num) return "0";
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
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

  if (!resource) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onConnectWallet={connectWallet}
          isWalletConnected={isConnected}
          walletAddress={address ?? undefined}
        />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Tài liệu không tồn tại</h2>
          <Link to="/library">
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

  const TypeIcon = getTypeIcon(resource.resource_type);

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
          <Link to="/library">
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
                {/* Resource Preview */}
                <div className="aspect-[4/3] bg-accent/50 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
                  {resource.thumbnail_url ? (
                    <img 
                      src={resource.thumbnail_url}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TypeIcon className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>

                {/* Resource Info */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-sm font-medium">
                    {resource.resource_type || "Tài liệu"}
                  </span>
                  {resource.category && (
                    <span className="px-3 py-1 rounded-full bg-accent text-foreground text-sm">
                      {resource.category}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-2xl font-bold text-foreground mb-3">
                  {resource.title}
                </h1>

                <p className="text-muted-foreground mb-6">
                  {resource.author || "Tác giả không xác định"}
                </p>

                <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {formatDownloads(resource.downloads)} lượt tải
                  </span>
                  {resource.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-secondary" />
                      {resource.rating.toFixed(1)}
                    </span>
                  )}
                  <span>
                    {resource.page_count || 0} {resource.resource_type === "Video" ? "video" : "trang"}
                  </span>
                </div>

                {/* Download Button */}
                <Button 
                  onClick={handleDownload}
                  className="btn-primary-gold mb-8"
                  size="lg"
                >
                  {resource.file_url ? (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Tải xuống
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Xem trước
                    </>
                  )}
                </Button>

                {/* Description */}
                {resource.description && (
                  <div className="academic-card p-6">
                    <h3 className="font-semibold text-foreground mb-3">Mô tả</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {resource.description}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar - Related Resources */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  Tài liệu liên quan
                </h2>

                {relatedResources.length === 0 ? (
                  <div className="academic-card p-6 text-center">
                    <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Chưa có tài liệu liên quan
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {relatedResources.map((related) => {
                      const RelatedIcon = getTypeIcon(related.resource_type);
                      return (
                        <Link key={related.id} to={`/library/${related.id}`}>
                          <div className="academic-card overflow-hidden group cursor-pointer hover:border-gold-muted">
                            <div className="flex gap-3 p-3">
                              <div className="w-16 h-16 rounded-lg bg-accent/50 flex-shrink-0 flex items-center justify-center">
                                {related.thumbnail_url ? (
                                  <img 
                                    src={related.thumbnail_url}
                                    alt={related.title}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <RelatedIcon className="w-6 h-6 text-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                  {related.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {related.author || "Tác giả"}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {formatDownloads(related.downloads)} lượt tải
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
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
