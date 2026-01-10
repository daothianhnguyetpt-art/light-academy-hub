import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Send, Trash2, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    academic_title: string | null;
  } | null;
}

interface VideoCommentSectionProps {
  comments: Comment[];
  commentsCount: number;
  loading: boolean;
  onAddComment: (content: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => void;
}

export function VideoCommentSection({
  comments,
  commentsCount,
  loading,
  onAddComment,
  onDeleteComment,
}: VideoCommentSectionProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    const success = await onAddComment(newComment);
    if (success) {
      setNewComment("");
    }
    setSubmitting(false);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <div className="academic-card p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-secondary" />
        Bình luận ({commentsCount})
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            placeholder="Viết bình luận của bạn..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none mb-3 bg-background border-border focus:border-gold-muted"
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Gửi bình luận
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 mb-6 bg-accent/30 rounded-lg">
          <p className="text-muted-foreground text-sm">
            Vui lòng đăng nhập để bình luận
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors"
            >
              <Avatar className="w-10 h-10 border border-gold-muted/30">
                <AvatarImage src={comment.author?.avatar_url ?? undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {getInitials(comment.author?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground text-sm">
                    {comment.author?.full_name || "Người dùng"}
                  </span>
                  {comment.author?.academic_title && (
                    <span className="text-xs text-muted-foreground">
                      • {comment.author.academic_title}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    • {formatDistanceToNow(new Date(comment.created_at), { 
                        addSuffix: true, 
                        locale: vi 
                      })}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
              {user && user.id === comment.author?.id && (
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors self-start"
                  title="Xóa bình luận"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
