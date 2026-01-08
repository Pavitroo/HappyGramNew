import { useState, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import PostCard from '@/components/post/PostCard';
import { useFeedPosts } from '@/hooks/usePosts';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import OnboardingDialog from '@/components/onboarding/OnboardingDialog';

const Home = () => {
  const { user } = useAuth();
  const { data: posts, isLoading, error } = useFeedPosts();
  const { data: profile, refetch: refetchProfile } = useProfile(user?.id);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (profile && !profile.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [profile]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    refetchProfile();
  };

  return (
    <AppLayout>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-brand-text">HappyGram</span>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">Error loading posts</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-6">
            <div className="w-24 h-24 mx-auto gradient-brand rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to HappyGram!</h2>
              <p className="text-muted-foreground mb-6">
                Start by creating your first post or discover other users.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/create">
                  <Button variant="gradient">Create your first post</Button>
                </Link>
                <Link to="/discover">
                  <Button variant="outline">Discover users</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <OnboardingDialog open={showOnboarding} onComplete={handleOnboardingComplete} />
    </AppLayout>
  );
};

export default Home;
