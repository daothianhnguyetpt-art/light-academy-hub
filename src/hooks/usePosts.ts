import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Post {
  id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  post_type: string | null;
  created_at: string;
  updated_at?: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    academic_title: string | null;
  };
  appreciates_count: number;
  comments_count: number;
  bookmarks_count: number;
  user_appreciated: boolean;
  user_bookmarked: boolean;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          media_url,
          media_type,
          post_type,
          created_at,
          updated_at,
          author:profiles!posts_author_id_fkey (
            id,
            full_name,
            avatar_url,
            academic_title
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) throw postsError;

      // Get counts and user interactions
      const postsWithStats = await Promise.all(
        (postsData || []).map(async (post) => {
          // Get appreciates count
          const { count: appreciatesCount } = await supabase
            .from('appreciates')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Get bookmarks count
          const { count: bookmarksCount } = await supabase
            .from('bookmarks')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Check if user appreciated
          let userAppreciated = false;
          let userBookmarked = false;

          if (user) {
            const { data: appreciateData } = await supabase
              .from('appreciates')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .maybeSingle();
            userAppreciated = !!appreciateData;

            const { data: bookmarkData } = await supabase
              .from('bookmarks')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .maybeSingle();
            userBookmarked = !!bookmarkData;
          }

          return {
            id: post.id,
            content: post.content,
            media_url: post.media_url,
            media_type: post.media_type,
            post_type: post.post_type,
            created_at: post.created_at,
            updated_at: post.updated_at,
            author: post.author as Post['author'],
            appreciates_count: appreciatesCount || 0,
            comments_count: commentsCount || 0,
            bookmarks_count: bookmarksCount || 0,
            user_appreciated: userAppreciated,
            user_bookmarked: userBookmarked,
          };
        })
      );

      setPosts(postsWithStats);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toggleAppreciate = useCallback(async (postId: string) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thực hiện');
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (post.user_appreciated) {
        await supabase
          .from('appreciates')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('appreciates')
          .insert({ post_id: postId, user_id: user.id });
      }

      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              user_appreciated: !p.user_appreciated,
              appreciates_count: p.user_appreciated ? p.appreciates_count - 1 : p.appreciates_count + 1
            }
          : p
      ));
    } catch (err) {
      console.error('Error toggling appreciate:', err);
      toast.error('Đã xảy ra lỗi');
    }
  }, [user, posts]);

  const toggleBookmark = useCallback(async (postId: string) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thực hiện');
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (post.user_bookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('bookmarks')
          .insert({ post_id: postId, user_id: user.id });
      }

      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              user_bookmarked: !p.user_bookmarked,
              bookmarks_count: p.user_bookmarked ? p.bookmarks_count - 1 : p.bookmarks_count + 1
            }
          : p
      ));

      toast.success(post.user_bookmarked ? 'Đã bỏ lưu' : 'Đã lưu bài viết');
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      toast.error('Đã xảy ra lỗi');
    }
  }, [user, posts]);

  const createPost = useCallback(async (content: string, postType?: string, mediaUrl?: string, mediaType?: string) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đăng bài');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          content,
          author_id: user.id,
          post_type: postType || 'Sharing',
          media_url: mediaUrl || null,
          media_type: mediaType || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Đã đăng bài thành công!');
      await fetchPosts();
      return data;
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Không thể đăng bài');
      return null;
    }
  }, [user, fetchPosts]);

  const updatePost = useCallback(async (postId: string, content: string, postType: string) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thực hiện');
      return false;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          content, 
          post_type: postType, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', postId)
        .eq('author_id', user.id);

      if (error) throw error;

      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, content, post_type: postType, updated_at: new Date().toISOString() }
          : p
      ));

      toast.success('Đã cập nhật bài viết');
      return true;
    } catch (err) {
      console.error('Error updating post:', err);
      toast.error('Không thể cập nhật bài viết');
      return false;
    }
  }, [user]);

  const deletePost = useCallback(async (postId: string) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thực hiện');
      return false;
    }

    try {
      // Delete related records first
      await supabase.from('appreciates').delete().eq('post_id', postId);
      await supabase.from('bookmarks').delete().eq('post_id', postId);
      await supabase.from('comments').delete().eq('post_id', postId);

      // Delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', user.id);

      if (error) throw error;

      setPosts(prev => prev.filter(p => p.id !== postId));
      toast.success('Đã xóa bài viết');
      return true;
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error('Không thể xóa bài viết');
      return false;
    }
  }, [user]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    toggleAppreciate,
    toggleBookmark,
    createPost,
    updatePost,
    deletePost,
  };
}
