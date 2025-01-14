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
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollPosition > 50
          ? 'bg-gradient-to-r from-gray-900/95 to-gray-800/95 shadow-lg backdrop-blur-md border-b border-gray-800/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
                DevChat
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? 'text-purple-400 bg-purple-400/10'
                    : 'text-gray-300 hover:text-purple-400 hover:bg-purple-400/10'
                }`}
              >
                <item.icon className={`mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                  pathname === item.href ? 'text-purple-400' : 'text-gray-400'
                }`} />
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-200">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                      <AvatarFallback className="bg-purple-400/10 text-purple-400 font-medium">
                        {session.user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-800/95 backdrop-blur-sm border-gray-700">
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-gray-300 hover:text-white hover:bg-red-600 focus:bg-gray-700/50 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium transition-all duration-200 hover:from-purple-700 hover:to-purple-800 hover:scale-105 focus:ring-2 focus:ring-purple-500/50 shadow-lg shadow-purple-600/20"
              >
                Get Started
              </Link>
            )}

            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-purple-400 hover:bg-purple-400/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-md border-t border-gray-800/50`}
      >
        <div className="container mx-auto px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'text-purple-400 bg-purple-400/10'
                  : 'text-gray-300 hover:text-purple-400 hover:bg-purple-400/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Link>
          ))}
          {!session && (
            <div className="pt-4 pb-3 border-t border-gray-800/50">
              <Link
                href="/auth/signin"
                className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium transition-all duration-200 hover:from-purple-700 hover:to-purple-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;