"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "@/schemas/signIn.schema";
import axios from "axios";

export default function SigninPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signin`,
        {
          identifier: data.identifier,
          password: data.password,
        },
        {
          withCredentials: true, // Include credentials in the request
        }
      );
      router.push("/dashboard");
    } catch (error: any) {
      // Check if error has a response
      if (error.response) {
        // Log the actual message from the backend
        console.error(
          "Error signing in:",
          error.response.data.message || error.response.data
        );
        alert(
          error.response.data.message || "Error signing in. Please try again."
        );
      } else {
        console.error("Error signing in:", error.message);
        alert("Error signing in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground">
            Welcome back! Sign in to your account.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
          {/* Email/Phone/Username */}
          <div className="space-y-2">
            <Label htmlFor="identifier">Email / Phone / Username</Label>

            <Input
              id="identifier"
              placeholder="Enter your email, phone or username"
              required
              {...register("identifier")}
            />
            <p className="text-xs text-muted-foreground">
              Enter the email, phone number, or username associated with your
              account.
            </p>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              {...register("password")}
            />
            <p className="text-xs text-muted-foreground">
              Your password must be at least 8 characters long and include
              letters, numbers, and special characters.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login Options */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              router.push(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 mr-2"
            >
              <path
                fill="#EA4335"
                d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
              />
              <path
                fill="#34A853"
                d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
              />
              <path
                fill="#4A90E2"
                d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
              />
              <path
                fill="#FBBC05"
                d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
              />
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              router.push(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/facebook`
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 mr-2 text-blue-600 fill-current"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </Button>
        </div>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-purple-400 hover:text-purple-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
