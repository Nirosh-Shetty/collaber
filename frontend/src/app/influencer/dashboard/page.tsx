"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  MessageSquare,
  Bell,
  Eye,
  Heart,
  Share,
  Plus,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

// Mock data
const stats = [
  {
    title: "Total Earnings",
    value: "$12,450",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-400",
  },
  {
    title: "Active Campaigns",
    value: "8",
    change: "+2",
    trend: "up",
    icon: TrendingUp,
    color: "text-blue-400",
  },
  {
    title: "Total Followers",
    value: "125.4K",
    change: "+5.2%",
    trend: "up",
    icon: Users,
    color: "text-purple-400",
  },
  {
    title: "Avg Engagement",
    value: "8.7%",
    change: "-0.3%",
    trend: "down",
    icon: Heart,
    color: "text-pink-400",
  },
]

const recentContracts = [
  {
    id: 1,
    brand: "TechCorp",
    campaign: "Summer Launch",
    status: "Active",
    amount: "$2,500",
    deadline: "Feb 15, 2024",
    progress: 65,
  },
  {
    id: 2,
    brand: "HealthBrand",
    campaign: "Wellness Series",
    status: "Review",
    amount: "$1,800",
    deadline: "Jan 30, 2024",
    progress: 90,
  },
  {
    id: 3,
    brand: "FashionCo",
    campaign: "Spring Collection",
    status: "Pending",
    amount: "$3,200",
    deadline: "Mar 10, 2024",
    progress: 0,
  },
]

const opportunities = [
  {
    id: 1,
    brand: "SportsBrand",
    campaign: "Athletic Wear Promo",
    budget: "$2,000 - $3,500",
    category: "Fashion",
    deadline: "Apply by Feb 20",
  },
  {
    id: 2,
    brand: "FoodApp",
    campaign: "Recipe Discovery",
    budget: "$1,500 - $2,200",
    category: "Food & Lifestyle",
    deadline: "Apply by Feb 25",
  },
]

const messages = [
  {
    id: 1,
    sender: "TechCorp Marketing",
    message: "Great work on the latest post! The engagement is fantastic.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    sender: "HealthBrand Team",
    message: "Can you share the analytics for last week's story?",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 3,
    sender: "Platform Support",
    message: "Your payment has been processed successfully.",
    time: "1 day ago",
    unread: false,
  },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John! 👋</h1>
            <p className="text-gray-300">Here's what's happening with your collaborations today.</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.trend === "up" ? (
                          <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-400 mr-1" />
                        )}
                        <span className={`text-sm ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Contracts */}
          <div className="lg:col-span-2">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Recent Contracts</CardTitle>
                    <CardDescription className="text-gray-400">Your active and pending collaborations</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                          {contract.brand.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{contract.campaign}</p>
                        <p className="text-gray-400 text-sm">{contract.brand}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge
                          variant="outline"
                          className={
                            contract.status === "Active"
                              ? "border-green-500/50 text-green-400"
                              : contract.status === "Review"
                                ? "border-yellow-500/50 text-yellow-400"
                                : "border-gray-500/50 text-gray-400"
                          }
                        >
                          {contract.status}
                        </Badge>
                        <span className="text-green-400 font-semibold">{contract.amount}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{contract.deadline}</p>
                      {contract.progress > 0 && (
                        <div className="mt-2">
                          <Progress value={contract.progress} className="h-1 w-20" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* New Opportunities */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">New Opportunities</CardTitle>
                <CardDescription className="text-gray-400">Fresh campaigns matching your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium text-sm">{opportunity.campaign}</h4>
                      <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                        {opportunity.category}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-xs">{opportunity.brand}</p>
                    <p className="text-green-400 font-semibold text-sm">{opportunity.budget}</p>
                    <p className="text-gray-400 text-xs">{opportunity.deadline}</p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Apply Now
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Messages</CardTitle>
                  <Bell className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg border ${
                      message.unread ? "bg-purple-500/10 border-purple-500/30" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white text-sm font-medium">{message.sender}</p>
                      <span className="text-gray-400 text-xs">{message.time}</span>
                    </div>
                    <p className="text-gray-300 text-xs">{message.message}</p>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  View All Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">Common tasks to manage your collaborations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Calendar className="h-6 w-6 mb-2" />
                Schedule Post
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Eye className="h-6 w-6 mb-2" />
                View Analytics
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <MessageSquare className="h-6 w-6 mb-2" />
                Contact Support
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Share className="h-6 w-6 mb-2" />
                Share Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
