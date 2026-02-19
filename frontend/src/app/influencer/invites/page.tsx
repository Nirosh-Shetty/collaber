"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarClock, CheckCircle2, Clock3, XCircle } from "lucide-react"

type InviteStatus = "pending" | "accepted" | "rejected" | "expired"

type Invite = {
  id: string
  brandId: string
  brandName: string
  brandHandle: string
  campaignLabel: string
  note: string
  status: InviteStatus
  createdAt: string
}

type InviteResponse = {
  items: Invite[]
}

const statusBadgeStyles: Record<InviteStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  rejected: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300",
  expired: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
}

const formatDate = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export default function InfluencerInvitesPage() {
  const [activeTab, setActiveTab] = useState<InviteStatus | "all">("pending")
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [busyInviteIds, setBusyInviteIds] = useState<string[]>([])

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      setLoading(true)
      setActionMessage(null)
      try {
        const statusQuery = activeTab === "all" ? "all" : activeTab
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/discover/invites?status=${statusQuery}`,
          { credentials: "include", signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error("Failed to load invites")
        }

        const data: InviteResponse = await response.json()
        setInvites(Array.isArray(data.items) ? data.items : [])
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setInvites([])
        setActionMessage("Unable to load invites right now.")
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [activeTab])

  const respond = async (inviteId: string, action: "accepted" | "rejected") => {
    setBusyInviteIds((previous) => [...previous, inviteId])
    setActionMessage(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/discover/invites/${inviteId}/respond`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ action }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update invite")
      }

      setInvites((previous) =>
        previous.map((invite) =>
          invite.id === inviteId ? { ...invite, status: action } : invite
        )
      )
      setActionMessage(action === "accepted" ? "Invite accepted." : "Invite declined.")
    } catch {
      setActionMessage("Could not update invite status.")
    } finally {
      setBusyInviteIds((previous) => previous.filter((id) => id !== inviteId))
    }
  }

  const pendingCount = useMemo(
    () => invites.filter((invite) => invite.status === "pending").length,
    [invites]
  )

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Card className="border-white/60 bg-white/85 shadow-xl shadow-cyan-100/40 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-cyan-900/10">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <Badge className="border-0 bg-cyan-100 text-cyan-900 dark:bg-cyan-500/20 dark:text-cyan-300">
              Creator Invites
            </Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              Campaign Invitations
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Review incoming brand invites and accept only the collaborations that fit your content direction.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">Pending Invites</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{pendingCount}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
        <CardHeader className="space-y-4">
          <div>
            <CardTitle className="text-slate-900 dark:text-slate-100">Inbox</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Accept or decline offers before moving to contract and messaging.
            </CardDescription>
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as InviteStatus | "all")}>
            <TabsList className="grid h-auto w-full grid-cols-5 border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
          </Tabs>
          {actionMessage ? (
            <p className="text-sm text-cyan-700 dark:text-cyan-300">{actionMessage}</p>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-3">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Loading invites...
            </div>
          ) : null}

          {!loading && invites.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              No invites in this status.
            </div>
          ) : null}

          {!loading &&
            invites.map((invite) => {
              const busy = busyInviteIds.includes(invite.id)
              return (
                <Card key={invite.id} className="border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <CardContent className="space-y-4 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{invite.brandName}</h3>
                          <Badge className={`border-0 ${statusBadgeStyles[invite.status]}`}>{invite.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{invite.brandHandle}</p>
                      </div>
                      <div className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {formatDate(invite.createdAt)}
                      </div>
                    </div>

                    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {invite.campaignLabel || "Campaign Invitation"}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">
                        {invite.note || "Brand invited you to collaborate on an upcoming campaign."}
                      </p>
                    </div>

                    {invite.status === "pending" ? (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          disabled={busy}
                          onClick={() => respond(invite.id, "accepted")}
                          className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          disabled={busy}
                          variant="outline"
                          onClick={() => respond(invite.id, "rejected")}
                          className="border-rose-300 bg-white text-rose-700 hover:bg-rose-50 disabled:opacity-60 dark:border-rose-700 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/20"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        {invite.status === "accepted" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : invite.status === "rejected" ? (
                          <XCircle className="h-4 w-4 text-rose-600" />
                        ) : (
                          <Clock3 className="h-4 w-4 text-slate-500" />
                        )}
                        Invite {invite.status}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
        </CardContent>
      </Card>
    </div>
  )
}
