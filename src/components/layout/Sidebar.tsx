import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User, Bookmark, Camera, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { icon: Home, path: '/home', label: 'Home' },
    { icon: Search, path: '/discover', label: 'Discover' },
    { icon: PlusSquare, path: '/create', label: 'Create' },
    { icon: Heart, path: '/activity', label: 'Activity' },
    { icon: Bookmark, path: '/saved', label: 'Saved' },
    { icon: User, path: `/profile/${user?.id}`, label: 'Profile' },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 xl:w-72 border-r border-border bg-background flex-col z-50">
      {/* Logo */}
      <div className="p-6">
        <Link to="/home" className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-brand-text">HappyGram</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path.includes('/profile/') && location.pathname.startsWith('/profile/'));
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-secondary text-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <item.icon className={cn('w-6 h-6', isActive && 'fill-current')} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          to="/settings"
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <Settings className="w-6 h-6" />
          <span>Settings</span>
        </Link>
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start gap-4 px-4 py-3 h-auto text-muted-foreground hover:bg-secondary hover:text-destructive"
        >
          <LogOut className="w-6 h-6" />
          <span>Log out</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
