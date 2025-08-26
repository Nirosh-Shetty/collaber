"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Eye, Heart, Share, TrendingUp, CheckCircle, Clock, AlertCircle, ExternalLink } from "lucide-react"

// Mock data for active collaborations
const activeCollabs = [
  {
    id: 1,
    brand: "TechCorp",
    brandLogo: "/techcorp-logo.png",
    campaign: "Summer Tech Launch",
    status: "In Progress",
    progress: 65,
    deadline: "2024-02-15",
    payment: "$2,500",
    deliverables: [
      { type: "Instagram Post", status: "completed", dueDate: "2024-01-20" },
      { type: "Story Series", status: "in-progress", dueDate: "2024-02-05" },
      { type: "Reel", status: "pending", dueDate: "2024-02-10" },
    ],
    metrics: {
      reach: "125K",
      engagement: "8.5%",
      clicks: "2.1K",
    },
  },
  {
    id: 2,
    brand: "HealthBrand",
    brandLogo: "/health-brand-logo.png",
    campaign: "Wellness Journey",
    status: "Review",
    progress: 90,
    deadline: "2024-01-30",
    payment: "$1,800",
    deliverables: [
      { type: "Blog Post", status: "completed", dueDate: "2024-01-15" },
      { type: "Instagram Post", status: "completed", dueDate: "2024-01-25" },
      { type: "Video Review", status: "review", dueDate: "2024-01-28" },
    ],
    metrics: {
      reach: "89K",
      engagement: "12.3%",
      clicks: "1.8K",
    },
  },
]

// Mock data for past collaborations
const pastCollabs = [
  {
    id: 3,
    brand: "SportsBrand",
    brandLogo: "/generic-sports-logo.png",
    campaign: "Athletic Wear Collection",
    completedDate: "2024-01-10",
    payment: "$3,200",
    rating: 5,
    finalMetrics: {
      reach: "200K",
      engagement: "15.2%",
      clicks: "4.5K",
      conversions: "180",
    },
    deliverables: [
      { type: "Instagram Post", status: "completed" },
      { type: "Story Highlights", status: "completed" },
      { type: "Reel", status: "completed" },
      { type: "IGTV", status: "completed" },
    ],
  },
  {
    id: 4,
    brand: "FoodApp",
    brandLogo: "/food-app-logo.png",
    campaign: "Recipe Discovery",
    completedDate: "2023-12-20",
    payment: "$1,500",
    rating: 4,
    finalMetrics: {
      reach: "95K",
      engagement: "18.7%",
      clicks: "2.8K",
      conversions: "95",
    },
    deliverables: [
      { type: "Recipe Post", status: "completed" },
      { type: "Story Tutorial", status: "completed" },
      { type: "Reel", status: "completed" },
    ],
  },
]

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "in-progress":
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
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    case "in-progress":
      return <Clock className="h-4 w-4" />
    case "review":
      return <AlertCircle className="h-4 w-4" />
    case "pending":
      return <Clock className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export default function MyCollabsPage() {
  const [activeTab, setActiveTab] = useState("active")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Collaborations</h1>
          <p className="text-gray-300">Track your ongoing and completed brand partnerships</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Collabs</p>
                  <p className="text-2xl font-bold text-white">{activeCollabs.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-white">{pastCollabs.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Earnings</p>
                  <p className="text-2xl font-bold text-white">$9,000</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Rating</p>
                  <p className="text-2xl font-bold text-white">4.5</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
            >
              Active Collaborations ({activeCollabs.length})
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
            >
              Past Collaborations ({pastCollabs.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Collaborations */}
          <TabsContent value="active" className="space-y-6">
            {activeCollabs.map((collab) => (
              <Card key={collab.id} className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={collab.brandLogo || "/placeholder.svg"} alt={collab.brand} />
                        <AvatarFallback>{collab.brand.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-white">{collab.campaign}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {collab.brand} • Due {new Date(collab.deadline).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(collab.status)}>
                        {getStatusIcon(collab.status)}
                        {collab.status}
                      </Badge>
                      <span className="text-green-400 font-semibold">{collab.payment}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Overall Progress</span>
                      <span className="text-sm text-white">{collab.progress}%</span>
                    </div>
                    <Progress value={collab.progress} className="h-2" />
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Deliverables</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {collab.deliverables.map((deliverable, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(deliverable.status)}
                            <span className="text-white text-sm">{deliverable.type}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(deliverable.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Metrics */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Current Performance</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <Eye className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-white font-semibold">{collab.metrics.reach}</p>
                        <p className="text-xs text-gray-400">Reach</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <Heart className="h-5 w-5 text-pink-400 mx-auto mb-1" />
                        <p className="text-white font-semibold">{collab.metrics.engagement}</p>
                        <p className="text-xs text-gray-400">Engagement</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <ExternalLink className="h-5 w-5 text-green-400 mx-auto mb-1" />
                        <p className="text-white font-semibold">{collab.metrics.clicks}</p>
                        <p className="text-xs text-gray-400">Clicks</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      Message Brand
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      Upload Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Past Collaborations */}
          <TabsContent value="past" className="space-y-6">
            {pastCollabs.map((collab) => (
              <Card key={collab.id} className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={collab.brandLogo || "/placeholder.svg"} alt={collab.brand} />
                        <AvatarFallback>{collab.brand.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-white">{collab.campaign}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {collab.brand} • Completed {new Date(collab.completedDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="h-4 w-4" />
                        Completed
                      </Badge>
                      <span className="text-green-400 font-semibold">{collab.payment}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Brand Rating:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < collab.rating ? "text-yellow-400" : "text-gray-600"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-white">({collab.rating}/5)</span>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Completed Deliverables</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {collab.deliverables.map((deliverable, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20"
                        >
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-white text-sm">{deliverable.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Metrics */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Final Performance</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <Eye className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-white font-semibold">{collab.finalMetrics.reach}</p>
                        <p className="text-xs text-gray-400">Reach</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <Heart className="h-5 w-5 text-pink-400 mx-auto mb-1" />
                        <p className="text-white font-semibold">{collab.finalMetrics.engagement}</p>
                        <p className="text-xs text-gray-400">Engagement</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <ExternalLink className="h-5 w-5 text-green-400 mx-auto mb-1" />
                        <p className="text-white font-semibold">{collab.finalMetrics.clicks}</p>
                        <p className="text-xs text-gray-400">Clicks</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <Share className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-white font-semibold">{collab.finalMetrics.conversions}</p>
                        <p className="text-xs text-gray-400">Conversions</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      View Campaign
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      Download Report
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      Leave Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
