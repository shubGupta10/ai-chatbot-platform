'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Copy, Check,  LinkIcon, ArrowRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface User {
  id: string
}

interface Session {
  user?: User
}

interface Chatbot {
  _id: string
  name: string
  description: string
  link?: string
}

export default function GenerateLink() {
  const { data: session } = useSession()
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [selectedChatbotId, setSelectedChatbotId] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [showLinkCard, setShowLinkCard] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const router = useRouter()

  const selectedChatbot = chatbots.find(bot => bot._id === selectedChatbotId)

  const fetchChatbots = async () => {
    if (!session?.user?.id) {
      setError('User not authenticated')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      const response = await fetch('/api/fetch-chatbot')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setChatbots(data.chatbots)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while fetching chatbots')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchChatbots()
    }
  }, [session])

  const handleGenerateLink = async () => {
    if (!session?.user?.id || !selectedChatbotId) {
      toast.error("Please select a chatbot to generate the link.")
      return
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    const link = `${baseUrl}/chatbot/${session.user.id}/${selectedChatbotId}`

    try {
      const response = await fetch('/api/generate-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          chatbotId: selectedChatbotId,
          link,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to save the link')
      }

      setGeneratedLink(link)
      setShowLinkCard(true)
      toast.success("Link generated successfully!")
      fetchChatbots()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred while saving the link.")
      console.error('Error:', error)
    }
  }

  const handleCopyLink = async () => {
    if (!generatedLink) return

    try {
      await navigator.clipboard.writeText(generatedLink)
      setIsCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy link to clipboard")
      console.error('Error copying to clipboard:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-block p-3 bg-purple-600/10 rounded-2xl mb-4">
              <LinkIcon className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-100">Generate your chatbot link here</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Generate a unique link for your chatbot and use in your app.
            </p>
          </div>

          {/* Main Card */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6 space-y-8">
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r"
                  >
                    <p className="text-red-200">{error}</p>
                  </motion.div>
                ) : isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-12"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                  </motion.div>
                ) : chatbots.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-300">Select Chatbot</label>
                      <Select onValueChange={setSelectedChatbotId} value={selectedChatbotId}>
                        <SelectTrigger className="h-12 bg-gray-700/50 border-gray-600 text-gray-100">
                          <SelectValue placeholder="Choose a chatbot to share" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {chatbots.map((chatbot) => (
                            <SelectItem
                              key={chatbot._id}
                              value={chatbot._id}
                              className="text-gray-100 focus:bg-purple-500/20 focus:text-purple-200"
                            >
                              {chatbot.name} {chatbot.link && '(Selected)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedChatbot && (
                        <p className="text-sm text-gray-400 italic">
                          {selectedChatbot.description}
                        </p>
                      )}
                    </div>

                    {selectedChatbotId && (
                      <div className="pt-4">
                        <Button
                          onClick={handleGenerateLink}
                          className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-lg shadow-purple-600/20 transition-all duration-200 group"
                        >
                          <LinkIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                          Generate Shareable Link
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 px-4"
                  >
                    <h3 className="text-xl font-semibold text-gray-200 mb-3">No Chatbots Found</h3>
                    <p className="text-gray-400 mb-8">Create your first chatbot to get started</p>
                    <Button
                      onClick={() => router.push('/create-chatbot')}
                      className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 transition-all duration-200 group"
                    >
                      Create a Chatbot
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generated Link Section */}
              <AnimatePresence>
                {showLinkCard && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="pt-6 mt-6 border-t border-gray-700"
                  >
                    <Card className="bg-gray-800/50">
                      <CardHeader>
                        <h3 className="text-xl font-semibold text-gray-200">Your Chatbot Link</h3>
                      </CardHeader>
                      <CardContent className="flex items-center space-x-4">
                        <Input
                          value={generatedLink}
                          readOnly
                          className="w-full bg-gray-700 text-gray-100"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                onClick={handleCopyLink}
                                variant="outline"
                                className="p-2"
                              >
                                {isCopied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5 text-gray-400" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isCopied ? 'Copied!' : 'Copy Link'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardContent>
                      <CardFooter>
                        <div>
                        <Button
                          onClick={() => window.open(generatedLink, '_blank')}
                          variant="outline"
                          className="w-full"
                        >
                          Open in New Tab
                        </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
