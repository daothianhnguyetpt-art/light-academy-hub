import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, Video, MapPin, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import { useTranslation } from "@/i18n/useTranslation";

interface CreatePostFormProps {
  onCreatePost: (content: string, postType: string, mediaUrl?: string, mediaType?: string, location?: string) => Promise<any>;
}

const postTypeValues = ["sharing", "course", "research", "lecture"] as const;

export function CreatePostForm({ onCreatePost }: CreatePostFormProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("sharing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Image state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Video state
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // Location state
  const [location, setLocation] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("socialFeed.imageTooLarge"));
        return;
      }
      // Clear video if selecting image
      removeVideo();
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(t("socialFeed.videoTooLarge"));
        return;
      }
      // Clear image if selecting video
      removeImage();
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const removeVideo = () => {
    setSelectedVideo(null);
    setVideoPreview(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const removeLocation = () => {
    setLocation("");
    setShowLocationInput(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(t("socialFeed.browserNoLocation"));
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get location name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=10&addressdetails=1`
          );
          const data = await response.json();
          const locationName = data.display_name?.split(',').slice(0, 3).join(', ') || 
            `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
          setLocation(locationName);
          setShowLocationInput(true);
        } catch {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setShowLocationInput(true);
        }
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error(t("socialFeed.locationFailed"));
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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

  const uploadVideo = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('post-videos')
      .upload(fileName, file);

    if (error) {
      console.error('Video upload error:', error);
      throw error;
    }

    const { data } = supabase.storage
      .from('post-videos')
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
      } else if (selectedVideo) {
        mediaUrl = await uploadVideo(selectedVideo) || undefined;
        mediaType = "video";
      }

      await onCreatePost(
        content.trim(), 
        postType, 
        mediaUrl, 
        mediaType, 
        location || undefined
      );
      
      // Reset form
      setContent("");
      setPostType("sharing");
      removeImage();
      removeVideo();
      removeLocation();
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error(t("socialFeed.postFailed"));
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
          {t("socialFeed.loginToPost")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("socialFeed.loginToPostDesc")}
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
            placeholder={t("socialFeed.createPostPlaceholder")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-border focus:border-gold-muted bg-background"
          />

          {/* Media Preview */}
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

          {videoPreview && (
            <div className="relative inline-block">
              <video 
                src={videoPreview} 
                controls
                className="max-h-48 rounded-lg border border-border"
              />
              <button
                onClick={removeVideo}
                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Location Input */}
          {showLocationInput && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("socialFeed.enterLocation")}
                className="flex-1 border-border focus:border-gold-muted bg-background"
              />
              <button
                onClick={removeLocation}
                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Toolbar - Facebook style */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-1">
              {/* Post Type Selector */}
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger className="w-[130px] border-border bg-background h-9">
                  <SelectValue placeholder={t("socialFeed.postTypeLabel")} />
                </SelectTrigger>
                <SelectContent>
                  {postTypeValues.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`socialFeed.postTypes.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Image Upload */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-muted-foreground hover:text-primary ${selectedImage ? 'text-primary' : ''}`}
                onClick={() => imageInputRef.current?.click()}
                disabled={!!selectedVideo}
              >
                <ImageIcon className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline text-xs">{t("socialFeed.addImage")}</span>
              </Button>

              {/* Video Upload */}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/mov,video/quicktime"
                onChange={handleVideoSelect}
                className="hidden"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-muted-foreground hover:text-primary ${selectedVideo ? 'text-primary' : ''}`}
                onClick={() => videoInputRef.current?.click()}
                disabled={!!selectedImage}
              >
                <Video className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline text-xs">{t("socialFeed.addVideo")}</span>
              </Button>

              {/* Location */}
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-muted-foreground hover:text-primary ${location ? 'text-primary' : ''}`}
                onClick={() => {
                  if (!showLocationInput) {
                    setShowLocationInput(true);
                  } else {
                    getCurrentLocation();
                  }
                }}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <Loader2 className="w-5 h-5 mr-1 animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5 mr-1" />
                )}
                <span className="hidden sm:inline text-xs">
                  {showLocationInput ? t("socialFeed.getLocation") : t("socialFeed.addLocation")}
                </span>
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
              {isSubmitting ? t("socialFeed.posting") : t("socialFeed.post")}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}