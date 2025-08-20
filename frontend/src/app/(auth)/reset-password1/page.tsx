"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, ShieldCheckIcon } from "lucide-react"

export default function ResetPassword1Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password)
  const isPasswordStrong = hasMinLength && hasLetter && hasNumber && hasSpecialChar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate password
    if (!isPasswordStrong) {
      setError("Please ensure your password meets all requirements")
      return
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would call your API to reset the password using the token
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, password })
      // })

      // For demo purposes, let's simulate different scenarios
      setTimeout(() => {
        setIsSubmitting(false)

        // Simulate different API responses
        const scenarios = ["success", "invalid-token", "expired", "user-not-found", "error", "rate-limited"]
        const randomScenario = scenarios[1] // Change this to test different scenarios

        // Redirect to result page with appropriate status
        router.push(`/reset-password1/result?status=${randomScenario}`)
      }, 1500)
    } catch (error) {
      setIsSubmitting(false)
      // Handle different error types and redirect accordingly
      router.push("/reset-password1/result?status=error")
    }
  }

  // If no token is provided, redirect to invalid token result
  if (!token) {
    router.push("/reset-password1/result?status=invalid-token")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white mb-2">Create New Password</h1>
              <p className="text-sm text-gray-400">Choose a strong password for your account</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password strength indicators */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-1 h-1 rounded-full mr-2 ${hasMinLength ? "bg-green-500" : "bg-gray-500"}`}
                      ></div>
                      <span className={hasMinLength ? "text-green-400" : "text-gray-400"}>8+ characters</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className={`w-1 h-1 rounded-full mr-2 ${hasLetter ? "bg-green-500" : "bg-gray-500"}`}></div>
                      <span className={hasLetter ? "text-green-400" : "text-gray-400"}>Contains letters</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className={`w-1 h-1 rounded-full mr-2 ${hasNumber ? "bg-green-500" : "bg-gray-500"}`}></div>
                      <span className={hasNumber ? "text-green-400" : "text-gray-400"}>Contains numbers</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-1 h-1 rounded-full mr-2 ${hasSpecialChar ? "bg-green-500" : "bg-gray-500"}`}
                      ></div>
                      <span className={hasSpecialChar ? "text-green-400" : "text-gray-400"}>Contains symbols</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-red-400 text-xs">Passwords do not match</p>
                )}
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3"
                disabled={isSubmitting || !isPasswordStrong || password !== confirmPassword}
              >
                {isSubmitting ? "Updating Password..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
