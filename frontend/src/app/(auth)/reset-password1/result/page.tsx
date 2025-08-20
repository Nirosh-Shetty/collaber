"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, RefreshCwIcon } from "lucide-react"

type ResultStatus = "success" | "invalid-token" | "user-not-found" | "error" | "rate-limited"

interface ResultConfig {
  icon: React.ReactNode
  title: string
  description: string
  primaryAction: {
    label: string
    action: () => void
  }
  secondaryAction?: {
    label: string
    action: () => void
  }
  iconColor: string
}

export default function ResetPassword1ResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = (searchParams.get("status") as ResultStatus) || "success"

  const getResultConfig = (status: ResultStatus): ResultConfig => {
    const configs: Record<ResultStatus, ResultConfig> = {
      success: {
        icon: <CheckCircleIcon className="h-12 w-12" />,
        title: "Password Updated!",
        description: "Your password has been successfully updated. You can now sign in with your new password.",
        primaryAction: {
          label: "Sign In",
          action: () => router.push("/signin"),
        },
        iconColor: "text-green-500",
      },
      "invalid-token": {
        icon: <XCircleIcon className="h-12 w-12" />,
        title: "Invalid Reset Link",
        description:
          "This password reset link is invalid, expired, or has already been used. Please request a new one.",
        primaryAction: {
          label: "Request New Link",
          action: () => router.push("/forgot-password1"),
        },
        secondaryAction: {
          label: "Back to Sign In",
          action: () => router.push("/signin"),
        },
        iconColor: "text-red-500",
      },
      "user-not-found": {
        icon: <AlertTriangleIcon className="h-12 w-12" />,
        title: "Account Not Found",
        description: "The account associated with this reset link no longer exists or has been deactivated.",
        primaryAction: {
          label: "Create Account",
          action: () => router.push("/signup1/welcome"),
        },
        secondaryAction: {
          label: "Back to Sign In",
          action: () => router.push("/signin"),
        },
        iconColor: "text-yellow-500",
      },
      error: {
        icon: <AlertTriangleIcon className="h-12 w-12" />,
        title: "Something Went Wrong",
        description: "We encountered an error while updating your password. Please try again or contact support.",
        primaryAction: {
          label: "Try Again",
          action: () => router.back(),
        },
        secondaryAction: {
          label: "Request New Link",
          action: () => router.push("/forgot-password1"),
        },
        iconColor: "text-red-500",
      },
      "rate-limited": {
        icon: <RefreshCwIcon className="h-12 w-12" />,
        title: "Too Many Attempts",
        description: "You've made too many password reset attempts. Please wait a few minutes before trying again.",
        primaryAction: {
          label: "Back to Sign In",
          action: () => router.push("/signin"),
        },
        secondaryAction: {
          label: "Try Again Later",
          action: () => router.push("/forgot-password1"),
        },
        iconColor: "text-orange-500",
      },
    }

    return configs[status]
  }

  const config = getResultConfig(status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className={`${config.iconColor} bg-white/10 rounded-full p-4`}>{config.icon}</div>
              </div>

              <div className="space-y-2">
                <h1 className="text-xl font-bold text-white">{config.title}</h1>
                <p className="text-gray-300 text-sm">{config.description}</p>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3"
                  onClick={config.primaryAction.action}
                >
                  {config.primaryAction.label}
                </Button>

                {config.secondaryAction && (
                  <Button
                    variant="outline"
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                    onClick={config.secondaryAction.action}
                  >
                    {config.secondaryAction.label}
                  </Button>
                )}
              </div>

              {status === "success" && (
                <p className="text-gray-400 text-xs">
                  For security, you'll need to sign in again with your new password
                </p>
              )}

              {status === "invalid-token" && (
                <p className="text-gray-400 text-xs">Reset links expire after 24 hours and can only be used once</p>
              )}

              {status === "rate-limited" && (
                <p className="text-gray-400 text-xs">This helps protect your account from unauthorized access</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
