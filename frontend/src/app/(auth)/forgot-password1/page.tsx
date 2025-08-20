"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon, MailIcon } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema } from "@/schemas/forgotPassword.schema"
import type { z } from "zod"

export default function ForgotPassword1Page() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  // Handle forgot password submission
  const handleForgotPasswordSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setError("")
    if (!data.email) {
      setError("Please enter your email address")
      return
    }
    setIsSubmitting(true)

    try {
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)

        // Store email in sessionStorage for the result page
        sessionStorage.setItem("resetEmail", data.email)

        // Redirect to result page
        router.push("/forgot-password1/result")
      }, 1500)
    } catch (error) {
      setIsSubmitting(false)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred. Please try again later.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center mb-6">
              <Link href="/signin1" className="mr-4">
                <ArrowLeftIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Reset Password</h1>
                <p className="text-sm text-gray-400">We'll send you a reset link</p>
              </div>
            </div>

            {/* Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MailIcon className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-300 text-sm">Enter your email and we'll send you a link to reset your password</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(handleForgotPasswordSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />

                {errors?.email?.message ? (
                  <p className="text-red-400 text-xs">{errors.email.message}</p>
                ) : error ? (
                  <p className="text-red-400 text-xs">{error}</p>
                ) : (
                  <p className="text-gray-400 text-xs">Enter the email associated with your account</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
