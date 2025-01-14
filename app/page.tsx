'use client'

import { useState, useEffect } from 'react';
import { ArrowRight, Bot, Code2, Settings, Globe, MessageSquare, Sparkles, Users, Github, Twitter, Linkedin, Menu, X, BarChart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-32 pb-24">
          <motion.div
            className="text-center space-y-8 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Background decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-3xl -z-10"></div>

            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/40"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-gray-200">AI-Powered Chatbots</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold"
              variants={fadeInUp}
            >
              <span className="text-gray-100">
                Build Intelligent & Context aware
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                Chatbots in Minutes
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Create, customize, and deploy AI chatbots that understand your business.
              No coding required. Elevate your customer experience today.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <button
                onClick={() => router.push('auth/signin')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all duration-200 flex items-center justify-center"
              >
                Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => router.push('/how-to-use')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-gray-600 hover:border-purple-500/50 text-gray-300 font-semibold transition-all duration-200"
              >
                View Demo
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Features section */}
        <section id="features" className="py-24 bg-gray-900">
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-100">Our Key Features</h2>
              <p className="text-gray-300 mt-4 text-xl">Explore the powerful capabilities that set us apart.</p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Bot className="w-12 h-12 text-purple-400" />,
                  title: "AI-Powered Chatbots",
                  description:
                    "Leverage advanced AI to create chatbots that understand context and provide human-like responses.",
                },
                {
                  icon: <Code2 className="w-12 h-12 text-purple-400" />,
                  title: "No-Code Platform",
                  description:
                    "Create sophisticated chatbots without writing a single line of code.",
                },
                {
                  icon: <Globe className="w-12 h-12 text-purple-400" />,
                  title: "Instant Integration",
                  description:
                    "Deploy your chatbot anywhere with a simple embed code or direct link.",
                },
                {
                  icon: <MessageSquare className="w-12 h-12 text-purple-400" />,
                  title: "Context-Aware",
                  description:
                    "Smart conversations that remember context and previous interactions.",
                },
                {
                  icon: <Users className="w-12 h-12 text-purple-400" />,
                  title: "Visitor Insights",
                  description:
                    "Gain valuable insights from chat interactions and user behavior analytics.",
                },
                {
                  icon: <BarChart className="w-12 h-12 text-purple-400" />,
                  title: "Track Analytics",
                  description:
                    "Monitor and analyze chatbot performance with detailed analytics.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 backdrop-blur-sm shadow-lg rounded-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-purple-500/50"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-center mb-6 bg-gray-700/30 w-20 h-20 rounded-full mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-100 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How to use app */}
        <section className="py-24 bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="bg-gray-800 rounded-xl p-12 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Decorative gradient elements */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />

              <div className="relative z-10 text-center">
                <h2 className="text-4xl font-bold text-gray-100 mb-6">
                  Want to know how to use the app?
                </h2>
                <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto">
                  Explore our comprehensive step-by-step guide and learn how to get the most out of our powerful features!
                </p>
                <motion.button
                  onClick={() => router.push('/how-to-use')}
                  className="group bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-500 transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-purple-600/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn How to Use
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </div>

              {/* Bottom gradient line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600/0 via-purple-600/50 to-purple-600/0" />
            </motion.div>
          </div>
        </section>


        {/* CTA Section */}
        <div className="container mx-auto px-6 py-24">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-800 to-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-purple-500/10 backdrop-blur-sm"></div>
            <div className="relative p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
                Transform Your Website Today
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Join thousands of businesses using DevChat to enhance their customer experience and boost engagement.
              </p>
              <button
                className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all duration-200 flex items-center justify-center mx-auto"
                onClick={() => router.push('auth/signin')}
              >
                Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

