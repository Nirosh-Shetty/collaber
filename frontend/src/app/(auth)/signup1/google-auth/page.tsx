"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoaderIcon } from "lucide-react"

export default function GoogleAuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("john.doe@gmail.com")
  const [password, setPassword] = useState("")

  // Simulate auto-redirect after a delay (like real OAuth)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-fill demo credentials
      setEmail("john.doe@gmail.com")
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate Google OAuth process
    setTimeout(() => {
      // Store Google user data
      const googleUserData = {
        email: email,
        name: "John Doe",
        picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        provider: "google",
        role: sessionStorage.getItem("selectedRole") || "influencer",
      }

      sessionStorage.setItem("socialUserData", JSON.stringify(googleUserData))

      // Redirect to username selection
      router.push("/signup1/username")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border border-gray-200 shadow-lg">
          <CardContent className="p-8">
            {/* Google Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign in</h1>
              <p className="text-gray-600">to continue to Collaber</p>
            </div>

            {/* Demo Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> This is a simulated Google login. Use any email to continue.
              </p>
            </div>

            <form onSubmit={handleGoogleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/signup1/welcome")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                ← Back to Collaber
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
