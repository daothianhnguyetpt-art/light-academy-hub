import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { usePosts, Post } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { CommentSection } from "@/components/posts/CommentSection";
import { EditPostModal } from "@/components/posts/EditPostModal";
import { useTranslation } from "@/i18n/useTranslation";
import { useLanguage } from "@/i18n/LanguageContext";
import { getDateLocale } from "@/lib/date-utils";
import { 
  Sparkles, 
  Bookmark, 
  MoreHorizontal,
  Video,
  FileText,
  GraduationCap,
  Users,
  TrendingUp,
  Loader2,
  Link as LinkIcon,
  Pencil,
  Trash2,
  Flag,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function SocialFeed() {
  const { user } = useAuth();
  const { isConnected, address, connectWallet } = useWallet();
  const { posts, loading, toggleAppreciate, toggleBookmark, fetchPosts, createPost, updatePost, deletePost } = usePosts();
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const { t } = useTranslation();
  const { language } = useLanguage();

  const contentTypes = [
    { icon: FileText, label: t('socialFeed.postTypes.all'), value: "all" },
    { icon: GraduationCap, label: t('socialFeed.postTypes.course'), value: "course" },
    { icon: FileText, label: t('socialFeed.postTypes.research'), value: "research" },
    { icon: Video, label: t('socialFeed.postTypes.lecture'), value: "lecture" },
    { icon: Users, label: t('socialFeed.postTypes.sharing'), value: "sharing" },
  ];

  const handleSharePost = async (postId: string) => {
    const url = `${window.location.origin}/social-feed#${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('socialFeed.copiedLink'));
    } catch {
      toast.error(t('socialFeed.copyFailed'));
    }
  };

  const handleReportPost = () => {
    toast.success(t('socialFeed.reportSent'));
  };

  const handleDeletePost = async () => {
    if (!deletingPostId) return;
    await deletePost(deletingPostId);
    setDeletingPostId(null);
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === "all") return true;
    return post.post_type === activeFilter;
  });

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: getDateLocale(language) });
    } catch {
      return dateStr;
    }
  };

  const isEdited = (post: Post) => {
    return post.updated_at && post.updated_at !== post.created_at;
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
                {t('socialFeed.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('socialFeed.subtitle')}
              </p>
            </motion.div>

            {/* Create Post Form */}
            <CreatePostForm onCreatePost={createPost} />

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
            >
              {contentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setActiveFilter(type.value)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap snap-start ${
                    activeFilter === type.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold-muted"
                  }`}
                >
                  <type.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {type.label}
                </button>
              ))}
            </motion.div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">{t('socialFeed.loadingPosts')}</span>
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
                  {t('socialFeed.noPosts')}
                </h3>
                <p className="text-muted-foreground">
                  {t('socialFeed.beFirst')}
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
                  className="academic-card p-4 sm:p-6"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gold-muted">
                        <AvatarImage src={post.author.avatar_url ?? undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(post.author.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {post.author.full_name || t('socialFeed.anonymous')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {post.author.academic_title || t('socialFeed.member')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.post_type && (
                        <span className="px-3 py-1 rounded-full bg-accent text-xs font-medium text-foreground">
                          {post.post_type}
                        </span>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {user?.id === post.author.id && (
                            <>
                              <DropdownMenuItem onClick={() => setEditingPost(post)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                {t('socialFeed.editPost')}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => setDeletingPostId(post.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t('socialFeed.deletePost')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem onClick={handleReportPost}>
                            <Flag className="w-4 h-4 mr-2" />
                            {t('common.report')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-foreground mb-4 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Location */}
                  {post.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{post.location}</span>
                    </div>
                  )}

                  {/* Media */}
                  {post.media_url && (
                    <div className="mb-4 rounded-xl bg-accent/50 border border-border overflow-hidden">
                      {post.media_type === "video" ? (
                        <video 
                          src={post.media_url} 
                          controls 
                          className="w-full max-h-96"
                        />
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
                      <CommentSection 
                        postId={post.id} 
                        commentsCount={post.comments_count}
                        onCommentAdded={fetchPosts}
                      />
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSharePost(post.id)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <LinkIcon className="w-4 h-4 mr-1" />
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(post.created_at)}
                      {isEdited(post) && <span className="ml-1">({t('socialFeed.edited')})</span>}
                    </span>
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
                  {t('socialFeed.reloadPosts')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Post Modal */}
      {editingPost && (
        <EditPostModal
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          post={editingPost}
          onSave={updatePost}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingPostId} onOpenChange={() => setDeletingPostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('socialFeed.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('socialFeed.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
