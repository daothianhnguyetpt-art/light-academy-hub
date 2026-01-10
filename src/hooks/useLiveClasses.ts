import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  instructor_id: string | null;
  scheduled_at: string;
  duration_minutes: number | null;
  max_participants: number | null;
  meeting_url: string | null;
  category: string | null;
  status: string | null;
  created_at: string | null;
  // Joined data
  instructor_name?: string;
}

export function useLiveClasses() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('live_classes')
        .select('*')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true });

      if (fetchError) throw fetchError;

      setClasses(data || []);
    } catch (err) {
      console.error('Error fetching live classes:', err);
      setError('Không thể tải lớp học');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLiveNow = useCallback(async () => {
    try {
      const now = new Date();
      const { data, error: fetchError } = await supabase
        .from('live_classes')
        .select('*')
        .eq('status', 'live')
        .order('scheduled_at', { ascending: true });

      if (fetchError) throw fetchError;

      return data || [];
    } catch (err) {
      console.error('Error fetching live classes:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    loading,
    error,
    fetchClasses,
    fetchLiveNow,
  };
}
