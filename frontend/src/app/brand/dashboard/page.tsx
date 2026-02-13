"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Eye,
  MessageSquare,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

export default function BrandDashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Brand Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">Welcome back, TechCorp Marketing Team</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Total Spend</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">$45,230</div>
            <p className="text-xs text-green-400">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Active Campaigns</CardTitle>
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">12</div>
            <p className="text-xs text-blue-400">3 launching this week</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Influencers</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">89</div>
            <p className="text-xs text-purple-400">+15 new partnerships</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Avg. ROI</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">4.2x</div>
            <p className="text-xs text-yellow-400">+0.3x this quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Overview */}
      <Card className="bg-black/20 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-white">Campaign Overview</CardTitle>
          <CardDescription className="text-sm text-gray-400">
            Track your active campaigns and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5">
              <TabsTrigger value="active" className="text-xs sm:text-sm">
                Active (8)
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm">
                Pending (4)
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm">
                Completed (15)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-3 sm:space-y-4 mt-4">
              {[
                {
                  title: "Summer Tech Collection",
                  influencer: "John Doe (@johndoe)",
                  budget: "$2,500",
                  reach: "45.2K",
                  engagement: "8.4%",
                  status: "In Progress",
                  deadline: "Jan 20, 2024",
                  deliverables: "2/3 completed",
                },
                {
                  title: "Gaming Setup Showcase",
                  influencer: "Sarah Gaming (@sarahgames)",
                  budget: "$4,100",
                  reach: "89.1K",
                  engagement: "12.1%",
                  status: "Content Review",
                  deadline: "Jan 25, 2024",
                  deliverables: "3/4 completed",
                },
                {
                  title: "Mobile Photography Tips",
                  influencer: "Alex Photo (@alexphotos)",
                  budget: "$1,800",
                  reach: "32.5K",
                  engagement: "6.8%",
                  status: "In Progress",
                  deadline: "Jan 30, 2024",
                  deliverables: "1/2 completed",
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
                      <p className="text-xs sm:text-sm text-gray-400">{campaign.influencer}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {campaign.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{campaign.deliverables}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 lg:min-w-0 lg:flex-1 lg:max-w-md">
                    <div className="text-center lg:text-right">
                      <div className="text-sm font-semibold text-green-400">{campaign.budget}</div>
                      <div className="text-xs text-gray-500">Budget</div>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-sm font-semibold text-blue-400">{campaign.reach}</div>
                      <div className="text-xs text-gray-500">Reach</div>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-sm font-semibold text-purple-400">{campaign.engagement}</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-sm font-semibold text-yellow-400">{campaign.deadline}</div>
                      <div className="text-xs text-gray-500">Deadline</div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-3 sm:space-y-4 mt-4">
              {[
                {
                  title: "Fashion Week Coverage",
                  influencer: "Emma Style (@emmastyle)",
                  budget: "$3,500",
                  status: "Awaiting Approval",
                  submitted: "2 days ago",
                  priority: "High",
                },
                {
                  title: "Fitness Challenge Series",
                  influencer: "Mike Fitness (@mikefit)",
                  budget: "$2,200",
                  status: "Contract Review",
                  submitted: "5 days ago",
                  priority: "Medium",
                },
              ].map((campaign, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 space-y-3 sm:space-y-0"
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{campaign.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-400">{campaign.influencer}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant={campaign.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                          {campaign.priority} Priority
                        </Badge>
                        <span className="text-xs text-gray-500">{campaign.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center text-right space-x-4 sm:space-x-0 sm:space-y-1">
                    <span className="text-sm font-semibold text-green-400">{campaign.budget}</span>
                    <span className="text-xs text-gray-500">{campaign.submitted}</span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3 sm:space-y-4 mt-4">
              {[
                {
                  title: "Holiday Gift Guide",
                  influencer: "Lisa Lifestyle (@lisalife)",
                  budget: "$2,800",
                  reach: "67.3K",
                  engagement: "9.2%",
                  roi: "5.1x",
                  completed: "Dec 20, 2023",
                },
                {
                  title: "New Year Fitness Goals",
                  influencer: "Tom Trainer (@tomtrains)",
                  budget: "$1,900",
                  reach: "41.8K",
                  engagement: "11.5%",
                  roi: "4.8x",
                  completed: "Jan 5, 2024",
                },
              ].map((campaign, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 space-y-3 lg:space-y-0"
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{campaign.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-400">{campaign.influencer}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="default" className="text-xs">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 lg:min-w-0 lg:flex-1 lg:max-w-md">
                    <div className="text-center lg:text-right">
                      <div className="text-sm font-semibold text-green-400">{campaign.budget}</div>
                      <div className="text-xs text-gray-500">Budget</div>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-sm font-semibold text-blue-400">{campaign.reach}</div>
                      <div className="text-xs text-gray-500">Reach</div>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-sm font-semibold text-purple-400">{campaign.engagement}</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-sm font-semibold text-yellow-400">{campaign.roi}</div>
                      <div className="text-xs text-gray-500">ROI</div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
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
                <span className="text-xs sm:text-sm text-white">New Campaign</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 border-white/20 hover:bg-white/10 bg-transparent"
              >
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                <span className="text-xs sm:text-sm text-white">Find Influencers</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 border-white/20 hover:bg-white/10 bg-transparent"
              >
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                <span className="text-xs sm:text-sm text-white">View Analytics</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 border-white/20 hover:bg-white/10 bg-transparent"
              >
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
                <span className="text-xs sm:text-sm text-white">Messages</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-white">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  message: "New content submitted for review",
                  time: "2 hours ago",
                  type: "review",
                },
                {
                  message: "Campaign deadline approaching",
                  time: "4 hours ago",
                  type: "warning",
                },
                {
                  message: "Influencer proposal received",
                  time: "1 day ago",
                  type: "info",
                },
              ].map((notification, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5">
                  <div className="flex-shrink-0 mt-1">
                    {notification.type === "review" && <Eye className="h-4 w-4 text-blue-400" />}
                    {notification.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-400" />}
                    {notification.type === "info" && <MessageSquare className="h-4 w-4 text-green-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
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
