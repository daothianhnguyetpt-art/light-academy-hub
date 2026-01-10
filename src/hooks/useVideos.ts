import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  category: string | null;
  level: string | null;
  institution: string | null;
  views: number | null;
  rating: number | null;
  instructor: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  course: {
    id: string;
    title: string;
  } | null;
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async (category?: string, search?: string) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('videos')
        .select(`
          id,
          title,
          description,
          video_url,
          thumbnail_url,
          duration_minutes,
          category,
          level,
          institution,
          views,
          rating,
          instructor:profiles!videos_instructor_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          course:courses!videos_course_id_fkey (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (category && category !== 'Tất cả') {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error: fetchError } = await query.limit(50);

      if (fetchError) throw fetchError;

      setVideos((data || []).map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url,
        duration_minutes: video.duration_minutes,
        category: video.category,
        level: video.level,
        institution: video.institution,
        views: video.views,
        rating: video.rating,
        instructor: video.instructor as Video['instructor'],
        course: video.course as Video['course'],
      })));
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const incrementViews = useCallback(async (videoId: string) => {
    try {
      const video = videos.find(v => v.id === videoId);
      if (!video) return;

      await supabase
        .from('videos')
        .update({ views: (video.views || 0) + 1 })
        .eq('id', videoId);

      setVideos(prev => prev.map(v => 
        v.id === videoId ? { ...v, views: (v.views || 0) + 1 } : v
      ));
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  }, [videos]);

  return {
    videos,
    loading,
    error,
    fetchVideos,
    incrementViews,
  };
}
