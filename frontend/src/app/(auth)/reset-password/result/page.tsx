"use client";

import type React from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
} from "lucide-react";

type ResultStatus =
  | "success"
  | "invalid-token"
  | "expired"
  | "user-not-found"
  | "error"
  | "rate-limited";

interface ResultConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryAction: {
    label: string;
    action: () => void;
  };
  secondaryAction?: {
    label: string;
    action: () => void;
  };
  iconColor: string;
}

export default function ResetPasswordResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") as ResultStatus) || "success";

  const getResultConfig = (status: ResultStatus): ResultConfig => {
    const configs: Record<ResultStatus, ResultConfig> = {
      success: {
        icon: <CheckCircleIcon className="h-16 w-16" />,
        title: "Password Reset Successful",
        description:
          "Your password has been successfully reset. You can now sign in with your new password.",
        primaryAction: {
          label: "Sign In with New Password",
          action: () => router.push("/signin"),
        },
        iconColor: "text-green-500",
      },
      "invalid-token": {
        icon: <XCircleIcon className="h-16 w-16" />,
        title: "Invalid Reset Link",
        description:
          "This password reset link is invalid or malformed. Please request a new one.",
        primaryAction: {
          label: "Request New Reset Link",
          action: () => router.push("/forgot-password"),
        },
        secondaryAction: {
          label: "Back to Sign In",
          action: () => router.push("/signin"),
        },
        iconColor: "text-red-500",
      },
      expired: {
        icon: <ClockIcon className="h-16 w-16" />,
        title: "Reset Link Expired",
        description:
          "This password reset link has expired for security reasons. Please request a new one.",
        primaryAction: {
          label: "Request New Reset Link",
          action: () => router.push("/forgot-password"),
        },
        secondaryAction: {
          label: "Back to Sign In",
          action: () => router.push("/signin"),
        },
        iconColor: "text-orange-500",
      },
      "user-not-found": {
        icon: <AlertTriangleIcon className="h-16 w-16" />,
        title: "Account Not Found",
        description:
          "The account associated with this reset link no longer exists or has been deactivated.",
        primaryAction: {
          label: "Create New Account",
          action: () => router.push("/signup/role"),
        },
        secondaryAction: {
          label: "Back to Sign In",
          action: () => router.push("/signin"),
        },
        iconColor: "text-yellow-500",
      },
      error: {
        icon: <AlertTriangleIcon className="h-16 w-16" />,
        title: "Something Went Wrong",
        description:
          "We encountered an error while resetting your password. Please try again or contact support if the problem persists.",
        primaryAction: {
          label: "Try Again",
          action: () => router.back(),
        },
        secondaryAction: {
          label: "Request New Reset Link",
          action: () => router.push("/forgot-password"),
        },
        iconColor: "text-red-500",
      },
      "rate-limited": {
        icon: <RefreshCwIcon className="h-16 w-16" />,
        title: "Too Many Attempts",
        description:
          "You've made too many password reset attempts. Please wait a few minutes before trying again.",
        primaryAction: {
          label: "Back to Sign In",
          action: () => router.push("/signin"),
        },
        secondaryAction: {
          label: "Try Again Later",
          action: () => router.push("/forgot-password"),
        },
        iconColor: "text-orange-500",
      },
    };

    return configs[status];
  };

  const config = getResultConfig(status);

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className={config.iconColor}>{config.icon}</div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{config.title}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>

        <div className="space-y-3">
          <Button className="w-full" onClick={config.primaryAction.action}>
            {config.primaryAction.label}
          </Button>

          {config.secondaryAction && (
            <Button
              variant="outline"
              className="w-full"
              onClick={config.secondaryAction.action}
            >
              {config.secondaryAction.label}
            </Button>
          )}
        </div>

        {status === "success" && (
          <p className="text-xs text-muted-foreground">
            For security reasons, you&apos;ll need to sign in again with your
            new password.
          </p>
        )}

        {(status === "invalid-token" || status === "expired") && (
          <p className="text-xs text-muted-foreground">
            Password reset links expire after 24 hours for security reasons.
          </p>
        )}

        {status === "rate-limited" && (
          <p className="text-xs text-muted-foreground">
            This helps protect your account from unauthorized access attempts.
          </p>
        )}
      </div>
    </div>
  );
}
