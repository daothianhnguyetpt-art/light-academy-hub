import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { usePosts } from "@/hooks/usePosts";
import { useTranslation } from "@/i18n/useTranslation";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const { t } = useTranslation();
  const { createPost } = usePosts();

  const handleCreatePost = async (
    content: string, 
    postType: string, 
    mediaUrl?: string, 
    mediaType?: string, 
    location?: string
  ) => {
    const result = await createPost(content, postType, mediaUrl, mediaType, location);
    if (result) {
      onOpenChange(false);
    }
    return result;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {t("social.createPost") || "Tạo bài viết mới"}
          </DialogTitle>
        </DialogHeader>
        <CreatePostForm onCreatePost={handleCreatePost} />
      </DialogContent>
    </Dialog>
  );
}
