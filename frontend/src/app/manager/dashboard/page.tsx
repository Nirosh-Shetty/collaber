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
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  MessageSquare,
  Plus,
  Eye,
  Target,
} from "lucide-react"

export default function ManagerDashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Manager Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">Welcome back, Sarah. Manage your influencer network</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Influencer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">$89,450</div>
            <p className="text-xs text-green-400">+18% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Active Influencers</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">24</div>
            <p className="text-xs text-blue-400">+3 new this month</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Active Campaigns</CardTitle>
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">16</div>
            <p className="text-xs text-purple-400">5 launching soon</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Avg. Performance</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">92%</div>
            <p className="text-xs text-yellow-400">+5% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Overview */}
      <Card className="bg-black/20 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-white">Management Overview</CardTitle>
          <CardDescription className="text-sm text-gray-400">
            Track your influencers and their campaign performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="influencers" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5">
              <TabsTrigger value="influencers" className="text-xs sm:text-sm">
                Influencers (24)
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="text-xs sm:text-sm">
                Campaigns (16)
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm">
                Pending (7)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="influencers" className="space-y-3 sm:space-y-4 mt-4">
              {[
                {
                  name: "John Doe",
                  handle: "@johndoe",
                  followers: "45.2K",
                  engagement: "8.4%",
                  activeCampaigns: 3,
                  totalEarnings: "$12,450",
                  rating: 4.8,
                  status: "active",
                },
                {
                  name: "Sarah Gaming",
                  handle: "@sarahgames",
                  followers: "89.1K",
                  engagement: "12.1%",
                  activeCampaigns: 2,
                  totalEarnings: "$18,900",
                  rating: 4.9,
                  status: "active",
                },
                {
                  name: "Alex Photo",
                  handle: "@alexphotos",
                  followers: "32.5K",
                  engagement: "6.8%",
                  activeCampaigns: 1,
                  totalEarnings: "$8,200",
                  rating: 4.6,
                  status: "review",
                },
              ].map((influencer, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 space-y-3 lg:space-y-0"
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {influencer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{influencer.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-400">{influencer.handle}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant={influencer.status === "active" ? "default" : "secondary"} className="text-xs">
                          {influencer.status}
                        </Badge>
                        <div className="flex items-center text-yellow-400">
                          <Star className="h-3 w-3 mr-1" />
                          <span className="text-xs">{influencer.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 lg:min-w-0 lg:flex-1 lg:max-w-lg">
                    <div className="text-center lg:text-right">
                      <div className="text-sm font-semibold text-blue-400">{influencer.followers}</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-sm font-semibold text-purple-400">{influencer.engagement}</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-sm font-semibold text-green-400">{influencer.totalEarnings}</div>
                      <div className="text-xs text-gray-500">Earnings</div>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-sm font-semibold text-orange-400">{influencer.activeCampaigns}</div>
                      <div className="text-xs text-gray-500">Campaigns</div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-3 sm:space-y-4 mt-4">
              {[
                {
                  title: "Summer Tech Collection",
                  brand: "TechCorp",
                  influencer: "John Doe",
                  budget: "$2,500",
                  progress: "2/3 deliverables",
                  deadline: "Jan 20, 2024",
                  status: "active",
                },
                {
                  title: "Gaming Setup Showcase",
                  brand: "GameTech",
                  influencer: "Sarah Gaming",
                  budget: "$4,100",
                  progress: "3/4 deliverables",
                  deadline: "Jan 25, 2024",
                  status: "review",
                },
                {
                  title: "Mobile Photography Tips",
                  brand: "PhotoBrand",
                  influencer: "Alex Photo",
                  budget: "$1,800",
                  progress: "1/2 deliverables",
                  deadline: "Jan 30, 2024",
                  status: "active",
                },
              ].map((campaign, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 space-y-3 lg:space-y-0"
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{campaign.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {campaign.brand} • {campaign.influencer}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant={campaign.status === "active" ? "default" : "secondary"} className="text-xs">
                          {campaign.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{campaign.progress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center text-right space-x-4 sm:space-x-0 sm:space-y-1">
                    <span className="text-sm font-semibold text-green-400">{campaign.budget}</span>
                    <span className="text-xs text-gray-500">{campaign.deadline}</span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-3 sm:space-y-4 mt-4">
              {[
                {
                  title: "Contract Review Required",
                  influencer: "Emma Style",
                  brand: "FashionCorp",
                  type: "Legal Review",
                  priority: "high",
                  submitted: "2 days ago",
                },
                {
                  title: "Content Approval Needed",
                  influencer: "Mike Fitness",
                  brand: "HealthBrand",
                  type: "Content Review",
                  priority: "medium",
                  submitted: "4 days ago",
                },
                {
                  title: "Payment Processing",
                  influencer: "Lisa Lifestyle",
                  brand: "BeautyBrand",
                  type: "Finance",
                  priority: "low",
                  submitted: "1 week ago",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 space-y-3 sm:space-y-0"
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {item.priority === "high" ? (
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      ) : item.priority === "medium" ? (
                        <Clock className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {item.influencer} • {item.brand}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge
                          variant={
                            item.priority === "high"
                              ? "destructive"
                              : item.priority === "medium"
                                ? "secondary"
                                : "default"
                          }
                          className="text-xs"
                        >
                          {item.priority} priority
                        </Badge>
                        <span className="text-xs text-gray-500">{item.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-2">
                    <span className="text-xs text-gray-500">{item.submitted}</span>
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

      {/* Quick Actions & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 border-white/20 hover:bg-white/10 bg-transparent"
              >
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                <span className="text-xs sm:text-sm text-white">Add Influencer</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 border-white/20 hover:bg-white/10 bg-transparent"
              >
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                <span className="text-xs sm:text-sm text-white">Schedule Meeting</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 border-white/20 hover:bg-white/10 bg-transparent"
              >
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                <span className="text-xs sm:text-sm text-white">View Reports</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 border-white/20 hover:bg-white/10 bg-transparent"
              >
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
                <span className="text-xs sm:text-sm text-white">Send Message</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  message: "John Doe completed campaign deliverable",
                  time: "1 hour ago",
                  type: "success",
                },
                {
                  message: "New influencer application received",
                  time: "3 hours ago",
                  type: "info",
                },
                {
                  message: "Campaign deadline approaching",
                  time: "5 hours ago",
                  type: "warning",
                },
                {
                  message: "Payment processed for Sarah Gaming",
                  time: "1 day ago",
                  type: "success",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5">
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === "success" && <CheckCircle className="h-4 w-4 text-green-400" />}
                    {activity.type === "info" && <Eye className="h-4 w-4 text-blue-400" />}
                    {activity.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
