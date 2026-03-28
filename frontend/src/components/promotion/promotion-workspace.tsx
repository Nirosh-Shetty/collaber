"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Loader2, MessageSquare, Save, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type UserRole = "brand" | "influencer"
type PromotionStatus =
  | "requested"
  | "negotiating"
  | "accepted"
  | "content_in_progress"
  | "posted"
  | "metrics_submitted"
  | "payment_pending"
  | "completed"

type Deliverable = {
  platform: string
  format: string
  quantity: number
}

type Promotion = {
  id: string
  campaignId: string
  brandId: string
  influencerId: string
  campaignTitle: string
  product: string
  campaignGoal: "awareness" | "sales" | "launch" | "other"
  deliverables: Deliverable[]
  draftDueAt: string
  postAt: string
  requiresDraftApproval: boolean
  captionRequirements: string
  brandTagRequired: boolean
  hashtags: string[]
  linkRequired: boolean
  discountCode: string
  allowReuse: boolean
  exclusivityDays?: number
  paymentAmount: number
  advanceAmount: number
  paymentDueAt: string
  paymentMethod: string
  paymentStatus: "pending" | "paid"
  performance: {
    reach: number
    views: number
    engagement: number
  }
  deliverySubmission?: {
    proofUrl?: string
    notes?: string
    submittedAt?: string
    reviewedAt?: string
    reviewStatus?: "pending" | "approved" | "changes_requested" | ""
    reviewFeedback?: string
  }
  status: PromotionStatus
  createdAt: string
  updatedAt: string
}

type PromotionResponse = {
  promotion?: Promotion
}

type TermsFormState = {
  product: string
  deliverablePlatform: string
  deliverableFormat: string
  deliverableQuantity: string
  draftDueAt: string
  postAt: string
  captionRequirements: string
  hashtags: string
  paymentAmount: string
  advanceAmount: string
  paymentDueAt: string
  paymentMethod: string
  exclusivityDays: string
  discountCode: string
}

const statusPillClass: Record<PromotionStatus, string> = {
  requested: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  negotiating: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  accepted: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
  content_in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  posted: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  metrics_submitted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  payment_pending: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)

const formatDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const toDateInput = (value?: string) => {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().slice(0, 10)
}

const getAllowedNextStatuses = (role: UserRole, current: PromotionStatus): PromotionStatus[] => {
  if (role === "brand") {
    if (current === "requested") return ["negotiating"]
    if (current === "negotiating") return ["requested"]
    if (current === "accepted") return ["content_in_progress"]
    if (current === "metrics_submitted") return ["payment_pending"]
    if (current === "payment_pending") return ["completed"]
    return []
  }

  if (current === "requested") return ["negotiating", "accepted"]
  if (current === "negotiating") return ["accepted"]
  if (current === "content_in_progress") return ["posted"]
  if (current === "posted") return ["metrics_submitted"]
  return []
}

export function PromotionWorkspace({
  promotionId,
  role,
  backHref,
  backLabel,
}: {
  promotionId: string
  role: UserRole
  backHref: string
  backLabel: string
}) {
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [savingTerms, setSavingTerms] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [submittingMetrics, setSubmittingMetrics] = useState(false)
  const [markingPaid, setMarkingPaid] = useState(false)
  const [submittingDelivery, setSubmittingDelivery] = useState(false)
  const [reviewingDelivery, setReviewingDelivery] = useState(false)
  const [nextStatus, setNextStatus] = useState<PromotionStatus | "">("")
  const [terms, setTerms] = useState<TermsFormState>({
    product: "",
    deliverablePlatform: "",
    deliverableFormat: "",
    deliverableQuantity: "1",
    draftDueAt: "",
    postAt: "",
    captionRequirements: "",
    hashtags: "",
    paymentAmount: "0",
    advanceAmount: "0",
    paymentDueAt: "",
    paymentMethod: "direct",
    exclusivityDays: "",
    discountCode: "",
  })
  const [metrics, setMetrics] = useState({
    reach: "0",
    views: "0",
    engagement: "0",
  })
  const [deliveryProofUrl, setDeliveryProofUrl] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [reviewFeedback, setReviewFeedback] = useState("")

  const loadPromotion = async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promotions/${promotionId}`, {
        credentials: "include",
        signal,
      })
      if (!response.ok) {
        throw new Error("Unable to load collaboration")
      }
      const data: PromotionResponse = await response.json()
      const item = data.promotion || null
      setPromotion(item)
      if (item) {
        const firstDeliverable = item.deliverables?.[0]
        setTerms({
          product: item.product || "",
          deliverablePlatform: firstDeliverable?.platform || "",
          deliverableFormat: firstDeliverable?.format || "",
          deliverableQuantity: String(firstDeliverable?.quantity || 1),
          draftDueAt: toDateInput(item.draftDueAt),
          postAt: toDateInput(item.postAt),
          captionRequirements: item.captionRequirements || "",
          hashtags: item.hashtags.join(", "),
          paymentAmount: String(item.paymentAmount ?? 0),
          advanceAmount: String(item.advanceAmount ?? 0),
          paymentDueAt: toDateInput(item.paymentDueAt),
          paymentMethod: item.paymentMethod || "direct",
          exclusivityDays: item.exclusivityDays !== undefined ? String(item.exclusivityDays) : "",
          discountCode: item.discountCode || "",
        })
        setMetrics({
          reach: String(item.performance.reach || 0),
          views: String(item.performance.views || 0),
          engagement: String(item.performance.engagement || 0),
        })
        setDeliveryProofUrl(item.deliverySubmission?.proofUrl || "")
        setDeliveryNotes(item.deliverySubmission?.notes || "")
        setReviewFeedback(item.deliverySubmission?.reviewFeedback || "")
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return
      setError(err instanceof Error ? err.message : "Unable to load collaboration")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    loadPromotion(controller.signal)
    return () => controller.abort()
  }, [promotionId])

  const allowedNextStatuses = useMemo(
    () => (promotion ? getAllowedNextStatuses(role, promotion.status) : []),
    [promotion, role]
  )

  const canEditTerms =
    promotion && ["requested", "negotiating", "accepted"].includes(promotion.status)
  const messagesHref =
    role === "brand"
      ? `/brand/messages?otherUserId=${promotion?.influencerId || ""}`
      : `/influencer/messages?otherUserId=${promotion?.brandId || ""}`
  const deliveryReviewStatus = promotion?.deliverySubmission?.reviewStatus || ""

  const submitDeliveryProof = async () => {
    if (!promotion) return
    setSubmittingDelivery(true)
    setMessage(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promotions/${promotion.id}/delivery`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proofUrl: deliveryProofUrl.trim(),
          notes: deliveryNotes.trim(),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || "Failed to submit delivery proof")
      setMessage(data?.message || "Delivery proof submitted.")
      await loadPromotion()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit delivery proof")
    } finally {
      setSubmittingDelivery(false)
    }
  }

  const reviewDeliveryProof = async (action: "approved" | "changes_requested") => {
    if (!promotion) return
    setReviewingDelivery(true)
    setMessage(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promotions/${promotion.id}/delivery/review`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          feedback: reviewFeedback.trim(),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || "Failed to review delivery proof")
      setMessage(data?.message || "Delivery review updated.")
      await loadPromotion()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to review delivery proof")
    } finally {
      setReviewingDelivery(false)
    }
  }

  const saveTerms = async () => {
    if (!promotion) return
    setSavingTerms(true)
    setMessage(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promotions/${promotion.id}/terms`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: terms.product.trim(),
          deliverables: [
            {
              platform: terms.deliverablePlatform.trim(),
              format: terms.deliverableFormat.trim(),
              quantity: Number(terms.deliverableQuantity || 1),
            },
          ],
          draftDueAt: terms.draftDueAt,
          postAt: terms.postAt,
          captionRequirements: terms.captionRequirements.trim(),
          hashtags: terms.hashtags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          paymentAmount: Number(terms.paymentAmount || 0),
          advanceAmount: Number(terms.advanceAmount || 0),
          paymentDueAt: terms.paymentDueAt,
          paymentMethod: terms.paymentMethod.trim(),
          exclusivityDays: terms.exclusivityDays ? Number(terms.exclusivityDays) : undefined,
          discountCode: terms.discountCode.trim(),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || "Failed to save terms")
      setMessage(data?.message || "Collaboration terms updated.")
      await loadPromotion()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save terms")
    } finally {
      setSavingTerms(false)
    }
  }

  const updateStatus = async () => {
    if (!promotion || !nextStatus) return
    setUpdatingStatus(true)
    setMessage(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promotions/${promotion.id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || "Failed to update status")
      setMessage(data?.message || "Collaboration status updated.")
      setNextStatus("")
      await loadPromotion()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const submitPerformance = async () => {
    if (!promotion) return
    setSubmittingMetrics(true)
    setMessage(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promotions/${promotion.id}/performance`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reach: Number(metrics.reach || 0),
          views: Number(metrics.views || 0),
          engagement: Number(metrics.engagement || 0),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || "Failed to submit metrics")
      setMessage(data?.message || "Performance submitted.")
      await loadPromotion()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit metrics")
    } finally {
      setSubmittingMetrics(false)
    }
  }

  const markPaid = async () => {
    if (!promotion) return
    setMarkingPaid(true)
    setMessage(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promotions/${promotion.id}/payment`, {
        method: "PATCH",
        credentials: "include",
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || "Failed to update payment")
      setMessage(data?.message || "Payment status updated.")
      await loadPromotion()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update payment")
    } finally {
      setMarkingPaid(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Button asChild variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
        <Link href={backHref}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Link>
      </Button>

      {loading ? (
        <Card className="border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
          <CardContent className="p-5 text-sm text-slate-600 dark:text-slate-300">Loading collaboration details...</CardContent>
        </Card>
      ) : null}

      {error ? (
        <Card className="border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
          <CardContent className="p-4 text-sm text-rose-600 dark:text-rose-300">{error}</CardContent>
        </Card>
      ) : null}

      {message ? (
        <Card className="border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
          <CardContent className="p-4 text-sm text-emerald-700 dark:text-emerald-300">{message}</CardContent>
        </Card>
      ) : null}

      {!loading && promotion ? (
        <>
          <Card className="border-white/60 bg-white/85 shadow-xl shadow-cyan-100/40 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/85">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">{promotion.campaignTitle}</CardTitle>
                  <CardDescription className="mt-1 text-slate-600 dark:text-slate-400">
                    {promotion.product || "Collaboration detail workspace"}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`border-0 capitalize ${statusPillClass[promotion.status]}`}>
                    {promotion.status.replaceAll("_", " ")}
                  </Badge>
                  <Badge className="border-0 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    Payment {promotion.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs text-slate-500 dark:text-slate-400">Payment value</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{formatMoney(promotion.paymentAmount)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs text-slate-500 dark:text-slate-400">Draft due</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{formatDateTime(promotion.draftDueAt)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs text-slate-500 dark:text-slate-400">Post due</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{formatDateTime(promotion.postAt)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs text-slate-500 dark:text-slate-400">Payment due</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{formatDateTime(promotion.paymentDueAt)}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
            <div className="space-y-6">
              <Card className="border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Terms and deliverables</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Edit the working agreement while the collaboration is still in planning.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label>Product or service</Label>
                      <Input value={terms.product} onChange={(e) => setTerms((prev) => ({ ...prev, product: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                    <div>
                      <Label>Deliverable platform</Label>
                      <Input value={terms.deliverablePlatform} onChange={(e) => setTerms((prev) => ({ ...prev, deliverablePlatform: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                    <div>
                      <Label>Deliverable format</Label>
                      <Input value={terms.deliverableFormat} onChange={(e) => setTerms((prev) => ({ ...prev, deliverableFormat: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input type="number" min={1} value={terms.deliverableQuantity} onChange={(e) => setTerms((prev) => ({ ...prev, deliverableQuantity: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                    <div>
                      <Label>Draft due</Label>
                      <Input type="date" value={terms.draftDueAt} onChange={(e) => setTerms((prev) => ({ ...prev, draftDueAt: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                    <div>
                      <Label>Post due</Label>
                      <Input type="date" value={terms.postAt} onChange={(e) => setTerms((prev) => ({ ...prev, postAt: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Caption requirements</Label>
                      <Textarea value={terms.captionRequirements} onChange={(e) => setTerms((prev) => ({ ...prev, captionRequirements: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Hashtags</Label>
                      <Input value={terms.hashtags} onChange={(e) => setTerms((prev) => ({ ...prev, hashtags: e.target.value }))} placeholder="comma separated" disabled={!canEditTerms} />
                    </div>
                    <div>
                      <Label>Payment amount</Label>
                      <Input type="number" min={0} value={terms.paymentAmount} onChange={(e) => setTerms((prev) => ({ ...prev, paymentAmount: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                    <div>
                      <Label>Advance amount</Label>
                      <Input type="number" min={0} value={terms.advanceAmount} onChange={(e) => setTerms((prev) => ({ ...prev, advanceAmount: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                    <div>
                      <Label>Payment due</Label>
                      <Input type="date" value={terms.paymentDueAt} onChange={(e) => setTerms((prev) => ({ ...prev, paymentDueAt: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                    <div>
                      <Label>Payment method</Label>
                      <Input value={terms.paymentMethod} onChange={(e) => setTerms((prev) => ({ ...prev, paymentMethod: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                    <div>
                      <Label>Exclusivity days</Label>
                      <Input type="number" min={0} value={terms.exclusivityDays} onChange={(e) => setTerms((prev) => ({ ...prev, exclusivityDays: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                    <div>
                      <Label>Discount code</Label>
                      <Input value={terms.discountCode} onChange={(e) => setTerms((prev) => ({ ...prev, discountCode: e.target.value }))} disabled={!canEditTerms} />
                    </div>
                  </div>
                  <Button onClick={saveTerms} disabled={!canEditTerms || savingTerms} className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-700">
                    {savingTerms ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save terms
                  </Button>
                </CardContent>
              </Card>

              {role === "influencer" ? (
                <Card className="border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-slate-100">Delivery proof</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Share the live asset link or proof for brand review before moving to metrics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Proof URL</Label>
                      <Input value={deliveryProofUrl} onChange={(e) => setDeliveryProofUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} />
                    </div>
                    {deliveryReviewStatus ? (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                        Review status: {deliveryReviewStatus.replaceAll("_", " ")}
                        {promotion.deliverySubmission?.reviewFeedback ? ` - ${promotion.deliverySubmission.reviewFeedback}` : ""}
                      </div>
                    ) : null}
                    <Button
                      onClick={submitDeliveryProof}
                      disabled={submittingDelivery || !["accepted", "content_in_progress", "posted"].includes(promotion.status)}
                      className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                    >
                      {submittingDelivery ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Submit delivery proof
                    </Button>
                  </CardContent>
                </Card>
              ) : null}

              {role === "influencer" ? (
                <Card className="border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-slate-100">Performance submission</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Submit post results once the collaboration has been published.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <Label>Reach</Label>
                        <Input type="number" min={0} value={metrics.reach} onChange={(e) => setMetrics((prev) => ({ ...prev, reach: e.target.value }))} />
                      </div>
                      <div>
                        <Label>Views</Label>
                        <Input type="number" min={0} value={metrics.views} onChange={(e) => setMetrics((prev) => ({ ...prev, views: e.target.value }))} />
                      </div>
                      <div>
                        <Label>Engagement %</Label>
                        <Input type="number" min={0} step="0.01" value={metrics.engagement} onChange={(e) => setMetrics((prev) => ({ ...prev, engagement: e.target.value }))} />
                      </div>
                    </div>
                    <Button onClick={submitPerformance} disabled={submittingMetrics || !["posted", "metrics_submitted"].includes(promotion.status)} className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-700">
                      {submittingMetrics ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                      Submit performance
                    </Button>
                  </CardContent>
                </Card>
              ) : null}
            </div>

            <div className="space-y-6">
              <Card className="border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Workflow actions</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Move the collaboration forward according to role-based rules.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Next status</Label>
                    <select
                      value={nextStatus}
                      onChange={(e) => setNextStatus(e.target.value as PromotionStatus | "")}
                      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <option value="">Select next step</option>
                      {allowedNextStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={updateStatus} disabled={updatingStatus || !nextStatus} className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-700">
                    {updatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                    Update status
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Link href={messagesHref}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message collaborator
                    </Link>
                  </Button>
                  {role === "brand" ? (
                    <Button
                      variant="outline"
                      onClick={markPaid}
                      disabled={markingPaid || promotion.paymentStatus === "paid"}
                      className="w-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {markingPaid ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {promotion.paymentStatus === "paid" ? "Payment recorded" : "Mark as paid"}
                    </Button>
                  ) : null}
                </CardContent>
              </Card>

              {role === "brand" ? (
                <Card className="border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-slate-100">Delivery review</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Review creator proof before you move the collaboration into payment.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                      <p className="font-medium text-slate-900 dark:text-slate-100">Proof URL</p>
                      <p className="mt-1 break-all text-xs text-slate-600 dark:text-slate-300">
                        {promotion.deliverySubmission?.proofUrl || "No proof submitted yet."}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                      <p className="font-medium text-slate-900 dark:text-slate-100">Creator notes</p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {promotion.deliverySubmission?.notes || "No notes submitted yet."}
                      </p>
                    </div>
                    <div>
                      <Label>Review feedback</Label>
                      <Textarea value={reviewFeedback} onChange={(e) => setReviewFeedback(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => reviewDeliveryProof("approved")}
                        disabled={reviewingDelivery || !promotion.deliverySubmission?.submittedAt}
                        className="flex-1 bg-slate-900 text-white hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                      >
                        {reviewingDelivery ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Approve proof
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => reviewDeliveryProof("changes_requested")}
                        disabled={reviewingDelivery || !promotion.deliverySubmission?.submittedAt}
                        className="flex-1 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Request changes
                      </Button>
                    </div>
                    {deliveryReviewStatus ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Current review: {deliveryReviewStatus.replaceAll("_", " ")}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              ) : null}

              <Card className="border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Current metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Reach</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{promotion.performance.reach}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Views</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{promotion.performance.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Engagement</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{promotion.performance.engagement}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
