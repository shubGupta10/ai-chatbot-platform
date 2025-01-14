import Link from 'next/link';
import { Github, Mail, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatbotFooter() {
  return (
    <footer className="relative mt-auto border-t border-gray-800">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Create Chatbot CTA */}
        <div className="container mx-auto px-4 py-12">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-600/90 to-gray-700/90 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_theme(colors.purple.400/0.15),_transparent_50%)]"></div>
            <div className="relative px-6 py-8 md:px-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Create Your Own Chatbot?
              </h2>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Transform your ideas into intelligent conversations with DevChat's powerful platform.
              </p>
              <Button
                asChild
                className="bg-white text-purple-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-900/20"
              >
                <Link href="/create-bot" className="inline-flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Your Chatbot
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Brand */}
            <div className="text-center md:text-left">
              <Link href="/" className="inline-flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                  DevChat
                </span>
              </Link>
              <p className="mt-2 text-sm text-gray-400">
                Building the future of conversational AI
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-6">
                <Link
                  href="https://github.com/devchat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                >
                  <span className="sr-only">GitHub</span>
                  <Github className="h-6 w-6" />
                </Link>
                <Link
                  href="mailto:contact@devchat.ai"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                >
                  <span className="sr-only">Email</span>
                  <Mail className="h-6 w-6" />
                </Link>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right text-sm text-gray-400">
              <p>© {new Date().getFullYear()} DevChat. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}