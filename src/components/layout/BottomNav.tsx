import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, path: '/home', label: 'Home' },
    { icon: Search, path: '/discover', label: 'Discover' },
    { icon: PlusSquare, path: '/create', label: 'Create' },
    { icon: Heart, path: '/activity', label: 'Activity' },
    { icon: Bookmark, path: '/saved', label: 'Saved' },
    { icon: User, path: `/profile/${user?.id}`, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border z-50 lg:hidden">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path.includes('/profile/') && location.pathname.startsWith('/profile/'));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-16 h-full transition-all',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.icon === PlusSquare ? (
                <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <item.icon className={cn('w-6 h-6', isActive && 'fill-current')} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
