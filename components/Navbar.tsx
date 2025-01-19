"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, LayoutDashboard, LogOut, Menu, X, LinkIcon, BookIcon, Sparkles, User, Contact2Icon } from 'lucide-react';
import { TypeIcon as type, type LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavLinkProps {
  item: NavItem;
  mobile?: boolean;
  onClick?: () => void;
}

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(session?.user?.isAdmin ?? false);
  }, [session]);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = isAdmin
    ? [
        { label: 'Display Users', href: '/admin/DisplayUsers', icon: Contact2Icon },
        { label: 'Home', href: '/', icon: Home },
        { label: 'How to use', href: '/how-to-use', icon: BookIcon },
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Generate Link', href: '/generateLink', icon: LinkIcon },
      ]
    : [
        { label: 'Home', href: '/', icon: Home },
        { label: 'How to use', href: '/how-to-use', icon: BookIcon },
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Generate Link', href: '/generateLink', icon: LinkIcon },
      ];

  const handleSignOut = async () => {
    try {
      const data = await signOut({ redirect: false, callbackUrl: '/' });
      router.push(data.url);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const NavLink = ({ item, mobile = false, onClick }: NavLinkProps) => (
    <Link
      href={item.href}
      className={`group flex items-center ${mobile ? 'px-4 py-3 text-base' : 'px-3.5 py-2 text-sm'} font-medium rounded-xl transition-all duration-300 ${
        pathname === item.href
          ? 'text-purple-300 bg-purple-400/10 ring-1 ring-purple-400/20'
          : 'text-gray-300 hover:text-purple-300 hover:bg-purple-400/10 hover:ring-1 hover:ring-purple-400/20'
      }`}
      onClick={onClick}
    >
      <item.icon 
        className={`${mobile ? 'h-5 w-5 mr-3' : 'h-4 w-4 mr-2'} transition-colors duration-300 ${
          pathname === item.href 
            ? 'text-purple-400' 
            : 'text-gray-400 group-hover:text-purple-400'
        }`} 
      />
      {item.label}
    </Link>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
            {status === 'authenticated' && (
              <div className="hidden md:flex md:items-center md:gap-2">
                {navItems.map((item) => (
                  <NavLink key={item.href} item={item} />
                ))}
              </div>
            )}

            {/* Right Section: Auth Button/User Menu */}
            <div className="flex items-center gap-3 sm:gap-4">
              {status === 'authenticated' ? (
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

                  {/* Mobile Menu Sheet */}
                  <Sheet onOpenChange={setIsMenuOpen}> 
                    <SheetTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="md:hidden text-white"
                      >
                        {isMenuOpen ? (
                          <X className="h-6 w-6 text-gray-300 border-2" />
                        ) : (
                          <Menu className="h-6 w-6 text-gray-300" />
                        )}
                        <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 sm:w-96 bg-gray-900/95 backdrop-blur-md border-purple-900/20">
                      <SheetHeader className="mb-8">
                        <SheetTitle>
                          <Link 
                            href="/" 
                            className="group flex items-center gap-2.5 hover:opacity-90 transition-all duration-300"
                          >
                            <Sparkles className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 group-hover:from-purple-300 group-hover:via-purple-200 group-hover:to-purple-300 transition-all duration-300">
                              DevChat
                            </span>
                          </Link>
                        </SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col space-y-2">
                        {navItems.map((item) => (
                          <NavLink 
                            key={item.href} 
                            item={item} 
                            mobile 
                            onClick={() => {
                              router.push(item.href);
                            }}
                          />
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-300 hover:text-purple-300 hover:bg-purple-400/10 hover:ring-1 hover:ring-purple-400/20 rounded-xl px-4 py-2 transition-all duration-300"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

