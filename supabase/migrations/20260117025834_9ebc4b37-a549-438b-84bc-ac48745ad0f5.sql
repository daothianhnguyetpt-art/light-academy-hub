-- Drop the old constraint and add a new one with 'completed' status
ALTER TABLE public.live_classes DROP CONSTRAINT IF EXISTS live_classes_status_check;

ALTER TABLE public.live_classes ADD CONSTRAINT live_classes_status_check 
CHECK (status = ANY (ARRAY['scheduled'::text, 'live'::text, 'ended'::text, 'completed'::text]));

-- Update any existing 'ended' status to 'completed' for consistency
UPDATE public.live_classes SET status = 'completed' WHERE status = 'ended';