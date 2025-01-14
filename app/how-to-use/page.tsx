'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Copy, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { installationData } from '@/data/data';

export default function HowToUse() {
  const [activeTab, setActiveTab] = useState('react');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Enhanced Header */}
        <div className="text-center mt-20 mb-16">
          <h1 className="text-5xl font-bold text-gray-100 mb-6">How to Use DevChat</h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Transform your website with AI-powered chat in just a few simple steps
          </p>
        </div>

        {/* Steps Container with Connection Lines */}
        <div className="space-y-6 relative">
          {/* Vertical Connection Line */}
          <div className="absolute left-[2.25rem] top-20 bottom-20 w-0.5 bg-purple-600/30 -z-10" />

          {/* Step 1 */}
          <section className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <span className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 shadow-lg shadow-purple-600/20">1</span>
              <h2 className="text-2xl font-semibold text-gray-100">Create and Configure Your Chatbot</h2>
            </div>
            <div className="ml-14">
              <p className="text-gray-300 leading-relaxed">
                Navigate to the dashboard and click "Create Chatbot." Add a name, provide context (e.g., instructions and data sources), 
                and save your chatbot. Once configured, proceed to the "Generate Link" page.
              </p>
            </div>
          </section>

          {/* Step 2 */}
          <section className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <span className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 shadow-lg shadow-purple-600/20">2</span>
              <h2 className="text-2xl font-semibold text-gray-100">Generate Your Chatbot Link</h2>
            </div>
            <div className="ml-14">
              <p className="text-gray-300 leading-relaxed">
                Go to the "Generate Link" page, select the chatbot you just created, and click "Generate." This will provide you with 
                a unique link to integrate into your application.
              </p>
            </div>
          </section>

          {/* Step 3 */}
          <section className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <span className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 shadow-lg shadow-purple-600/20">3</span>
              <h2 className="text-2xl font-semibold text-gray-100">Add the Chat Widget to Your Application</h2>
            </div>
            <div className="ml-14">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Select your framework below and add the provided code snippet to your app. Replace <code className="bg-gray-900 px-2 py-1 rounded text-purple-300">YOUR_GENERATED_LINK</code> with the link you generated earlier.
              </p>

              {/* Enhanced Framework Tabs */}
              <div className="flex flex-wrap gap-3 mb-6">
                {Object.entries(installationData).map(([key, { title }]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      activeTab === key
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {title}
                    {activeTab === key && <ArrowRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>

              {/* Enhanced Code Snippet */}
              <div className="relative group">
                <pre className="bg-gray-900 p-6 rounded-lg overflow-x-auto border border-gray-700 transition-all duration-300 group-hover:border-purple-500/30">
                  <code className="text-sm text-gray-300 font-mono">{installationData[activeTab].code}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(installationData[activeTab].code)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-purple-300 transition-all duration-300"
                  aria-label="Copy code"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <p className="text-gray-300 mt-4 leading-relaxed">
                {installationData[activeTab].description} After this step, your chatbot will appear as a floating button on your application.
              </p>
            </div>
          </section>

          {/* Step 4 */}
          <section className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <span className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 shadow-lg shadow-purple-600/20">4</span>
              <h2 className="text-2xl font-semibold text-gray-100">Test Your Chatbot</h2>
            </div>
            <div className="ml-14">
              <p className="text-gray-300 leading-relaxed">
                Visit your application and click the chat button to test it. Interact with the chatbot to verify it responds as expected.
              </p>
            </div>
          </section>

          {/* Step 5 */}
          <section className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <span className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 shadow-lg shadow-purple-600/20">5</span>
              <h2 className="text-2xl font-semibold text-gray-100">View Analytics</h2>
            </div>
            <div className="ml-14">
              <p className="text-gray-300 leading-relaxed">
                Go to the "Analytics" section in your dashboard to view user interactions, frequently asked questions, and other engagement metrics.
              </p>
            </div>
          </section>
        </div>

        {/* Enhanced Support Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 mt-16 hover:border-purple-500/30 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4 flex items-center gap-3">
            Need Help? <span className="text-purple-400">I'm here</span>
          </h2>
          <p className="text-gray-300 mr-2 leading-relaxed">
            I'm here to assist you. Contact me at 
            <a
              href="https://x.com/i_m_shubham45"
              className="text-purple-400  hover:text-purple-300 underline transition-colors duration-300"
            >
              Twitter
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}