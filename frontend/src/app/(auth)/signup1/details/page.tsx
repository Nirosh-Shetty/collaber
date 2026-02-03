"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, CheckIcon, XIcon, LoaderIcon, RefreshCwIcon } from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function DetailsPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle")
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get role from sessionStorage
  useEffect(() => {
    const role = sessionStorage.getItem("selectedRole")
    if (!role) {
      router.push("/signup1/welcome")
    } else {
      setSelectedRole(role)
    }
  }, [router])

  // Username validation with debounce and backend check
  const lastCheckedUsername = useRef<string | null>(null)

  const checkUsernameAvailability = useCallback(
    async (username: string) => {
      setUsernameStatus("checking")
      lastCheckedUsername.current = username
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/check-username-unique`,
          { username, email: formData.email }
        )
        setUsernameStatus(res?.data?.availability)
        if (res?.data?.availability === "taken") {
          setUsernameSuggestions(res?.data?.suggestions || [])
        } else {
          setUsernameSuggestions([])
        }
      } catch (error: any) {
        console.error("Failed to check username availability")
        setUsernameStatus("idle")
        setErrors((prev) => ({
          ...prev,
          username: error.response?.data?.message || "Error checking username",
        }))
      }
    },
    [formData.email]
  )

  useEffect(() => {
    if (formData.username.length < 3) {
      setUsernameStatus("idle")
      setUsernameSuggestions([])
      return
    }

    const timer = setTimeout(() => {
      if (lastCheckedUsername.current !== formData.username) {
        checkUsernameAvailability(formData.username)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.username, checkUsernameAvailability])

  const generateUsernameSuggestions = (baseUsername: string) => {
    const base = baseUsername.toLowerCase().replace(/[^a-z0-9]/g, "")
    const currentYear = new Date().getFullYear().toString().slice(-2)

    const suggestionTypes = [
      `${base}${Math.floor(10 + Math.random() * 90)}`,
      `${base}_${Math.floor(10 + Math.random() * 90)}`,
      `${base}${currentYear}`,
      `${base}.official`,
      `the_${base}`,
      `${base}_user`,
      `${base}pro`,
      `${base}${Math.floor(100 + Math.random() * 900)}`,
    ]

    // Get 3 random unique suggestions
    const shuffled = suggestionTypes.sort(() => 0.5 - Math.random())
    setUsernameSuggestions(shuffled.slice(0, 3))
  }

  const generateNewSuggestions = () => {
    generateUsernameSuggestions(formData.username)
  }

  const selectSuggestion = (suggestion: string) => {
    setFormData((prev) => ({ ...prev, username: suggestion }))
    setUsernameStatus("available")
    setUsernameSuggestions([])

    // Clear any existing username errors
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: "" }))
    }
  }

  // Password strength
  const passwordStrength = {
    hasLength: formData.password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
  }
  const isPasswordValid = Object.values(passwordStrength).every(Boolean)

  // Email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)

  const handleInputChange = (field: string, value: string) => {
    if (field === "username") {
      // Clean username input
      value = value.toLowerCase().replace(/[^a-z0-9._]/g, "")
    }

    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!isEmailValid) newErrors.email = "Please enter a valid email"
    if (usernameStatus !== "available") newErrors.username = "Username not available"
    if (!isPasswordValid) newErrors.password = "Password doesn't meet requirements"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Call backend to create user
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`,
        {
          name: formData.email.split("@")[0], // Use email prefix as name, can be updated later
          email: formData.email,
          username: formData.username,
          password: formData.password,
          role: selectedRole,
        },
        {
          withCredentials: true,
        }
      )

      // Store data for verification page
      sessionStorage.setItem(
        "signupData",
        JSON.stringify({
          role: selectedRole,
          ...formData,
        })
      )

      router.push("/signup1/verify")
    } catch (error: any) {
      console.error("Signup error:", error)
      const errorMessage = error.response?.data?.message || "An error occurred during signup"
      const errorIn = error.response?.data?.errorIn

      if (errorIn) {
        setErrors((prev) => ({
          ...prev,
          [errorIn]: errorMessage,
        }))
      } else {
        setErrors((prev) => ({
          ...prev,
          email: errorMessage,
        }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleLabel = () => {
    switch (selectedRole) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center mb-6">
              <Link href="/signup1/welcome" className="mr-4">
                <ArrowLeftIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Create Account</h1>
                {selectedRole && <p className="text-sm text-gray-400">Signing up as {getRoleLabel()}</p>}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${
                    errors.email ? "border-red-500" : isEmailValid && formData.email ? "border-green-500" : ""
                  }`}
                  required
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="@username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10 ${
                      errors.username
                        ? "border-red-500"
                        : usernameStatus === "available"
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

                {usernameStatus === "taken" && usernameSuggestions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-red-400 text-xs mb-2">Try these instead:</p>
                    <div className="flex flex-wrap gap-2">
                      {usernameSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => selectSuggestion(suggestion)}
                          className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-400/50 text-white text-xs px-3 py-1 h-7 rounded-full transition-all duration-200"
                        >
                          @{suggestion}
                        </Button>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={generateNewSuggestions}
                        className="text-gray-400 hover:text-white bg-transparent hover:bg-white/10 p-1 h-7 w-7 min-w-[28px] rounded-full border border-white/20 hover:border-purple-400/50"
                        title="Get new suggestions"
                      >
                        <RefreshCwIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {errors.username && <p className="text-red-400 text-xs">{errors.username}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10 ${
                      errors.password
                        ? "border-red-500"
                        : isPasswordValid && formData.password
                          ? "border-green-500"
                          : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>

                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-1 h-1 rounded-full mr-2 ${passwordStrength.hasLength ? "bg-green-500" : "bg-gray-500"}`}
                      ></div>
                      <span className={passwordStrength.hasLength ? "text-green-400" : "text-gray-400"}>
                        8+ characters
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-1 h-1 rounded-full mr-2 ${passwordStrength.hasLetter ? "bg-green-500" : "bg-gray-500"}`}
                      ></div>
                      <span className={passwordStrength.hasLetter ? "text-green-400" : "text-gray-400"}>
                        Contains letters
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-1 h-1 rounded-full mr-2 ${passwordStrength.hasNumber ? "bg-green-500" : "bg-gray-500"}`}
                      ></div>
                      <span className={passwordStrength.hasNumber ? "text-green-400" : "text-gray-400"}>
                        Contains numbers
                      </span>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !isEmailValid || usernameStatus !== "available" || !isPasswordValid}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
