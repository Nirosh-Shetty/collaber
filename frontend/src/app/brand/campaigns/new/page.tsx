"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Priority = "low" | "medium" | "high"

export default function NewCampaignPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [objective, setObjective] = useState("")
  const [niche, setNiche] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [budgetTotal, setBudgetTotal] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [deliverablesTotal, setDeliverablesTotal] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/campaigns`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          objective: objective.trim(),
          niche: niche.trim() || "General",
          priority,
          budgetTotal: Number(budgetTotal),
          startDate,
          endDate,
          deliverablesTotal: Number(deliverablesTotal || 0),
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.message || "Failed to create campaign")
      }

      router.push("/brand/campaigns")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not create campaign")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Button asChild variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
        <Link href="/brand/campaigns">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to campaigns
        </Link>
      </Button>

      <Card className="border-white/60 bg-white/85 shadow-xl shadow-cyan-100/40 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-cyan-900/10">
        <CardHeader>
          <Badge className="w-fit border-0 bg-cyan-100 text-cyan-900 hover:bg-cyan-100 dark:bg-cyan-500/20 dark:text-cyan-300">
            New Campaign
          </Badge>
          <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">Create Campaign</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Set campaign basics and launch your workflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Campaign name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Objective</label>
                <Textarea value={objective} onChange={(e) => setObjective(e.target.value)} required />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Niche</label>
                <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Lifestyle, Tech, Fashion..." />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Budget (USD)</label>
                <Input type="number" min={0} value={budgetTotal} onChange={(e) => setBudgetTotal(e.target.value)} required />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Deliverables target</label>
                <Input type="number" min={0} value={deliverablesTotal} onChange={(e) => setDeliverablesTotal(e.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Start date</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">End date</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>

            {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}

            <Button
              type="submit"
              disabled={submitting}
              className="bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-cyan-600 dark:hover:bg-cyan-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create campaign
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
