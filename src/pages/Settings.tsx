import { ArrowLeft, User, Bell, Lock, HelpCircle, LogOut, Moon, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    navigate('/');
  };

  const settingsItems = [
    {
      icon: User,
      label: 'Edit profile',
      onClick: () => navigate(`/profile/${user?.id}`),
    },
    {
      icon: Bell,
      label: 'Notifications',
      onClick: () => {},
    },
    {
      icon: Lock,
      label: 'Privacy',
      onClick: () => {},
    },
    {
      icon: HelpCircle,
      label: 'Help',
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-1">
          {settingsItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center gap-4 p-4 hover:bg-secondary rounded-xl transition-colors"
            >
              <item.icon className="w-6 h-6 text-muted-foreground" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-border mt-6 pt-6">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 p-4 hover:bg-secondary rounded-xl transition-colors text-destructive"
          >
            <LogOut className="w-6 h-6" />
            <span className="font-medium">Log out</span>
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            HappyGram v1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Share happiness, spread joy ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
