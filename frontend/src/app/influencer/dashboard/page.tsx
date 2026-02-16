"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Calendar,
  Camera,
  CheckCircle2,
  CircleDashed,
  Compass,
  Eye,
  Heart,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
} from "lucide-react"

const campaignOverview = [
  {
    name: "Nimbus Skincare",
    progress: 82,
    due: "Feb 19",
    status: "On track",
    amount: "$3,400",
  },
  {
    name: "AeroFit Studio",
    progress: 64,
    due: "Feb 24",
    status: "Needs draft",
    amount: "$2,150",
  },
  {
    name: "Northbeam Audio",
    progress: 95,
    due: "Feb 17",
    status: "Ready to submit",
    amount: "$1,800",
  },
]

const todayFocus = [
  {
    title: "Submit final reel cut",
    detail: "Nimbus Skincare",
    priority: "High",
    icon: CheckCircle2,
  },
  {
    title: "Approve story storyboard",
    detail: "AeroFit Studio",
    priority: "Medium",
    icon: CircleDashed,
  },
  {
    title: "Reply to brand feedback",
    detail: "Northbeam Audio",
    priority: "High",
    icon: Send,
  },
]

const recentCollabs = [
  {
    brand: "Nimbus Skincare",
    campaign: "Glow Reset Weekend",
    date: "2 days ago",
    result: "1.2M impressions",
  },
  {
    brand: "Northbeam Audio",
    campaign: "Desk Setup Series",
    date: "5 days ago",
    result: "8.1% engagement",
  },
  {
    brand: "AeroFit Studio",
    campaign: "Morning Mobility",
    date: "1 week ago",
    result: "34K saves",
  },
]

const platformMetrics = [
  {
    platform: "Instagram",
    followers: "72.4K",
    growth: "+4.6%",
    engagement: "7.9%",
  },
  {
    platform: "TikTok",
    followers: "118K",
    growth: "+6.2%",
    engagement: "9.3%",
  },
  {
    platform: "YouTube",
    followers: "41.8K",
    growth: "+2.4%",
    engagement: "5.8%",
  },
]

export default function InfluencerDashboard() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-8 lg:px-8">
      <Card className="border-white/60 bg-white/85 shadow-xl shadow-cyan-100/40 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge className="w-fit border-0 bg-cyan-100 text-cyan-900 hover:bg-cyan-100">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Creator Dashboard
            </Badge>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Hi John, your week looks strong.</h1>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                You are ahead on deliverables and your engagement trend is climbing.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="bg-slate-900 text-white hover:bg-slate-800">
                <Plus className="mr-2 h-4 w-4" /> New pitch
              </Button>
              <Button variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                <Calendar className="mr-2 h-4 w-4" /> Plan content
              </Button>
            </div>
          </div>

          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <p className="text-xs text-slate-500">This Month</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">$9,840</p>
              <p className="mt-1 flex items-center text-xs text-emerald-600">
                <TrendingUp className="mr-1 h-3.5 w-3.5" /> +18.4%
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <p className="text-xs text-slate-500">Active Deals</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">6</p>
              <p className="mt-1 text-xs text-slate-600">3 close this week</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <p className="text-xs text-slate-500">Avg Engagement</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">8.6%</p>
              <p className="mt-1 text-xs text-emerald-600">Above category avg</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <p className="text-xs text-slate-500">Response Time</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">2.1h</p>
              <p className="mt-1 text-xs text-slate-600">Top 12% creators</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/70 bg-white/90 shadow-lg shadow-slate-200/60 lg:col-span-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-slate-900">Campaign Momentum</CardTitle>
            <CardDescription className="text-slate-600">Track where each collaboration stands right now.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaignOverview.map((campaign) => (
              <div key={campaign.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-slate-900">{campaign.name}</h3>
                    <p className="text-sm text-slate-500">Due {campaign.due}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{campaign.amount}</p>
                    <Badge variant="secondary" className="mt-1 bg-slate-100 text-slate-700 hover:bg-slate-100">
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${campaign.progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-500">{campaign.progress}% complete</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/90 shadow-lg shadow-slate-200/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-slate-900">Focus Today</CardTitle>
            <CardDescription className="text-slate-600">A short list to keep you moving.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayFocus.map((task) => {
              const Icon = task.icon
              return (
                <div key={task.title} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-xl bg-amber-100 p-2 text-amber-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.detail}</p>
                    </div>
                    <Badge
                      className={
                        task.priority === "High"
                          ? "border-0 bg-rose-100 text-rose-700 hover:bg-rose-100"
                          : "border-0 bg-amber-100 text-amber-700 hover:bg-amber-100"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              )
            })}
            <Button variant="outline" className="mt-2 w-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              Open full task board <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/70 bg-white/90 shadow-lg shadow-slate-200/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-slate-900">Recent Collaborations</CardTitle>
            <CardDescription className="text-slate-600">Performance highlights from your latest campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCollabs.map((item) => (
              <div key={item.campaign} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{item.campaign}</p>
                    <p className="text-sm text-slate-500">{item.brand}</p>
                  </div>
                  <span className="text-xs text-slate-500">{item.date}</span>
                </div>
                <p className="mt-2 text-sm text-emerald-700">{item.result}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/90 shadow-lg shadow-slate-200/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-slate-900">Audience Snapshot</CardTitle>
            <CardDescription className="text-slate-600">Cross-platform health and engagement signals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformMetrics.map((metric) => (
              <div key={metric.platform} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{metric.platform}</p>
                  <Badge className="border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{metric.growth}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Followers</p>
                    <p className="font-semibold text-slate-900">{metric.followers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Engagement</p>
                    <p className="font-semibold text-slate-900">{metric.engagement}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" /> Reach
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5" /> Saves
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" /> Replies
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/70 bg-white/90 shadow-lg shadow-slate-200/60">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-sm font-medium text-slate-900">Quick Actions</p>
            <p className="text-xs text-slate-500">Jump into frequent workflows.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <Camera className="mr-2 h-4 w-4" /> New content
            </Button>
            <Button variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <Compass className="mr-2 h-4 w-4" /> Discover brands
            </Button>
            <Button className="bg-cyan-600 text-white hover:bg-cyan-700">
              View analytics <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
