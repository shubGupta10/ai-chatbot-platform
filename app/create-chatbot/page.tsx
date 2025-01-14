'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Bot, Loader2, Plus, X, ArrowLeft, Info, HelpCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

function CreateChatBot() {
    const { data: session } = useSession()
    const user = session?.user
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const [chatbotName, setChatbotName] = useState('')
    const [chatbotDescription, setChatbotDescription] = useState('')
    const [chatbotContext, setChatbotContext] = useState<{ [key: string]: string }>({})
    const [newKey, setNewKey] = useState('')
    const [newValue, setNewValue] = useState('')

    const handleAddContextData = () => {
        if (!newKey.trim() || !newValue.trim()) {
            toast.error('Please fill in both key and value')
            return
        }

        if (newKey in chatbotContext) {
            toast.error('A context with this key already exists!', {
                icon: '⚠️',
                style: {
                    background: '#374151',
                    color: '#fff',
                    border: '1px solid #4B5563',
                }
            })
            return
        }

        setChatbotContext(prev => ({
            ...prev,
            [newKey]: newValue
        }))
        setNewKey('')
        setNewValue('')
    }

    const handleCreateChatbot = async () => {
        if (!chatbotName || !chatbotDescription || Object.keys(chatbotContext).length === 0) {
            toast.error('Please fill in all fields')
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/create-chatBot', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    userId: user?.id,
                    name: chatbotName,
                    description: chatbotDescription,
                    contextData: chatbotContext,
                })
            })

            if (response.ok) {
                toast.success('Chatbot created successfully')
                router.push('/dashboard')
            } else {
                toast.error('Failed to create chatbot')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8 lg:py-16 max-w-4xl">
                <Card className="bg-gray-800 mt-10 border-gray-700 shadow-xl">
                    <CardHeader className="space-y-1 pb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-600/10 rounded-lg">
                                <Bot className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-100">Create New Chatbot</CardTitle>
                                <CardDescription className="text-gray-400 mt-1">Configure your AI assistant chatbot</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-200">Chatbot Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter a unique name for your chatbot"
                                        value={chatbotName}
                                        onChange={(e) => setChatbotName(e.target.value)}
                                        className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium text-gray-200">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your chatbot's purpose and functionality"
                                        value={chatbotDescription}
                                        onChange={(e) => setChatbotDescription(e.target.value)}
                                        rows={3}
                                        className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Context Data */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                                            Context Data
                                            <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                                        </h3>
                                        <p className="text-sm text-gray-400">Add key-value pairs to define your chatbot's knowledge</p>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {Object.keys(chatbotContext).length} pairs added
                                    </span>
                                </div>

                                {/* Input Area */}
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="Key"
                                        value={newKey}
                                        onChange={(e) => setNewKey(e.target.value)}
                                        className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                    <Input
                                        placeholder="Value"
                                        value={newValue}
                                        onChange={(e) => setNewValue(e.target.value)}
                                        className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                    <Button
                                        onClick={handleAddContextData}
                                        type="button"
                                        className="bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Context List */}
                                <div className="bg-gray-900 rounded-lg border border-gray-700">
                                    {Object.entries(chatbotContext).length === 0 ? (
                                        <div className="text-center py-6 text-gray-400">
                                            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p>No context data added yet</p>
                                        </div>
                                    ) : (
                                        <div className="max-h-[200px] overflow-y-auto divide-y divide-gray-700">
                                            {Object.entries(chatbotContext).map(([key, value], index) => (
                                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-800/50 group">
                                                    <div className="flex-1 min-w-0 pr-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-medium text-gray-300 truncate">{key}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-400 truncate">{value}</p>
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            const newContext = { ...chatbotContext }
                                                            delete newContext[key]
                                                            setChatbotContext(newContext)
                                                        }}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-100 hover:bg-gray-700"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between pt-6 mt-6 border-t border-gray-700">
                                <Button 
                                    onClick={() => router.push('/dashboard')}
                                    variant="outline"
                                    className="bg-transparent border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-gray-100"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Dashboard
                                </Button>
                                <Button 
                                    onClick={handleCreateChatbot} 
                                    className="bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/20"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Chatbot'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    )
}

export default CreateChatBot