"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon, CheckIcon, XIcon, LoaderIcon, RefreshCwIcon } from "lucide-react"
import Link from "next/link"

export default function UsernamePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [username, setUsername] = useState("")
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if user came from social login
    const socialData = sessionStorage.getItem("socialUserData")
    if (socialData) {
      const data = JSON.parse(socialData)
      setUserData(data)

      // Generate initial username suggestion from name
      const nameParts = data.name.toLowerCase().split(" ")
      const initialUsername = nameParts.join("")
      setUsername(initialUsername)
    } else {
      // Redirect back if no social data
      router.push("/signup/welcome")
    }
  }, [router])

  // Username validation with debounce
  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus("idle")
      setSuggestions([])
      return
    }

    const timer = setTimeout(() => {
      setUsernameStatus("checking")

      // Simulate API call
      setTimeout(() => {
        const isAvailable =
          username.length > 5 && !["admin", "test", "user", "johndoe", "john"].includes(username.toLowerCase())

        if (isAvailable) {
          setUsernameStatus("available")
          setSuggestions([])
        } else {
          setUsernameStatus("taken")
          generateSuggestions(username)
        }
      }, 800)
    }, 500)

    return () => clearTimeout(timer)
  }, [username, userData])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ""))
  }

  const selectSuggestion = (suggestion: string) => {
    setUsername(suggestion)
    setUsernameStatus("checking")
    setSuggestions([])

    // Immediately check the suggested username
    setTimeout(() => {
      setUsernameStatus("available") // Assume suggestions are always available
    }, 500)
  }

  const generateSuggestions = (baseUsername: string) => {
    const baseName = userData?.name.toLowerCase().replace(/\s+/g, "") || baseUsername
    const currentYear = new Date().getFullYear().toString().slice(-2)

    const suggestionTypes = [
      `${baseName}${Math.floor(10 + Math.random() * 90)}`,
      `${baseName}_${Math.floor(10 + Math.random() * 90)}`,
      `${baseName}${currentYear}`,
      `${baseName}.official`,
      `the_${baseName}`,
      `${baseName}_creator`,
      `${baseName}pro`,
      `${baseName}${Math.floor(100 + Math.random() * 900)}`,
    ]

    // Get 3 random unique suggestions
    const shuffled = suggestionTypes.sort(() => 0.5 - Math.random())
    setSuggestions(shuffled.slice(0, 3))
  }

  const generateNewSuggestions = () => {
    generateSuggestions(username)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (usernameStatus !== "available") return

    setIsSubmitting(true)

    // Complete social signup
    const completeUserData = {
      ...userData,
      username: username,
    }

    sessionStorage.setItem("completeUserData", JSON.stringify(completeUserData))

    // Simulate account creation
    setTimeout(() => {
      // Clear temporary data
      sessionStorage.removeItem("socialUserData")
      sessionStorage.removeItem("selectedRole")

      // Redirect to dashboard
      router.push("/dashboard")
    }, 1500)
  }

  const getRoleLabel = () => {
    switch (userData?.role) {
      case "influencer":
        return "Creator"
      case "brand":
        return "Brand"
      case "manager":
        return "Manager"
      default:
        return ""
    }
  }

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          </div>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center mb-6">
              <Link href="/signup/welcome" className="mr-4">
                <ArrowLeftIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Choose Username</h1>
                <p className="text-sm text-gray-400">Last step!</p>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">
                  {userData.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{userData.name}</p>
                <p className="text-gray-400 text-sm">{userData.email}</p>
                <p className="text-purple-400 text-xs">Signing up as {getRoleLabel()}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="@username"
                    value={username}
                    onChange={handleUsernameChange}
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10 ${
                      usernameStatus === "available"
                        ? "border-green-500"
                        : usernameStatus === "taken"
                          ? "border-red-500"
                          : ""
                    }`}
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameStatus === "checking" && <LoaderIcon className="h-4 w-4 animate-spin text-gray-400" />}
                    {usernameStatus === "available" && <CheckIcon className="h-4 w-4 text-green-500" />}
                    {usernameStatus === "taken" && <XIcon className="h-4 w-4 text-red-500" />}
                  </div>
                </div>

                {usernameStatus === "taken" && suggestions.length > 0 && (
                  <div className="mt-4 p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-red-400 text-sm font-medium">Try these instead:</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={generateNewSuggestions}
                        className="text-gray-400 hover:text-white bg-transparent hover:bg-white/10 p-2 h-8 w-8 min-w-[32px] flex-shrink-0"
                        title="Get new suggestions"
                      >
                        <RefreshCwIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          onClick={() => selectSuggestion(suggestion)}
                          className="w-full bg-white/5 hover:bg-white/10 border-white/20 hover:border-purple-400/50 text-white justify-start p-4 h-12 transition-all duration-200 group touch-manipulation"
                        >
                          <span className="text-purple-400 mr-3 text-base">@</span>
                          <span className="group-hover:text-purple-300 text-base font-medium">{suggestion}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-400">This will be your unique identifier on Collaber</p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || usernameStatus !== "available"}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3"
              >
                {isSubmitting ? "Creating account..." : "Complete Signup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
