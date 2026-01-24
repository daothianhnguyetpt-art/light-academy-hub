-- Fix 1: Create a SECURITY DEFINER function to safely return live class data
-- This hides meeting credentials from non-registered users

CREATE OR REPLACE FUNCTION public.get_live_class_with_credentials(class_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
  is_registered boolean;
  is_instructor boolean;
  has_admin boolean;
BEGIN
  -- Check if user is registered for this class
  SELECT EXISTS(
    SELECT 1 FROM class_registrations 
    WHERE class_registrations.class_id = get_live_class_with_credentials.class_id 
    AND user_id = auth.uid()
  ) INTO is_registered;
  
  -- Check if user is the instructor
  SELECT EXISTS(
    SELECT 1 FROM live_classes 
    WHERE id = get_live_class_with_credentials.class_id 
    AND instructor_id = auth.uid()
  ) INTO is_instructor;
  
  -- Check if user is admin
  SELECT public.has_role(auth.uid(), 'admin') INTO has_admin;
  
  -- If user has access, return full data including credentials
  IF is_registered OR is_instructor OR has_admin THEN
    SELECT jsonb_build_object(
      'id', lc.id,
      'title', lc.title,
      'description', lc.description,
      'instructor_id', lc.instructor_id,
      'scheduled_at', lc.scheduled_at,
      'duration_minutes', lc.duration_minutes,
      'max_participants', lc.max_participants,
      'meeting_url', lc.meeting_url,
      'meeting_platform', lc.meeting_platform,
      'meeting_id', lc.meeting_id,
      'meeting_password', lc.meeting_password,
      'livestream_url', lc.livestream_url,
      'category', lc.category,
      'status', lc.status,
      'created_at', lc.created_at,
      'recording_url', lc.recording_url,
      'has_access', true
    ) INTO result
    FROM live_classes lc
    WHERE lc.id = get_live_class_with_credentials.class_id;
  ELSE
    -- Return sanitized data without credentials
    SELECT jsonb_build_object(
      'id', lc.id,
      'title', lc.title,
      'description', lc.description,
      'instructor_id', lc.instructor_id,
      'scheduled_at', lc.scheduled_at,
      'duration_minutes', lc.duration_minutes,
      'max_participants', lc.max_participants,
      'meeting_url', NULL,
      'meeting_platform', lc.meeting_platform,
      'meeting_id', NULL,
      'meeting_password', NULL,
      'livestream_url', CASE WHEN lc.status = 'live' THEN lc.livestream_url ELSE NULL END,
      'category', lc.category,
      'status', lc.status,
      'created_at', lc.created_at,
      'recording_url', lc.recording_url,
      'has_access', false
    ) INTO result
    FROM live_classes lc
    WHERE lc.id = get_live_class_with_credentials.class_id;
  END IF;
  
  RETURN result;
END;
$$;

-- Fix 2: Create function to check if user can see meeting credentials
CREATE OR REPLACE FUNCTION public.can_access_meeting_credentials(class_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    -- User is registered for this class
    EXISTS(SELECT 1 FROM class_registrations WHERE class_registrations.class_id = can_access_meeting_credentials.class_id AND user_id = auth.uid())
    OR
    -- User is the instructor
    EXISTS(SELECT 1 FROM live_classes WHERE id = can_access_meeting_credentials.class_id AND instructor_id = auth.uid())
    OR
    -- User is admin
    public.has_role(auth.uid(), 'admin')
  );
$$;

-- Fix 3: Add explicit write policies for library_resources
CREATE POLICY "Admins can add library resources"
ON public.library_resources FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update library resources"
ON public.library_resources FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete library resources"
ON public.library_resources FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 4: Set file size limit on post-images bucket
UPDATE storage.buckets 
SET file_size_limit = 10485760
WHERE id = 'post-images';