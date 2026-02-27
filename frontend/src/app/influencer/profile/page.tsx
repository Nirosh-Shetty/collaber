"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Globe } from "lucide-react"

type InfluencerProfile = {
  id: string
  role: "influencer"
  name: string
  username?: string
  email?: string
  profilePicture?: string
  rating?: number
  totalReviews?: number
  influencerDetails?: {
    niche?: string
    followers?: number
    engagement?: number
    summary?: string
    socialLinks?: Record<string, string>
    highlight?: string
    audience?: string
  }
}

const formatMetric = (value?: number) => {
  if (!value) return "—"
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return `${value}`
}

export default function InfluencerProfilePage() {
  const [profile, setProfile] = useState<InfluencerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/me`, {
          credentials: "include",
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Unable to load profile")
        const data: InfluencerProfile = await response.json()
        if (data.role !== "influencer") throw new Error("Expected an influencer account")
        setProfile(data)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return
        setError(err instanceof Error ? err.message : "Profile unavailable")
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  const socialEntries = useMemo(() => {
    return Object.entries(profile?.influencerDetails?.socialLinks || {}).filter(([, value]) => Boolean(value))
  }, [profile])

  const heroStats = useMemo(() => {
    if (!profile) return []
    return [
      {
        label: "Rating",
        value: profile.rating ? profile.rating.toFixed(1) : "—",
        meta: `${profile.totalReviews ?? 0} reviews`,
      },
      {
        label: "Followers",
        value: formatMetric(profile.influencerDetails?.followers),
        meta: profile.influencerDetails?.engagement
          ? `Engagement ${profile.influencerDetails.engagement.toFixed(1)}%`
          : "Engagement —",
      },
      {
        label: "Channels",
        value: socialEntries.length,
        meta: "Live social links",
      },
    ]
  }, [profile, socialEntries])

  const heroSummary =
    profile?.influencerDetails?.summary ?? "Handbook-grade creator focused on measurable collaborations."

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {loading && (
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="p-6 text-sm text-slate-600">Loading influencer profile…</CardContent>
        </Card>
      )}
      {error && (
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="p-6 text-sm text-rose-600">{error}</CardContent>
        </Card>
      )}

      {profile && (
        <>
          <section className="rounded-[32px] border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-900/70 p-6 shadow-2xl shadow-cyan-500/20 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="h-20 w-20 border border-white/40 bg-white/10 text-xl font-semibold uppercase text-white">
                {profile.profilePicture
                  ? profile.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                  : profile.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-semibold tracking-tight">{profile.name}</h1>
                  <Badge className="border-0 bg-emerald-100/30 text-emerald-100">Influencer</Badge>
                  {profile.influencerDetails?.niche && (
                    <Badge className="border-0 bg-cyan-500/20 text-cyan-100">{profile.influencerDetails.niche}</Badge>
                  )}
                </div>
                <p className="text-sm text-white/70">@{profile.username || "creator"}</p>
                <p className="mt-2 text-sm text-white/80 max-w-2xl leading-relaxed">{heroSummary}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="border border-white/40 text-white hover:bg-white/10">
                  Edit profile
                </Button>
                <Button variant="outline" className="border-white/50 text-white">
                  Share profile
                </Button>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/30 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-widest text-white/60">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-white/60">{stat.meta}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <Card className="border-slate-200 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Audience pulse</CardTitle>
                  <CardDescription>Qualitative notes that help brands understand what you bring.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-700">
                    <p className="text-sm font-semibold text-slate-900">Storyline</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {profile.influencerDetails?.highlight ??
                        "Reliable creator with a focus on authentic shares and measurable outcomes."}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                      <p className="text-xs uppercase tracking-widest text-slate-500">Core audience</p>
                      <p className="text-base font-semibold text-slate-900">
                        {profile.influencerDetails?.audience ?? "Lifestyle-forward, engaged shoppers."}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                      <p className="text-xs uppercase tracking-widest text-slate-500">Primary lane</p>
                      <p className="text-base font-semibold text-slate-900">
                        {profile.influencerDetails?.niche ?? "General entertainment"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Active collaborations</CardTitle>
                  <CardDescription>High-level view of what you continue to deliver.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <p>Open invites</p>
                    <span className="text-base font-semibold text-slate-900">{socialEntries.length + 2}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Milestones pending</p>
                    <span className="text-base font-semibold text-slate-900">{profile.totalReviews ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Payment window</p>
                    <span className="text-base font-semibold text-slate-900">
                      {profile.influencerDetails?.followers ? "15 days" : "TBD"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-slate-200 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Connected channels</CardTitle>
                  <CardDescription>Links your team can open instantly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {socialEntries.length > 0 ? (
                    socialEntries.map(([platform, url]) => (
                      <Link
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        key={platform}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 transition hover:border-cyan-300"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Globe className="h-4 w-4 text-cyan-500" />
                          {platform}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Add your socials to unlock more invites.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                  <CardDescription>Always kept private, shared only when you approve invites.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex items-center justify-between">
                      <p>Email</p>
                      <span className="text-slate-900">{profile.email ?? "Not shared yet"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Handle</p>
                      <span className="text-slate-900">@{profile.username || "creator"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Preferred response</p>
                      <span className="text-slate-900">Within 24 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
