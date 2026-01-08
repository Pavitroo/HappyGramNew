import { Heart, UserPlus, MessageCircle, Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { useActivities, useMarkActivityRead } from '@/hooks/useActivity';
import { formatDistanceToNow } from 'date-fns';
import { useEffect } from 'react';

const Activity = () => {
  const { data: activities, isLoading } = useActivities();
  const markRead = useMarkActivityRead();

  // Mark activities as read when viewing
  useEffect(() => {
    if (activities) {
      activities
        .filter((a) => !a.read)
        .forEach((a) => {
          markRead.mutate(a.id);
        });
    }
  }, [activities]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-primary" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getMessage = (activity: any) => {
    switch (activity.type) {
      case 'like':
        return 'liked your post';
      case 'follow':
        return 'started following you';
      case 'comment':
        return `commented: "${activity.content?.slice(0, 50)}${activity.content?.length > 50 ? '...' : ''}"`;
      default:
        return '';
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border p-4">
          <h1 className="text-xl font-bold">Activity</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="divide-y divide-border">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center gap-3 p-4 transition-colors ${
                  !activity.read ? 'bg-primary/5' : ''
                }`}
              >
                <Link to={`/profile/${activity.actor_id}`}>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={activity.actor_profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-secondary">
                      {activity.actor_profile?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <Link
                      to={`/profile/${activity.actor_id}`}
                      className="font-semibold hover:underline"
                    >
                      {activity.actor_profile?.username}
                    </Link>{' '}
                    {getMessage(activity)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {getIcon(activity.type)}
                  {activity.post && (
                    <img
                      src={activity.post.image_url}
                      alt="Post"
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto border-4 border-foreground rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Activity on your posts</h3>
            <p className="text-muted-foreground">
              When someone likes or comments on your posts, you'll see it here.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Activity;
