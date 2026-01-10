import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { scheduleReminder, cancelReminder } from '@/lib/calendar-utils';
import { toast } from 'sonner';

interface RegistrationState {
  isRegistered: boolean;
  registrationCount: number;
  loading: boolean;
}

export function useLiveClassRegistration(classId: string | null) {
  const { user } = useAuth();
  const [state, setState] = useState<RegistrationState>({
    isRegistered: false,
    registrationCount: 0,
    loading: true,
  });

  const fetchRegistrationStatus = useCallback(async () => {
    if (!classId) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      // Fetch count
      const { count } = await supabase
        .from('class_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', classId);

      // Check if user is registered
      let isRegistered = false;
      if (user) {
        const { data } = await supabase
          .from('class_registrations')
          .select('id')
          .eq('class_id', classId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        isRegistered = !!data;
      }

      setState({
        isRegistered,
        registrationCount: count || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching registration status:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [classId, user]);

  useEffect(() => {
    fetchRegistrationStatus();
  }, [fetchRegistrationStatus]);

  const registerForClass = useCallback(async (
    classTitle: string, 
    scheduledAt: string,
    enableReminder: boolean = true
  ): Promise<boolean> => {
    if (!user || !classId) {
      toast.error('Vui lòng đăng nhập để đăng ký lớp học');
      return false;
    }

    try {
      const { error } = await supabase
        .from('class_registrations')
        .insert({
          class_id: classId,
          user_id: user.id,
          reminder_enabled: enableReminder,
        });

      if (error) throw error;

      if (enableReminder) {
        scheduleReminder(classId, classTitle, scheduledAt);
      }

      setState(prev => ({
        ...prev,
        isRegistered: true,
        registrationCount: prev.registrationCount + 1,
      }));

      toast.success('Đã đăng ký thành công!');
      return true;
    } catch (error) {
      console.error('Error registering for class:', error);
      toast.error('Không thể đăng ký lớp học');
      return false;
    }
  }, [classId, user]);

  const unregisterFromClass = useCallback(async (): Promise<boolean> => {
    if (!user || !classId) return false;

    try {
      const { error } = await supabase
        .from('class_registrations')
        .delete()
        .eq('class_id', classId)
        .eq('user_id', user.id);

      if (error) throw error;

      cancelReminder(classId);

      setState(prev => ({
        ...prev,
        isRegistered: false,
        registrationCount: Math.max(0, prev.registrationCount - 1),
      }));

      toast.success('Đã hủy đăng ký');
      return true;
    } catch (error) {
      console.error('Error unregistering from class:', error);
      toast.error('Không thể hủy đăng ký');
      return false;
    }
  }, [classId, user]);

  return {
    ...state,
    registerForClass,
    unregisterFromClass,
    refresh: fetchRegistrationStatus,
  };
}

// Hook to get all user's registered classes
export function useMyRegistrations() {
  const { user } = useAuth();
  const [registeredClassIds, setRegisteredClassIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRegistrations = async () => {
      if (!user) {
        setRegisteredClassIds([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('class_registrations')
          .select('class_id')
          .eq('user_id', user.id);

        if (error) throw error;

        setRegisteredClassIds(data?.map(r => r.class_id) || []);
      } catch (error) {
        console.error('Error fetching registrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRegistrations();
  }, [user]);

  return { registeredClassIds, loading };
}
