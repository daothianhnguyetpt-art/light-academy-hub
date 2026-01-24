import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('useLibraryResources');

export interface LibraryResource {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  category: string | null;
  resource_type: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  page_count: number | null;
  downloads: number | null;
  rating: number | null;
  created_at: string | null;
}

export function useLibraryResources() {
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async (category?: string, searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('library_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'Tất cả') {
        query = query.eq('resource_type', category);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setResources(data || []);
    } catch (err) {
      logger.error('Error fetching library resources', err);
      setError('Không thể tải tài liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const incrementDownloads = useCallback(async (resourceId: string) => {
    // Note: This would need an edge function or RPC to properly implement
    // For now, we just track locally
    setResources(prev => 
      prev.map(r => 
        r.id === resourceId 
          ? { ...r, downloads: (r.downloads || 0) + 1 }
          : r
      )
    );
  }, []);

  return {
    resources,
    loading,
    error,
    fetchResources,
    incrementDownloads,
  };
}
