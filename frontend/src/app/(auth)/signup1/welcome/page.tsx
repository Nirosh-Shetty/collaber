"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserIcon, BuildingIcon, BriefcaseIcon, ArrowRightIcon } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const roles = [
    {
      id: "influencer",
      title: "Creator",
      subtitle: "Share & earn",
      icon: UserIcon,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      id: "brand",
      title: "Brand",
      subtitle: "Find creators",
      icon: BuildingIcon,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      id: "manager",
      title: "Manager",
      subtitle: "Manage talent",
      icon: BriefcaseIcon,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/30",
    },
  ]

  const handleSocialSignup = (provider: string) => {
    if (!selectedRole) return

    // Store role for after social auth
    sessionStorage.setItem("selectedRole", selectedRole)

    // Redirect to social auth page
    if (provider === "google") {
      router.push("/signup1/google-auth")
    } else if (provider === "facebook") {
      // For demo, just redirect to Google auth
      router.push("/signup1/google-auth")
    }
  }

  const handleLocalSignup = () => {
    if (!selectedRole) return

    setIsSubmitting(true)
    sessionStorage.setItem("selectedRole", selectedRole)
    router.push("/signup1/details")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Join Collaber</h1>
              <p className="text-gray-300">Choose how you'll use our platform</p>
            </div>

            {/* Role Selection */}
            <div className="space-y-3 mb-8">
              {roles.map((role) => {
                const Icon = role.icon
                const isSelected = selectedRole === role.id

                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? `bg-gradient-to-r ${role.bgGradient} ${role.borderColor} scale-[1.02]`
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${role.gradient} flex items-center justify-center mr-4`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-semibold">{role.title}</h3>
                        <p className="text-gray-400 text-sm">{role.subtitle}</p>
                      </div>
                      {isSelected && (
                        <div className="ml-auto">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={() => handleSocialSignup("google")}
                disabled={!selectedRole}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
                Continue with Google
              </Button>

              <Button
                onClick={() => handleSocialSignup("facebook")}
                disabled={!selectedRole}
                className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium py-3"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gray-900 px-4 text-sm text-gray-400">or</span>
              </div>
            </div>

            {/* Email Signup */}
            <Button
              onClick={handleLocalSignup}
              disabled={!selectedRole || isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 group"
            >
              {isSubmitting ? (
                "Getting started..."
              ) : (
                <>
                  Continue with Email
                  <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 mt-6">
              Already have an account?{" "}
              <Link href="/signin" className="text-purple-400 hover:text-purple-300">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
