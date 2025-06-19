"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon } from "lucide-react";
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
  // const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  // const [isResending, setIsResending] = useState(false);
  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const {
    handleSubmit,
    register,
    // getValues,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  // const email = getValues("email");

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
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`,
        {
          email: data.email,
        }
      );
      // setIsSubmitted(true);
      router.replace(
        `/forgot-password/check-email?email=${encodeURIComponent(data.email)}`
      );
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        setError(error.response?.data?.message);
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
      </div>
    </div>
  );
}
