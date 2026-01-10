-- Create bucket for post videos (50MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('post-videos', 'post-videos', true, 52428800)
ON CONFLICT (id) DO NOTHING;

-- Policy for authenticated users to upload videos
CREATE POLICY "Users can upload post videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'post-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for public to view videos
CREATE POLICY "Public can view post videos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'post-videos');

-- Policy for users to delete their own videos
CREATE POLICY "Users can delete own post videos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'post-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add location columns to posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS location_lat numeric;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS location_lng numeric;