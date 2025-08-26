"use client"
import { useEffect } from "react"

import { useRouter } from "next/navigation"

export default function InfluencerPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/influencer/dashboard")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
