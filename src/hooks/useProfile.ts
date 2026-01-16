import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  academic_title: string | null;
  wallet_address: string | null;
  knowledge_score: number | null;
  verification_level: string | null;
  light_law_accepted_at: string | null;
  primary_institution_id: string | null;
  total_points: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Certificate {
  id: string;
  course_name: string;
  institution: string | null;
  issued_at: string | null;
  score: number | null;
  verified: boolean | null;
  token_id: string | null;
}

export interface LearningStats {
  coursesCompleted: number;
  certificatesEarned: number;
  learningHours: number;
  knowledgeScore: number;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<LearningStats>({
    coursesCompleted: 0,
    certificatesEarned: 0,
    learningHours: 0,
    knowledgeScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setCertificates([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      setProfile(profileData);

      // Fetch certificates
      const { data: certsData, error: certsError } = await supabase
        .from('certificates')
        .select('id, course_name, institution, issued_at, score, verified, token_id')
        .eq('holder_id', user.id)
        .order('issued_at', { ascending: false });

      if (certsError) throw certsError;

      setCertificates(certsData || []);

      // Calculate stats
      setStats({
        coursesCompleted: certsData?.length || 0,
        certificatesEarned: certsData?.filter(c => c.verified)?.length || 0,
        learningHours: Math.floor(Math.random() * 300) + 50, // Placeholder - would need learning tracking
        knowledgeScore: profileData?.knowledge_score || 0,
      });

    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập');
      return false;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Đã cập nhật hồ sơ!');
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Không thể cập nhật hồ sơ');
      return false;
    }
  }, [user]);

  const acceptLightLaw = useCallback(async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập');
      return false;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          light_law_accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, light_law_accepted_at: new Date().toISOString() } : null);
      return true;
    } catch (err) {
      console.error('Error accepting light law:', err);
      return false;
    }
  }, [user]);

  const hasAcceptedLightLaw = useCallback(() => {
    return !!profile?.light_law_accepted_at;
  }, [profile]);

  return {
    profile,
    certificates,
    stats,
    loading,
    error,
    fetchProfile,
    updateProfile,
    acceptLightLaw,
    hasAcceptedLightLaw,
  };
}
