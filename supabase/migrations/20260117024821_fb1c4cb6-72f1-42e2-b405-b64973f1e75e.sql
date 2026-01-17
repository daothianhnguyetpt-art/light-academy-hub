-- Add recording_url column for completed livestreams
ALTER TABLE public.live_classes ADD COLUMN IF NOT EXISTS recording_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.live_classes.recording_url IS 'URL of the recorded video after livestream ends';