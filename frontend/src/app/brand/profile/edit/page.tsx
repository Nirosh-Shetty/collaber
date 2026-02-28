"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type BrandFormState = {
  name: string
  username: string
  email: string
  phone: string
  companyName: string
  website: string
  brandCategory: string
  collaborations: string
  activeCampaigns: string
  pointsOfContact: string
  summary: string
}

const emptyForm: BrandFormState = {
  name: "",
  username: "",
  email: "",
  phone: "",
  companyName: "",
  website: "",
  brandCategory: "",
  collaborations: "",
  activeCampaigns: "",
  pointsOfContact: "",
  summary: "",
}

export default function BrandProfileEditPage() {
  const [form, setForm] = useState<BrandFormState>(emptyForm)
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
        if (data.role !== "brand") throw new Error("Expected brand account")
        setForm({
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          companyName: data.brandDetails?.companyName || "",
          website: data.brandDetails?.website || "",
          brandCategory: data.brandDetails?.brandCategory || "",
          collaborations: data.brandDetails?.collaborations?.toString() || "",
          activeCampaigns: data.brandDetails?.activeCampaigns?.toString() || "",
          pointsOfContact: data.brandDetails?.pointsOfContact?.toString() || "",
          summary: data.brandDetails?.summary || "",
        })
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

  const readyToSave = Boolean(form.name && form.companyName && form.website)

  const handleFieldChange = (field: keyof BrandFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
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
        brandDetails: {
          companyName: form.companyName,
          website: form.website,
          brandCategory: form.brandCategory,
          collaborations: Number(form.collaborations) || undefined,
          activeCampaigns: Number(form.activeCampaigns) || undefined,
          pointsOfContact: Number(form.pointsOfContact) || undefined,
          summary: form.summary,
        },
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/brand`, {
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
      setStatus("We couldn't save your brand profile. Try again in a moment.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge className="border-0 bg-cyan-100 text-cyan-900">Brand profile</Badge>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Fine-tune how creators discover you</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Define your story, contact data, and operational KPIs in a single, professional form.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/brand/profile">Preview profile</Link>
          </Button>
        </div>
      </section>

      <div className="space-y-6">
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Brand essentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Primary contact</p>
                <Input value={form.name} onChange={(event) => handleFieldChange("name", event.target.value)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Handle/username</p>
                <Input value={form.username} onChange={(event) => handleFieldChange("username", event.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Email</p>
                <Input type="email" value={form.email} onChange={(event) => handleFieldChange("email", event.target.value)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Phone</p>
                <Input value={form.phone} onChange={(event) => handleFieldChange("phone", event.target.value)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Company</p>
                <Input value={form.companyName} onChange={(event) => handleFieldChange("companyName", event.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Website</p>
                <Input value={form.website} onChange={(event) => handleFieldChange("website", event.target.value)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Category</p>
                <Input value={form.brandCategory} onChange={(event) => handleFieldChange("brandCategory", event.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Operational snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Collaborations</p>
                <Input value={form.collaborations} onChange={(event) => handleFieldChange("collaborations", event.target.value)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Active campaigns</p>
                <Input value={form.activeCampaigns} onChange={(event) => handleFieldChange("activeCampaigns", event.target.value)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Points of contact</p>
                <Input value={form.pointsOfContact} onChange={(event) => handleFieldChange("pointsOfContact", event.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Brand story</p>
              <Textarea
                value={form.summary}
                onChange={(event) => handleFieldChange("summary", event.target.value)}
                placeholder="Share the tone, mission, or goals you want creators to know."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button className="bg-slate-900 text-white hover:bg-slate-800" disabled={!readyToSave || saving} onClick={handleSubmit}>
          {saving ? "Saving..." : "Save brand profile"}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/brand/profile">Cancel</Link>
        </Button>
        <p className="text-sm text-slate-500 dark:text-slate-400">{status}</p>
      </div>
    </div>
  )
}
