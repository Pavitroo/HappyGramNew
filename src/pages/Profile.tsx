import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Settings, Grid, Bookmark, Camera, Loader2, UserPlus, UserMinus, Heart, MessageCircle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth';
import { useProfile, useFollowStats, useIsFollowing, useToggleFollow } from '@/hooks/useProfile';
import { useUserPosts } from '@/hooks/usePosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { useCreateActivity } from '@/hooks/useActivity';
import EditProfileDialog from '@/components/profile/EditProfileDialog';

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const targetUserId = userId || user?.id || '';
  const { data: profile, isLoading: profileLoading } = useProfile(targetUserId);
  const isOwnProfile = user?.id === profile?.user_id;

  const { data: posts, isLoading: postsLoading } = useUserPosts(profile?.user_id || '');
  const { data: savedPosts } = useSavedPosts();
  const { data: followStats } = useFollowStats(profile?.user_id || '');
  const { data: isFollowing } = useIsFollowing(profile?.user_id || '');
  const toggleFollow = useToggleFollow();
  const createActivity = useCreateActivity();

  const handleFollow = () => {
    if (!profile?.user_id) return;
    toggleFollow.mutate({ targetUserId: profile.user_id, isFollowing: isFollowing || false });
    
    // Create activity for follow (only if following, not unfollowing)
    if (!isFollowing) {
      createActivity.mutate({
        targetUserId: profile.user_id,
        type: 'follow',
      });
    }
  };

  if (profileLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Avatar */}
          <div className="flex justify-center md:justify-start">
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full p-1 story-ring">
              <Avatar className="w-full h-full">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-3xl">
                  {profile.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-xl font-semibold">@{profile.username}</h1>
              {isOwnProfile ? (
                <div className="flex justify-center md:justify-start gap-2">
                  <Button variant="secondary" onClick={() => setShowEditDialog(true)}>
                    Edit profile
                  </Button>
                  <Link to="/settings">
                    <Button variant="ghost" size="icon">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex justify-center md:justify-start gap-2">
                  <Button
                    variant={isFollowing ? 'secondary' : 'gradient'}
                    onClick={handleFollow}
                    disabled={toggleFollow.isPending}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button variant="secondary">Message</Button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-8 mb-4">
              <div>
                <span className="font-semibold">{posts?.length || 0}</span>{' '}
                <span className="text-muted-foreground">posts</span>
              </div>
              <div>
                <span className="font-semibold">{followStats?.followers || 0}</span>{' '}
                <span className="text-muted-foreground">followers</span>
              </div>
              <div>
                <span className="font-semibold">{followStats?.following || 0}</span>{' '}
                <span className="text-muted-foreground">following</span>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              {profile.full_name && (
                <p className="font-semibold">{profile.full_name}</p>
              )}
              {profile.bio && (
                <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-center border-t border-border rounded-none bg-transparent h-auto p-0">
            <TabsTrigger
              value="posts"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-none border-t-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent"
            >
              <Grid className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">Posts</span>
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger
                value="saved"
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-none border-t-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent"
              >
                <Bookmark className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Saved</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            {postsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 md:gap-4 mt-1">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="aspect-square bg-secondary relative group cursor-pointer overflow-hidden rounded-md"
                  >
                    <img
                      src={post.image_url}
                      alt={post.caption || 'Post'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex gap-6 text-white">
                        <span className="flex items-center gap-1 font-semibold">
                          <Heart className={`w-5 h-5 ${(post.likes_count || 0) > 0 ? 'fill-white' : ''}`} />
                          {post.likes_count || 0}
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <MessageCircle className="w-5 h-5" />
                          {post.comments_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 mx-auto border-4 border-foreground rounded-full flex items-center justify-center">
                  <Camera className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {isOwnProfile ? 'Share Photos' : 'No Posts Yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile
                      ? "When you share photos, they'll appear on your profile."
                      : "When they share photos, they'll appear here."}
                  </p>
                  {isOwnProfile && (
                    <Link to="/create" className="mt-4 inline-block">
                      <Button variant="gradient">Create your first post</Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {isOwnProfile && (
            <TabsContent value="saved" className="mt-0">
              {savedPosts && savedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1 md:gap-4 mt-1">
                  {savedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="aspect-square bg-secondary relative group cursor-pointer overflow-hidden rounded-md"
                    >
                      <img
                        src={post.image_url}
                        alt={post.caption || 'Post'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex gap-6 text-white">
                          <span className="flex items-center gap-1 font-semibold">
                            <Heart className={`w-5 h-5 ${(post.likes_count || 0) > 0 ? 'fill-white' : ''}`} />
                            {post.likes_count || 0}
                          </span>
                          <span className="flex items-center gap-1 font-semibold">
                            <MessageCircle className="w-5 h-5" />
                            {post.comments_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 space-y-4">
                  <div className="w-20 h-20 mx-auto border-4 border-foreground rounded-full flex items-center justify-center">
                    <Bookmark className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Save</h3>
                    <p className="text-muted-foreground">
                      Save photos and videos that you want to see again.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>

      {isOwnProfile && (
        <EditProfileDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          profile={profile}
        />
      )}
    </AppLayout>
  );
};

export default Profile;
