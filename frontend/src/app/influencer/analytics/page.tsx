"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, Eye, Heart, MessageCircle, Share2, Download } from "lucide-react"

const earningsData = [
  { month: "Jan", earnings: 2400, collaborations: 3 },
  { month: "Feb", earnings: 1800, collaborations: 2 },
  { month: "Mar", earnings: 3200, collaborations: 4 },
  { month: "Apr", earnings: 2800, collaborations: 3 },
  { month: "May", earnings: 4100, collaborations: 5 },
  { month: "Jun", earnings: 3600, collaborations: 4 },
]

const engagementData = [
  { date: "Dec 1", views: 12000, likes: 980, comments: 45 },
  { date: "Dec 8", views: 15000, likes: 1200, comments: 67 },
  { date: "Dec 15", views: 18000, likes: 1450, comments: 89 },
  { date: "Dec 22", views: 22000, likes: 1800, comments: 112 },
]

const platformData = [
  { name: "Instagram", value: 45, color: "#E1306C" },
  { name: "YouTube", value: 30, color: "#FF0000" },
  { name: "TikTok", value: 20, color: "#000000" },
  { name: "Twitter", value: 5, color: "#1DA1F2" },
]

export default function InfluencerAnalytics() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics & Earnings</h1>
          <p className="text-gray-400 mt-1">Track your performance and revenue</p>
        </div>
        <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$18,950</div>
            <div className="flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
              <span className="text-green-400">+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.4M</div>
            <div className="flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-blue-400 mr-1" />
              <span className="text-blue-400">+8.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Engagement Rate</CardTitle>
            <Heart className="h-4 w-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4.8%</div>
            <div className="flex items-center text-xs">
              <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
              <span className="text-red-400">-0.3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Collabs</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <div className="flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-purple-400 mr-1" />
              <span className="text-purple-400">+2 new this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="earnings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 border border-white/10">
          <TabsTrigger value="earnings" className="text-gray-300 data-[state=active]:text-white">
            Earnings
          </TabsTrigger>
          <TabsTrigger value="engagement" className="text-gray-300 data-[state=active]:text-white">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="platforms" className="text-gray-300 data-[state=active]:text-white">
            Platforms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Monthly Earnings</CardTitle>
              <CardDescription className="text-gray-400">
                Your earnings and collaboration count over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                  <Bar dataKey="earnings" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Engagement Trends</CardTitle>
              <CardDescription className="text-gray-400">
                Views, likes, and comments over the last month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="likes" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="comments" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Platform Distribution</CardTitle>
                <CardDescription className="text-gray-400">Your content distribution across platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Platform Performance</CardTitle>
                <CardDescription className="text-gray-400">Detailed metrics by platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { platform: "Instagram", followers: "125.4K", engagement: "4.8%", earnings: "$8,450" },
                  { platform: "YouTube", followers: "89.2K", engagement: "3.2%", earnings: "$6,200" },
                  { platform: "TikTok", followers: "234.1K", engagement: "7.1%", earnings: "$3,800" },
                  { platform: "Twitter", followers: "45.6K", engagement: "2.1%", earnings: "$500" },
                ].map((platform, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div>
                      <h4 className="text-white font-medium">{platform.platform}</h4>
                      <p className="text-gray-400 text-sm">{platform.followers} followers</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{platform.earnings}</p>
                      <p className="text-gray-400 text-sm">{platform.engagement} engagement</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Performance */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Recent Content Performance</CardTitle>
          <CardDescription className="text-gray-400">Your top performing content from the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Summer Tech Haul",
                platform: "Instagram",
                date: "Dec 20, 2023",
                views: "45.2K",
                likes: "3.8K",
                comments: "234",
                shares: "89",
                earnings: "$850",
              },
              {
                title: "Wellness Morning Routine",
                platform: "YouTube",
                date: "Dec 18, 2023",
                views: "128K",
                likes: "5.2K",
                comments: "892",
                shares: "234",
                earnings: "$1,200",
              },
              {
                title: "Quick Recipe Tutorial",
                platform: "TikTok",
                date: "Dec 15, 2023",
                views: "89.3K",
                likes: "12.1K",
                comments: "456",
                shares: "1.2K",
                earnings: "$650",
              },
            ].map((content, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{content.platform[0]}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{content.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {content.platform} • {content.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1 text-gray-300">
                    <Eye className="h-4 w-4" />
                    <span>{content.views}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-300">
                    <Heart className="h-4 w-4" />
                    <span>{content.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-300">
                    <MessageCircle className="h-4 w-4" />
                    <span>{content.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-300">
                    <Share2 className="h-4 w-4" />
                    <span>{content.shares}</span>
                  </div>
                  <div className="text-green-400 font-medium">{content.earnings}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
