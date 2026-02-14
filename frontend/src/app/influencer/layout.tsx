"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { usePathname, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  HomeIcon,
  FileTextIcon,
  DollarSignIcon,
  MessageSquareIcon,
  SettingsIcon,
  BellIcon,
  Sparkles,
  MenuIcon,
  HandshakeIcon,
  BarChart3Icon,
} from "lucide-react"
import Link from "next/link"

const sidebarItems = [
  { title: "Dashboard", icon: HomeIcon, url: "/influencer/dashboard" },
  { title: "Collaborations", icon: HandshakeIcon, url: "/influencer/my-collabs" },
  { title: "Analytics", icon: BarChart3Icon, url: "/influencer/analytics" },
  { title: "Contracts", icon: FileTextIcon, url: "/influencer/contracts" },
  { title: "Earnings", icon: DollarSignIcon, url: "/influencer/earnings" },
  { title: "Messages", icon: MessageSquareIcon, url: "/influencer/messages" },
]

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showMobileMore, setShowMobileMore] = useState(false)
  const pathname = usePathname()
  const router = useRouter();
 const handlesignout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signout`,
        {}, // no body for signout
        {
          withCredentials: true, // Important for cookies/session handling
        }
      );

      // If successful, navigate
      router.push("/signin");
    } catch (error) {
      console.error("signout error:", error);
    }
  };
  const SidebarItem = ({ item }: { item: (typeof sidebarItems)[0] }) => {
    const isActive = pathname === item.url
    const content = (
      <Link
        href={item.url}
        className={`flex items-center ${sidebarCollapsed ? "justify-center px-3" : "px-3"} py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
            : "text-gray-300 hover:text-white hover:bg-white/10"
        }`}
      >
        <item.icon className={`h-4 w-4 ${sidebarCollapsed ? "" : "mr-3"}`} />
        {!sidebarCollapsed && <span>{item.title}</span>}
      </Link>
    )

    if (sidebarCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return content
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="flex h-screen">
          {/* Sidebar - Hidden on mobile */}
          <div
            className={`hidden lg:block fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? "w-20" : "w-64"} bg-black/20 backdrop-blur-sm border-r border-white/10 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-center p-4 border-b border-white/10">
              {!sidebarCollapsed ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Collaber</h2>
                    <p className="text-xs text-gray-400">Influencer Dashboard</p>
                  </div>
                </div>
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {sidebarItems.map((item) => (
                <SidebarItem key={item.title} item={item} />
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-white/10">
              {sidebarCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/influencer/settings"
                      className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pathname === "/influencer/settings"
                          ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <SettingsIcon className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  href="/influencer/settings"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/influencer/settings"
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <SettingsIcon className="h-4 w-4 mr-3" />
                  Settings
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Floating Bottom Navigation */}
          <div className="lg:hidden">
            {/* Floating Bottom Nav Bar */}
            <nav className="fixed bottom-4 left-2 right-2 sm:left-4 sm:right-4 bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl z-50 shadow-2xl">
              <div className="flex items-center justify-center py-2 sm:py-4 px-2 sm:px-6">
                <div className="flex items-center justify-between w-full max-w-xs sm:max-w-sm mx-auto gap-1 sm:gap-4">
                  {[
                    { title: "Dashboard", icon: HomeIcon, url: "/influencer/dashboard" },
                    { title: "Collabs", icon: HandshakeIcon, url: "/influencer/my-collabs" },
                    { title: "Analytics", icon: BarChart3Icon, url: "/influencer/analytics" },
                    { title: "Messages", icon: MessageSquareIcon, url: "/influencer/messages" },
                  ].map((item, index) => {
                    const isActive = pathname === item.url
                    return (
                      <Link
                        key={index}
                        href={item.url}
                        className={`flex flex-col items-center py-2 sm:py-3 px-1 sm:px-2 rounded-xl sm:rounded-2xl min-w-0 flex-1 transition-all duration-200 ${
                          isActive
                            ? "text-purple-300 bg-purple-600/40 shadow-lg border border-purple-500/30"
                            : "text-gray-300 hover:text-white hover:bg-white/20 hover:scale-105"
                        }`}
                      >
                        <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1.5" />
                        <span className="text-[10px] sm:text-xs font-medium truncate hidden xs:block sm:block">
                          {item.title}
                        </span>
                      </Link>
                    )
                  })}
                  <button
                    onClick={() => setShowMobileMore(!showMobileMore)}
                    className="flex flex-col items-center py-2 sm:py-3 px-1 sm:px-2 rounded-xl sm:rounded-2xl text-gray-300 min-w-0 flex-1 hover:text-white hover:bg-white/20 hover:scale-105 transition-all duration-200"
                  >
                    <SettingsIcon className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1.5" />
                    <span className="text-[10px] sm:text-xs font-medium hidden xs:block sm:block">More</span>
                  </button>
                </div>
              </div>
            </nav>

            {/* More Panel */}
            {showMobileMore && (
              <>
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMore(false)} />
                <div className="fixed bottom-16 sm:bottom-24 left-2 right-2 sm:left-4 sm:right-4 bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl z-50 max-h-80 overflow-y-auto shadow-2xl">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">More Options</h3>
                    <div className="space-y-2">
                      {[
                        { title: "Contracts", icon: FileTextIcon, url: "/influencer/contracts" },
                        { title: "Earnings", icon: DollarSignIcon, url: "/influencer/earnings" },
                        { title: "Settings", icon: SettingsIcon, url: "/influencer/settings" },
                      ].map((item, index) => {
                        const isActive = pathname === item.url
                        return (
                          <Link
                            key={index}
                            href={item.url}
                            className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                              isActive
                                ? "bg-purple-600/40 text-purple-300 border border-purple-500/30"
                                : "text-gray-300 hover:bg-white/20 hover:text-white"
                            }`}
                            onClick={() => setShowMobileMore(false)}
                          >
                            <item.icon className="h-5 w-5 mr-3" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header - Fixed Position */}
            <header className="flex-shrink-0 sticky top-0 z-40 flex h-16 items-center justify-between px-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                {/* Hamburger menu - Hidden on mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex text-white hover:bg-white/10"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>

                {/* Mobile logo */}
                <div className="lg:hidden flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Collaber</h2>
                </div>
              </div>

              <div className="flex-1" />

              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <BellIcon className="h-5 w-5" />
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10 px-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">JD</span>
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-gray-400">@johndoe</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handlesignout}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Main Content Area - Scrollable */}
            <main className="flex-1 overflow-auto pb-20 sm:pb-28 lg:pb-0">{children}</main>
          </div>

          {/* Mobile sidebar overlay - Hidden on mobile since sidebar is hidden */}
          {sidebarOpen && (
            <div className="hidden lg:block fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
