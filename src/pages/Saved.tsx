import { Loader2, Bookmark } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import PostCard from '@/components/post/PostCard';

const Saved = () => {
  const { data: posts, isLoading } = useSavedPosts();

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border p-4">
          <h1 className="text-xl font-bold">Saved</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="px-4 py-6 space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="w-20 h-20 mx-auto border-4 border-foreground rounded-full flex items-center justify-center mb-4">
              <Bookmark className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No saved posts</h3>
            <p className="text-muted-foreground">Save posts to see them here.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Saved;
