import { Github, Link as LinkIcon, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Left section with logo and description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-100">DevChat</h3>
            <p className="text-gray-300 text-sm">Building the future of AI-powered conversations.</p>
          </div>

          {/* Middle section with Generate Link button */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/generateLink" 
              className="flex items-center px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-purple-300 transition-all text-sm border border-gray-700 hover:border-purple-400"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Generate Link
            </Link>
          </div>

          {/* Right section with social links */}
          <div className="flex space-x-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">Star on GitHub</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          © {currentYear} DevChat. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;