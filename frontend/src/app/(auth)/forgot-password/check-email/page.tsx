"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function CheckEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  // Redirect to forgot password page if no email is provided
  useEffect(() => {
    if (!email) {
      router.replace("/forgot-password");
    }
  }, [email, router]);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);
    setError("");

    try {
      // Here you would call your API to resend the reset email
      // await axios.post("/api/auth/forgot-password", { email })

      // Simulate API call
      setTimeout(() => {
        setIsResending(false);
        setCountdown(60); // Reset countdown
      }, 1000);
    } catch (error) {
      setIsResending(false);
      setError("Failed to resend email. Please try again.");
    }
  };

  // Don't render if no email (will redirect)
  if (!email) {
    return null;
  }

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="space-y-6">
        <Link
          href="/forgot-password"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to forgot password
        </Link>

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">Check Your Email</h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              We&apos;ve sent a password reset link to
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium text-foreground">{email}</span>
              <Link
                href="/forgot-password"
                className="text-xs text-purple-400 hover:text-purple-300 underline"
              >
                Wrong email?
              </Link>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            If you don&apos;t see the email in your inbox, please check your
            spam folder.
          </p>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="space-y-3 mt-6">
            <Button onClick={() => router.push("/signin")} className="w-full">
              Return to Sign In
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn&apos;t receive the email?
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
      </div>
    </div>
  );
}
