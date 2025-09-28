"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { resetPasswordSchema } from "@/schemas/forgot&resetPassword.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) {
      setToken(t);
    } else {
      router.replace("/reset-password/result?status=invalid-token");
    }
  }, [searchParams, router]);

  const {
    control,
    handleSubmit,
    register,
    // getValues,
    // watch,
    trigger,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  // const password = watch("password");
  const password = useWatch({ control, name: "password" });
  // 🔁 Re-validate confirmPassword whenever password changes
  const confirmPassTouchedRef = useRef(false);

  useEffect(() => {
    if (confirmPassTouchedRef.current) {
      trigger("confirmPassword");
    }
  }, [password, trigger]);

  //TODO: try doing this bellow things drieclty in the zod schema instead of using local variablesq if possible
  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  // const isPasswordStrong =
  //   hasMinLength && hasLetter && hasNumber && hasSpecialChar;

  const handlePassSubmit = async (
    data: z.infer<typeof resetPasswordSchema>
  ) => {
    // setError("");

    // Validate password
    // if (!isPasswordStrong) {
    //   setError("Please ensure your password meets all requirements");
    //   return;
    // }

    // // Check if passwords match
    // if (data.password !== data.confirmPassword) {
    //   setError("Passwords do not match");
    //   return;
    // }

    // setIsSubmitting(true);

    // Here you would call your API to reset the password using the token
    // For now, we'll simulate the API call with a timeout
    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`,
        {
          token,
          newPassword: data.password,
        }
      );
      router.replace(`/reset-password/result?status=success`);
      // setIsSubmitted(true);
      setError(""); // Clear any previous errors
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorIn = error?.response?.data?.errorIn;
        if (errorIn && errorIn !== "error") {
          router.replace(`/reset-password/result?status=${errorIn}`);
          return;
        }
        setError(error?.response?.data?.message || "Unexpected server error");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  // If no token is provided, show an error
  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="space-y-6">
        {/* {!isSubmitted ? ( */}
        <>
          <div>
            <h1 className="text-2xl font-bold">Reset Your Password</h1>
            <p className="text-muted-foreground mt-2">
              Create a new password for your account.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handlePassSubmit)}>
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("password")}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {/* TODO: try using the zod for this password strength indicators instead of using local variables for simplicity and to avoid redudancy, if you can  */}
              {/* Password strength indicators */}
              <div className="space-y-2 mt-2">
                <p className="text-xs font-medium">Password must:</p>
                <ul className="space-y-1 text-xs">
                  <li
                    className={`flex items-center ${
                      hasMinLength ? "text-green-500" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full mr-2 ${
                        hasMinLength ? "bg-green-500" : "bg-muted-foreground"
                      }`}
                    ></div>
                    Be at least 8 characters long
                  </li>
                  <li
                    className={`flex items-center ${
                      hasLetter ? "text-green-500" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full mr-2 ${
                        hasLetter ? "bg-green-500" : "bg-muted-foreground"
                      }`}
                    ></div>
                    Contain at least one letter
                  </li>
                  <li
                    className={`flex items-center ${
                      hasNumber ? "text-green-500" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full mr-2 ${
                        hasNumber ? "bg-green-500" : "bg-muted-foreground"
                      }`}
                    ></div>
                    Contain at least one number
                  </li>
                  <li
                    className={`flex items-center ${
                      hasSpecialChar
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full mr-2 ${
                        hasSpecialChar ? "bg-green-500" : "bg-muted-foreground"
                      }`}
                    ></div>
                    Contain at least one special character
                  </li>
                </ul>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...register("confirmPassword")}
                  required
                  onBlur={() => {
                    confirmPassTouchedRef.current = true;
                    trigger("confirmPassword");
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors?.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword?.message}
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting ||
                // error.length > 0 ||
                !!errors.password ||
                !!errors.confirmPassword
              }
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </>
        {/* ) : ( */}
        {/* <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">Password Reset Successful</h2>
            <p className="text-muted-foreground">
              Your password has been successfully reset.
            </p>
            <Button className="mt-4" onClick={() => router.replace("/signin")}>
              Sign In with New Password
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
}
