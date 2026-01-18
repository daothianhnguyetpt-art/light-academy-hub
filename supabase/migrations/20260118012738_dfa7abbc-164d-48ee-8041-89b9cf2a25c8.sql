-- Create bucket for course thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-thumbnails', 'course-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- RLS: Admin can upload course thumbnails
CREATE POLICY "Admins can upload course thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-thumbnails' 
  AND public.has_role(auth.uid(), 'admin')
);

-- RLS: Anyone can view course thumbnails
CREATE POLICY "Anyone can view course thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-thumbnails');

-- RLS: Admin can delete course thumbnails
CREATE POLICY "Admins can delete course thumbnails"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-thumbnails' 
  AND public.has_role(auth.uid(), 'admin')
);

-- RLS: Admin can create courses
CREATE POLICY "Admins can create courses"
ON public.courses FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: Admin can update all courses
CREATE POLICY "Admins can update all courses"
ON public.courses FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Admin can delete courses
CREATE POLICY "Admins can delete courses"
ON public.courses FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));