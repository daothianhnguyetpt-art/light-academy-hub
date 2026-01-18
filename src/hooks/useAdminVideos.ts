import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AdminVideo {
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
  instructor_id: string | null;
  course_id: string | null;
  created_at: string;
  instructor?: {
    id: string;
    full_name: string | null;
  } | null;
}

export interface VideoFormData {
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration_minutes: number;
  category: string;
  level: string;
  institution: string;
  instructor_id: string;
  course_id: string;
}

export function useAdminVideos() {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
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
          instructor_id,
          course_id,
          created_at,
          instructor:profiles!videos_instructor_id_fkey (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVideos((data || []).map(video => ({
        ...video,
        instructor: video.instructor as AdminVideo['instructor'],
      })));
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createVideo = useCallback(async (formData: VideoFormData) => {
    try {
      setSaving(true);
      const dataToSave = {
        title: formData.title,
        description: formData.description || null,
        video_url: formData.video_url || null,
        thumbnail_url: formData.thumbnail_url || null,
        duration_minutes: formData.duration_minutes || null,
        category: formData.category || null,
        level: formData.level || null,
        institution: formData.institution || null,
        instructor_id: formData.instructor_id || null,
        course_id: formData.course_id || null,
      };

      const { error } = await supabase
        .from('videos')
        .insert([dataToSave]);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error creating video:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateVideo = useCallback(async (id: string, formData: VideoFormData) => {
    try {
      setSaving(true);
      const dataToSave = {
        title: formData.title,
        description: formData.description || null,
        video_url: formData.video_url || null,
        thumbnail_url: formData.thumbnail_url || null,
        duration_minutes: formData.duration_minutes || null,
        category: formData.category || null,
        level: formData.level || null,
        institution: formData.institution || null,
        instructor_id: formData.instructor_id || null,
        course_id: formData.course_id || null,
      };

      const { error } = await supabase
        .from('videos')
        .update(dataToSave)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error updating video:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteVideo = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVideos(prev => prev.filter(v => v.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }, []);

  const uploadThumbnail = useCallback(async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('video-thumbnails')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('video-thumbnails')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }, []);

  const uploadVideo = useCallback(async (
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Supabase doesn't support progress natively, so we simulate it
    if (onProgress) onProgress(10);

    const { error: uploadError } = await supabase.storage
      .from('video-library')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (onProgress) onProgress(90);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('video-library')
      .getPublicUrl(fileName);

    if (onProgress) onProgress(100);

    return data.publicUrl;
  }, []);

  return {
    videos,
    loading,
    saving,
    fetchVideos,
    createVideo,
    updateVideo,
    deleteVideo,
    uploadThumbnail,
    uploadVideo,
  };
}
