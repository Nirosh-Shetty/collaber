"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Home,
  Users,
  BarChart3,
  MessageSquare,
  FileText,
  TrendingUp,
  Calendar,
  Settings,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react"

const sidebarItems = [
  { name: "Dashboard", href: "/manager/dashboard", icon: Home },
  { name: "Influencers", href: "/manager/influencers", icon: Users },
  { name: "Campaigns", href: "/manager/campaigns", icon: TrendingUp },
  { name: "Analytics", href: "/manager/analytics", icon: BarChart3 },
  { name: "Messages", href: "/manager/messages", icon: MessageSquare },
  { name: "Contracts", href: "/manager/contracts", icon: FileText },
  { name: "Schedule", href: "/manager/schedule", icon: Calendar },
  { name: "Reports", href: "/manager/reports", icon: BarChart3 },
  { name: "Settings", href: "/manager/settings", icon: Settings },
]

function SidebarItem({ item, isCollapsed }: { item: (typeof sidebarItems)[0]; isCollapsed: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  const content = (
    <Link
      href={item.href}
      className={`flex items-center ${isCollapsed ? "justify-center" : "justify-start"} px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
          : "text-gray-300 hover:text-white hover:bg-white/10"
      }`}
    >
      <item.icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
      {!isCollapsed && <span>{item.name}</span>}
    </Link>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.name}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showMobileMore, setShowMobileMore] = useState(false)
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex overflow-hidden">
        {/* Mobile sidebar overlay - Hidden on mobile since sidebar is hidden */}
        {sidebarOpen && (
          <div className="hidden lg:block fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar - Hidden on mobile */}
        <div
          className={`hidden lg:block ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 ${
            sidebarCollapsed ? "w-20" : "w-64"
          } bg-black/20 backdrop-blur-xl border-r border-white/10 transition-all duration-300 lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
            {!sidebarCollapsed && (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="ml-2 text-white font-semibold">ManagerHub</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">M</span>
              </div>
            )}
          </div>

          <nav className="mt-8 px-4 space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem key={item.name} item={item} isCollapsed={sidebarCollapsed} />
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex-shrink-0 sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 lg:px-6 h-16">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center">
                {/* Hamburger menu - Hidden on mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:flex text-gray-400 hover:text-white"
                >
                  {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>

                {/* Mobile logo */}
                <div className="lg:hidden flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span className="ml-2 text-white font-semibold">ManagerHub</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-white" />
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium">Sarah Manager</div>
                        <div className="text-xs text-gray-400">Manager Account</div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
                    <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <User className="mr-2 h-4 w-4" />
                      Manager Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-auto pb-20 sm:pb-28 lg:pb-0">{children}</main>
        </div>

        {/* Mobile Floating Bottom Navigation */}
        <div className="lg:hidden">
          {/* Floating Bottom Nav Bar */}
          <nav className="fixed bottom-4 left-2 right-2 sm:left-4 sm:right-4 bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl z-50 shadow-2xl">
            <div className="flex items-center justify-center py-2 sm:py-4 px-2 sm:px-6">
              <div className="flex items-center justify-between w-full max-w-xs sm:max-w-sm mx-auto gap-1 sm:gap-4">
                {[
                  { name: "Dashboard", href: "/manager/dashboard", icon: Home },
                  { name: "Influencers", href: "/manager/influencers", icon: Users },
                  { name: "Campaigns", href: "/manager/campaigns", icon: TrendingUp },
                  { name: "Messages", href: "/manager/messages", icon: MessageSquare },
                ].map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={`flex flex-col items-center py-2 sm:py-3 px-1 sm:px-2 rounded-xl sm:rounded-2xl min-w-0 flex-1 transition-all duration-200 ${
                        isActive
                          ? "text-purple-300 bg-purple-600/40 shadow-lg border border-purple-500/30"
                          : "text-gray-300 hover:text-white hover:bg-white/20 hover:scale-105"
                      }`}
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1.5" />
                      <span className="text-[10px] sm:text-xs font-medium truncate hidden xs:block sm:block">
                        {item.name}
                      </span>
                    </Link>
                  )
                })}
                <button
                  onClick={() => setShowMobileMore(!showMobileMore)}
                  className="flex flex-col items-center py-2 sm:py-3 px-1 sm:px-2 rounded-xl sm:rounded-2xl text-gray-300 min-w-0 flex-1 hover:text-white hover:bg-white/20 hover:scale-105 transition-all duration-200"
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1.5" />
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
                      { name: "Analytics", href: "/manager/analytics", icon: BarChart3 },
                      { name: "Contracts", href: "/manager/contracts", icon: FileText },
                      { name: "Schedule", href: "/manager/schedule", icon: Calendar },
                      { name: "Reports", href: "/manager/reports", icon: BarChart3 },
                      { name: "Settings", href: "/manager/settings", icon: Settings },
                    ].map((item, index) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={index}
                          href={item.href}
                          className={`flex items-center px-4 py-3 rounded-xl sm:rounded-2xl transition-colors ${
                            isActive
                              ? "bg-purple-600/40 text-purple-300 border border-purple-500/30"
                              : "text-gray-300 hover:bg-white/20 hover:text-white"
                          }`}
                          onClick={() => setShowMobileMore(false)}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
