"use client";

import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch OAuth session data from backend
    const fetchOAuthSession = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-oauth-session`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to retrieve session");
          router.replace(errorData.redirectTo || "/signin");
          return;
        }

        const data = await response.json();
        if (data.user) {
          sessionStorage.setItem("oauthUser", JSON.stringify(data.user));
          setLoading(false);
        } else {
          setError("Invalid session data");
          router.replace("/signin");
        }
      } catch (err) {
        console.error("Error fetching OAuth session:", err);
        setError("Failed to retrieve session");
        router.replace("/signin");
      }
    };

    fetchOAuthSession();
  }, [router]);

  const handleRoleSelect = (role: string) => {
    // Save role to session and proceed to complete signup
    const user = sessionStorage.getItem("oauthUser");
    if (user) {
      const userObj = JSON.parse(user);
      userObj.role = role;
      sessionStorage.setItem("socialUserData", JSON.stringify(userObj));
      sessionStorage.removeItem("oauthUser");
      
      // Call complete-social-auth endpoint
      completeOAuthSignup(userObj, role);
    }
  };

  const completeOAuthSignup = async (userObj: any, role: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/complete-social-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          role,
          fromProvider: userObj.provider,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to complete signup");
        return;
      }

      router.push(`/${role}/dashboard`);
    } catch (err) {
      console.error("Error completing OAuth signup:", err);
      setError("Failed to complete signup");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px]">
              <LoaderIcon className="w-12 h-12 text-purple-400 animate-spin mb-4" />
              <p className="text-gray-300">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px]">
              <p className="text-red-400 text-center mb-4">{error}</p>
              <Button
                onClick={() => router.replace("/signin")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px]">
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
