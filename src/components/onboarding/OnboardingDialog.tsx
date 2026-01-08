import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useUpdateProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

interface OnboardingDialogProps {
  open: boolean;
  onComplete: () => void;
}

const OnboardingDialog = ({ open, onComplete }: OnboardingDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const updateProfile = useUpdateProfile();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1 && !username.trim()) {
      toast({
        title: 'Username required',
        description: 'Please enter a username to continue.',
        variant: 'destructive',
      });
      return;
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let avatarUrl = null;

      // Upload avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
          avatarUrl = urlData.publicUrl;
        }
      }

      // Update profile
      await updateProfile.mutateAsync({
        username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        full_name: fullName || null,
        bio: bio || null,
        avatar_url: avatarUrl,
        onboarding_completed: true,
      } as any);

      toast({
        title: 'Profile complete! 🎉',
        description: 'Welcome to HappyGram!',
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete onboarding.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 1 && 'Choose your username'}
            {step === 2 && 'Add a profile photo'}
            {step === 3 && 'Tell us about yourself'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Step 1: Username */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-6">
                Pick a unique username for your profile. This is how others will find you.
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">@</span>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="yourname"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name (optional)</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          {/* Step 2: Avatar */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-6">
                Add a profile photo so friends can recognize you.
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={avatarPreview || undefined} />
                    <AvatarFallback className="bg-secondary text-4xl">
                      {username?.[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-primary-foreground" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">Click the camera to upload</p>
              </div>
            </div>
          )}

          {/* Step 3: Bio */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-6">
                Write a short bio to let others know about you.
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (optional)</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="resize-none"
                  rows={4}
                  maxLength={150}
                />
                <p className="text-xs text-muted-foreground text-right">{bio.length}/150</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center text-xs text-muted-foreground">
                <p className="font-medium">Managed by Pavitroo LLC</p>
                <p className="mt-1">Your data is secure and protected.</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={loading}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Complete
                </>
              )}
            </Button>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                s === step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
