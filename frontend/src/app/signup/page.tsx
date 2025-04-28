"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserIcon, BuildingIcon, BriefcaseIcon } from "lucide-react";
import Link from "next/link";
import { signUpSchema } from "@/schemas/signUp.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<
    z.infer<typeof signUpSchema>
  >({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const role = watch("role");

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(false);
  const [otpCooldownTime, setOtpCooldownTime] = useState(60); // 1 minute cooldown
  const handleRoleSelect = (role: "influencer" | "brand" | "manager") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const handleGetOtp = () => {
    setIsOtpSent(true);
    setOtpCooldown(true);
    setOtpCooldownTime(60);

    const intervalId = setInterval(() => {
      setOtpCooldownTime((prev) => {
        if (prev <= 1) {
          setOtpCooldown(false);
          clearInterval(intervalId); // Stop the interval
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // In a real app, you would trigger OTP sending here
  };

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-muted-foreground">
            Select your role to get started.
          </p>
        </div>

        {/* Role Selection */}
        <div>
          <Label className="text-base mb-2 block">Select Role</Label>
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${
                selectedRole === "influencer"
                  ? "border-purple-600 bg-purple-950/20"
                  : "border-gray-700 bg-gray-900"
              }`}
              onClick={() => handleRoleSelect("influencer")}
            >
              <UserIcon className="h-6 w-6 mb-2" />
              <span className="text-sm">Influencer</span>
            </div>
            <div
              className={`flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${
                selectedRole === "brand"
                  ? "border-purple-600 bg-purple-950/20"
                  : "border-gray-700 bg-gray-900"
              }`}
              onClick={() => handleRoleSelect("brand")}
            >
              <BuildingIcon className="h-6 w-6 mb-2" />
              <span className="text-sm">Brand</span>
            </div>
            <div
              className={`flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${
                selectedRole === "manager"
                  ? "border-purple-600 bg-purple-950/20"
                  : "border-gray-700 bg-gray-900"
              }`}
              onClick={() => handleRoleSelect("manager")}
            >
              <BriefcaseIcon className="h-6 w-6 mb-2" />
              <span className="text-sm">Manager</span>
            </div>
          </div>
        </div>

        <form className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              disabled={!selectedRole}
              {...register("name")}
            />
            <p className="text-xs text-muted-foreground">
              Please enter your legal name as it appears on official documents.
            </p>
          </div>

          {/* Email or Phone */}
          <div className="space-y-2">
            <Label htmlFor="emailOrPhone">Email or Phone</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              disabled={!selectedRole}
              {...register("email")}
            />
            <p className="text-xs text-muted-foreground">
              We'll use this to verify your account and for important
              notifications.
            </p>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Choose a unique username"
              disabled={!selectedRole}
              {...register("username")}
            />
            <p className="text-xs text-muted-foreground">
              This will be your public identity on our platform.
            </p>
          </div>

          {/* OTP Field */}
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <div className="flex gap-2">
              <Input
                id="otp"
                placeholder="Enter OTP"
                disabled={!selectedRole || !isOtpSent}
                {...register("otp")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGetOtp}
                disabled={!selectedRole || otpCooldown}
                className="whitespace-nowrap"
              >
                Get OTP
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {isOtpSent
                ? "OTP sent! Check your email or phone for the verification code."
                : "Click 'Get OTP' to receive a verification code."}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedRole || !isOtpSent}
          >
            Create Account
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
            disabled={!selectedRole}
            className="w-full"
            onClick={() => {
              router.push(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google?role=${role}`
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
            disabled={!selectedRole}
            className="w-full"
            onClick={() => {
              router.push(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/facebook?role=${role}`
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

        <p className="text-xs text-center text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-purple-400 hover:text-purple-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
