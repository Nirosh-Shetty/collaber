"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileBarChart, TrendingUp, Users } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-8 lg:px-8">
      <Card className="border-white/60 bg-white/85 shadow-lg shadow-cyan-100/40 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <Badge className="border-0 bg-cyan-100 text-cyan-900 hover:bg-cyan-100">Manager Reporting</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Reports</h1>
            <p className="mt-1 text-sm text-slate-600">Generate performance, payout, and campaign reliability summaries.</p>
          </div>
          <Button variant="outline" className="w-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50 sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Export all
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Monthly Revenue", value: "$89,450", icon: TrendingUp },
          { title: "Creators Managed", value: "24", icon: Users },
          { title: "Reports Generated", value: "18", icon: FileBarChart },
          { title: "Campaign Completion", value: "92%", icon: TrendingUp },
        ].map((metric) => (
          <Card key={metric.title} className="border-slate-200 bg-white/90 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{metric.title}</p>
                <metric.icon className="h-4 w-4 text-cyan-700" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Available Reports</CardTitle>
          <CardDescription className="text-slate-600">Download role-based snapshots for your team and clients.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "Creator Performance Summary",
            "Campaign Delivery Timeline",
            "Payout and Escrow Reconciliation",
            "Audience Growth and Engagement",
          ].map((name) => (
            <div key={name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
              <span className="text-sm text-slate-900">{name}</span>
              <Button variant="outline" size="sm" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                Download
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}