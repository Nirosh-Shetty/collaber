"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Star,
  MessageSquare,
  Eye,
  Heart,
  Share2,
  Clock,
  AlertCircle,
  Handshake,
  BarChart3,
  ClockIcon,
} from "lucide-react"

export default function InfluencerDashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome back, John!</h1>
        <p className="text-sm sm:text-base text-gray-400">Here's what's happening with your collaborations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Total Earnings</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">$12,450</div>
            <p className="text-xs text-green-400">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Active Collabs</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">8</div>
            <p className="text-xs text-blue-400">+2 new this week</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Followers</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">45.2K</div>
            <p className="text-xs text-purple-400">+5.4% growth</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Avg. Engagement</CardTitle>
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">8.4%</div>
            <p className="text-xs text-pink-400">+1.2% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-black/20 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-white">Recent Activity</CardTitle>
          <CardDescription className="text-sm text-gray-400">
            Your latest collaborations and content performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="collaborations" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 h-auto p-1">
              <TabsTrigger
                value="collaborations"
                className="flex items-center justify-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <Handshake className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Collaborations</span>
                <span className="xs:hidden sm:hidden">Collabs</span>
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="flex items-center justify-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Content</span>
                <span className="xs:hidden sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="flex items-center justify-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Pending</span>
                <span className="xs:hidden sm:hidden">Todo</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collaborations" className="space-y-3 sm:space-y-4 mt-4">
              {[
                {
                  title: "Summer Tech Collection",
                  brand: "TechCorp",
                  amount: "$2,500",
                  date: "1/15/2024",
                  deliverables: "2/3 deliverables",
                  status: "active",
                },
                {
                  title: "Fitness Challenge Campaign",
                  brand: "HealthBrand",
                  amount: "$1,800",
                  date: "1/12/2024",
                  deliverables: "1/2 deliverables",
                  status: "review",
                },
                {
                  title: "Food Photography Series",
                  brand: "FoodieApp",
                  amount: "$3,200",
                  date: "1/10/2024",
                  deliverables: "3/3 deliverables",
                  status: "completed",
                },
              ].map((collab, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 space-y-3 sm:space-y-0"
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-base">{collab.title.charAt(0)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{collab.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-400">{collab.brand}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge
                          variant={
                            collab.status === "completed"
                              ? "default"
                              : collab.status === "active"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {collab.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{collab.deliverables}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center text-right space-x-4 sm:space-x-0 sm:space-y-1">
                    <span className="text-sm sm:text-base font-semibold text-green-400">{collab.amount}</span>
                    <span className="text-xs text-gray-500">{collab.date}</span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="content" className="space-y-3 sm:space-y-4 mt-4">
              {[
                {
                  title: "Tech Review: Latest Smartphone",
                  platform: "Instagram",
                  views: "12.5K",
                  likes: "1.2K",
                  comments: "89",
                  date: "2 days ago",
                },
                {
                  title: "Unboxing Video: Gaming Setup",
                  platform: "TikTok",
                  views: "45.2K",
                  likes: "3.8K",
                  comments: "234",
                  date: "5 days ago",
                },
                {
                  title: "Morning Routine with Health Products",
                  platform: "YouTube",
                  views: "8.9K",
                  likes: "567",
                  comments: "45",
                  date: "1 week ago",
                },
              ].map((content, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 space-y-3 sm:space-y-0"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">{content.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400">{content.platform}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{content.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{content.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{content.comments}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{content.date}</span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-3 sm:space-y-4 mt-4">
              {[
                {
                  title: "Brand Partnership Proposal",
                  brand: "SportsCorp",
                  type: "Proposal Review",
                  priority: "high",
                  date: "2 days ago",
                },
                {
                  title: "Content Approval Needed",
                  brand: "BeautyBrand",
                  type: "Content Review",
                  priority: "medium",
                  date: "4 days ago",
                },
                {
                  title: "Contract Signature Required",
                  brand: "TechStartup",
                  type: "Legal",
                  priority: "high",
                  date: "1 week ago",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 space-y-3 sm:space-y-0"
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      {item.priority === "high" ? (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-400">{item.brand}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant={item.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                          {item.priority} priority
                        </Badge>
                        <span className="text-xs text-gray-500">{item.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-2">
                    <span className="text-xs text-gray-500">{item.date}</span>
                    <Button size="sm" className="text-xs">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-black/20 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Button
              variant="outline"
              className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 border-white/20 hover:bg-white/10 bg-transparent"
            >
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
              <span className="text-xs sm:text-sm text-white">Schedule Post</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 border-white/20 hover:bg-white/10 bg-transparent"
            >
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              <span className="text-xs sm:text-sm text-white">New Message</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 border-white/20 hover:bg-white/10 bg-transparent"
            >
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
              <span className="text-xs sm:text-sm text-white">Rate Collab</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 border-white/20 hover:bg-white/10 bg-transparent"
            >
              <Share2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
              <span className="text-xs sm:text-sm text-white">Share Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
