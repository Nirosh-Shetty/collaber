"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  Filter,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Wallet,
  AlertCircle,
} from "lucide-react"

type PaymentStatus = "pending" | "processing" | "completed" | "failed"
type PaymentMethod = "direct" | "escrow"

type Payment = {
  id: string
  influencerName: string
  campaignTitle: string
  amount: number
  status: PaymentStatus
  paymentMethod: PaymentMethod
  date: string
  dueDate: string
}

const statusColors: Record<PaymentStatus, string> = {
  pending: "border-0 bg-amber-100 text-amber-700",
  processing: "border-0 bg-blue-100 text-blue-700",
  completed: "border-0 bg-emerald-100 text-emerald-700",
  failed: "border-0 bg-rose-100 text-rose-700",
}

const statusLabels: Record<PaymentStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  direct: "Direct Payment",
  escrow: "Escrow (Vooki)",
}

const paymentMethodColors: Record<PaymentMethod, string> = {
  direct: "bg-emerald-50 border-emerald-200 text-emerald-700",
  escrow: "bg-blue-50 border-blue-200 text-blue-700",
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: "pay_1",
    influencerName: "Sarah Johnson",
    campaignTitle: "Spring Launch Burst",
    amount: 1500,
    status: "completed",
    paymentMethod: "direct",
    date: "2026-03-01",
    dueDate: "2026-02-28",
  },
  {
    id: "pay_2",
    influencerName: "Marcus Chen",
    campaignTitle: "Creator Testimonial Series",
    amount: 1200,
    status: "processing",
    paymentMethod: "direct",
    date: "2026-03-05",
    dueDate: "2026-03-05",
  },
  {
    id: "pay_3",
    influencerName: "Emma Davis",
    campaignTitle: "Summer Vibes Campaign",
    amount: 1800,
    status: "pending",
    paymentMethod: "escrow",
    date: "2026-03-10",
    dueDate: "2026-03-15",
  },
  {
    id: "pay_4",
    influencerName: "Alex Rodriguez",
    campaignTitle: "Product Review - Gadgets",
    amount: 950,
    status: "completed",
    paymentMethod: "direct",
    date: "2026-02-25",
    dueDate: "2026-02-25",
  },
  {
    id: "pay_5",
    influencerName: "Jessica Taylor",
    campaignTitle: "Weekend Getaway Series",
    amount: 2100,
    status: "completed",
    paymentMethod: "escrow",
    date: "2026-02-20",
    dueDate: "2026-02-20",
  },
  {
    id: "pay_6",
    influencerName: "David Park",
    campaignTitle: "Wellness Challenge",
    amount: 1350,
    status: "failed",
    paymentMethod: "direct",
    date: "2026-03-08",
    dueDate: "2026-03-08",
  },
]

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)

export default function PaymentsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<PaymentStatus | "all">("all")
  const [payments] = useState<Payment[]>(mockPayments)

  // Calculate metrics
  const metrics = useMemo(() => {
    const completed = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
    const pending = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
    const processing = payments.filter((p) => p.status === "processing").reduce((sum, p) => sum + p.amount, 0)
    const totalSpent = completed + processing + pending

    return {
      totalSpent,
      pending,
      processing,
      completed,
    }
  }, [payments])

  // Filter payments
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return payments.filter((payment) => {
      const matchesText =
        !query ||
        payment.influencerName.toLowerCase().includes(query) ||
        payment.campaignTitle.toLowerCase().includes(query)
      const matchesTab = activeTab === "all" || payment.status === activeTab
      return matchesText && matchesTab
    })
  }, [payments, search, activeTab])

  const counts = useMemo(() => {
    return {
      all: payments.length,
      pending: payments.filter((p) => p.status === "pending").length,
      processing: payments.filter((p) => p.status === "processing").length,
      completed: payments.filter((p) => p.status === "completed").length,
      failed: payments.filter((p) => p.status === "failed").length,
    }
  }, [payments])

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-8 lg:px-8">
      {/* Header */}
      <Card className="border-white/60 bg-white/85 shadow-lg shadow-blue-100/40 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <Badge className="border-0 bg-blue-100 text-blue-900 hover:bg-blue-100">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Payment Hub
            </Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Payments</h1>
            <p className="mt-1 text-sm text-slate-600">Manage creator payments, track transactions, and reconcile budgets.</p>
          </div>
          <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Export payments
          </Button>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Spent</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatMoney(metrics.totalSpent)}</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-2">
                <Wallet className="h-5 w-5 text-blue-700" />
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
                <Clock3 className="h-5 w-5 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Processing</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatMoney(metrics.processing)}</p>
              </div>
              <div className="rounded-lg bg-sky-100 p-2">
                <TrendingUp className="h-5 w-5 text-sky-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatMoney(metrics.completed)}</p>
              </div>
              <div className="rounded-lg bg-emerald-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
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
                placeholder="Search by influencer or campaign"
                className="h-10 border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <Button variant="outline" className="h-10 border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-5 rounded-xl border border-slate-200 bg-white p-1">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                All ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                Pending ({counts.pending})
              </TabsTrigger>
              <TabsTrigger value="processing" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                Processing ({counts.processing})
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                Completed ({counts.completed})
              </TabsTrigger>
              <TabsTrigger value="failed" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                Failed ({counts.failed})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Transactions */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="border-slate-200 bg-white/90 shadow-sm">
            <CardContent className="flex flex-col items-center px-4 py-12 text-center">
              <div className="rounded-full bg-slate-100 p-3">
                <Wallet className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">No payments found</h3>
              <p className="mt-1 text-sm text-slate-600">Adjust filters to see payment history.</p>
            </CardContent>
          </Card>
        ) : null}

        {filtered.map((payment) => (
          <Card key={payment.id} className="border-slate-200 bg-white/90 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-lg text-slate-900">{payment.influencerName}</CardTitle>
                    <Badge className={statusColors[payment.status]}>{statusLabels[payment.status]}</Badge>
                  </div>
                  <CardDescription className="mt-1 text-slate-600">{payment.campaignTitle}</CardDescription>
                </div>
                <p className="text-lg font-semibold text-slate-900">{formatMoney(payment.amount)}</p>
              </div>
              <div className="mt-3 inline-flex">
                <div className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${paymentMethodColors[payment.paymentMethod]}`}>
                  {paymentMethodLabels[payment.paymentMethod]}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Payment Details */}
              <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Calendar className="h-4 w-4 text-slate-700" />
                  <span>Due {new Date(payment.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <CreditCard className="h-4 w-4 text-slate-700" />
                  <span>{paymentMethodLabels[payment.paymentMethod]}</span>
                </div>
                {payment.status === "failed" && (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
                    <AlertCircle className="h-4 w-4 text-rose-700" />
                    <span className="text-rose-700">Retry required</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                  View details
                </Button>
                {payment.status === "pending" && (
                  <Button variant="outline" size="sm" className="border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100">
                    <ArrowRight className="mr-2 h-4 w-4" /> Process payment
                  </Button>
                )}
                {payment.status === "failed" && (
                  <Button variant="outline" size="sm" className="border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100">
                    <ArrowRight className="mr-2 h-4 w-4" /> Retry payment
                  </Button>
                )}
                {payment.status === "completed" && (
                  <Button variant="outline" size="sm" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                    <Download className="mr-2 h-4 w-4" /> Receipt
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Settings */}
      <Card className="border-slate-200 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Payment Settings</CardTitle>
          <CardDescription className="text-slate-600">Configure how creators receive payments from your campaigns.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method Note */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-900 font-medium">Payment Method Setup</p>
            <p className="mt-1 text-sm text-blue-800">
              Payment methods are set when you create a campaign. Direct payments transfer immediately after content approval. Escrow payments are held securely via Vooki.
            </p>
          </div>

          {/* Upcoming Payments */}
          <div >
            <p className="font-semibold text-slate-900">Upcoming Due Payments</p>
            <div className="mt-3 space-y-2">
              {payments
                .filter((p) => p.status === "pending")
                .slice(0, 3)
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{p.influencerName}</p>
                      <p className="text-xs text-slate-600">{p.campaignTitle}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{formatMoney(p.amount)}</p>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
