import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    academic_title: string | null;
  };
}

interface CommentSectionProps {
  postId: string;
  commentsCount: number;
  onCommentAdded?: () => void;
}

export function CommentSection({ postId, commentsCount, onCommentAdded }: CommentSectionProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const fetchComments = useCallback(async () => {
    if (!isOpen) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          author:profiles!comments_author_id_fkey (
            id,
            full_name,
            avatar_url,
            academic_title
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setComments((data || []).map(c => ({
        ...c,
        author: c.author as Comment['author']
      })));
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [postId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, fetchComments]);

  const handleSubmit = async () => {
    if (!user || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content: newComment.trim(),
        });

      if (error) throw error;

      setNewComment("");
      await fetchComments();
      onCommentAdded?.();
      toast.success("Đã thêm bình luận");
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error("Không thể thêm bình luận");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <MessageCircle className="w-4 h-4 mr-1" />
          <span className="text-xs">{commentsCount || ""}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <MessageCircle className="w-5 h-5" />
            Bình luận ({comments.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-120px)] mt-4">
          {/* Comments List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {!isLoading && comments.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Chưa có bình luận nào. Hãy là người đầu tiên!
                </p>
              </div>
            )}

            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <Avatar className="w-9 h-9 border border-border flex-shrink-0">
                    <AvatarImage src={comment.author.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(comment.author.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-accent rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground">
                          {comment.author.full_name || "Ẩn danh"}
                        </span>
                        {comment.author.academic_title && (
                          <span className="text-xs text-muted-foreground">
                            • {comment.author.academic_title}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {formatTime(comment.created_at)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Comment Input */}
          {user ? (
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex gap-3">
                <Avatar className="w-9 h-9 border border-gold-muted flex-shrink-0">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(profile?.full_name ?? null)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Viết bình luận..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] resize-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.metaKey) {
                        handleSubmit();
                      }
                    }}
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      disabled={!newComment.trim() || isSubmitting}
                      className="btn-primary-gold"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-1" />
                          Gửi
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t border-border pt-4 mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Đăng nhập để bình luận
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
