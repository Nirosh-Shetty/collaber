"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    // Here you would call your API to send a password reset link
    // For now, we'll simulate the API call with a timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
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
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the email address associated with your account.
                </p>
                {error && <p className="text-sm text-red-500">{error}</p>}
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
            <p className="text-muted-foreground">
              We've sent a password reset link to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              If you don't see the email in your inbox, please check your spam
              folder.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/signin")}
            >
              Return to Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
