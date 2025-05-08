import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  BookOpen, 
  Sun, 
  Moon, 
  Palette, 
  Menu, 
  X,
  User,
  LogOut,
  Settings,
  BookMarked
} from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { AuthModal } from '@/components/auth/auth-modal';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [location, setLocation] = useLocation();
  const isMobile = useMobile();

  // Close mobile menu when changing location
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const openLoginModal = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalTab('signup');
    setAuthModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-primary-gradient p-2 rounded-lg mr-2">
                <BookOpen className="text-white text-xl" />
              </div>
              <span className="font-inter font-bold text-xl text-foreground">Wiser Material</span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/explore" className="font-medium hover:text-accent text-foreground">
              Explore
            </Link>
            <Link href="/#quiz" className="font-medium hover:text-accent text-foreground">
              Find Your Course
            </Link>
            <Link href="/#testimonials" className="font-medium hover:text-accent text-foreground">
              Testimonials
            </Link>
            <Link href="/#pricing" className="font-medium hover:text-accent text-foreground">
              Pricing
            </Link>
          </nav>

          {/* Auth & Theme Buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <div className="hidden md:flex items-center border rounded-lg p-1 border-border">
              <Button
                variant="ghost"
                size="icon"
                className="p-1 rounded-md hover:bg-accent/10"
                onClick={() => setTheme('light')}
                title="Light Theme"
              >
                <Sun className="h-4 w-4 text-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="p-1 rounded-md hover:bg-accent/10"
                onClick={() => setTheme('dark')}
                title="Dark Theme"
              >
                <Moon className="h-4 w-4 text-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="p-1 rounded-md hover:bg-accent/10"
                onClick={() => setTheme('luxury')}
                title="Luxury Theme"
              >
                <Palette className="h-4 w-4 text-foreground" />
              </Button>
            </div>

            {/* Login / Sign Up or User Avatar */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
                    <Avatar>
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback>{userProfile?.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <BookMarked className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/auth')}
                >
                  Log In
                </Button>
                <Button 
                  className="bg-primary-gradient hover:opacity-90"
                  onClick={() => setLocation('/auth?tab=signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <Link href="/explore" className="block py-2 font-medium text-foreground">
              Explore
            </Link>
            <Link href="/#quiz" className="block py-2 font-medium text-foreground">
              Find Your Course
            </Link>
            <Link href="/#testimonials" className="block py-2 font-medium text-foreground">
              Testimonials
            </Link>
            <Link href="/#pricing" className="block py-2 font-medium text-foreground">
              Pricing
            </Link>
            
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1 rounded-md"
                    onClick={() => setTheme('light')}
                    title="Light Theme"
                  >
                    <Sun className="h-4 w-4 text-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1 rounded-md"
                    onClick={() => setTheme('dark')}
                    title="Dark Theme"
                  >
                    <Moon className="h-4 w-4 text-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1 rounded-md"
                    onClick={() => setTheme('luxury')}
                    title="Luxury Theme"
                  >
                    <Palette className="h-4 w-4 text-foreground" />
                  </Button>
                </div>
                {!user && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocation('/auth')}
                    >
                      Log In
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-primary-gradient hover:opacity-90"
                      onClick={() => setLocation('/auth?tab=signup')}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialTab={authModalTab}
      />
    </header>
  );
}
