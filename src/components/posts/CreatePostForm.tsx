import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreatePostFormProps {
  onCreatePost: (content: string, postType: string, mediaUrl?: string, mediaType?: string) => Promise<any>;
}

const postTypes = [
  { value: "Sharing", label: "Chia sẻ" },
  { value: "Course", label: "Khóa học" },
  { value: "Research", label: "Nghiên cứu" },
  { value: "Lecture", label: "Bài giảng" },
];

export function CreatePostForm({ onCreatePost }: CreatePostFormProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("Sharing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh phải nhỏ hơn 5MB");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('post-images')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const { data } = supabase.storage
      .from('post-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      let mediaUrl: string | undefined;
      let mediaType: string | undefined;

      if (selectedImage) {
        mediaUrl = await uploadImage(selectedImage) || undefined;
        mediaType = "image";
      }

      await onCreatePost(content.trim(), postType, mediaUrl, mediaType);
      setContent("");
      setPostType("Sharing");
      removeImage();
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Không thể đăng bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="academic-card p-6 mb-8 text-center"
      >
        <Sparkles className="w-10 h-10 text-secondary mx-auto mb-3" />
        <h3 className="font-semibold text-foreground mb-1">
          Đăng nhập để chia sẻ tri thức
        </h3>
        <p className="text-sm text-muted-foreground">
          Tham gia cộng đồng học thuật và bắt đầu chia sẻ kiến thức của bạn
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="academic-card p-6 mb-8"
    >
      <div className="flex gap-4">
        <Avatar className="w-12 h-12 border-2 border-gold-muted flex-shrink-0">
          <AvatarImage src={profile?.avatar_url ?? undefined} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {getInitials(profile?.full_name ?? null)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <Textarea
            placeholder="Chia sẻ kiến thức, nghiên cứu hoặc bài học của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-border focus:border-gold-muted bg-background"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-48 rounded-lg border border-border"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger className="w-[140px] border-border bg-background">
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

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="btn-primary-gold"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Chia Sẻ
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
