-- Tạo bucket cho video uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('video-library', 'video-library', true)
ON CONFLICT (id) DO NOTHING;

-- RLS: Admin có thể upload video
CREATE POLICY "Admins can upload videos to video-library"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'video-library' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- RLS: Mọi người có thể xem video
CREATE POLICY "Anyone can view videos in video-library"
ON storage.objects FOR SELECT
USING (bucket_id = 'video-library');

-- RLS: Admin có thể xóa video
CREATE POLICY "Admins can delete videos from video-library"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'video-library' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- RLS: Admin có thể cập nhật video
CREATE POLICY "Admins can update videos in video-library"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'video-library' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);