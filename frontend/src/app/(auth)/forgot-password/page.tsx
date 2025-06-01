"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/schemas/forgotPassword.schema";
import type { z } from "zod";
import axios from "axios";

export default function ForgotPasswordPage() {
  const router = useRouter();
  // const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    setIsResending(true);
    setError("");

    try {
      // Here you would call your API to resend the reset email
      // await axios.post("/api/auth/forgot-password", { email })

      // Simulate API call
      setTimeout(() => {
        setIsResending(false);
        setCountdown(60); // Start 60 second countdown
      }, 1000);
    } catch (error) {
      setIsResending(false);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again later."
      );
    }
  };

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const email = getValues("email");

  // Start countdown when email is first sent
  const handleForgotPasswordSubmit = async (
    data: z.infer<typeof forgotPasswordSchema>
  ) => {
    setError("");
    if (!data.email) {
      setError("Please enter your email address");
      return;
    }
    setIsSubmitting(true);

    try {
      await axios.post("/api/auth/forgot-password", {
        email: data.email,
      });
      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="space-y-6">
        <Link
          href="/signin"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>

        {!isSubmitted ? (
          <>
            <div>
              <h1 className="text-2xl font-bold">Forgot Password</h1>
              <p className="text-muted-foreground mt-2">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleForgotPasswordSubmit)}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email")}
                  required
                />

                {errors?.email?.message ? (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                ) : error ? (
                  <p className="text-sm text-red-500">{error}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Enter the email address associated with your account.
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Reset Password"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">Check Your Email</h2>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                We've sent a password reset link to
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-medium text-foreground">{email}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setError("");
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 underline"
                >
                  Wrong email?
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              If you don't see the email in your inbox, please check your spam
              folder.
            </p>

            <div className="space-y-3 mt-6">
              <Button onClick={() => router.push("/signin")} className="w-full">
                Return to Sign In
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the email?
                </p>
                {countdown > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend in {countdown}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-sm text-purple-400 hover:text-purple-300 underline disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend reset link"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
