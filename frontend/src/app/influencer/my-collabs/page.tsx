"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  MoreHorizontal,
  Star,
} from "lucide-react"

const collaborations = [
  {
    id: 1,
    title: "Summer Tech Collection",
    brand: "TechCorp",
    brandLogo: "/techcorp-logo.png",
    amount: "$2,500",
    status: "active",
    deadline: "Jan 20, 2024",
    deliverables: { completed: 2, total: 3 },
    description: "Create engaging content showcasing the latest tech gadgets for summer",
    priority: "high",
    category: "Technology",
  },
  {
    id: 2,
    title: "Fitness Challenge Campaign",
    brand: "HealthBrand",
    brandLogo: "/health-brand-logo.png",
    amount: "$1,800",
    status: "review",
    deadline: "Jan 25, 2024",
    deliverables: { completed: 1, total: 2 },
    description: "30-day fitness challenge with daily workout videos and progress updates",
    priority: "medium",
    category: "Health & Fitness",
  },
  {
    id: 3,
    title: "Food Photography Series",
    brand: "FoodieApp",
    brandLogo: "/food-app-logo.png",
    amount: "$3,200",
    status: "completed",
    deadline: "Jan 15, 2024",
    deliverables: { completed: 3, total: 3 },
    description: "Professional food photography for new restaurant partnerships",
    priority: "low",
    category: "Food & Beverage",
  },
  {
    id: 4,
    title: "Gaming Setup Showcase",
    brand: "GameTech",
    brandLogo: "/generic-sports-logo.png",
    amount: "$4,100",
    status: "pending",
    deadline: "Feb 1, 2024",
    deliverables: { completed: 0, total: 4 },
    description: "Showcase the ultimate gaming setup with detailed reviews and tutorials",
    priority: "high",
    category: "Gaming",
  },
  {
    id: 5,
    title: "Sustainable Fashion Week",
    brand: "EcoWear",
    brandLogo: "/placeholder-kbq75.png",
    amount: "$2,800",
    status: "active",
    deadline: "Jan 30, 2024",
    deliverables: { completed: 1, total: 5 },
    description: "Promote sustainable fashion choices during fashion week",
    priority: "medium",
    category: "Fashion",
  },
]

export default function MyCollaborations() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "review":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "pending":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-3 w-3" />
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      case "review":
        return <Eye className="h-3 w-3" />
      case "pending":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const filteredCollabs = collaborations.filter((collab) => {
    const matchesSearch =
      collab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || collab.status === activeTab
    return matchesSearch && matchesTab
  })

  const getTabCount = (status: string) => {
    if (status === "all") return collaborations.length
    return collaborations.filter((c) => c.status === status).length
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Collaborations</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">Manage and track your brand partnerships</p>
        </div>
        <Button className="w-full sm:w-auto">
          <MessageSquare className="h-4 w-4 mr-2" />
          New Proposal
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search collaborations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/10 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
            <DropdownMenuItem className="text-gray-300">By Priority</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300">By Category</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300">By Deadline</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300">By Amount</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/5 p-1">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All ({getTabCount("all")})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs sm:text-sm">
            Active ({getTabCount("active")})
          </TabsTrigger>
          <TabsTrigger value="review" className="text-xs sm:text-sm">
            Review ({getTabCount("review")})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            Done ({getTabCount("completed")})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs sm:text-sm">
            Pending ({getTabCount("pending")})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 sm:mt-6">
          <div className="grid gap-4 sm:gap-6">
            {filteredCollabs.map((collab) => (
              <Card key={collab.id} className="bg-black/20 border-white/10 hover:bg-black/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-start space-x-3 min-w-0 flex-1">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm sm:text-lg">{collab.title.charAt(0)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <CardTitle className="text-base sm:text-lg text-white truncate">{collab.title}</CardTitle>
                          <Badge className={`${getStatusColor(collab.status)} text-xs w-fit`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(collab.status)}
                              {collab.status}
                            </span>
                          </Badge>
                        </div>
                        <CardDescription className="text-sm text-gray-400 mt-1">
                          {collab.brand} • {collab.category}
                        </CardDescription>
                        <p className="text-xs sm:text-sm text-gray-300 mt-2 line-clamp-2">{collab.description}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white flex-shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                        <DropdownMenuItem className="text-gray-300">View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300">Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300">Message Brand</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-green-400 text-xs sm:text-sm">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="font-semibold">{collab.amount}</span>
                      </div>
                      <p className="text-xs text-gray-500">Payment</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-blue-400 text-xs sm:text-sm">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="font-semibold truncate">{collab.deadline}</span>
                      </div>
                      <p className="text-xs text-gray-500">Deadline</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-purple-400 text-xs sm:text-sm">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="font-semibold">
                          {collab.deliverables.completed}/{collab.deliverables.total}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Deliverables</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-yellow-400 text-xs sm:text-sm">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="font-semibold capitalize">{collab.priority}</span>
                      </div>
                      <p className="text-xs text-gray-500">Priority</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                    <Button size="sm" className="flex-1 sm:flex-none">
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none border-white/20 hover:bg-white/10 bg-transparent"
                    >
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Message
                    </Button>
                    {collab.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none border-white/20 hover:bg-white/10 bg-transparent"
                      >
                        Upload Content
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCollabs.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No collaborations found</h3>
              <p className="text-sm sm:text-base text-gray-400 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Start your first collaboration today"}
              </p>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                New Proposal
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
