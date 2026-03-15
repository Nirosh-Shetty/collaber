"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Landmark,
  Calendar,
  CheckCircle2,
  Download,
  Eye,
  Filter,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Wallet,
  Send,
} from "lucide-react"

type EarningStatus = "pending" | "ready_for_payment" | "paid"
type PaymentMethod = "direct" | "escrow"

type Earning = {
  id: string
  campaignTitle: string
  brandName: string
  amount: number
  status: EarningStatus
  paymentMethod: PaymentMethod
  reach?: number
  engagement?: number
  datePaid?: string
  createdAt: string
}

const statusColors: Record<EarningStatus, string> = {
  pending: "border-0 bg-amber-100 text-amber-700",
  ready_for_payment: "border-0 bg-cyan-100 text-cyan-700",
  paid: "border-0 bg-emerald-100 text-emerald-700",
}

const statusLabels: Record<EarningStatus, string> = {
  pending: "Content Pending",
  ready_for_payment: "Ready for Payment",
  paid: "Paid",
}

// Mock data
const mockEarnings: Earning[] = [
  {
    id: "earn_1",
    campaignTitle: "Spring Launch Burst",
    brandName: "TechCorp",
    amount: 1500,
    status: "paid",
    paymentMethod: "direct",
    reach: 95000,
    engagement: 7.2,
    datePaid: "2026-03-01",
    createdAt: "2026-02-01",
  },
  {
    id: "earn_2",
    campaignTitle: "Creator Testimonial Series",
    brandName: "HealthBrand",
    amount: 1200,
    status: "ready_for_payment",
    paymentMethod: "direct",
    reach: 74000,
    engagement: 8.1,
    createdAt: "2026-02-05",
  },
  {
    id: "earn_3",
    campaignTitle: "Summer Vibes Campaign",
    brandName: "FashionHub",
    amount: 1800,
    status: "pending",
    paymentMethod: "escrow",
    reach: 0,
    engagement: 0,
    createdAt: "2026-02-15",
  },
  {
    id: "earn_4",
    campaignTitle: "Product Review - Gadgets",
    brandName: "ElectroWave",
    amount: 950,
    status: "paid",
    paymentMethod: "direct",
    reach: 62000,
    engagement: 6.5,
    datePaid: "2026-02-25",
    createdAt: "2026-01-20",
  },
  {
    id: "earn_5",
    campaignTitle: "Weekend Getaway Series",
    brandName: "TravelCo",
    amount: 2100,
    status: "paid",
    paymentMethod: "escrow",
    reach: 142000,
    engagement: 9.1,
    datePaid: "2026-02-20",
    createdAt: "2026-01-10",
  },
  {
    id: "earn_6",
    campaignTitle: "Wellness Challenge",
    brandName: "FitLife",
    amount: 1350,
    status: "ready_for_payment",
    paymentMethod: "direct",
    reach: 88000,
    engagement: 7.8,
    createdAt: "2026-02-10",
  },
]

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)

const paymentMethodLabels: Record<PaymentMethod, string> = {
  direct: "Direct Payment",
  escrow: "Escrow (Coming Soon)",
}

const paymentMethodColors: Record<PaymentMethod, string> = {
  direct: "bg-emerald-50 border-emerald-200 text-emerald-700",
  escrow: "bg-slate-100 border-slate-200 text-slate-600",
}

export default function EarningsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<EarningStatus | "all">("all")
  const [earnings] = useState<Earning[]>(mockEarnings)

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalEarned = earnings.filter((e) => e.status === "paid").reduce((sum, e) => sum + e.amount, 0)
    const pending = earnings.filter((e) => e.status === "pending").reduce((sum, e) => sum + e.amount, 0)
    const readyForPayment = earnings.filter((e) => e.status === "ready_for_payment").reduce((sum, e) => sum + e.amount, 0)
    const thisMonth = earnings
      .filter((e) => {
        const earningDate = new Date(e.datePaid || e.createdAt)
        const today = new Date()
        return earningDate.getMonth() === today.getMonth() && earningDate.getFullYear() === today.getFullYear()
      })
      .reduce((sum, e) => sum + (e.status === "paid" ? e.amount : 0), 0)

    return {
      totalEarned,
      pending,
      received: readyForPayment + totalEarned,
      thisMonth,
    }
  }, [earnings])

  // Filter earnings
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return earnings.filter((earning) => {
      const matchesText =
        !query ||
        earning.campaignTitle.toLowerCase().includes(query) ||
        earning.brandName.toLowerCase().includes(query)
      const matchesTab = activeTab === "all" || earning.status === activeTab
      return matchesText && matchesTab
    })
  }, [earnings, search, activeTab])

  const counts = useMemo(() => {
    return {
      all: earnings.length,
      pending: earnings.filter((e) => e.status === "pending").length,
      ready_for_payment: earnings.filter((e) => e.status === "ready_for_payment").length,
      paid: earnings.filter((e) => e.status === "paid").length,
    }
  }, [earnings])

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-8 lg:px-8">
      {/* Header */}
      <Card className="border-white/60 bg-white/85 shadow-lg shadow-green-100/40 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <Badge className="border-0 bg-green-100 text-green-900 hover:bg-green-100">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Revenue Hub
            </Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Earnings</h1>
            <p className="mt-1 text-sm text-slate-600">Track your collaborations, payments, and account details.</p>
          </div>
          <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Export earnings
          </Button>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Earned</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatMoney(metrics.totalEarned)}</p>
              </div>
              <div className="rounded-lg bg-emerald-100 p-2">
                <Wallet className="h-5 w-5 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatMoney(metrics.pending)}</p>
              </div>
              <div className="rounded-lg bg-amber-100 p-2">
                <Calendar className="h-5 w-5 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Received</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatMoney(metrics.received)}</p>
              </div>
              <div className="rounded-lg bg-cyan-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-cyan-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">This Month</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatMoney(metrics.thisMonth)}</p>
              </div>
              <div className="rounded-lg bg-sky-100 p-2">
                <TrendingUp className="h-5 w-5 text-sky-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="border-slate-200 bg-white/90 shadow-sm">
        <CardContent className="space-y-3 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by campaign or brand"
                className="h-10 border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <Button variant="outline" className="h-10 border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-4 rounded-xl border border-slate-200 bg-white p-1">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                All ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                Pending ({counts.pending})
              </TabsTrigger>
              <TabsTrigger value="ready_for_payment" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                Ready ({counts.ready_for_payment})
              </TabsTrigger>
              <TabsTrigger value="paid" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                Paid ({counts.paid})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Earnings Timeline */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="border-slate-200 bg-white/90 shadow-sm">
            <CardContent className="flex flex-col items-center px-4 py-12 text-center">
              <div className="rounded-full bg-slate-100 p-3">
                <Wallet className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">No earnings found</h3>
              <p className="mt-1 text-sm text-slate-600">Adjust filters to see your earnings history.</p>
            </CardContent>
          </Card>
        ) : null}

        {filtered.map((earning) => (
          <Card key={earning.id} className="border-slate-200 bg-white/90 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-lg text-slate-900">{earning.campaignTitle}</CardTitle>
                    <Badge className={statusColors[earning.status]}>{statusLabels[earning.status]}</Badge>
                  </div>
                  <CardDescription className="mt-1 text-slate-600">{earning.brandName}</CardDescription>
                </div>
                <p className="text-lg font-semibold text-slate-900">{formatMoney(earning.amount)}</p>
              </div>
              <div className="mt-3 inline-flex">
                <div className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${paymentMethodColors[earning.paymentMethod]}`}>
                  {paymentMethodLabels[earning.paymentMethod]}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Eye className="h-4 w-4 text-cyan-700" />
                  <span>Reach: {earning.reach ? earning.reach.toLocaleString() : "—"}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <TrendingUp className="h-4 w-4 text-sky-700" />
                  <span>Engagement: {earning.engagement ? `${earning.engagement}%` : "—"}</span>
                </div>
                {earning.datePaid && (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    <span>Paid {new Date(earning.datePaid).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                  View details
                </Button>
                {earning.status === "paid" && (
                  <Button variant="outline" size="sm" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                    <Download className="mr-2 h-4 w-4" /> Invoice
                  </Button>
                )}
                {earning.status === "ready_for_payment" && (
                  <Button variant="outline" size="sm" className="border-green-300 bg-green-50 text-green-700 hover:bg-green-100">
                    <Send className="mr-2 h-4 w-4" /> Request payment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Performance Table */}
      <Card className="border-slate-200 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Campaign Performance</CardTitle>
          <CardDescription className="text-slate-600">Performance metrics across all your earnings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Campaign</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Brand</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Reach</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Engagement</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Payment</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((earning) => (
                  <tr key={earning.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900">{earning.campaignTitle}</td>
                    <td className="px-4 py-3 text-slate-600">{earning.brandName}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{formatMoney(earning.amount)}</td>
                    <td className="px-4 py-3 text-slate-600">{earning.reach ? earning.reach.toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{earning.engagement ? `${earning.engagement}%` : "—"}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={`inline-block rounded px-2 py-1 font-medium ${paymentMethodColors[earning.paymentMethod]}`}>
                        {earning.paymentMethod === "direct" ? "Direct" : "Escrow"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[earning.status]}>{statusLabels[earning.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment & Bank Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Bank Account */}
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Bank Account</CardTitle>
            <CardDescription className="text-slate-600">Where your earnings are transferred.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
              <div className="flex items-start gap-3">
                <Landmark className="h-5 w-5 text-slate-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-slate-600">Current Account</p>
                  <p className="mt-2 font-semibold text-slate-900">Chase Bank</p>
                  <p className="mt-1 text-sm text-slate-600 font-mono">•••• •••• •••• 4829</p>
                  <p className="mt-2 text-xs text-slate-500">Account holder: User Name</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <Plus className="mr-2 h-4 w-4" /> Update bank details
            </Button>
          </CardContent>
        </Card>

        {/* Withdrawal */}
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Request Withdrawal</CardTitle>
            <CardDescription className="text-slate-600">Transfer your available earnings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-900 font-semibold">Available to Withdraw</p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">{formatMoney(metrics.received)}</p>
              <p className="mt-2 text-xs text-emerald-700">Minimum payout: $50</p>
            </div>
            <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
              <ArrowRight className="mr-2 h-4 w-4" /> Request withdrawal
            </Button>
            <p className="text-xs text-slate-500">Withdrawals are processed within 3–5 business days.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
