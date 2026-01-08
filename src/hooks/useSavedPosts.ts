import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Post } from './usePosts';

export function useSavedPosts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['savedPosts', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: savedPosts, error } = await supabase
        .from('saved_posts')
        .select('post_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!savedPosts || savedPosts.length === 0) return [];

      // Get full post data
      const postIds = savedPosts.map((sp) => sp.post_id);
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .in('id', postIds);

      if (postsError) throw postsError;

      // Get profiles for posts
      const postsWithProfiles = await Promise.all(
        (posts || []).map(async (post) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url, full_name')
            .eq('user_id', post.user_id)
            .maybeSingle();

          const [likesResult, commentsResult] = await Promise.all([
            supabase.from('likes').select('id', { count: 'exact' }).eq('post_id', post.id),
            supabase.from('comments').select('id', { count: 'exact' }).eq('post_id', post.id),
          ]);

          return {
            ...post,
            profile,
            likes_count: likesResult.count || 0,
            comments_count: commentsResult.count || 0,
          } as Post;
        })
      );

      return postsWithProfiles;
    },
    enabled: !!user,
  });
}

export function useIsPostSaved(postId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['isPostSaved', postId, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data } = await supabase
        .from('saved_posts')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .maybeSingle();

      return !!data;
    },
    enabled: !!user && !!postId,
  });
}

export function useToggleSavePost() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, isSaved }: { postId: string; isSaved: boolean }) => {
      if (!user) throw new Error('Not authenticated');

      if (isSaved) {
        await supabase.from('saved_posts').delete().eq('user_id', user.id).eq('post_id', postId);
      } else {
        await supabase.from('saved_posts').insert({ user_id: user.id, post_id: postId });
      }
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['isPostSaved', postId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts', user?.id] });
    },
  });
}
