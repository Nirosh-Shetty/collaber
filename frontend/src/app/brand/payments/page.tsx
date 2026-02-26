"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database } from "lucide-react"

export default function PaymentsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="space-y-3">
        <Badge className="border-0 bg-cyan-100 text-cyan-900">Payments</Badge>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Payment Operations</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Monitor payouts, pending settlements, and escrow releases outside of individual campaigns.
        </p>
      </div>

      <Card className="border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
        <CardHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Database className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-lg">Escrow Overview</CardTitle>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Release funds, view pending invoices, or reconcile campaign budgets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Placeholder content: wire this section to real transaction data from your payment provider.
          </p>
          <Button asChild variant="outline" className="w-fit border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
            <Link href="/brand/payments">Refresh</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
