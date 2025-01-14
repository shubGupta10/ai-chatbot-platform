'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layout, Plus, ChevronRight, Loader2, Bot, Loader2Icon } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'

interface ChatBot {
  _id: string;
  name: string;
  description: string;
}

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user
  const [recentChatbots, setRecentChatbots] = useState<ChatBot[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecentChatbots = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/fetch-chatbot')
        const data = await response.json()
        if (response.ok) {
          setRecentChatbots(data.chatbots)
        }
      } catch (error) {
        console.error('Error fetching recent chatbots:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchRecentChatbots()
    }
  }, [user])

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="flex h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800"
      >
        <div className="text-center bg-gray-800 p-10 rounded-xl shadow-xl border border-gray-700">
          <h1 className="text-3xl font-bold text-gray-100">Access Denied</h1>
          <p className="mt-3 text-lg text-gray-300">
            Please sign in to access the dashboard
          </p>
          <Button 
            onClick={() => router.push('/signin')}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-gray-100 font-semibold"
          >
            Sign In
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <main className="container mx-auto px-6 py-10">
        <div className="flex flex-col mt-12 md:flex-row justify-between items-center gap-6 bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
          <div className="flex items-center gap-4">
            <Layout className="h-16 w-16 text-purple-400" />
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-100">
                AI Assistant Dashboard
              </h1>
              <p className="mt-2 text-xl text-gray-300">
                Welcome back, {user.name}!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <Card className="bg-gray-800 border-gray-700 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-100">Create New Chatbot</CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Design and deploy your custom AI assistant in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Start with a template or build from scratch. Our intuitive interface makes it easy to create powerful chatbots.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push("/create-chatbot")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-gray-100 font-semibold py-4 px-6 rounded-lg shadow-lg transition duration-200 text-xl flex items-center justify-center gap-2"
              >
                <Plus className="h-6 w-6" /> Create New Chatbot
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gray-800 border-gray-700 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-100">Analyse Chatbots</CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Check your recent selected chatbot analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-gray-300 mb-4">
                Select a chatbot to view detailed analytics and performance metrics.
                </p>
                <Button
                onClick={() => {
                  router.push("/recent-chatbot-analytics");
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-gray-100 font-semibold py-4 px-6 rounded-lg shadow-lg transition duration-200 text-xl flex items-center justify-center gap-2"
                >
                 <Bot className="h-6 w-6" />  Recent Chatbot Metrics
                </Button>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Recent Chatbots</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentChatbots.map((chatbot, index) => (
                <motion.div
                  key={chatbot._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-gray-100">{chatbot.name}</CardTitle>
                      <CardDescription className="mt-5 text-gray-300">{chatbot.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => router.push(`/view-chatbots/${chatbot._id}`)}
                        variant="link" 
                        className="bg-purple-400 hover:bg-purple-300 transition-colors duration-200"
                      >
                        View Details <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          {!isLoading && recentChatbots.length === 0 && (
            <>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-gray-300 mt-8"
              >
                No chatbots created yet. Start by creating one!
              </motion.p>
              <div className="flex justify-center mt-4">
                <Loader2Icon className="h-10 w-10 text-purple-400 animate-spin" />
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
    <Footer/>
    </>
  )
}