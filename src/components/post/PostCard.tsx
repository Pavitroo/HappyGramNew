import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Post, useAddComment, useDeletePost, usePostComments, useToggleLike } from '@/hooks/usePosts';
import { useIsPostSaved, useToggleSavePost } from '@/hooks/useSavedPosts';
import { useCreateActivity } from '@/hooks/useActivity';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const isOwner = user?.id === post.user_id;

  const toggleLike = useToggleLike();
  const addComment = useAddComment();
  const deletePost = useDeletePost();
  const { data: comments } = usePostComments(post.id);
  const { data: isSaved } = useIsPostSaved(post.id);
  const toggleSave = useToggleSavePost();
  const createActivity = useCreateActivity();

  const handleLike = () => {
    toggleLike.mutate({ postId: post.id, isLiked: post.is_liked || false });

    // Create activity for post owner (only if liking, not unliking)
    if (!post.is_liked) {
      createActivity.mutate({
        targetUserId: post.user_id,
        type: 'like',
        postId: post.id,
      });
    }
  };

  const handleSave = () => {
    toggleSave.mutate({ postId: post.id, isSaved: isSaved || false });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addComment.mutate({ postId: post.id, content: comment });

    // Create activity for post owner
    createActivity.mutate({
      targetUserId: post.user_id,
      type: 'comment',
      postId: post.id,
      content: comment,
    });

    setComment('');
  };

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync({ postId: post.id });
      toast({ title: 'Post deleted' });
    } catch (e: any) {
      toast({
        title: 'Delete failed',
        description: e?.message || 'Could not delete this post.',
        variant: 'destructive',
      });
    } finally {
      setDeleteOpen(false);
    }
  };

  const likesCount = post.likes_count || 0;

  return (
    <>
      <article className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Link to={`/profile/${post.user_id}`} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full p-0.5 story-ring">
              <Avatar className="w-full h-full">
                <AvatarImage src={post.profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {post.profile?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="font-semibold text-sm">{post.profile?.username}</p>
              {post.location && <p className="text-xs text-muted-foreground">{post.location}</p>}
            </div>
          </Link>

          {isOwner ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" className="text-muted-foreground" disabled>
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Image */}
        <div className="aspect-square bg-secondary">
          <img
            src={post.image_url}
            alt={post.caption || 'Post image'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Actions */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={cn('transition-all', post.is_liked && 'animate-heart-beat')}
              >
                <Heart
                  className={cn(
                    'w-7 h-7 transition-colors',
                    post.is_liked
                      ? 'fill-red-500 text-red-500'
                      : 'hover:text-muted-foreground'
                  )}
                />
              </button>
              <button onClick={() => setShowComments(!showComments)}>
                <MessageCircle className="w-7 h-7 hover:text-muted-foreground transition-colors" />
              </button>
              <button>
                <Send className="w-6 h-6 hover:text-muted-foreground transition-colors" />
              </button>
            </div>
            <button onClick={handleSave}>
              <Bookmark
                className={cn(
                  'w-7 h-7 transition-colors',
                  isSaved ? 'fill-foreground text-foreground' : 'hover:text-muted-foreground'
                )}
              />
            </button>
          </div>

          {/* Likes count */}
          {likesCount > 0 && (
            <p className="font-semibold text-sm mb-2">
              {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
            </p>
          )}

          {/* Caption */}
          {post.caption && (
            <p className="text-sm mb-2">
              <Link to={`/profile/${post.user_id}`} className="font-semibold mr-2">
                {post.profile?.username}
              </Link>
              {post.caption}
            </p>
          )}

          {/* Comments preview */}
          {(post.comments_count || 0) > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-sm text-muted-foreground mb-2 hover:text-foreground transition-colors"
            >
              View all {post.comments_count} comments
            </button>
          )}

          {/* Comments section */}
          {showComments && comments && comments.length > 0 && (
            <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
              {comments.map((c: any) => (
                <div key={c.id} className="flex gap-2 text-sm">
                  <Link to={`/profile/${c.user_id}`} className="font-semibold shrink-0">
                    {c.profile?.username}
                  </Link>
                  <span>{c.content}</span>
                </div>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>

        {/* Add comment */}
        <form
          onSubmit={handleComment}
          className="flex items-center gap-3 px-4 py-3 border-t border-border"
        >
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="border-0 bg-transparent focus-visible:ring-0 px-0"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-primary font-semibold"
            disabled={!comment.trim()}
          >
            Post
          </Button>
        </form>
      </article>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the post. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePost.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deletePost.isPending}>
              {deletePost.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PostCard;
