"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ManagerSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Card className="border-white/60 bg-white/85 shadow-lg shadow-cyan-100/40 backdrop-blur-sm">
        <CardContent className="p-5 sm:p-6">
          <Badge className="border-0 bg-cyan-100 text-cyan-900 hover:bg-cyan-100">Account Settings</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Manager Settings</h1>
          <p className="mt-1 text-sm text-slate-600">Configure profile, communication defaults, and approval controls.</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Profile</CardTitle>
          <CardDescription className="text-slate-600">Details shown to brands and managed creators.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="managerName">Full Name</Label>
            <Input id="managerName" defaultValue="Sarah Manager" className="border-slate-300" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Agency / Company</Label>
            <Input id="company" defaultValue="Collaber Management" className="border-slate-300" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">Work Email</Label>
            <Input id="email" defaultValue="sarah@collabermgmt.com" className="border-slate-300" />
          </div>
          <Button className="sm:col-span-2 bg-slate-900 text-white hover:bg-slate-800">Save changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}