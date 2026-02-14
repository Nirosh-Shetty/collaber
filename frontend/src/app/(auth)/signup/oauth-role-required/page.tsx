"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";

const roles = [
  { id: "influencer", label: "Creator" },
  { id: "brand", label: "Brand" },
  { id: "manager", label: "Manager" },
];

export default function OauthRoleRequiredPage() {
  const router = useRouter();

  useEffect(() => {
    // If user already has a role (shouldn't happen), redirect to dashboard
    const user = sessionStorage.getItem("oauthUser");
    if (!user) {
      router.replace("/signin");
    }
  }, [router]);

  const handleRoleSelect = (role: string) => {
    // Save role to session and proceed to username step
    const user = sessionStorage.getItem("oauthUser");
    if (user) {
      const userObj = JSON.parse(user);
      userObj.role = role;
      sessionStorage.setItem("socialUserData", JSON.stringify(userObj));
      sessionStorage.removeItem("oauthUser");
      router.push("/signup/username");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            <LoaderIcon className="w-12 h-12 text-purple-400 animate-spin mb-4" />
            <h1 className="text-xl font-bold text-white mb-4">Select Your Role</h1>
            <p className="text-gray-300 text-center mb-6">Choose how you'll use Collaber to finish signing up with Google or Facebook.</p>
            <div className="w-full space-y-3">
              {roles.map((role) => (
                <Button
                  key={role.id}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3"
                  onClick={() => handleRoleSelect(role.id)}
                >
                  {role.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
