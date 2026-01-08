import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image, MapPin, X, Loader2, ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePost } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';

const Create = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createPost = useCreatePost();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast({
        title: 'No image selected',
        description: 'Please select an image for your post.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createPost.mutateAsync({
        imageFile: selectedImage,
        caption: caption || undefined,
        location: location || undefined,
      });

      toast({
        title: 'Post created! 🎉',
        description: 'Your post has been shared successfully.',
      });

      navigate('/home');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold">New Post</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSubmit}
            disabled={!selectedImage || createPost.isPending}
            className="text-primary font-semibold"
          >
            {createPost.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Share'
            )}
          </Button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image upload */}
          <div className="aspect-square bg-secondary rounded-xl overflow-hidden relative">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={clearImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-20 h-20 gradient-brand rounded-full flex items-center justify-center">
                  <Image className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Add photo</p>
                  <p className="text-sm">Click to upload an image</p>
                </div>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="resize-none min-h-[100px]"
              maxLength={2200}
            />
            <p className="text-xs text-muted-foreground text-right">
              {caption.length}/2200
            </p>
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Add location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Submit button (for larger screens) */}
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={!selectedImage || createPost.isPending}
          >
            {createPost.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Share Post
              </>
            )}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Create;
