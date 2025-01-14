'use client'

import { useSession } from 'next-auth/react'
import { use, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, ArrowLeft, Pencil, Trash2, MessageCircle, Calendar, Clock, Save, X, Bot, ChevronRight, Info, Settings2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface ChatBot {
    _id: string;
    userId: string;
    name: string;
    description: string;
    contextData: Record<string, string>;
    createdAt: Date;
    updatedAt: Date;
}

interface ContextItem {
    key: string;
    value: string;
}

export default function ViewChatBot() {
    const params = useParams();
    const chatbotId = params.chatbotId as string;
    const { data: session } = useSession()
    const [chatbot, setChatbot] = useState<ChatBot | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [contextItems, setContextItems] = useState<ContextItem[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()
    const user = useSession();
    const userId = user.data?.user.id

    useEffect(() => {
        const fetchChatbot = async () => {
            if (!session) return
            try {
                const response = await fetch(`/api/fetch-single-chatbot/${chatbotId}`)
                const data = await response.json()

                if (response.ok) {
                    setChatbot(data.chatbot)
                    setContextItems(Object.entries(data.chatbot.contextData || {}).map(([key, value]) => ({
                        key,
                        value: value as string
                    })))
                } else {
                    setError(data.message || 'Failed to fetch chatbot')
                }
            } catch (error) {
                setError('An error occurred while fetching the chatbot')
                console.error('Error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchChatbot()
    }, [session, chatbotId])

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/delete-chatbot/${chatbot?._id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                toast.success('Chatbot deleted successfully')
                router.push('/view-chatbots')
            } else {
                toast.error('Failed to delete chatbot')
            }
        } catch (error) {
            toast.error('An error occurred while deleting')
        }
    }

    const addContextItem = () => {
        setContextItems([...contextItems, { key: '', value: '' }])
    }

    const removeContextItem = (index: number) => {
        setContextItems(contextItems.filter((_, i) => i !== index))
    }

    const updateContextItem = (index: number, field: 'key' | 'value', value: string) => {
        const newItems = [...contextItems]
        newItems[index] = { ...newItems[index], [field]: value }
        setContextItems(newItems)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const contextData = contextItems.reduce((acc, item) => {
                if (item.key && item.value) {
                    acc[item.key] = item.value
                }
                return acc
            }, {} as Record<string, string>)

            const response = await fetch(`/api/update-chatbot/${chatbotId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contextData }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Context data updated successfully')
                setChatbot(data.data)
                setIsEditing(false)
            } else {
                toast.error(data.message || 'Failed to update context data')
            }
        } catch (error) {
            toast.error('An error occurred while updating')
            console.error('Error:', error)
        } finally {
            setIsSaving(false)
        }
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md px-4"
                >
                    <Card className="w-full bg-gray-800/90 backdrop-blur-lg border border-purple-500/20 shadow-2xl">
                        <CardContent className="pt-6">
                            <Bot className="w-20 h-20 mx-auto mb-6 text-purple-400" />
                            <p className="text-center text-2xl font-semibold text-gray-100 mb-6">Please sign in to view this chatbot</p>
                            <Button
                                onClick={() => router.push('/signin')}
                                className="w-full py-6 bg-purple-600 text-gray-100 hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
                            >
                                Sign In
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
                <Loader2 className="w-20 h-20 text-purple-400 animate-spin" />
            </div>
        )
    }

    if (error || !chatbot) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md px-4"
                >
                    <Card className="w-full bg-gray-800/90 backdrop-blur-lg border border-red-500/20 shadow-2xl">
                        <CardContent className="pt-6">
                            <X className="w-20 h-20 mx-auto mb-6 text-red-400" />
                            <p className="text-center text-2xl font-semibold text-red-400 mb-6">{error || 'Chatbot not found'}</p>
                            <Button
                                onClick={() => router.push('/dashboard')}
                                className="w-full py-6 bg-gray-700 text-gray-100 hover:bg-gray-600 transition-all duration-300"
                            >
                                <ArrowLeft className="w-6 h-6 mr-2" />
                                Back to Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    return (
        <>
        <Navbar/>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 mt-16"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Button
                            onClick={() => router.push('/dashboard')}
                            variant="ghost"
                            className="text-gray-300 hover:text-purple-400 hover:bg-gray-800/50 w-full sm:w-auto backdrop-blur-lg transition-all duration-300"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Dashboard
                        </Button>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button
                                className="bg-purple-600 text-gray-100 hover:bg-purple-700 flex-1 sm:flex-initial px-6 py-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                                onClick={() => router.push(`/Chatbot-Analytics/${userId}/${chatbotId}`)}
                            >
                                <Settings2 className="w-5 h-5 mr-2" />
                                Analytics
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        variant="destructive" 
                                        className="bg-red-500/80 text-gray-100 hover:bg-red-600 flex-1 sm:flex-initial px-6 py-6 backdrop-blur-lg transition-all duration-300"
                                    >
                                        <Trash2 className="w-5 h-5 mr-2" /> Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-gray-800/95 border border-red-500/20 backdrop-blur-lg">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-2xl text-gray-100">Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-300 text-lg">
                                            This action cannot be undone. This will permanently delete your chatbot and remove all associated data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="gap-3">
                                        <AlertDialogCancel className="bg-gray-700 text-gray-100 hover:bg-gray-600 transition-all duration-300">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-red-500/80 text-gray-100 hover:bg-red-600 transition-all duration-300"
                                        >
                                            Delete Permanently
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="bg-gray-800/90 border border-purple-500/20 shadow-2xl backdrop-blur-lg overflow-hidden">
                        <CardHeader className="bg-gray-900/80 border-b border-purple-500/20 px-8 py-10">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                <div className="flex-1">
                                    <CardTitle className="text-4xl text-gray-100 flex items-center mb-4">
                                        <Bot className="w-10 h-10 mr-3 text-purple-400" />
                                        {chatbot.name}
                                    </CardTitle>
                                    <CardDescription className="text-gray-300 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-lg">
                                        <span className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full">
                                            <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                                            Created: {new Date(chatbot.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="hidden sm:inline text-purple-400">•</span>
                                        <span className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full">
                                            <Clock className="w-5 h-5 mr-2 text-purple-400" />
                                            Updated: {new Date(chatbot.updatedAt).toLocaleDateString()}
                                        </span>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Tabs defaultValue="info" className="w-full">
                                <TabsList className="w-full justify-start bg-gray-900/80 border-b border-purple-500/20 px-8 py-8 space-x-6">
                                    <TabsTrigger
                                        value="info"
                                        className="flex items-center gap-3 px-6 py-3 text-gray-300 text-xl rounded-full
                                        data-[state=active]:bg-purple-600 data-[state=active]:text-gray-100
                                        hover:bg-gray-800/50 transition-all duration-300"
                                    >
                                        <Info className="w-5 h-5" />
                                        Info
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="context"
                                        className="flex items-center gap-3 px-6 py-3 text-gray-300 text-xl rounded-full
                                        data-[state=active]:bg-purple-600 data-[state=active]:text-gray-100
                                        hover:bg-gray-800/50 transition-all duration-300"
                                    >
                                        <Bot className="w-5 h-5" />
                                        Context Data
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="info" className="p-8">
                                    <div className="bg-gray-900/50 p-8 rounded-2xl backdrop-blur-lg border border-purple-500/20">
                                        <h3 className="text-2xl font-semibold text-purple-400 mb-4 flex items-center">
                                            <MessageCircle className="w-6 h-6 mr-3" />
                                            Description
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed text-lg">{chatbot.description}</p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="context" className="p-8">
                                    <div className="bg-gray-900/50 p-8 rounded-2xl backdrop-blur-lg border border-purple-500/20">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-2xl font-semibold text-purple-400 flex items-center">
                                                <Bot className="w-6 h-6 mr-3" />
                                                Context Data
                                            </h3>
                                            <div className="flex gap-3">
                                                {!isEditing ? (
                                                    <Button
                                                        variant="outline"
                                                        className="bg-purple-600 text-gray-100 hover:bg-purple-700 px-6 py-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        <Pencil className="w-5 h-5 mr-2" />
                                                        Edit Context
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            className="bg-gray-700 text-gray-100 hover:bg-gray-600 px-6 py-6 transition-all duration-300"
                                                            onClick={() => setIsEditing(false)}
                                                        >
                                                            <X className="w-5 h-5 mr-2" />
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            className="bg-purple-600 text-gray-100 hover:bg-purple-700 px-6 py-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                                                            onClick={handleSave}
                                                            disabled={isSaving}
                                                        >
                                                            {isSaving ? (
                                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                            ) : (
                                                                <Save className="w-5 h-5 mr-2" />
                                                            )}
                                                            Save Changes
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <ScrollArea className="h-[500px] pr-4">
                                            {isEditing ? (
                                                <div className="space-y-6">
                                                    {contextItems.map((item, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                                            className="flex flex-col sm:flex-row gap-4 items-start bg-gray-800/50 p-6 rounded-xl backdrop-blur-lg border border-purple-500/10"
                                                        >
                                                            <Input
                                                                placeholder="Key"
                                                                value={item.key}
                                                                onChange={(e) => updateContextItem(index, 'key', e.target.value)}
                                                                className="flex-1 bg-gray-700/50 text-gray-100 border-gray-600 h-12 text-lg"
                                                            />
                                                            <Textarea
                                                                placeholder="Value"
                                                                value={item.value}
                                                                onChange={(e) => updateContextItem(index, 'value', e.target.value)}
                                                                className="flex-1 bg-gray-700/50 text-gray-100 border-gray-600 min-h-[3rem] text-lg"
                                                            />
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                onClick={() => removeContextItem(index)}
                                                                className="bg-red-500/80 text-gray-100 hover:bg-red-600 h-12 w-12"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </Button>
                                                        </motion.div>
                                                    ))}
                                                    <Button
                                                        variant="outline"
                                                        onClick={addContextItem}
                                                        className="mt-6 bg-purple-600 text-gray-100 hover:bg-purple-700 px-6 py-6 w-full shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                                                    >
                                                        + Add New Context Item
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <AnimatePresence>
                                                        {contextItems.map((item, index) => (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -20 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-lg border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
                                                            >
                                                                <dt className="text-purple-400 font-bold text-lg mb-2">{item.key}</dt>
                                                                <dd className="text-gray-300 text-lg">{item.value}</dd>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                    {contextItems.length === 0 && (
                                                        <div className="flex flex-col items-center justify-center py-12 bg-gray-800/30 rounded-xl backdrop-blur-lg border border-purple-500/10">
                                                            <Bot className="w-16 h-16 text-gray-500 mb-4" />
                                                            <p className="text-gray-400 italic text-lg text-center">No context data available</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
        <Footer/>
        </>
    )
}