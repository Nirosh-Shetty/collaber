"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const socialPlatforms = ["Instagram", "TikTok", "YouTube", "Threads"] as const

type SocialLinks = Record<(typeof socialPlatforms)[number], string>

type InfluencerFormState = {
  name: string
  username: string
  email: string
  phone: string
  niche: string
  followers: string
  engagement: string
  summary: string
  highlight: string
  audience: string
  socialLinks: SocialLinks
}

const defaultSocialLinks: SocialLinks = Object.fromEntries(
  socialPlatforms.map((platform) => [platform, ""])
) as SocialLinks

const emptyForm: InfluencerFormState = {
  name: "",
  username: "",
  email: "",
  phone: "",
  niche: "",
  followers: "",
  engagement: "",
  summary: "",
  highlight: "",
  audience: "",
  socialLinks: defaultSocialLinks,
}

export default function InfluencerProfileEditPage() {
  const [form, setForm] = useState<InfluencerFormState>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/me`, {
          credentials: "include",
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Unable to load profile")
        const data = await response.json()
        if (data.role !== "influencer") throw new Error("Expected influencer account")
        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          niche: data.influencerDetails?.niche || "",
          followers: data.influencerDetails?.followers?.toString() || "",
          engagement: data.influencerDetails?.engagement?.toString() || "",
          summary: data.influencerDetails?.summary || "",
          highlight: data.influencerDetails?.highlight || "",
          audience: data.influencerDetails?.audience || "",
          socialLinks: {
            ...defaultSocialLinks,
            ...(data.influencerDetails?.socialLinks || {}),
          },
        }))
      } catch (err) {
        console.error(err)
        setStatus("Unable to load your profile. Try refreshing.")
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  const readyToSave = useMemo(() => Boolean(form.name && form.username && form.niche), [form.name, form.username, form.niche])

  const handleFieldChange = (field: keyof Omit<InfluencerFormState, "socialLinks">, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateSocialLink = (platform: (typeof socialPlatforms)[number], value: string) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }))
  }

  const handleSubmit = async () => {
    if (!readyToSave) return
    setSaving(true)
    setStatus(null)
    try {
      const payload = {
        name: form.name,
        username: form.username,
        email: form.email,
        phone: form.phone,
        influencerDetails: {
          niche: form.niche,
          followers: Number(form.followers) || undefined,
          engagement: Number(form.engagement) || undefined,
          summary: form.summary,
          highlight: form.highlight,
          audience: form.audience,
          socialLinks: form.socialLinks,
        },
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/influencer`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error("Unable to save profile")
      setStatus("Profile saved successfully.")
    } catch (err) {
      console.error(err)
      setStatus("We couldn't save your profile. Try again in a moment.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge className="border-0 bg-emerald-100 text-emerald-900">Creator profile</Badge>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Edit your profile</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Keep your brand story and audience data current so invites feel professional.</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/influencer/profile">Preview profile</Link>
          </Button>
        </div>
      </section>

      <div className="space-y-6">
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Creator identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Full name</p>
                <Input value={form.name} onChange={(event) => handleFieldChange("name", event.target.value)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Handle</p>
                <Input value={form.username} onChange={(event) => handleFieldChange("username", event.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Email</p>
                <Input type="email" value={form.email} onChange={(event) => handleFieldChange("email", event.target.value)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Phone</p>
                <Input value={form.phone} onChange={(event) => handleFieldChange("phone", event.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Profile summary</p>
              <Textarea
                value={form.summary}
                onChange={(event) => handleFieldChange("summary", event.target.value)}
                placeholder="Share what kind of creators you are and how you measure impact."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Audience snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Niche</p>
                <Input value={form.niche} onChange={(event) => handleFieldChange("niche", event.target.value)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Followers</p>
                <Input value={form.followers} onChange={(event) => handleFieldChange("followers", event.target.value)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Engagement (%)</p>
                <Input value={form.engagement} onChange={(event) => handleFieldChange("engagement", event.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Highlight</p>
                <Input
                  value={form.highlight}
                  onChange={(event) => handleFieldChange("highlight", event.target.value)}
                  placeholder="Short elevator pitch (e.g., 'Authentic science-backed skincare soul')."
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Audience profile</p>
                <Input
                  value={form.audience}
                  onChange={(event) => handleFieldChange("audience", event.target.value)}
                  placeholder="Who follows your story? (e.g., 'Lifestyle enthusiasts aged 22-35')."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Social links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialPlatforms.map((platform) => (
              <div key={platform} className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{platform}</p>
                <Input
                  value={form.socialLinks[platform]}
                  onChange={(event) => updateSocialLink(platform, event.target.value)}
                  placeholder={`https://www.${platform.toLowerCase()}.com/your-handle`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button className="bg-slate-900 text-white hover:bg-slate-800" disabled={!readyToSave || saving} onClick={handleSubmit}>
          {saving ? "Saving..." : "Save creator profile"}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/influencer/profile">Cancel</Link>
        </Button>
        <p className="text-sm text-slate-500 dark:text-slate-400">{status}</p>
      </div>
    </div>
  )
}
