import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface AcademicVerification {
  id: string;
  user_id: string;
  institution_id: string | null;
  verification_type: string;
  credential_name: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  evidence_url: string | null;
  status: string | null;
  requested_at: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  institution?: {
    name: string;
    logo_url: string | null;
  };
}

export interface VerificationRequest {
  institution_id: string;
  verification_type: string;
  credential_name: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  evidence_url?: string;
}

export function useVerification() {
  const [verifications, setVerifications] = useState<AcademicVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchVerifications = useCallback(async () => {
    if (!user) {
      setVerifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('academic_verifications')
        .select(`
          *,
          institution:institutions(name, logo_url)
        `)
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false });

      if (fetchError) throw fetchError;

      setVerifications(data?.map(v => ({
        ...v,
        institution: Array.isArray(v.institution) ? v.institution[0] : v.institution
      })) || []);

    } catch (err) {
      console.error('Error fetching verifications:', err);
      setError('Không thể tải thông tin xác minh');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const submitVerificationRequest = useCallback(async (request: VerificationRequest) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập');
      return false;
    }

    try {
      setSubmitting(true);

      const { error: insertError } = await supabase
        .from('academic_verifications')
        .insert({
          user_id: user.id,
          institution_id: request.institution_id,
          verification_type: request.verification_type,
          credential_name: request.credential_name,
          field_of_study: request.field_of_study || null,
          start_date: request.start_date || null,
          end_date: request.end_date || null,
          evidence_url: request.evidence_url || null,
          status: 'pending',
          requested_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      toast.success('Đã gửi yêu cầu xác minh!');
      await fetchVerifications();
      return true;

    } catch (err) {
      console.error('Error submitting verification request:', err);
      toast.error('Không thể gửi yêu cầu xác minh');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [user, fetchVerifications]);

  const getVerificationStatus = useCallback(() => {
    if (verifications.length === 0) return 'none';
    
    const hasApproved = verifications.some(v => v.status === 'approved');
    if (hasApproved) return 'verified';
    
    const hasPending = verifications.some(v => v.status === 'pending');
    if (hasPending) return 'pending';
    
    return 'rejected';
  }, [verifications]);

  const getApprovedVerifications = useCallback(() => {
    return verifications.filter(v => v.status === 'approved');
  }, [verifications]);

  return {
    verifications,
    loading,
    submitting,
    error,
    fetchVerifications,
    submitVerificationRequest,
    getVerificationStatus,
    getApprovedVerifications,
  };
}
