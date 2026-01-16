-- Create user_rewards table
CREATE TABLE public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('points', 'badge', 'certificate')),
  title TEXT NOT NULL,
  description TEXT,
  points_amount INTEGER DEFAULT 0,
  badge_icon TEXT,
  badge_color TEXT,
  awarded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add total_points column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;

-- Enable RLS
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

-- Admin can do everything with rewards
CREATE POLICY "Admins can manage all rewards"
ON public.user_rewards
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own rewards
CREATE POLICY "Users can view their own rewards"
ON public.user_rewards
FOR SELECT
USING (auth.uid() = user_id);

-- Create function to update total_points when points are awarded
CREATE OR REPLACE FUNCTION public.update_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reward_type = 'points' AND NEW.points_amount > 0 THEN
    UPDATE public.profiles
    SET total_points = COALESCE(total_points, 0) + NEW.points_amount
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-update points
CREATE TRIGGER on_reward_created
AFTER INSERT ON public.user_rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_user_total_points();