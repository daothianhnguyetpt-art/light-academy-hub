-- =============================================
-- PHASE 2: GLOBAL SCHOOLS - DATABASE SCHEMA
-- Principles: Equality, Collaboration, No Hierarchy
-- =============================================

-- 1. INSTITUTIONS TABLE
-- Represents universities, schools, organizations, independent educators
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  institution_type TEXT NOT NULL CHECK (institution_type IN ('university', 'school', 'organization', 'independent_educator', 'research_center', 'community')),
  country TEXT,
  region TEXT, -- For Global South visibility
  city TEXT,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  verified BOOLEAN DEFAULT false,
  wallet_address TEXT, -- Web3 ready
  contribution_score INTEGER DEFAULT 0, -- Measures contribution, NOT ranking
  founding_year INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INSTITUTION MEMBERS TABLE
-- Links users to institutions with roles
CREATE TABLE public.institution_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_role TEXT NOT NULL CHECK (member_role IN ('admin', 'educator', 'student', 'staff', 'alumni', 'researcher')),
  title TEXT, -- Optional job title
  department TEXT,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(institution_id, user_id)
);

-- 3. ACADEMIC VERIFICATIONS TABLE
-- For verifying academic identities
CREATE TABLE public.academic_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('degree', 'enrollment', 'employment', 'certification', 'research')),
  credential_name TEXT NOT NULL, -- Name of degree/certificate
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  evidence_url TEXT,
  evidence_hash TEXT, -- For future on-chain verification
  rejection_reason TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id)
);

-- 4. PARTNERSHIPS TABLE
-- Symmetric partnerships between institutions (no hierarchy)
CREATE TABLE public.partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_a_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  institution_b_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  partnership_type TEXT NOT NULL CHECK (partnership_type IN ('exchange', 'recognition', 'collaboration', 'resource_sharing', 'joint_program')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'ended')),
  approved_by_a BOOLEAN DEFAULT false,
  approved_by_b BOOLEAN DEFAULT false,
  terms JSONB DEFAULT '{}',
  established_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_institutions CHECK (institution_a_id != institution_b_id)
);

-- 5. CROSS-BORDER RECOGNITIONS TABLE
-- For certificates recognized across institutions/borders
CREATE TABLE public.cross_border_recognitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES public.certificates(id) ON DELETE CASCADE,
  recognizing_institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  recognition_type TEXT NOT NULL CHECK (recognition_type IN ('full', 'partial', 'equivalent', 'complementary')),
  equivalent_credential TEXT, -- Name of equivalent credential at recognizing institution
  notes TEXT,
  recognized_at TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  recognized_by UUID REFERENCES public.profiles(id)
);

-- 6. UPDATE EXISTING TABLES

-- Add institution link to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS primary_institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS academic_title TEXT,
ADD COLUMN IF NOT EXISTS verification_level TEXT DEFAULT 'unverified' CHECK (verification_level IN ('unverified', 'basic', 'verified', 'trusted'));

-- Add institution link to courses
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS accreditation_status TEXT DEFAULT 'self_published' CHECK (accreditation_status IN ('self_published', 'institution_approved', 'cross_border_recognized')),
ADD COLUMN IF NOT EXISTS accessible_to TEXT DEFAULT 'everyone' CHECK (accessible_to IN ('everyone', 'institution_only', 'partnership_network'));

-- Add institution link to certificates
ALTER TABLE public.certificates
ADD COLUMN IF NOT EXISTS issuing_institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS recognition_count INTEGER DEFAULT 0;

-- 7. ENABLE RLS ON NEW TABLES

ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_border_recognitions ENABLE ROW LEVEL SECURITY;

-- 8. HELPER FUNCTIONS

-- Check if user is admin of an institution
CREATE OR REPLACE FUNCTION public.is_institution_admin(_user_id UUID, _institution_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.institution_members
    WHERE user_id = _user_id
      AND institution_id = _institution_id
      AND member_role = 'admin'
      AND verified = true
  )
$$;

-- Check if user is member of an institution
CREATE OR REPLACE FUNCTION public.is_institution_member(_user_id UUID, _institution_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.institution_members
    WHERE user_id = _user_id
      AND institution_id = _institution_id
  )
$$;

-- 9. RLS POLICIES FOR INSTITUTIONS

-- Everyone can view institutions
CREATE POLICY "Institutions are viewable by everyone"
ON public.institutions FOR SELECT
USING (true);

-- Only system admins can create institutions
CREATE POLICY "Admins can create institutions"
ON public.institutions FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Institution admins can update their institution
CREATE POLICY "Institution admins can update own institution"
ON public.institutions FOR UPDATE
USING (public.is_institution_admin(auth.uid(), id));

-- 10. RLS POLICIES FOR INSTITUTION MEMBERS

-- Members can view members of same institution
CREATE POLICY "Members can view institution members"
ON public.institution_members FOR SELECT
USING (
  public.is_institution_member(auth.uid(), institution_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- Institution admins can add members
CREATE POLICY "Institution admins can add members"
ON public.institution_members FOR INSERT
WITH CHECK (
  public.is_institution_admin(auth.uid(), institution_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- Institution admins can update members
CREATE POLICY "Institution admins can update members"
ON public.institution_members FOR UPDATE
USING (
  public.is_institution_admin(auth.uid(), institution_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- Users can leave institutions (delete own membership)
CREATE POLICY "Users can leave institutions"
ON public.institution_members FOR DELETE
USING (
  auth.uid() = user_id
  OR public.is_institution_admin(auth.uid(), institution_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- 11. RLS POLICIES FOR ACADEMIC VERIFICATIONS

-- Users can view own verifications
CREATE POLICY "Users can view own verifications"
ON public.academic_verifications FOR SELECT
USING (auth.uid() = user_id);

-- Institution admins can view pending verifications for their institution
CREATE POLICY "Institution admins can view institution verifications"
ON public.academic_verifications FOR SELECT
USING (
  public.is_institution_admin(auth.uid(), institution_id)
);

-- Users can request verification
CREATE POLICY "Users can request verification"
ON public.academic_verifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Institution admins can update verifications (approve/reject)
CREATE POLICY "Institution admins can review verifications"
ON public.academic_verifications FOR UPDATE
USING (
  public.is_institution_admin(auth.uid(), institution_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- 12. RLS POLICIES FOR PARTNERSHIPS

-- Everyone can view active partnerships
CREATE POLICY "Active partnerships are viewable by everyone"
ON public.partnerships FOR SELECT
USING (status = 'active');

-- Institution admins can view all their partnerships
CREATE POLICY "Institution admins can view all own partnerships"
ON public.partnerships FOR SELECT
USING (
  public.is_institution_admin(auth.uid(), institution_a_id)
  OR public.is_institution_admin(auth.uid(), institution_b_id)
);

-- Institution admins can create partnership requests
CREATE POLICY "Institution admins can create partnerships"
ON public.partnerships FOR INSERT
WITH CHECK (
  public.is_institution_admin(auth.uid(), institution_a_id)
);

-- Institution admins can update their partnerships
CREATE POLICY "Institution admins can update partnerships"
ON public.partnerships FOR UPDATE
USING (
  public.is_institution_admin(auth.uid(), institution_a_id)
  OR public.is_institution_admin(auth.uid(), institution_b_id)
);

-- 13. RLS POLICIES FOR CROSS-BORDER RECOGNITIONS

-- Everyone can view recognitions
CREATE POLICY "Recognitions are viewable by everyone"
ON public.cross_border_recognitions FOR SELECT
USING (true);

-- Institution admins can grant recognitions
CREATE POLICY "Institution admins can grant recognitions"
ON public.cross_border_recognitions FOR INSERT
WITH CHECK (
  public.is_institution_admin(auth.uid(), recognizing_institution_id)
);

-- Institution admins can update their recognitions
CREATE POLICY "Institution admins can update recognitions"
ON public.cross_border_recognitions FOR UPDATE
USING (
  public.is_institution_admin(auth.uid(), recognizing_institution_id)
);

-- 14. TRIGGERS FOR UPDATED_AT

CREATE TRIGGER update_institutions_updated_at
BEFORE UPDATE ON public.institutions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 15. INDEXES FOR PERFORMANCE

CREATE INDEX idx_institutions_type ON public.institutions(institution_type);
CREATE INDEX idx_institutions_country ON public.institutions(country);
CREATE INDEX idx_institutions_region ON public.institutions(region);
CREATE INDEX idx_institution_members_user ON public.institution_members(user_id);
CREATE INDEX idx_institution_members_institution ON public.institution_members(institution_id);
CREATE INDEX idx_academic_verifications_user ON public.academic_verifications(user_id);
CREATE INDEX idx_academic_verifications_status ON public.academic_verifications(status);
CREATE INDEX idx_partnerships_status ON public.partnerships(status);
CREATE INDEX idx_cross_border_recognitions_certificate ON public.cross_border_recognitions(certificate_id);