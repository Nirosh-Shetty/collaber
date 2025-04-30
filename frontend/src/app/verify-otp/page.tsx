"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifyOtpSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });
  useEffect(() => {
    const signupData = sessionStorage.getItem("signupData");
    if (!signupData) {
      router.replace("/signup");
      return;
    }
    const { reservationExpiresAt, email } = JSON.parse(signupData);
    console.log(JSON.parse(signupData));
    if (Date.now() > reservationExpiresAt) {
      sessionStorage.removeItem("signupData");
      router.replace("/signup");
      return;
    }
    setEmail(email);

    const lastOtpSentAt = sessionStorage.getItem("lastOtpSentAt");
    const now = Date.now();

    if (lastOtpSentAt) {
      const timeElapsed = Math.floor((now - parseInt(lastOtpSentAt)) / 1000);
      const remaining = 60 - timeElapsed;
      setCountdown(remaining > 0 ? remaining : 0);
    } else {
      // setTimeout(() => {
      requestOtp();
      // }, 2000);
      // send if no OTP was sent earlier
    }
  }, []);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const requestOtp = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/request-otp`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCountdown(60);
      sessionStorage.setItem("lastOtpSentAt", Date.now().toString());
      setOtp(["", "", "", "", "", ""]);
      // console.log(data);
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.redirectTo) {
        sessionStorage.removeItem("signupData");
        sessionStorage.removeItem("lastOtpSentAt");
        router.replace(error.response.data.redirectTo);
      }
      if (error.response?.data?.lastOtpSentAt) {
        const timeElapsed = Math.floor(
          (Date.now() - new Date(error.response.data.lastOtpSentAt).getTime()) /
            1000
        );
        const remaining = 60 - timeElapsed;
        setCountdown(remaining > 0 ? remaining : 0);
        sessionStorage.setItem(
          "lastOtpSentAt",
          error.response.data.lastOtpSentAt?.toString()
        );
      }
      setError(error.response?.data?.message || "failed to send OTP");
      if (error.response?.status === 500) setCountdown(0);
    }
  };
  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
    setValue("otp", newOtp.join("")); // Update the form value
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

  // Handle verify OTP
  const handleSubmitOtp = async (data: z.infer<typeof verifySchema>) => {
    setIsVerifying(true);
    setError("");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-otp`,
        {
          email,
          otp: data.otp,
        }
      );
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.redirectTo) {
        sessionStorage.removeItem("signupData");
        sessionStorage.removeItem("lastOtpSentAt");
        router.replace(error.response.data.redirectTo);
      } else setError(error.response?.data?.message || "verification failed");
    } finally {
      setIsVerifying(false);
    }
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
          <form onSubmit={handleSubmit(handleSubmitOtp)}>
            <div className="space-y-2">
              <Label htmlFor="otp-0">Enter Verification Code</Label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    autoFocus={index === 0}
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg"
                  />
                ))}
              </div>
              {errors?.otp?.message ? (
                <p className="text-sm text-red-500 mt-2">
                  {errors.otp.message}
                </p>
              ) : error ? (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              ) : (
                ""
              )}
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit code sent to your email or phone number.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              // onClick={handleVerifyOtp}
              disabled={isVerifying || otp.join("").length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify Account"}
            </Button>
          </form>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              {countdown > 0 ? (
                <span>Resend in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={requestOtp}
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
