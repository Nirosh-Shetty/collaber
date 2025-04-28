"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  UserIcon,
  BuildingIcon,
  BriefcaseIcon,
  CheckIcon,
  XIcon,
  LoaderIcon,
} from "lucide-react";
import Link from "next/link";
import { signUpSchema } from "@/schemas/signUp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const roles = [
  { label: "Influencer", value: "influencer", Icon: UserIcon },
  { label: "Brand", value: "brand", Icon: BuildingIcon },
  { label: "Manager", value: "manager", Icon: BriefcaseIcon },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    // defaultValues: {
    //   name: "",
    //   email: "",
    //   username: "",
    // role: undefined,
    // },
  });

  const selectedRole = watch("role");
  const username = watch("username");

  // Debounce Username Check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!username || username.length < 3) {
        setUsernameStatus("idle");
        setUsernameSuggestions([]);
        return;
      }

      checkUsernameAvailability(username);
    }, 1000);

    return () => clearTimeout(timer);
  }, [username]);

  async function checkUsernameAvailability(username: string) {
    setUsernameStatus("checking");

    try {
      // simulate server request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const isAvailable = username.length > 5; // Mock condition
      if (isAvailable) {
        setUsernameStatus("available");
        setUsernameSuggestions([]);
      } else {
        setUsernameStatus("taken");
        setUsernameSuggestions([`${username}123`, `${username}_user`]);
      }
    } catch (err) {
      console.error("Failed to check username availability");
      setUsernameStatus("idle");
    }
  }

  function selectSuggestion(suggestion: string) {
    setValue("username", suggestion);
    setUsernameStatus("available");
    setUsernameSuggestions([]);
  }

  const onSubmit = (data: z.infer<typeof signUpSchema>) => {
    console.log("Submitting form with data:", data);
    sessionStorage.setItem(
      "signupData",
      JSON.stringify({
        role: selectedRole,
        name: data.name,
        email: data.email,
        username: data.username,
      })
    );
    router.push("/verify-otp");
  };

  return (
    <div className="container max-w-md mx-auto py-10 px-4 space-y-6">
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
          {roles.map(({ label, value, Icon }) => (
            <div
              key={value}
              onClick={() => setValue("role", value)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all
                ${
                  selectedRole === value
                    ? "border-purple-600 bg-purple-950/20"
                    : "border-gray-700 bg-gray-900"
                }`}
            >
              <Icon className="h-6 w-6 mb-2" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            className={
              errors?.name && "border-red-500 focus-visible:ring-red-500"
            }
            placeholder="Enter your full name"
            disabled={!selectedRole}
            {...register("name")}
            required
          />
          {errors?.name ? (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Please enter your legal name as it appears on official documents.
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Enter your email"
            disabled={!selectedRole}
            {...register("email")}
            required
            className={
              errors?.email && "border-red-500 focus-visible:ring-red-500"
            }
            // type="email"
          />
          {errors?.email ? (
            <p className="text-xs text-red-400">{errors?.email?.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              We'll use this to verify your account and for important
              notifications.
            </p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <Input
              id="username"
              placeholder="Choose a unique username"
              disabled={!selectedRole}
              {...register("username")}
              className={`pr-10 ${
                usernameStatus === "available" && !errors?.username
                  ? "border-green-500 focus-visible:ring-green-500"
                  : usernameStatus === "taken"
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              required
            />
            {usernameStatus === "checking" && (
              <LoaderIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
            )}
            {usernameStatus === "available" && (
              <CheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
            )}
            {usernameStatus === "taken" && (
              <XIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
            )}
          </div>
          {errors?.username ? (
            <p className="text-xs text-red-400">{errors?.username?.message}</p>
          ) : usernameStatus === "available" ? (
            <p className="text-xs text-green-500">Username is available!</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Choose a unique username. It can be changed later.
            </p>
          )}
          {usernameStatus === "taken" && usernameSuggestions.length > 0 && (
            <div className="mt-2">
              {/* <p className="text-xs text-red-400 mb-2">
                This username is already taken. Try one:
              </p> */}
              <div className="flex flex-wrap gap-2">
                {usernameSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="px-3 py-1 text-sm bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* <p className="text-xs text-muted-foreground">
            This will be your public identity on our platform.
          </p> */}
        </div>
        {/* Password */}
        <div className="space-y-2">
          {/* <div className="flex items-center justify-between"> */}
          <Label htmlFor="password">Password</Label>
          {/* </div> */}
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            disabled={!selectedRole}
            {...register("password")}
            className={
              errors?.password && "border-red-500 focus-visible:ring-red-500"
            }
          />
          {errors?.password ? (
            <p className="text-xs text-red-400">{errors?.password?.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Your password must be at least 8 characters long and include
              letters, numbers, and special characters.
            </p>
          )}
        </div>
        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={
            !selectedRole ||
            usernameStatus === "taken" ||
            usernameStatus === "checking" ||
            isSubmitting
          }
        >
          Continue to Verification
        </Button>
      </form>

      {/* Separator */}
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

      {/* Socials */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          disabled={!selectedRole}
          className="w-full"
          onClick={() =>
            router.push(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google?role=${selectedRole}`
            )
          }
        >
          {/* Google Logo */}
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
          onClick={() =>
            router.push(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/facebook?role=${selectedRole}`
            )
          }
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
        <Link href="/signin" className="text-purple-400 hover:text-purple-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
