import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, LayoutDashboard, LogOut, Menu, X, LinkIcon, BookIcon, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      if (isMenuOpen) setIsMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'How to use', href: '/how-to-use', icon: BookIcon },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Generate Link', href: '/generateLink', icon: LinkIcon },
  ];

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: '/' });
    router.push(data.url);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollPosition > 50
          ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-800/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[2000px] mx-auto">
        <div className="relative px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Sparkles className="w-5 h-5 xs:w-6 xs:h-6 text-purple-400" />
                <span className="text-lg xs:text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
                  DevChat
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Only show when logged in */}
            {session && (
              <div className="hidden md:flex md:items-center md:gap-1 lg:gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-2.5 lg:px-3 py-1.5 lg:py-2 text-[13px] lg:text-sm font-medium rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'text-purple-400 bg-purple-400/10'
                        : 'text-gray-300 hover:text-purple-400 hover:bg-purple-400/10'
                    }`}
                  >
                    <item.icon className={`mr-1.5 h-4 w-4 ${
                      pathname === item.href ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Right Section: Auth Button/User Menu + Mobile Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {session ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 xs:h-9 xs:w-9 rounded-full ring-2 ring-purple-500/20">
                        <Avatar className="h-full w-full">
                          <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                          <AvatarFallback className="text-xs xs:text-sm bg-purple-400/10 text-purple-400">
                            {session.user.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 xs:w-48 sm:w-56">
                      <DropdownMenuItem onClick={handleSignOut} className="text-[13px] sm:text-sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile Menu Button - Only show when logged in */}
                  <button
                    type="button"
                    className="md:hidden inline-flex items-center justify-center p-1.5 rounded-lg text-gray-300 hover:text-purple-400 hover:bg-purple-400/10 transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded={isMenuOpen}
                  >
                    <span className="sr-only">Open main menu</span>
                    {isMenuOpen ? (
                      <X className="h-5 w-5 xs:h-6 xs:w-6" />
                    ) : (
                      <Menu className="h-5 w-5 xs:h-6 xs:w-6" />
                    )}
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-sm font-medium rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu - Only show when logged in */}
        {session && (
          <div
            className={`md:hidden transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
              isMenuOpen 
                ? 'max-h-[400px] opacity-100 border-t border-gray-800' 
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-gray-900/95 backdrop-blur-sm px-4 pt-2 pb-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-[13px] xs:text-sm rounded-lg transition-colors mb-1 ${
                    pathname === item.href
                      ? 'text-purple-400 bg-purple-400/10'
                      : 'text-gray-300 hover:text-purple-400 hover:bg-purple-400/10'
                  }`}
                >
                  <item.icon className={`mr-2 h-4 w-4 ${
                    pathname === item.href ? 'text-purple-400' : 'text-gray-400'
                  }`} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;