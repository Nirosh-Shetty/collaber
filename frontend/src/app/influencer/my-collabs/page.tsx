"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  CheckCircle2,
  Clock3,
  Filter,
  MessageSquare,
  Search,
  Sparkles,
  Upload,
} from "lucide-react"

const collaborations = [
  {
    id: 1,
    title: "Summer Tech Collection",
    brand: "TechCorp",
    amount: "$2,500",
    status: "active",
    deadline: "Feb 20, 2026",
    deliverables: { completed: 2, total: 3 },
    description: "Short-form launch content highlighting flagship devices across IG and TikTok.",
    priority: "high",
    category: "Technology",
  },
  {
    id: 2,
    title: "Fitness Challenge Campaign",
    brand: "HealthBrand",
    amount: "$1,800",
    status: "review",
    deadline: "Feb 25, 2026",
    deliverables: { completed: 1, total: 2 },
    description: "30-day challenge recap with before-after transformations and CTA reels.",
    priority: "medium",
    category: "Health & Fitness",
  },
  {
    id: 3,
    title: "Food Photography Series",
    brand: "FoodieApp",
    amount: "$3,200",
    status: "completed",
    deadline: "Feb 14, 2026",
    deliverables: { completed: 3, total: 3 },
    description: "Premium editorial food visuals for seasonal restaurant partner spotlight.",
    priority: "low",
    category: "Food & Beverage",
  },
  {
    id: 4,
    title: "Gaming Setup Showcase",
    brand: "GameTech",
    amount: "$4,100",
    status: "pending",
    deadline: "Mar 1, 2026",
    deliverables: { completed: 0, total: 4 },
    description: "Desk transformation series with product reveals and creator POV storytelling.",
    priority: "high",
    category: "Gaming",
  },
  {
    id: 5,
    title: "Sustainable Fashion Week",
    brand: "EcoWear",
    amount: "$2,800",
    status: "active",
    deadline: "Feb 28, 2026",
    deliverables: { completed: 1, total: 5 },
    description: "Behind-the-scenes daily looks focused on conscious fabric and styling choices.",
    priority: "medium",
    category: "Fashion",
  },
]

type TabValue = "all" | "active" | "review" | "completed" | "pending"

const statusStyles: Record<string, string> = {
  active: "border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  review: "border-0 bg-amber-100 text-amber-700 hover:bg-amber-100",
  completed: "border-0 bg-cyan-100 text-cyan-700 hover:bg-cyan-100",
  pending: "border-0 bg-slate-200 text-slate-700 hover:bg-slate-200",
}

const priorityStyles: Record<string, string> = {
  high: "text-rose-600",
  medium: "text-amber-600",
  low: "text-emerald-600",
}

export default function MyCollaborations() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<TabValue>("all")

  const filteredCollabs = useMemo(() => {
    return collaborations.filter((collab) => {
      const matchesSearch =
        collab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collab.brand.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTab = activeTab === "all" || collab.status === activeTab
      return matchesSearch && matchesTab
    })
  }, [searchTerm, activeTab])

  const getTabCount = (status: TabValue) => {
    if (status === "all") return collaborations.length
    return collaborations.filter((item) => item.status === status).length
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-8 lg:px-8">
      <Card className="border-white/60 bg-white/85 shadow-lg shadow-cyan-100/40 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <Badge className="border-0 bg-amber-100 text-amber-800 hover:bg-amber-100">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Partnership Hub
            </Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">My Collaborations</h1>
            <p className="mt-1 text-sm text-slate-600">Track campaign progress, priorities, and delivery status in one view.</p>
          </div>
          <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto">
            <MessageSquare className="mr-2 h-4 w-4" /> New proposal
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active", value: getTabCount("active") },
          { label: "In Review", value: getTabCount("review") },
          { label: "Completed", value: getTabCount("completed") },
          { label: "Pending", value: getTabCount("pending") },
        ].map((item) => (
          <Card key={item.label} className="border-slate-200 bg-white/90 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 bg-white/90 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by campaign or brand"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-10 border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <Button variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="mt-4 w-full">
            <TabsList className="grid h-auto w-full grid-cols-5 rounded-xl border border-slate-200 bg-white p-1">
              <TabsTrigger value="all" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                All ({getTabCount("all")})
              </TabsTrigger>
              <TabsTrigger value="active" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                Active ({getTabCount("active")})
              </TabsTrigger>
              <TabsTrigger value="review" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                Review ({getTabCount("review")})
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                Done ({getTabCount("completed")})
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                Pending ({getTabCount("pending")})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredCollabs.map((collab) => {
          const progress = Math.round((collab.deliverables.completed / collab.deliverables.total) * 100)
          return (
            <Card key={collab.id} className="border-slate-200 bg-white/90 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg text-slate-900">{collab.title}</CardTitle>
                      <Badge className={statusStyles[collab.status]}>{collab.status}</Badge>
                    </div>
                    <CardDescription className="mt-1 text-slate-600">
                      {collab.brand} · {collab.category}
                    </CardDescription>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{collab.amount}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{collab.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Deliverables Progress</span>
                    <span>
                      {collab.deliverables.completed}/{collab.deliverables.total}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <Calendar className="h-4 w-4 text-cyan-700" />
                    <span>Deadline: {collab.deadline}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <Clock3 className="h-4 w-4 text-amber-700" />
                    <span className={priorityStyles[collab.priority]}>Priority: {collab.priority}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    <span>{progress}% completed</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                    <MessageSquare className="mr-2 h-4 w-4" /> Message brand
                  </Button>
                  {collab.status === "active" && (
                    <Button variant="outline" size="sm" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                      <Upload className="mr-2 h-4 w-4" /> Upload content
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCollabs.length === 0 && (
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="flex flex-col items-center px-4 py-12 text-center">
            <div className="rounded-full bg-slate-100 p-3">
              <MessageSquare className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">No collaborations found</h3>
            <p className="mt-1 text-sm text-slate-600">
              {searchTerm ? "Try a different term or filter." : "You do not have collaborations in this status yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
