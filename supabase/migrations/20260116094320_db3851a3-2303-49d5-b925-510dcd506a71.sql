-- Update user role to admin for daothianhnguyet.pt@gmail.com
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = '829d2ba4-8735-4488-a89a-41f66cad1f82';

-- Add RLS policy for admins to manage live_classes
CREATE POLICY "Admins can manage live_classes"
ON public.live_classes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = id);

-- Add RLS policy for admins to manage user_roles
CREATE POLICY "Admins can manage user_roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));