"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  UserIcon,
  BuildingIcon,
  BriefcaseIcon,
  ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function SelectRolePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const fromProvider = searchParams.get("fromProvider");

  const heading = fromProvider
    ? "Complete Your Sign Up"
    : "Create Your Account";

  const subText = fromProvider
    ? "Before we set up your profile, tell us how you’ll use the platform."
    : "First, let's understand how you'll be using our platform. Select the role that best describes you.";
  const step = fromProvider ? "Step 1 of 1" : "Step 1 of 2";

  const handleContinue = async () => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    if (fromProvider) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/complete-google-signup`,
          {
            fromProvider,
            role: selectedRole,
          },
          {
            withCredentials: true, // Important for cookies/session handling
          }
        );
        router.replace("/dashboard");
      } catch (error: any) {
        console.error("failed to signup", error.message);
        //TODO: can give a popup saying the error and click ok to redirect
        if (error.response.data.status === 500)
          //TODO: give a popup istaed of this
          router.replace(`/signup/select-role?fromProvider=${fromProvider}`);
        router.replace("/signup/select-role");
      }
    }

    // Store the selected role in sessionStorage
    // sessionStorage.setItem("selectedRole", selectedRole);

    // Navigate to the basic info page
    else router.push(`/signup/basic-info?role=${selectedRole}`);
    setIsSubmitting(false);
  };

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="space-y-8">
        <div>
          <div className="flex items-center mb-2">
            <div className="bg-purple-600 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2">
              1
            </div>
            <p className="text-sm font-medium text-muted-foreground">{step}</p>
          </div>
          <h1 className="text-2xl font-bold">{heading}</h1>
          <p className="text-muted-foreground mt-2">{subText}</p>
        </div>

        <div className="space-y-4">
          <Label className="text-base">Select your role</Label>

          <div className="grid gap-4">
            {/* Influencer Role */}
            <div
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                selectedRole === "influencer"
                  ? "border-purple-600 bg-purple-950/20"
                  : "border-gray-700 bg-gray-900"
              }`}
              onClick={() => handleRoleSelect("influencer")}
            >
              <div className="h-12 w-12 rounded-full bg-purple-950/30 flex items-center justify-center mr-4">
                <UserIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Influencer</h3>
                <p className="text-sm text-muted-foreground">
                  I create content and want to partner with brands
                </p>
              </div>
            </div>

            {/* Brand Role */}
            <div
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                selectedRole === "brand"
                  ? "border-purple-600 bg-purple-950/20"
                  : "border-gray-700 bg-gray-900"
              }`}
              onClick={() => handleRoleSelect("brand")}
            >
              <div className="h-12 w-12 rounded-full bg-purple-950/30 flex items-center justify-center mr-4">
                <BuildingIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Brand</h3>
                <p className="text-sm text-muted-foreground">
                  I represent a company looking for influencers
                </p>
              </div>
            </div>

            {/* Manager Role */}
            <div
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                selectedRole === "manager"
                  ? "border-purple-600 bg-purple-950/20"
                  : "border-gray-700 bg-gray-900"
              }`}
              onClick={() => handleRoleSelect("manager")}
            >
              <div className="h-12 w-12 rounded-full bg-purple-950/30 flex items-center justify-center mr-4">
                <BriefcaseIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Manager</h3>
                <p className="text-sm text-muted-foreground">
                  I manage influencers and their brand partnerships
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full"
          disabled={!selectedRole || isSubmitting}
        >
          {isSubmitting ? (
            "Processing..."
          ) : (
            <>
              Continue <ArrowRightIcon className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-center text-sm">
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
