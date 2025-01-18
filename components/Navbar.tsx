"use client";

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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, LayoutDashboard, LogOut, Menu, X, LinkIcon, BookIcon, Sparkles, User } from 'lucide-react';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollPosition > 50
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg shadow-purple-500/5 border-b border-purple-900/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[2000px] mx-auto">
        <div className="relative px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link 
                href="/" 
                className="group flex items-center gap-2.5 hover:opacity-90 transition-all duration-300"
              >
                <Sparkles className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 group-hover:from-purple-300 group-hover:via-purple-200 group-hover:to-purple-300 transition-all duration-300">
                  DevChat
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {session && (
              <div className="hidden md:flex md:items-center md:gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                      pathname === item.href
                        ? 'text-purple-300 bg-purple-400/10 ring-1 ring-purple-400/20'
                        : 'text-gray-300 hover:text-purple-300 hover:bg-purple-400/10 hover:ring-1 hover:ring-purple-400/20'
                    }`}
                  >
                    <item.icon className={`mr-2 h-4 w-4 transition-colors duration-300 ${
                      pathname === item.href 
                        ? 'text-purple-400' 
                        : 'text-gray-400 group-hover:text-purple-400'
                    }`} />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Right Section: Auth Button/User Menu + Mobile Menu Toggle */}
            <div className="flex items-center gap-3 sm:gap-4">
              {session ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="group h-10 px-2 gap-2 rounded-full hover:bg-purple-400/10 ring-1 ring-purple-500/20 hover:ring-purple-500/30 transition-all duration-300"
                      >
                        <Avatar className="h-7 w-7 ring-2 ring-purple-400/20 group-hover:ring-purple-400/40 transition-all duration-300">
                          <AvatarImage 
                            src={session.user.image || ''} 
                            alt={session.user.name || ''} 
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-purple-400/10">
                            <User className="h-4 w-4 text-purple-400" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-300 group-hover:text-purple-300 transition-colors duration-300">
                          {session.user.name?.split(' ')[0] || 'User'}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-64 mt-2 bg-gray-900/95 backdrop-blur-md border-purple-900/20"
                    >
                      <DropdownMenuLabel className="flex items-center gap-3 px-3 py-3">
                        <Avatar className="h-10 w-10 ring-2 ring-purple-400/20">
                          <AvatarImage 
                            src={session.user.image || ''} 
                            alt={session.user.name || ''} 
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-purple-400/10">
                            <User className="h-5 w-5 text-purple-400" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-200">
                            {session.user.name || 'User'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {session.user.email || ''}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-purple-900/20" />
                      <DropdownMenuItem 
                        onClick={handleSignOut} 
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:text-purple-300 focus:text-purple-300 focus:bg-purple-400/10"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile Menu Button */}
                  <button
                    type="button"
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-gray-300 hover:text-purple-300 hover:bg-purple-400/10 ring-1 ring-transparent hover:ring-purple-400/20 transition-all duration-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded={isMenuOpen}
                  >
                    <span className="sr-only">Toggle menu</span>
                    {isMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-purple-500 hover:bg-purple-600 text-white ring-1 ring-purple-500/50 hover:ring-purple-600/50 transition-all duration-300"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {session && (
          <div
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMenuOpen 
                ? 'max-h-[400px] opacity-100 border-t border-purple-900/20' 
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-gray-900/95 backdrop-blur-md px-4 pt-2 pb-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300 mb-2 ${
                    pathname === item.href
                      ? 'text-purple-300 bg-purple-400/10 ring-1 ring-purple-400/20'
                      : 'text-gray-300 hover:text-purple-300 hover:bg-purple-400/10 hover:ring-1 hover:ring-purple-400/20'
                  }`}
                >
                  <item.icon className={`mr-2.5 h-4 w-4 transition-colors duration-300 ${
                    pathname === item.href 
                      ? 'text-purple-400' 
                      : 'text-gray-400 group-hover:text-purple-400'
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