import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface VideoComment {
  id: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    academic_title: string | null;
  } | null;
}

export function useVideoInteractions(videoId: string | undefined) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Check if video is bookmarked
  useEffect(() => {
    const checkBookmark = async () => {
      if (!user || !videoId) return;

      const { data } = await supabase
        .from('video_bookmarks')
        .select('id')
        .eq('video_id', videoId)
        .eq('user_id', user.id)
        .maybeSingle();

      setIsBookmarked(!!data);
    };

    checkBookmark();
  }, [user, videoId]);

  // Fetch user rating
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!user || !videoId) return;

      const { data } = await supabase
        .from('video_ratings')
        .select('rating')
        .eq('video_id', videoId)
        .eq('user_id', user.id)
        .maybeSingle();

      setUserRating(data?.rating || null);
    };

    fetchUserRating();
  }, [user, videoId]);

  // Fetch average rating
  useEffect(() => {
    const fetchAverageRating = async () => {
      if (!videoId) return;

      const { data, count } = await supabase
        .from('video_ratings')
        .select('rating', { count: 'exact' })
        .eq('video_id', videoId);

      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(avg);
        setRatingCount(count || 0);
      }
    };

    fetchAverageRating();
  }, [videoId, userRating]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (!videoId) return;

    setLoadingComments(true);
    try {
      // Fetch comments
      const { data: commentsData, count } = await supabase
        .from('video_comments')
        .select('id, content, created_at, author_id', { count: 'exact' })
        .eq('video_id', videoId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!commentsData) {
        setComments([]);
        setCommentsCount(0);
        return;
      }

      // Fetch author profiles
      const authorIds = [...new Set(commentsData.map(c => c.author_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, academic_title')
        .in('id', authorIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const commentsWithAuthors = commentsData.map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        author: profileMap.get(comment.author_id) || null
      }));

      setComments(commentsWithAuthors as VideoComment[]);
      setCommentsCount(count || 0);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoadingComments(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Toggle bookmark
  const toggleBookmark = useCallback(async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để lưu video');
      return;
    }

    if (!videoId) return;

    setLoadingBookmark(true);
    try {
      if (isBookmarked) {
        await supabase
          .from('video_bookmarks')
          .delete()
          .eq('video_id', videoId)
          .eq('user_id', user.id);
        setIsBookmarked(false);
        toast.success('Đã xóa khỏi danh sách lưu');
      } else {
        await supabase
          .from('video_bookmarks')
          .insert({ video_id: videoId, user_id: user.id });
        setIsBookmarked(true);
        toast.success('Đã lưu video');
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoadingBookmark(false);
    }
  }, [user, videoId, isBookmarked]);

  // Submit rating
  const submitRating = useCallback(async (rating: number) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đánh giá');
      return;
    }

    if (!videoId) return;

    setLoadingRating(true);
    try {
      if (userRating) {
        // Update existing rating
        await supabase
          .from('video_ratings')
          .update({ rating })
          .eq('video_id', videoId)
          .eq('user_id', user.id);
      } else {
        // Insert new rating
        await supabase
          .from('video_ratings')
          .insert({ video_id: videoId, user_id: user.id, rating });
      }
      setUserRating(rating);
      toast.success('Cảm ơn bạn đã đánh giá!');
    } catch (err) {
      console.error('Error submitting rating:', err);
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoadingRating(false);
    }
  }, [user, videoId, userRating]);

  // Add comment
  const addComment = useCallback(async (content: string) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để bình luận');
      return false;
    }

    if (!videoId || !content.trim()) return false;

    try {
      const { error } = await supabase
        .from('video_comments')
        .insert({
          video_id: videoId,
          author_id: user.id,
          content: content.trim()
        });

      if (error) throw error;

      await fetchComments();
      toast.success('Đã thêm bình luận');
      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Có lỗi xảy ra');
      return false;
    }
  }, [user, videoId, fetchComments]);

  // Delete comment
  const deleteComment = useCallback(async (commentId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('video_comments')
        .delete()
        .eq('id', commentId)
        .eq('author_id', user.id);

      setComments(prev => prev.filter(c => c.id !== commentId));
      setCommentsCount(prev => prev - 1);
      toast.success('Đã xóa bình luận');
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error('Có lỗi xảy ra');
    }
  }, [user]);

  return {
    isBookmarked,
    userRating,
    averageRating,
    ratingCount,
    comments,
    commentsCount,
    loadingBookmark,
    loadingRating,
    loadingComments,
    toggleBookmark,
    submitRating,
    addComment,
    deleteComment,
    fetchComments,
  };
}
