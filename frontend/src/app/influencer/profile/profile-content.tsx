"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Globe } from "lucide-react"

type PlatformKey = "youtube" | "instagram"

type YoutubeConnectionEntry = {
  platform: "youtube"
  profile?: {
    channelId?: string
    title?: string
    customUrl?: string
    avatarUrl?: string
  }
  metrics?: {
    subscribers?: number
    totalViews?: number
    videoCount?: number
    commentCount?: number
    hiddenSubscriberCount?: boolean
  }
  lastSynced?: string
}

type InstagramConnectionEntry = {
  platform: "instagram"
  profile?: {
    instagramId?: string
    username?: string
    profilePicture?: string
    pageId?: string
    pageName?: string
  }
  metrics?: {
    followers?: number
    mediaCount?: number
    reach?: number
    impressions?: number
  }
  lastSynced?: string
}

type GenericSocialConnectionEntry = {
  platform: string
  profile?: Record<string, unknown>
  metrics?: Record<string, unknown>
  lastSynced?: string
}

type SocialConnectionEntry =
  | YoutubeConnectionEntry
  | InstagramConnectionEntry
  | GenericSocialConnectionEntry

interface InfluencerProfile {
  _id: string
  user: string
  bio?: string
  profileProof?: string
  category?: string[]
  socialConnections?: Record<string, SocialConnectionEntry>
  pastClients?: string[]
  averageEngagementRate?: number
  hireable?: boolean
  createdAt: string
  updatedAt: string
}

interface User {
  _id: string
  username: string
  email: string
  name: string
  profilePhotoUrl?: string
  bio?: string
  role: string
}

function getMetricsLines(entry: SocialConnectionEntry): string[] {
  const lines: string[] = []

  if (entry.platform === "youtube") {
    if (entry.metrics?.subscribers)
      lines.push(`${(entry.metrics.subscribers as number / 1000).toFixed(1)}K Subscribers`)
    if (entry.metrics?.videoCount) lines.push(`${entry.metrics.videoCount} Videos`)
    if (entry.metrics?.totalViews)
      lines.push(`${((entry.metrics.totalViews as number) / 1000000).toFixed(1)}M Views`)
    if (entry.profile?.customUrl)
      lines.push(`youtube.com/${(entry.profile.customUrl as string).replace("http://www.youtube.com/", "")}`)
  } else if (entry.platform === "instagram") {
    if (entry.metrics?.followers) lines.push(`${(entry.metrics.followers as number / 1000).toFixed(1)}K Followers`)
    if (entry.metrics?.mediaCount) lines.push(`${entry.metrics.mediaCount} Posts`)
    if (entry.profile?.username)
      lines.push(`@${entry.profile.username as string}`)
  }

  if (entry.lastSynced) {
    const lastSync = new Date(entry.lastSynced)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60))
    if (diffMinutes < 60) lines.push(`Synced ${diffMinutes}min ago`)
    else if (diffMinutes < 1440) lines.push(`Synced ${Math.floor(diffMinutes / 60)}h ago`)
    else lines.push(`Synced ${Math.floor(diffMinutes / 1440)}d ago`)
  }

  return lines
}

function getProfileLines(entry: SocialConnectionEntry): string[] {
  const lines: string[] = []
  if (entry.profile?.username) lines.push(`Handle: ${entry.profile.username}`)
  if (entry.profile?.pageName) lines.push(`Page: ${entry.profile.pageName}`)
  return lines
}

export function ProfileContent() {
  const [profile, setProfile] = useState<InfluencerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const connectedPlatform = searchParams?.get("connected") ?? null
  const [socialConnections, setSocialConnections] = useState<Record<string, SocialConnectionEntry>>({})

  const loadConnections = async (signal: AbortSignal) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/social/connections`, {
        credentials: "include",
        cache: "no-store",
        signal,
      })
      if (!response.ok) return
      const data = await response.json()
      setSocialConnections(data.connections || {})
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return
      console.error("Failed to refresh social connections", err)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/influencer/profile`, {
          credentials: "include",
          signal: controller.signal,
        })

        if (!response.ok) {
          setError("Failed to load profile")
          return
        }

        const data = await response.json()
        setProfile(data.profile)
        setSocialConnections(data.profile?.socialConnections || {})
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return
        console.error("Error fetching profile:", err)
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (connectedPlatform) {
      const timer = setTimeout(() => {
        const controller = new AbortController()
        loadConnections(controller.signal)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [connectedPlatform])

  const handleDisconnectPlatform = async (platform: PlatformKey) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/social/${platform}/disconnect`,
        {
          method: "POST",
          credentials: "include",
        }
      )

      if (response.ok) {
        setSocialConnections((prev) => ({
          ...prev,
          [platform]: undefined,
        }))
      }
    } catch (err) {
      console.error("Failed to disconnect platform", err)
    }
  }

  const handleConnectPlatform = async (platform: PlatformKey) => {
    setConnectError(null)
    setConnecting(platform)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/social/${platform}/auth-url`,
        {
          method: "GET",
          credentials: "include",
        }
      )

      if (!response.ok) {
        setConnectError("Failed to authorize")
        setConnecting(null)
        return
      }

      const data = await response.json()

      if (data.authUrl) {
        window.location.href = data.authUrl
      } else {
        setConnectError("No authorization URL provided")
        setConnecting(null)
      }
    } catch (err) {
      console.error("Error connecting platform:", err)
      setConnectError("Failed to connect. Please try again.")
      setConnecting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-500">Loading profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="border-b pb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              {/* User profile photo would go here */}
              <AvatarFallback>IN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Influencer Profile</h1>
              <p className="text-muted-foreground mt-2">Manage your social media connections</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Platforms Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Connected Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* YouTube Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Youtube className="h-5 w-5" />
                  YouTube
                </CardTitle>
                {socialConnections.youtube && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                )}
              </div>
              <CardDescription>Connect your YouTube channel</CardDescription>
            </CardHeader>
            <CardContent>
              {socialConnections.youtube ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={socialConnections.youtube.profile?.avatarUrl as string} />
                      <AvatarFallback>YT</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {(socialConnections.youtube.profile?.title as string) || "YouTube Channel"}
                      </p>
                      {getProfileLines(socialConnections.youtube).map((line, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  {getMetricsLines(socialConnections.youtube).length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t">
                      {getMetricsLines(socialConnections.youtube).map((metric, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="text-muted-foreground">{metric}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectPlatform("youtube")}
                      className="w-full"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect your YouTube channel to showcase your content and reach
                  </p>
                  <Button
                    onClick={() => handleConnectPlatform("youtube")}
                    disabled={connecting !== null}
                    className="w-full"
                  >
                    {connecting === "youtube" ? "Connecting..." : "Connect YouTube"}
                  </Button>
                </div>
              )}
              {connectError && connecting === "youtube" && (
                <p className="text-xs text-red-500 mt-2">{connectError}</p>
              )}
            </CardContent>
          </Card>

          {/* Instagram Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="h-5 w-5" />
                  Instagram
                </CardTitle>
                {socialConnections.instagram && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                )}
              </div>
              <CardDescription>Connect your Instagram account</CardDescription>
            </CardHeader>
            <CardContent>
              {socialConnections.instagram ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={socialConnections.instagram.profile?.profilePicture as string} />
                      <AvatarFallback>IG</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {(socialConnections.instagram.profile?.username as string) || "Instagram Account"}
                      </p>
                      {getProfileLines(socialConnections.instagram).map((line, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  {getMetricsLines(socialConnections.instagram).length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t">
                      {getMetricsLines(socialConnections.instagram).map((metric, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="text-muted-foreground">{metric}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectPlatform("instagram")}
                      className="w-full"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect your Instagram account to showcase your audience
                  </p>
                  <Button
                    onClick={() => handleConnectPlatform("instagram")}
                    disabled={connecting !== null}
                    className="w-full"
                  >
                    {connecting === "instagram" ? "Connecting..." : "Connect Instagram"}
                  </Button>
                </div>
              )}
              {connectError && connecting === "instagram" && (
                <p className="text-xs text-red-500 mt-2">{connectError}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bio Section */}
      {profile?.bio && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Bio</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">{profile.bio}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Icon components
function Youtube(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  )
}

function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <circle cx="17.5" cy="6.5" r="1.5"></circle>
    </svg>
  )
}
