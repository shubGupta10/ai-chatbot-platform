'use client'

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, Sparkles, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Something went wrong. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-6">
            <Image
              src="/DevChat.png"
              alt="DevChat Logo"
              width={180}
              height={180}
              className="mx-auto filter invert bg-transparent hover:scale-105 transition-transform duration-200"
              priority
            />
            
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
                Welcome to DevChat
              </h1>
              <p className="text-gray-400">Where you can get context aware chatbots</p>
            </div>
          </div>

          <Card className="border-0 bg-gray-800/50 backdrop-blur-xl shadow-2xl shadow-purple-500/5">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center text-purple-300">Sign In</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Get your chatbot now 
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800/50 rounded-lg p-3 animate-shake">
                  {error}
                </div>
              )}
              
              <Button
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-600/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-purple-600/30"
                onClick={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Continue with Google
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-purple-400" />
                <span>Secure login</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-purple-400" />
                <span>Instant access</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}