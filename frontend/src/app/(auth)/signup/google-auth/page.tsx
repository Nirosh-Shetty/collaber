"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { LoaderIcon } from "lucide-react"

export default function GoogleAuthPage() {
  const router = useRouter()

  useEffect(() => {
    // Get selected role from sessionStorage
    const selectedRole = sessionStorage.getItem("selectedRole")

    // Redirect directly to backend OAuth endpoint with role
    if (selectedRole) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      window.location.href = `${backendUrl}/api/auth/google?role=${selectedRole}`
    } else {
      // If no role, redirect back to welcome
      router.push("/signup/welcome")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            <LoaderIcon className="w-12 h-12 text-purple-400 animate-spin mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Redirecting to Google</h1>
            <p className="text-gray-300 text-center">Please wait while we redirect you to Google for authentication...</p>
      </div>
    </div>
  )
}
