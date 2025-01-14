'use client'

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Clock, Calendar, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

interface Session {
  sessionId: string
  userAction: string
  sessionStart: string
  duration?: number
}

interface ApiResponse {
  sessions: Session[]
}

const ChatbotAnalytics: React.FC = () => {
  const { userId, chatbotId } = useParams()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/session/session-list/${userId}/${chatbotId}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch sessions.")
      }

      const result: ApiResponse = await response.json()
      setSessions(result.sessions)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [userId, chatbotId])

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-8 mt-20">
          <h1 className="text-3xl font-bold mb-2">Chatbot Analytics</h1>
          <p className="text-gray-400">View session data for your chatbot</p>
        </header>

        <Card className="bg-gray-800 border-gray-700 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-gray-100">Session Overview</CardTitle>
            <CardDescription className="text-gray-400">
              Total Sessions: {sessions.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              User ID: <span className="font-semibold">{userId}</span>
            </p>
            <p className="text-gray-300">
              Chatbot ID: <span className="font-semibold">{chatbotId}</span>
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={fetchSessions}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Refresh Sessions
            </Button>
          </CardFooter>
        </Card>

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 className="h-8 w-8 animate-spin text-purple-400 mr-2" />
              <span className="text-xl text-gray-300">Loading sessions...</span>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-900/20 border-l-4 border-red-700 p-4 rounded"
            >
              <p className="text-red-300">Error: {error}</p>
            </motion.div>
          ) : sessions.length > 0 ? (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {sessions.map((session, index) => (
                <motion.li
                  key={`${session.sessionId}-${index}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-100">
                        Session ID: {session.sessionId}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-gray-400 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <p className="text-sm">
                          Started: {new Date(session.sessionStart).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        <p className="text-sm">
                          Duration: {session.duration ? `${session.duration} seconds` : "N/A"}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href={`/Sessiondetails/${session.sessionId}`}
                        className="flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-400"
            >
              No session data available.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default ChatbotAnalytics

