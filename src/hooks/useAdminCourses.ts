import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AdminCourse {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  instructor_id: string | null;
  institution_id: string | null;
  thumbnail_url: string | null;
  duration_hours: number | null;
  created_at: string;
  instructor?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  video_count?: number;
}

export interface CourseFormData {
  title: string;
  description: string;
  category: string;
  level: string;
  instructor_id: string;
  institution: string;
  thumbnail_url: string;
  duration_hours: number;
}

export function useAdminCourses() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch courses with instructor info
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles!courses_instructor_id_fkey(id, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch video counts for each course
      const coursesWithCounts = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { count } = await supabase
            .from('videos')
            .select('id', { count: 'exact', head: true })
            .eq('course_id', course.id);

          return {
            ...course,
            video_count: count || 0,
          };
        })
      );

      setCourses(coursesWithCounts);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (formData: CourseFormData) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('courses')
        .insert({
          title: formData.title,
          description: formData.description || null,
          category: formData.category || null,
          level: formData.level || null,
          instructor_id: formData.instructor_id || null,
          thumbnail_url: formData.thumbnail_url || null,
          duration_hours: formData.duration_hours || null,
        });

      if (error) throw error;

      await fetchCourses();
    } catch (error: any) {
      throw error;
    } finally {
      setSaving(false);
    }
  }, [fetchCourses]);

  const updateCourse = useCallback(async (id: string, formData: CourseFormData) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('courses')
        .update({
          title: formData.title,
          description: formData.description || null,
          category: formData.category || null,
          level: formData.level || null,
          instructor_id: formData.instructor_id || null,
          thumbnail_url: formData.thumbnail_url || null,
          duration_hours: formData.duration_hours || null,
        })
        .eq('id', id);

      if (error) throw error;

      await fetchCourses();
    } catch (error: any) {
      throw error;
    } finally {
      setSaving(false);
    }
  }, [fetchCourses]);

  const deleteCourse = useCallback(async (id: string) => {
    try {
      // First, unlink all videos from this course
      const { error: unlinkError } = await supabase
        .from('videos')
        .update({ course_id: null })
        .eq('course_id', id);

      if (unlinkError) throw unlinkError;

      // Then delete the course
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (error: any) {
      throw error;
    }
  }, []);

  const uploadThumbnail = useCallback(async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('course-thumbnails')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('course-thumbnails')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }, []);

  // Get videos for a course
  const getCourseVideos = useCallback(async (courseId: string) => {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        id,
        title,
        thumbnail_url,
        duration_minutes,
        views,
        instructor:profiles!videos_instructor_id_fkey(id, full_name, avatar_url)
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }, []);

  // Get all videos not in any course (for adding to courses)
  const getAvailableVideos = useCallback(async () => {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        id,
        title,
        thumbnail_url,
        duration_minutes,
        instructor:profiles!videos_instructor_id_fkey(id, full_name)
      `)
      .is('course_id', null)
      .order('title');

    if (error) throw error;
    return data || [];
  }, []);

  // Add video to course
  const addVideoToCourse = useCallback(async (videoId: string, courseId: string) => {
    const { error } = await supabase
      .from('videos')
      .update({ course_id: courseId })
      .eq('id', videoId);

    if (error) throw error;
  }, []);

  // Remove video from course
  const removeVideoFromCourse = useCallback(async (videoId: string) => {
    const { error } = await supabase
      .from('videos')
      .update({ course_id: null })
      .eq('id', videoId);

    if (error) throw error;
  }, []);

  return {
    courses,
    loading,
    saving,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadThumbnail,
    getCourseVideos,
    getAvailableVideos,
    addVideoToCourse,
    removeVideoFromCourse,
  };
}
