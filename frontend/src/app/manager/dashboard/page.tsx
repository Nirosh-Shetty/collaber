"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  Plus,
  Star,
  Users,
} from "lucide-react"

const managedCreators = [
  { name: "John Doe", handle: "@johndoe", followers: "45.2K", campaigns: 3, rating: 4.8 },
  { name: "Sarah Gaming", handle: "@sarahgames", followers: "89.1K", campaigns: 2, rating: 4.9 },
  { name: "Alex Photo", handle: "@alexphotos", followers: "32.5K", campaigns: 1, rating: 4.6 },
]

export default function ManagerDashboard() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-8 lg:px-8">
      <Card className="border-white/60 bg-white/85 shadow-xl shadow-cyan-100/40 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <Badge className="border-0 bg-cyan-100 text-cyan-900 hover:bg-cyan-100">Manager Control Center</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Team Performance Overview</h1>
            <p className="mt-1 text-sm text-slate-600">Coordinate creators, monitor campaigns, and clear pending tasks faster.</p>
          </div>
          <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add influencer
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Portfolio Revenue", value: "$89,450", delta: "+18%" },
          { title: "Active Influencers", value: "24", delta: "+3 this month" },
          { title: "Running Campaigns", value: "16", delta: "5 launch this week" },
          { title: "Delivery Health", value: "92%", delta: "+5%" },
        ].map((metric) => (
          <Card key={metric.title} className="border-slate-200 bg-white/90 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">{metric.title}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
              <p className="mt-1 text-xs text-emerald-600">{metric.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Operations Queue</CardTitle>
          <CardDescription className="text-slate-600">Review creators, campaign progress, and urgent items.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="creators" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-3 rounded-xl border border-slate-200 bg-white p-1">
              <TabsTrigger value="creators" className="rounded-lg data-[state=active]:bg-slate-100">Creators</TabsTrigger>
              <TabsTrigger value="campaigns" className="rounded-lg data-[state=active]:bg-slate-100">Campaigns</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-slate-100">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="creators" className="mt-4 space-y-3">
              {managedCreators.map((creator) => (
                <div key={creator.handle} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{creator.name}</p>
                      <p className="text-sm text-slate-500">{creator.handle}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm sm:text-right">
                      <div>
                        <p className="text-slate-500">Followers</p>
                        <p className="font-semibold text-slate-900">{creator.followers}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Campaigns</p>
                        <p className="font-semibold text-slate-900">{creator.campaigns}</p>
                      </div>
                      <div className="inline-flex items-center justify-end gap-1">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="font-semibold text-slate-900">{creator.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="campaigns" className="mt-4 space-y-3">
              {[
                { title: "Spring Launch Burst", owner: "John Doe", progress: "2/3 deliverables", budget: "$4,200" },
                { title: "Creator Testimonial Series", owner: "Sarah Gaming", progress: "3/4 deliverables", budget: "$3,600" },
              ].map((campaign) => (
                <div key={campaign.title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <p className="font-medium text-slate-900">{campaign.title}</p>
                    <p className="text-sm text-slate-500">{campaign.owner} - {campaign.progress}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{campaign.budget}</span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="mt-4 space-y-3">
              {[
                { icon: AlertTriangle, text: "Contract review required", time: "2d" },
                { icon: Clock, text: "Content approval pending", time: "4d" },
                { icon: CheckCircle, text: "Payment ready for release", time: "1w" },
              ].map((item) => (
                <div key={item.text} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-cyan-700" />
                    <p className="text-sm text-slate-900">{item.text}</p>
                  </div>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <Users className="mr-2 h-4 w-4" /> Add creator
            </Button>
            <Button variant="outline" className="justify-start border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <Calendar className="mr-2 h-4 w-4" /> Schedule review
            </Button>
            <Button variant="outline" className="justify-start border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <Eye className="mr-2 h-4 w-4" /> Open reports
            </Button>
            <Button variant="outline" className="justify-start border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <MessageSquare className="mr-2 h-4 w-4" /> Team messages
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "John Doe submitted final cut",
              "New creator application arrived",
              "Campaign deadline update shared",
              "Payment released to Sarah Gaming",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900">
                {item}
              </div>
            ))}
            <Button className="w-full bg-cyan-600 text-white hover:bg-cyan-700">
              Open activity log <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}