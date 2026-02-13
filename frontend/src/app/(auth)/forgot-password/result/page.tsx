"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";

export default function ForgotPassword1ResultPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Get email from sessionStorage on component mount
  useEffect(() => {
    const resetEmail = sessionStorage.getItem("resetEmail");
    if (!resetEmail) {
      // If no email found, redirect back to forgot password
      router.push("/forgot-password");
      return;
    }
    setEmail(resetEmail);
  }, [router]);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    setIsResending(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/resend-password-reset-email`,
        { email },
        { withCredentials: true }
      );

      setCountdown(120); // Start 2 minute countdown after successful resend
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const retryAfter = error.response?.data?.retryAfter;
        if (retryAfter) {
          setCountdown(retryAfter);
        }
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleEditEmail = () => {
    // Clear the stored email and go back to form
    sessionStorage.removeItem("resetEmail");
    router.push("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircleIcon className="h-8 w-8 text-white" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Check Your Email
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">
                    We've sent a password reset link to
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-medium text-white">{email}</span>
                    <button
                      type="button"
                      onClick={handleEditEmail}
                      className="text-xs text-purple-400 hover:text-purple-300 underline"
                    >
                      Wrong email?
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-4">
                  If you don't see the email, check your spam folder
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/signin")}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3"
                >
                  Back to Sign In
                </Button>

                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">
                    Didn't receive the email?
                  </p>
                  {countdown > 0 ? (
                    <p className="text-gray-400 text-sm">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
