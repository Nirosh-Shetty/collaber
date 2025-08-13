"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  LoaderIcon,
  UserIcon,
  BuildingIcon,
  BriefcaseIcon,
  RefreshCwIcon,
} from "lucide-react";
import Link from "next/link";

export default function UsernameSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sanitize to allowed username characters and lower-case
  const makeSafe = (s: string) =>
    s.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase();

  const generateUsernameSuggestions = (raw: string): string[] => {
    const base = makeSafe(raw) || "user";
    const words = ["official", "creator", "hq", "studio", "app", "pro"];
    const nums = () => Math.floor(10 + Math.random() * 89); // 2 digits
    const choices = new Set<string>();
    const candidates = [
      `${base}${nums()}`,
      `${base}_${nums()}${Math.floor(Math.random() * 10)}`,
      `${base}.${words[Math.floor(Math.random() * words.length)]}`,
      `the_${base}`,
      `${base}${new Date().getFullYear().toString().slice(2)}`,
    ];
    for (const c of candidates) {
      if (choices.size >= 3) break;
      if (c !== base) choices.add(c);
    }
    // Fallbacks if we didn't get 3 yet
    while (choices.size < 3) {
      choices.add(`${base}${Math.floor(100 + Math.random() * 900)}`);
    }
    return Array.from(choices).slice(0, 3);
  };

  const getRoleLabel = () => {
    switch (selectedRole) {
      case "influencer":
        return "Influencer";
      case "brand":
        return "Brand";
      case "manager":
        return "Manager";
      default:
        return "Unknown";
    }
  };

  const getRoleIcon = () => {
    switch (selectedRole) {
      case "influencer":
        return <UserIcon className="h-5 w-5" />;
      case "brand":
        return <BuildingIcon className="h-5 w-5" />;
      case "manager":
        return <BriefcaseIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  // Get the selected role from sessionStorage
  useEffect(() => {
    const role = sessionStorage.getItem("selectedRole");
    if (!role) {
      // If no role is selected, redirect back to role selection
      router.push("/signup/role");
    } else {
      setSelectedRole(role);
    }
  }, [router]);

  // Debounce username input to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && username.length > 2) {
        setDebouncedUsername(username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // Check username availability when debounced username changes
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (!debouncedUsername || debouncedUsername.length < 3) {
        setUsernameStatus("idle");
        setUsernameSuggestions([]);
        return;
      }

      setUsernameStatus("checking");

      try {
        // This is where you'll implement your checkUsernameUnique function
        // For now, I'll simulate an API call with setTimeout
        setTimeout(() => {
          // Simulate a response - you'll replace this with your actual API call
          const isAvailable = debouncedUsername.length > 5;

          if (isAvailable) {
            setUsernameStatus("available");
            setUsernameSuggestions([]);
          } else {
            setUsernameStatus("taken");
            setUsernameSuggestions(
              generateUsernameSuggestions(debouncedUsername)
            );
          }
        }, 1000);

        // Your actual implementation will look something like this:
        // const response = await checkUsernameUnique(debouncedUsername)
        // if (response.isAvailable) {
        //   setUsernameStatus("available")
        //   setUsernameSuggestions([])
        // } else {
        //   setUsernameStatus("taken")
        //   setUsernameSuggestions(response.suggestions)
        // }
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameStatus("idle");
      }
    };

    checkUsernameAvailability();
  }, [debouncedUsername]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (usernameStatus !== "idle") {
      setUsernameStatus("idle");
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setUsername(suggestion);
    setUsernameStatus("checking");
    setUsernameSuggestions([]);
    // Trigger an immediate re-check without waiting for debounce
    setDebouncedUsername(suggestion);
  };

  const shuffleSuggestions = () => {
    const base = username || debouncedUsername;
    setUsernameSuggestions(generateUsernameSuggestions(base));
  };

  const handleContinue = () => {
    if (
      !selectedRole ||
      usernameStatus === "taken" ||
      usernameStatus === "checking" ||
      !username
    ) {
      return;
    }

    setIsSubmitting(true);

    // Store the username in sessionStorage
    sessionStorage.setItem("selectedUsername", username);

    // Navigate to the basic info page
    router.push("/signup/basic-info");
  };

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="space-y-6">
        <Link
          href="/signup/role"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to role selection
        </Link>

        <div>
          <div className="flex items-center mb-2">
            <div className="bg-purple-600 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2">
              2
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Step 2 of 3
            </p>
          </div>
          <h1 className="text-2xl font-bold">Choose Your Username</h1>
          <p className="text-muted-foreground mt-2">
            Pick a unique username that will identify you on our platform.
          </p>
          {/* Simple role reminder */}
          {selectedRole && (
            <div className="flex items-center p-3 rounded-lg bg-purple-950/20 border border-purple-600 mb-2">
              <div className="h-8 w-8 rounded-full bg-purple-950/50 flex items-center justify-center mr-3">
                {getRoleIcon()}
              </div>
              <p className="text-sm">
                {"You're signing up as "}
                <span className="font-medium">{getRoleLabel()}</span>
                {"."}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="Choose a unique username"
                value={username}
                onChange={handleUsernameChange}
                className={`pr-10 ${
                  usernameStatus === "available"
                    ? "border-green-500 focus-visible:ring-green-500"
                    : usernameStatus === "taken"
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                required
                autoFocus
              />
              {usernameStatus === "idle" && username.length > 2 && (
                <p className="text-xs text-muted-foreground mt-1">
                  If this one&apos;s taken, we’ll suggest a few options for you.
                </p>
              )}
              {usernameStatus === "checking" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <LoaderIcon className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {usernameStatus === "available" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                </div>
              )}
              {usernameStatus === "taken" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <XIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {usernameStatus === "taken" && usernameSuggestions.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-red-400 mb-2">
                  This username is taken. Try one of these:
                </p>
                <div className="flex flex-wrap gap-2">
                  {usernameSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => selectSuggestion(suggestion)}
                      className="bg-gray-800/70 hover:bg-gray-800 border border-gray-700 text-foreground rounded-full"
                      aria-label={`Use suggestion ${suggestion}`}
                      title={`Use ${suggestion}`}
                    >
                      @{suggestion}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={shuffleSuggestions}
                    className="rounded-full border-gray-700 text-muted-foreground hover:text-foreground bg-transparent"
                  >
                    <RefreshCwIcon className="h-4 w-4 mr-1" />
                    Show more
                  </Button>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Your username will be visible to others and can be used to log in.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm">Tips for a good username:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
              <li>Use a combination of letters and numbers</li>
              <li>Avoid using personal information like your full name</li>
              <li>Keep it simple and memorable</li>
              <li>Consider using something related to your interests</li>
            </ul>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full"
            disabled={
              usernameStatus !== "available" || !username || isSubmitting
            }
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                Continue <ArrowRightIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
