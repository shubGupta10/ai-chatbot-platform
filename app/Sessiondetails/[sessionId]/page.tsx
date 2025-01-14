'use client'

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Clock, Calendar, User, Bot, ArrowLeft, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import Link from "next/link"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

interface SessionEntry {
  _id: string
  sessionId: string
  userId: string
  chatbotId: string
  sessionStart: string
  sessionEnd: string
  duration: number
  userAction: string
}

const SessionDetails: React.FC = () => {
  const { sessionId } = useParams()
  const [sessionEntries, setSessionEntries] = useState<SessionEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSessionDetails = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/session/session-details/${sessionId}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch session details.")
      }

      const result = await response.json()
      setSessionEntries(result.sessions)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessionDetails()
  }, [sessionId])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTotalDuration = () => {
    return sessionEntries.reduce((total, entry) => total + entry.duration, 0)
  }

  const chartData = [
    { name: 'Total Duration', value: getTotalDuration() },
  ]

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">Session Details</h1>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <Loader2 className="h-8 w-8 animate-spin text-purple-400 mr-2" />
            <span className="text-xl text-gray-300">Loading session details...</span>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/20 border-l-4 border-red-700 p-4 rounded"
          >
            <p className="text-red-300">Error: {error}</p>
          </motion.div>
        ) : sessionEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-400"
          >
            No session details found.
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-100">Session Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-purple-400" />
                      <span className="text-gray-300">Total Duration: </span>
                      <span className="ml-2 text-blue-600 font-semibold">{formatDuration(getTotalDuration())}</span>
                    </li>
                    <li className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                      <span className="text-gray-300">Start: </span>
                      <span className="ml-2 text-blue-600 font-semibold">{new Date(sessionEntries[0].sessionStart).toLocaleString()}</span>
                    </li>
                    <li className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                      <span className="text-gray-300">End: </span>
                      <span className="ml-2 text-blue-600 font-semibold">
                        {new Date(sessionEntries[sessionEntries.length - 1].sessionEnd).toLocaleString()}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-purple-400" />
                      <span className="text-gray-300">Total Interactions: </span>
                      <span className="ml-2 text-blue-600 font-semibold">{sessionEntries.length}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-100">Identifiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-purple-400" />
                      <span className="text-gray-300">User ID: </span>
                      <span className="ml-2 text-blue-600 font-semibold">{sessionEntries[0].userId}</span>
                    </li>
                    <li className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-purple-400" />
                      <span className="text-gray-300">Chatbot ID: </span>
                      <span className="ml-2 text-blue-600 font-semibold">{sessionEntries[0].chatbotId}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-gray-300">Session ID: </span>
                      <span className="ml-2 text-blue-600 font-semibold">{sessionEntries[0].sessionId}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-gray-100">Session Duration</CardTitle>
                <CardDescription className="text-gray-400">Visual representation of total session duration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Bar dataKey="value" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-gray-100">Conversation Log</CardTitle>
                <CardDescription className="text-gray-400">Detailed log of user and bot interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {sessionEntries.map((entry, index) => (
                    <div key={entry._id} className={`p-3 rounded-lg ${entry.userAction.startsWith('User') ? 'bg-blue-900' : 'bg-purple-900'}`}>
                      <div className="flex items-center mb-2">
                        {entry.userAction.startsWith('User') ? (
                          <User className="h-5 w-5 mr-2 text-blue-400" />
                        ) : (
                          <Bot className="h-5 w-5 mr-2 text-purple-400" />
                        )}
                        <span className="font-semibold">{entry.userAction.startsWith('User') ? 'User' : 'Bot'}</span>
                      </div>
                      <p className="text-gray-200 text-sm">{entry.userAction.split(': ')[1]}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(entry.sessionStart).toLocaleTimeString()} - Duration: {formatDuration(entry.duration)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </motion.div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default SessionDetails

