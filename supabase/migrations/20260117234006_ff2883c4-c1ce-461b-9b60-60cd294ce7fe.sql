-- Create storage bucket for video thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('video-thumbnails', 'video-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for video-thumbnails bucket
CREATE POLICY "Admins can upload video thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'video-thumbnails' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update video thumbnails"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'video-thumbnails' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete video thumbnails"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'video-thumbnails' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Anyone can view video thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'video-thumbnails');

-- RLS policies for videos table - Admin management
CREATE POLICY "Admins can create videos"
ON public.videos FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all videos"
ON public.videos FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete videos"
ON public.videos FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));