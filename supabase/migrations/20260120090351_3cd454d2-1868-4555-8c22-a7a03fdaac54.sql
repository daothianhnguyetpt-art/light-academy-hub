-- Step 2: Create is_owner function
CREATE OR REPLACE FUNCTION public.is_owner(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'owner'
  )
$$;

-- Step 3: Update daothianhnguyet.pt@gmail.com to owner
UPDATE public.user_roles 
SET role = 'owner' 
WHERE user_id = '829d2ba4-8735-4488-a89a-41f66cad1f82';

-- Step 4: Drop existing policies on user_roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Owner can add any role, Admin can add non-admin" ON public.user_roles;
DROP POLICY IF EXISTS "Owner can update any, Admin can update non-admin" ON public.user_roles;
DROP POLICY IF EXISTS "Only owner can delete roles" ON public.user_roles;

-- Step 5: Create new RLS policies

-- SELECT: Users can view own role, Admin/Owner can view all
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (
  auth.uid() = user_id 
  OR public.is_owner(auth.uid()) 
  OR public.has_role(auth.uid(), 'admin')
);

-- INSERT: Owner can add any role, Admin can add non-admin/non-owner
CREATE POLICY "Owner can add any role, Admin can add non-admin"
ON public.user_roles FOR INSERT
WITH CHECK (
  public.is_owner(auth.uid())
  OR (
    public.has_role(auth.uid(), 'admin') 
    AND role NOT IN ('admin', 'owner')
  )
);

-- UPDATE: Owner can update any, Admin can update non-admin/non-owner
CREATE POLICY "Owner can update any, Admin can update non-admin"
ON public.user_roles FOR UPDATE
USING (
  public.is_owner(auth.uid())
  OR (
    public.has_role(auth.uid(), 'admin') 
    AND role NOT IN ('admin', 'owner')
  )
);

-- DELETE: Only owner can delete roles
CREATE POLICY "Only owner can delete roles"
ON public.user_roles FOR DELETE
USING (public.is_owner(auth.uid()));