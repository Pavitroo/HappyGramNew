import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2, UserPlus } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { useIsFollowing, useToggleFollow } from '@/hooks/useProfile';

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

const UserCard = ({ profile }: { profile: UserProfile }) => {
  const { user } = useAuth();
  const { data: isFollowing } = useIsFollowing(profile.user_id);
  const toggleFollow = useToggleFollow();

  const isOwnProfile = user?.id === profile.user_id;

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFollow.mutate({ targetUserId: profile.user_id, isFollowing: isFollowing || false });
  };

  return (
    <Link
      to={`/profile/${profile.user_id}`}
      className="flex items-center gap-4 p-4 hover:bg-secondary/50 rounded-xl transition-colors"
    >
      <Avatar className="w-14 h-14">
        <AvatarImage src={profile.avatar_url || undefined} />
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          {profile.username?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{profile.username}</p>
        <p className="text-sm text-muted-foreground truncate">
          {profile.full_name || profile.bio || 'HappyGram user'}
        </p>
      </div>
      {!isOwnProfile && (
        <Button
          variant={isFollowing ? 'secondary' : 'gradient'}
          size="sm"
          onClick={handleFollow}
          disabled={toggleFollow.isPending}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}
    </Link>
  );
};

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const { data: users, isLoading } = useQuery({
    queryKey: ['discoverUsers', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user?.id || '')
        .limit(50);

      if (searchQuery) {
        query = query.or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as UserProfile[];
    },
  });

  return (
    <AppLayout>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-secondary border-0"
            />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">
          {searchQuery ? 'Search results' : 'Discover people'}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : users && users.length > 0 ? (
          <div className="space-y-1">
            {users.map((profile) => (
              <UserCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 mx-auto gradient-brand rounded-full flex items-center justify-center">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                {searchQuery ? 'No users found' : 'No users yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Be the first to invite your friends!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Discover;
