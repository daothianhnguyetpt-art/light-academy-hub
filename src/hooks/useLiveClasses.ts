import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveClassInstructor {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  academic_title: string | null;
}

export interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  instructor_id: string | null;
  scheduled_at: string;
  duration_minutes: number | null;
  max_participants: number | null;
  meeting_url: string | null;
  meeting_platform: string | null;
  livestream_url: string | null;
  category: string | null;
  status: string | null;
  created_at: string | null;
  // Joined data
  instructor?: LiveClassInstructor | null;
  registration_count?: number;
}

export function useLiveClasses() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch classes with instructor info
      const { data, error: fetchError } = await supabase
        .from('live_classes')
        .select(`
          *,
          instructor:profiles!live_classes_instructor_id_fkey(
            id, full_name, avatar_url, academic_title
          )
        `)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true });

      if (fetchError) throw fetchError;

      // Fetch registration counts for each class
      const classesWithCounts = await Promise.all(
        (data || []).map(async (classItem) => {
          const { count } = await supabase
            .from('class_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', classItem.id);

          return {
            ...classItem,
            registration_count: count || 0,
          };
        })
      );

      setClasses(classesWithCounts);
    } catch (err) {
      console.error('Error fetching live classes:', err);
      setError('Không thể tải lớp học');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLiveNow = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('live_classes')
        .select(`
          *,
          instructor:profiles!live_classes_instructor_id_fkey(
            id, full_name, avatar_url, academic_title
          )
        `)
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
