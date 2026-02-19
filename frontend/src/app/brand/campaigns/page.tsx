"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight, Calendar, Filter, Plus, Search, Target, Users } from "lucide-react"

const campaigns = [
  {
    name: "Spring Launch Burst",
    type: "Product Awareness",
    creators: 6,
    budget: "$14,500",
    status: "Active",
    due: "Mar 02",
  },
  {
    name: "Creator Testimonial Series",
    type: "Social Proof",
    creators: 4,
    budget: "$9,200",
    status: "Review",
    due: "Mar 06",
  },
  {
    name: "Feature Deep-Dive Reels",
    type: "Education",
    creators: 3,
    budget: "$7,100",
    status: "Planned",
    due: "Mar 12",
  },
]

export default function CampaignsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-8 lg:px-8">
      <Card className="border-white/60 bg-white/85 shadow-lg shadow-cyan-100/40 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <Badge className="border-0 bg-amber-100 text-amber-800 hover:bg-amber-100">Campaign Studio</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Campaigns</h1>
            <p className="mt-1 text-sm text-slate-600">Plan launches, monitor creator delivery, and track campaign output.</p>
          </div>
          <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> New campaign
          </Button>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white/90 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="h-10 border-slate-300 bg-white pl-10 text-slate-900" placeholder="Search campaign names" />
            </div>
            <Button variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.name} className="border-slate-200 bg-white/90 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-slate-900">{campaign.name}</CardTitle>
                  <CardDescription className="text-slate-600">{campaign.type}</CardDescription>
                </div>
                <Badge className="w-fit border-0 bg-cyan-100 text-cyan-700 hover:bg-cyan-100">{campaign.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-600 sm:grid-cols-4">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Users className="h-4 w-4 text-cyan-700" /> {campaign.creators} creators
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Target className="h-4 w-4 text-emerald-700" /> {campaign.budget}
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Calendar className="h-4 w-4 text-amber-700" /> Due {campaign.due}
              </div>
              <Button variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                Open campaign <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}