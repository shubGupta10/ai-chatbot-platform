'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock, Link, Users, Activity, User, Loader2, RefreshCw, ChevronRight, BarChart2, MessageSquare,  Zap, ThumbsUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

interface AnalyticsData {
  chatbotId: string
  totalSessions: number
  totalDuration: number
  averageDuration: number
  userActions: string[]
  chatbotName: string
  chatbotLink: string
  userId: string
  userName: string
}

const SelectedChatbotAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/session/selected-chatbot-analytics')
      const data = await response.json()
      
      if (response.ok) {
        setAnalytics(data.analytics)
      } else {
        setError(data.message || 'Failed to fetch analytics')
      }
    } catch (error) {
      setError('An error occurred while fetching the data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const formattedDuration = useMemo(() => {
    if (!analytics) return { total: '0s', average: '0s' }
    
    const formatTime = (seconds: number) => {
      const units = [
        { label: 'y', seconds: 31536000 },
        { label: 'm', seconds: 2592000 },
        { label: 'd', seconds: 86400 },
        { label: 'h', seconds: 3600 },
        { label: 'm', seconds: 60 },
        { label: 's', seconds: 1 }
      ]

      return units.reduce((acc, { label, seconds: unitSeconds }) => {
        const count = Math.floor(seconds / unitSeconds)
        seconds %= unitSeconds
        return count ? `${acc}${count}${label} ` : acc
      }, '').trim() || '0s'
    }

    return {
      total: formatTime(analytics.totalDuration),
      average: formatTime(analytics.averageDuration)
    }
  }, [analytics])

  const totalMessages = useMemo(() => {
    return analytics?.userActions.length || 0
  }, [analytics?.userActions])

  const mockChartData = useMemo(() => {
    if (!analytics) {
      return [
        { name: 'Mon', sessions: 0 },
        { name: 'Tue', sessions: 0 },
        { name: 'Wed', sessions: 0 },
        { name: 'Thu', sessions: 0 },
        { name: 'Fri', sessions: 0 },
        { name: 'Sat', sessions: 0 },
        { name: 'Sun', sessions: 0 },
      ];
    }
  
    // Example: Distribute totalSessions over the week
    const dailySessions = Math.floor(analytics.totalSessions / 7);
    const remainingSessions = analytics.totalSessions % 7;
  
    return [
      { name: 'Mon', sessions: dailySessions + (remainingSessions > 0 ? 1 : 0) },
      { name: 'Tue', sessions: dailySessions + (remainingSessions > 1 ? 1 : 0) },
      { name: 'Wed', sessions: dailySessions + (remainingSessions > 2 ? 1 : 0) },
      { name: 'Thu', sessions: dailySessions + (remainingSessions > 3 ? 1 : 0) },
      { name: 'Fri', sessions: dailySessions + (remainingSessions > 4 ? 1 : 0) },
      { name: 'Sat', sessions: dailySessions + (remainingSessions > 5 ? 1 : 0) },
      { name: 'Sun', sessions: dailySessions },
    ];
  }, [analytics]);
  

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
        <p className="mt-4 text-gray-400">Loading analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-700 max-w-md mx-auto mt-20">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
          <Button 
            onClick={fetchAnalytics} 
            className="mt-4 w-full bg-red-700 hover:bg-red-600"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card className="bg-gray-800 border-gray-700 max-w-md mx-auto mt-20">
        <CardContent className="pt-6">
          <div className="text-center">
            <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-400">No analytics data available</p>
          </div>
          <Button 
            onClick={fetchAnalytics} 
            className="mt-4 w-full bg-purple-700 hover:bg-purple-600"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
    <Navbar/>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1 mt-20">
          <h1 className="text-3xl font-bold text-gray-100">Analytics Dashboard</h1>
          <p className="text-gray-400">{analytics.chatbotName}</p>
        </div>
        <Button
          onClick={fetchAnalytics}
          className="bg-purple-700 hover:bg-purple-600 transition-colors duration-200"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="bg-gray-750">
            <CardTitle className="text-gray-100 flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-400" />
              <span>Chatbot Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Name</label>
              <p className="text-gray-200 font-semibold">{analytics.chatbotName}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Link</label>
              <div className="break-all">
                <a 
                  href={analytics.chatbotLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-purple-400 hover:text-purple-300 flex items-center"
                >
                  <Link className="h-4 w-4 mr-2" />
                  {analytics.chatbotLink}
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Owner</label>
              <div className="flex items-center space-x-2 text-gray-200">
                <User className="h-4 w-4 text-purple-400" />
                <span>{analytics.userName}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="bg-gray-750">
            <CardTitle className="text-gray-100 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-400" />
              <span>Key Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-purple-400">{analytics.totalSessions}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400 opacity-50" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Total Duration</p>
                <p className="text-2xl font-bold text-purple-400">{formattedDuration.total}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400 opacity-50" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Avg. Duration</p>
                <p className="text-2xl font-bold text-purple-400">{formattedDuration.average}</p>
              </div>
              <BarChart2 className="h-8 w-8 text-purple-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="bg-gray-750">
            <CardTitle className="text-gray-100 flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <span>Conversation Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Total Messages</p>
                <p className="text-2xl font-bold text-purple-400">{totalMessages}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-400 opacity-50" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">User Satisfaction</p>
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="h-5 w-5 text-green-400" />
                  <span className="text-xl font-bold text-green-400">85%</span>
                </div>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-400 opacity-50" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Avg. Response Time</p>
                <p className="text-2xl font-bold text-purple-400">2.5s</p>
              </div>
              <Zap className="h-8 w-8 text-purple-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="bg-gray-750">
          <CardTitle className="text-gray-100 flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-purple-400" />
            <span>Session Trends</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Weekly session activity
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name"  stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Line type="monotone" dataKey="sessions" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="bg-gray-750">
          <CardTitle className="text-gray-100 flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            <span>Conversation Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ScrollArea className="h-[300px] w-full">
            <ul className="space-y-2">
              {['Product Information', 'Pricing', 'Technical Support', 'Account Issues', 'Feature Requests'].map((topic, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-750 p-3 rounded-lg text-gray-200 flex items-center justify-between"
                >
                  <span>{topic}</span>
                  <span className="text-purple-400 font-semibold">{Math.floor(Math.random() * 100)}%</span>
                </motion.li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => router.push('/dashboard')}
          className="bg-purple-700 hover:bg-purple-600 transition-colors duration-200"
        >
          Back to Dashboard
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
    <Footer/>
    </>
  )
}

export default SelectedChatbotAnalytics

