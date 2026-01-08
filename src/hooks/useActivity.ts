import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';

export interface Activity {
  id: string;
  user_id: string;
  actor_id: string;
  type: 'like' | 'comment' | 'follow';
  post_id: string | null;
  comment_id: string | null;
  content: string | null;
  read: boolean;
  created_at: string;
  actor_profile?: {
    username: string;
    avatar_url: string | null;
  } | null;
  post?: {
    image_url: string;
  } | null;
}

export function useActivities() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['activities', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get actor profiles and post data
      const activitiesWithData = await Promise.all(
        (data || []).map(async (activity) => {
          const [actorProfile, postData] = await Promise.all([
            supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('user_id', activity.actor_id)
              .maybeSingle(),
            activity.post_id
              ? supabase
                  .from('posts')
                  .select('image_url')
                  .eq('id', activity.post_id)
                  .maybeSingle()
              : Promise.resolve({ data: null }),
          ]);

          return {
            ...activity,
            actor_profile: actorProfile.data,
            post: postData.data,
          } as Activity;
        })
      );

      return activitiesWithData;
    },
    enabled: !!user,
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('activities-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['activities', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return query;
}

export function useMarkActivityRead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (activityId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('activities')
        .update({ read: true })
        .eq('id', activityId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', user?.id] });
    },
  });
}

export function useUnreadActivityCount() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unreadActivityCount', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { count, error } = await supabase
        .from('activities')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });
}

export function useCreateActivity() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      targetUserId,
      type,
      postId,
      commentId,
      content,
    }: {
      targetUserId: string;
      type: 'like' | 'comment' | 'follow';
      postId?: string;
      commentId?: string;
      content?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      if (targetUserId === user.id) return; // Don't create activity for own actions

      const { error } = await supabase.from('activities').insert({
        user_id: targetUserId,
        actor_id: user.id,
        type,
        post_id: postId || null,
        comment_id: commentId || null,
        content: content || null,
      });

      if (error) throw error;
    },
  });
}
