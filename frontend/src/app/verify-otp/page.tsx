"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  // Get email from session storage on component mount
  useEffect(() => {
    const signupData = sessionStorage.getItem("signupData");
    if (!signupData) {
      router.replace("/signup");
      return;
    }
    const { expiresAt } = JSON.parse(signupData);
    if (Date.now() > expiresAt) {
      sessionStorage.removeItem("signupData");
      router.replace("/signup");
    }
    const { email } = JSON.parse(signupData);
    setEmail(email);
    // Start countdown immediately when page loads
    setCountdown(60);
  }, [router]);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Auto-focus next input if current input is filled
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle key down for backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      // Focus the last input
      const lastInput = document.getElementById(`otp-5`);
      if (lastInput) {
        lastInput.focus();
      }
    }
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    // Here you would call your API to resend the OTP
    // For now, we'll just reset the countdown
    setCountdown(60);
    setError("");
  };

  // Handle verify OTP
  const handleVerifyOtp = () => {
    const otpValue = otp.join("");

    // Check if OTP is complete
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits of the OTP");
      return;
    }

    setIsVerifying(true);

    // Here you would call your API to verify the OTP
    // For now, we'll simulate a verification process
    setTimeout(() => {
      setIsVerifying(false);

      // For demo purposes, let's say OTP "123456" is valid
      if (otpValue === "123456") {
        // Navigate to success page or dashboard
        router.push("/dashboard");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    }, 1500);
  };

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="space-y-6">
        <Link
          href="/signup"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to signup
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Verify Your Account</h1>
          <p className="text-muted-foreground mt-2">
            We've sent a 6-digit verification code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-0">Enter Verification Code</Label>
            <div className="flex gap-2 justify-between">
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
                  className="w-12 h-12 text-center text-lg"
                />
              ))}
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code sent to your email or phone number.
            </p>
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={handleVerifyOtp}
            disabled={isVerifying || otp.join("").length !== 6}
          >
            {isVerifying ? "Verifying..." : "Verify Account"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              {countdown > 0 ? (
                <span>Resend in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Resend Code
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
