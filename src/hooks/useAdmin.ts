import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './useAuth';
import { createLogger } from '@/lib/logger';

const logger = createLogger('useAdmin');

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = useCallback(async () => {
    // Nếu auth đang loading, không làm gì - đợi auth xong
    if (authLoading) {
      return;
    }

    // Nếu không có user, reset state
    if (!user?.id) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Bắt đầu check role - set loading = true
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        logger.error('Error checking admin status', error);
        setIsAdmin(false);
      } else {
        // Owner cũng có quyền admin
        const hasAdminAccess = data?.role === 'admin' || data?.role === 'owner';
        logger.debug('Role check result', { role: data?.role, hasAdminAccess });
        setIsAdmin(hasAdminAccess);
      }
    } catch (err) {
      logger.error('Error checking admin status', err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [user?.id, authLoading]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  return {
    isAdmin,
    loading,
    checkAdminStatus,
  };
}
