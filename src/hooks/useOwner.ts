import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from '@/lib/logger';

const logger = createLogger('useOwner');

export function useOwner() {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsOwner(false);
          setLoading(false);
          return;
        }

        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        setIsOwner(roles?.role === 'owner');
      } catch (error) {
        logger.error('Error checking owner status', error);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwner();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkOwner();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isOwner, loading };
}
