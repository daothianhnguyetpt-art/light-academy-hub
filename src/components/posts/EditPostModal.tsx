import { useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    content: string;
    post_type: string | null;
  };
  onSave: (postId: string, content: string, postType: string) => Promise<boolean>;
}

const postTypes = [
  { value: "sharing", label: "Chia sẻ" },
  { value: "course", label: "Khóa học" },
  { value: "research", label: "Nghiên cứu" },
  { value: "lecture", label: "Bài giảng" },
];

export function EditPostModal({ isOpen, onClose, post, onSave }: EditPostModalProps) {
  const [content, setContent] = useState(post.content);
  const [postType, setPostType] = useState(post.post_type || "Sharing");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!content.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const success = await onSave(post.id, content.trim(), postType);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Pencil className="w-5 h-5 text-primary" />
            Chỉnh sửa bài viết
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nội dung bài viết..."
            className="min-h-[150px] resize-none border-border focus:border-gold-muted bg-background"
          />

          <Select value={postType} onValueChange={setPostType}>
            <SelectTrigger className="w-full border-border bg-background">
              <SelectValue placeholder="Loại bài viết" />
            </SelectTrigger>
            <SelectContent>
              {postTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!content.trim() || isSubmitting}
              className="btn-primary-gold"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Pencil className="w-4 h-4 mr-2" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
