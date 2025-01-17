'use client';

import { useState, useEffect, useRef } from "react";
import { Loader2, Send, User, Bot, Sparkles, Moon, Sun, Trash2 } from 'lucide-react';
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import AIMessageContent from "@/components/ai-message-content";
import UserMessageContent from "@/components/user-message-content";
import { addSession } from "@/app/actions/session";
import { calculateDurationInSeconds } from "@/app/actions/time";
import ChatbotFooter from "@/components/ChatbotFooter";

interface Message {
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatSession {
  sessionId: string;
  startTime: Date;
}

const Chatbot = () => {
  const params = useParams();
  const userId = params?.userId as string;
  const chatbotId = params?.chatbotId as string;
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current && autoScroll) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle scroll events to detect when user manually scrolls
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = scrollArea;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
      setAutoScroll(isAtBottom);
    };

    scrollArea.addEventListener('scroll', handleScroll);
    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
    inputRef.current?.focus();
  }, [messages, autoScroll]);

  useEffect(() => {
    if (userId && chatbotId) {
      setMessages([]);
      const newSession = {
        sessionId: crypto.randomUUID(),
        startTime: new Date()
      };
      setCurrentSession(newSession);
    }
  }, [userId, chatbotId]);

  useEffect(() => {
    return () => {
      if (currentSession) {
        const duration = new Date().getTime() - currentSession.startTime.getTime();
        addSession({
          sessionId: currentSession.sessionId,
          userId,
          chatbotId,
          userAction: "Session ended",
          sessionStart: currentSession.startTime,
          sessionEnd: new Date(),
          duration
        });
      }
    };
  }, [currentSession, userId, chatbotId]);

  const sendMessage = async () => {
    if (!message.trim() || !userId || !chatbotId) return;
  
    if (!currentSession) {
      const newSession = {
        sessionId: crypto.randomUUID(),
        startTime: new Date()
      };
      setCurrentSession(newSession);
    }
  
    const sessionId = currentSession?.sessionId || crypto.randomUUID();
    const sessionStart = currentSession?.startTime || new Date();
  
    const newMessage = { text: message.trim(), sender: "user" as const, timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    setMessage("");
    setAutoScroll(true);
  
    try {
      await addSession({
        sessionId,
        userId,
        chatbotId,
        userAction: `User sent a message: ${newMessage.text}`,
        sessionStart,
        sessionEnd: new Date(),
        duration: calculateDurationInSeconds(sessionStart)
      });
  
      const response = await axios.post<{ response: string }>(
        `/api/chat-Bot/${userId}/${chatbotId}`,
        { message: newMessage.text }
      );
  
      if (response.data?.response) {
        setIsTyping(true);
        const aiMessage = response.data.response;
  
        await addSession({
          sessionId,
          userId,
          chatbotId,
          userAction: `Bot responded: ${aiMessage}`,
          sessionStart,
          sessionEnd: new Date(),
          duration: calculateDurationInSeconds(sessionStart)
        });
  
        setMessages(prev => [...prev, { 
          text: "",
          sender: "ai",
          timestamp: new Date() 
        }]);
  
        let displayedMessage = "";
        const words = aiMessage.split(" ");
        for (let i = 0; i < words.length; i++) {
          displayedMessage += words[i] + " ";
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              text: displayedMessage.trim(),
              sender: "ai",
              timestamp: new Date()
            };
            return newMessages;
          });
          await new Promise(resolve => setTimeout(resolve, 30));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        toast.error('Rate limit exceeded. Please wait a moment before trying again.')
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast.success('Chat history cleared');
  };

  if (!userId || !chatbotId) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Card className="p-8 text-center animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
          <CardTitle className="mb-4 text-2xl">Invalid Chat Parameters</CardTitle>
          <p className="text-muted-foreground">Please check your URL and try again.</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen flex flex-col bg-background transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
        <Card className="flex-grow flex flex-col mx-auto w-full max-w-[95%] md:max-w-[85%] lg:max-w-[75%] xl:max-w-[65%] my-4 shadow-2xl border-primary/10">
          <CardHeader className="border-b bg-card/95 backdrop-blur-sm px-4 py-3 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                <div className="absolute inset-0 blur-sm bg-primary/20 rounded-full animate-pulse" />
              </div>
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                AI Assistant
              </CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={clearChat}
                      variant="ghost"
                      size="icon"
                      className="hover:bg-secondary/20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear Chat</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                  className="data-[state=checked]:bg-primary"
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-0 relative">
            <ScrollArea 
              ref={scrollAreaRef as any}
              className="h-[calc(100vh-14rem)] sm:h-[calc(100vh-12rem)]"
            >
              <div className="p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "ai" ? "justify-start" : "justify-end"} animate-in fade-in-50 slide-in-from-bottom-2 duration-300`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[90%] lg:max-w-[80%] ${msg.sender === "ai" ? "flex-row" : "flex-row-reverse"}`}>
                      <Avatar className={`w-8 h-8 ring-2 transition-all duration-300 ${
                        msg.sender === "ai" 
                          ? "ring-primary/20 bg-primary/10 hover:ring-primary/40" 
                          : "ring-secondary/20 bg-secondary/10 hover:ring-secondary/40"
                      }`}>
                        <AvatarFallback className={`${msg.sender === "ai" ? "text-primary" : "text-secondary-foreground"}`}>
                          {msg.sender === "ai" ? <Bot size={16} /> : <User size={16} />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        {msg.sender === "ai" ? (
                          <AIMessageContent content={msg.text} isTyping={isTyping && index === messages.length - 1} />
                        ) : (
                          <UserMessageContent content={msg.text} />
                        )}
                        <div className="text-xs text-muted-foreground/60 px-2">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
              {isLoading && !isTyping && (
                <div className="flex justify-center items-center py-4">
                  <div className="relative">
                    <Loader2 className="animate-spin text-primary h-6 w-6" />
                    <div className="absolute inset-0 blur-md animate-pulse bg-primary/20 rounded-full" />
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-3 bg-card/95 backdrop-blur-sm sticky bottom-0 z-50">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex w-full space-x-2">
              <Input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading || isTyping}
                className="flex-grow bg-background/50 border-primary/20 focus:border-primary/40 transition-all duration-200 hover:bg-background/80"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="submit" 
                      disabled={isLoading || isTyping || !message.trim()}
                      className="bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-primary/20"
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send Message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </form>
          </CardFooter>
        </Card>
      </div>
      <ChatbotFooter />
    </>
  );
};

export default Chatbot;