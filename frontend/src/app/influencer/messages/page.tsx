"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Phone, Video, MoreVertical, CheckCheck, Check, Paperclip, Smile, ArrowLeft } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "other"
  timestamp: string
  read: boolean
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>("1")
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileView, setMobileView] = useState<"list" | "chat">("list")

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "SC",
      lastMessage: "Looking forward to the collaboration!",
      timestamp: "2 min",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "TechCorp Brand Manager",
      avatar: "TC",
      lastMessage: "Can you send us the final deliverables?",
      timestamp: "1 hour",
      unread: 0,
      online: true,
    },
    {
      id: "3",
      name: "Alex Johnson",
      avatar: "AJ",
      lastMessage: "Great work on the campaign!",
      timestamp: "3 hours",
      unread: 0,
      online: false,
    },
    {
      id: "4",
      name: "Beauty Brand Agency",
      avatar: "BB",
      lastMessage: "Do you have availability next month?",
      timestamp: "1 day",
      unread: 1,
      online: false,
    },
    {
      id: "5",
      name: "Mike Rodriguez",
      avatar: "MR",
      lastMessage: "Your analytics look impressive",
      timestamp: "2 days",
      unread: 0,
      online: true,
    },
  ]

  const messages: Record<string, Message[]> = {
    "1": [
      {
        id: "1",
        text: "Hi! I wanted to discuss the collaboration details.",
        sender: "other",
        timestamp: "10:30",
        read: true,
      },
      { id: "2", text: "Of course! I'm excited about this project.", sender: "user", timestamp: "10:32", read: true },
      {
        id: "3",
        text: "Can we discuss the deliverables and timeline?",
        sender: "other",
        timestamp: "10:35",
        read: true,
      },
      {
        id: "4",
        text: "Absolutely. I can deliver 3 posts and 2 reels by the end of the month.",
        sender: "user",
        timestamp: "10:36",
        read: true,
      },
      { id: "5", text: "Looking forward to the collaboration!", sender: "other", timestamp: "10:38", read: false },
    ],
    "2": [
      { id: "1", text: "Hi! We're excited to work with you.", sender: "other", timestamp: "09:15", read: true },
      { id: "2", text: "Thanks! I'm excited too.", sender: "user", timestamp: "09:20", read: true },
      { id: "3", text: "Can you send us the final deliverables?", sender: "other", timestamp: "14:22", read: false },
    ],
  }

  const activeConversation = conversations.find((c) => c.id === selectedConversation)
  const activeMessages = messages[selectedConversation] || []

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput("")
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    setMobileView("chat")
  }

  const handleBackToList = () => {
    setMobileView("list")
  }

  return (
    <>
      {mobileView === "chat" && window.innerWidth < 1024 ? (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-50 bg-gradient-to-b from-purple-900/95 to-purple-950/95 flex flex-col">
          {activeConversation && (
            <>
              <div className="border-b border-white/10 px-4 py-3 flex flex-row items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleBackToList}
                    className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0 flex-shrink-0"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{activeConversation.avatar}</span>
                    </div>
                    {activeConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-white text-base truncate">{activeConversation.name}</h2>
                    <p className="text-xs text-gray-400">{activeConversation.online ? "Online" : "Offline"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
                {activeMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-purple-600 text-white"
                          : "bg-white/10 text-gray-200 border border-white/10"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <span className="text-xs opacity-70">{msg.timestamp}</span>
                        {msg.sender === "user" &&
                          (msg.read ? (
                            <CheckCheck className="h-3 w-3 opacity-70" />
                          ) : (
                            <Check className="h-3 w-3 opacity-70" />
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 p-3 space-y-3 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/50 h-10"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white h-10 w-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {mobileView === "list" && (
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Messages</h1>
              <p className="text-sm sm:text-base text-gray-400">Connect and collaborate with brands</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-[600px]">
            {(mobileView === "list" || window.innerWidth >= 1024) && (
              <Card className="bg-black/20 border-white/10 lg:col-span-1 flex flex-col">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 h-9 sm:h-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-2 sm:space-y-3">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all flex items-start space-x-3 ${
                        selectedConversation === conv.id
                          ? "bg-purple-500/20 border border-purple-400/50"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs sm:text-sm">{conv.avatar}</span>
                        </div>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-white text-sm sm:text-base truncate">{conv.name}</h3>
                          {conv.unread > 0 && (
                            <Badge className="bg-purple-500 text-white text-xs ml-2 flex-shrink-0">{conv.unread}</Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-gray-500 mt-1">{conv.timestamp}</p>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeConversation && (
              <Card className="bg-black/20 border-white/10 lg:col-span-2 flex flex-col">
                <CardHeader className="border-b border-white/10 pb-3 sm:pb-4 flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs sm:text-sm">{activeConversation.avatar}</span>
                      </div>
                      {activeConversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-white text-sm sm:text-base truncate">
                        {activeConversation.name}
                      </h2>
                      <p className="text-xs text-gray-400">{activeConversation.online ? "Online" : "Offline"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto py-4 px-3 sm:px-4 space-y-4">
                  {activeMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === "user"
                            ? "bg-purple-600 text-white"
                            : "bg-white/10 text-gray-200 border border-white/10"
                        }`}
                      >
                        <p className="text-sm sm:text-base break-words">{msg.text}</p>
                        <div className="flex items-center justify-end space-x-1 mt-1">
                          <span className="text-xs opacity-70">{msg.timestamp}</span>
                          {msg.sender === "user" &&
                            (msg.read ? (
                              <CheckCheck className="h-3 w-3 opacity-70" />
                            ) : (
                              <Check className="h-3 w-3 opacity-70" />
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <div className="border-t border-white/10 p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/50 h-10"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="bg-purple-600 hover:bg-purple-700 text-white h-10 w-10 p-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  )
}
