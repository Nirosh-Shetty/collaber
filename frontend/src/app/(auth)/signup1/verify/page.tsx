"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react"
import Link from "next/link"

export default function VerifyPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [email, setEmail] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const signupData = sessionStorage.getItem("signupData")
    if (!signupData) {
      router.push("/signup1/welcome")
      return
    }

    const { email } = JSON.parse(signupData)
    setEmail(email)
  }, [router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      document.getElementById("otp-5")?.focus()
    }
  }

  const handleVerify = () => {
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      setError("Please enter the complete code")
      return
    }

    setIsVerifying(true)
    setError("")

    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false)
      if (otpValue === "123456") {
        router.push("/dashboard")
      } else {
        setError("Invalid code. Please try again.")
      }
    }, 1500)
  }

  const handleResend = () => {
    setCountdown(60)
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          </div>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center mb-6">
              <Link href="/signup1/details" className="mr-4">
                <ArrowLeftIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Verify Email</h1>
                <p className="text-sm text-gray-400">Almost done!</p>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-300 mb-2">We sent a code to</p>
              <p className="text-white font-medium">{email}</p>
            </div>

            {/* OTP Input */}
            <div className="space-y-6">
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg bg-white/10 border-white/20 text-white"
                  />
                ))}
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <Button
                onClick={handleVerify}
                disabled={isVerifying || otp.join("").length !== 6}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3"
              >
                {isVerifying ? "Verifying..." : "Verify & Continue"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Didn't receive it?{" "}
                  {countdown > 0 ? (
                    <span>Resend in {countdown}s</span>
                  ) : (
                    <button onClick={handleResend} className="text-purple-400 hover:text-purple-300">
                      Resend code
                    </button>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
