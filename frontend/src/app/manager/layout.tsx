"use client"

import type React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
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
  BarChart3,
  Bell,
  Briefcase,
  Calendar,
  ChevronRight,
  FileText,
  Home,
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
  MenuIcon,
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
]

const mobilePrimary = [
  { name: "Dashboard", href: "/manager/dashboard", icon: Home },
  { name: "Influencers", href: "/manager/influencers", icon: Users },
  { name: "Campaigns", href: "/manager/campaigns", icon: TrendingUp },
  { name: "Messages", href: "/manager/messages", icon: MessageSquare },
]

const routeTitle: Record<string, string> = {
  "/manager/dashboard": "Dashboard",
  "/manager/influencers": "Influencers",
  "/manager/campaigns": "Campaigns",
  "/manager/analytics": "Analytics",
  "/manager/messages": "Messages",
  "/manager/contracts": "Contracts",
  "/manager/schedule": "Schedule",
  "/manager/reports": "Reports",
  "/manager/settings": "Settings",
}

function SidebarItem({ item, isCollapsed }: { item: (typeof sidebarItems)[0]; isCollapsed: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  const content = (
    <Link
      href={item.href}
      className={`group flex items-center rounded-xl py-2.5 text-sm font-medium transition-all ${
        isCollapsed ? "justify-center px-2" : "justify-between px-3"
      } ${
        isActive
          ? "border border-cyan-200 bg-cyan-50 text-cyan-900"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      }`}
    >
      <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
        <item.icon className="h-4 w-4" />
        {!isCollapsed && <span>{item.name}</span>}
      </div>
      {!isCollapsed && <ChevronRight className={`h-4 w-4 ${isActive ? "text-cyan-700 dark:text-cyan-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"}`} />}
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

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showMobileMore, setShowMobileMore] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const pageTitle = useMemo(() => routeTitle[pathname] ?? "Manager Workspace", [pathname])

  const handleSignOut = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signout`,
        {},
        {
          withCredentials: true,
        }
      )
      router.push("/signin")
    } catch (error) {
      console.error("signout error:", error)
    }
  }

  return (
    <TooltipProvider>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="pointer-events-none absolute -top-20 left-0 h-72 w-72 rounded-full bg-amber-200/35 blur-3xl dark:bg-cyan-500/15" />
        <div className="pointer-events-none absolute top-16 right-0 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl dark:bg-emerald-500/10" />

        <div className="relative flex min-h-screen">
          <aside
            className={`hidden border-r border-slate-200/70 bg-white/85 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/85 lg:flex lg:flex-col ${
              sidebarCollapsed ? "w-24" : "w-72"
            } transition-all duration-300`}
          >
            <div className="flex items-center gap-3 border-b border-slate-200/70 px-5 py-4 dark:border-slate-800/80">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-sm">
                <Briefcase className="h-5 w-5" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Collaber</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manager Workspace</p>
                </div>
              )}
            </div>

            <nav className="flex-1 space-y-2 px-4 py-5">
              {sidebarItems.map((item) => (
                <SidebarItem key={item.name} item={item} isCollapsed={sidebarCollapsed} />
              ))}
            </nav>

            <div className="border-t border-slate-200/70 p-4 dark:border-slate-800/80">
              <Link
                href="/manager/settings"
                className={`flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors ${
                  sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"
                } ${
                  pathname === "/manager/settings"
                    ? "border border-cyan-200 bg-cyan-50 text-cyan-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <Settings className="h-4 w-4" />
                {!sidebarCollapsed && <span>Settings</span>}
              </Link>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/80 sm:px-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:inline-flex"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>

                <div className="lg:hidden flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Collaber</p>
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manager</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{pageTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                  <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-cyan-300 text-sm font-semibold text-slate-800">
                        SM
                      </div>
                      <div className="hidden text-left md:block">
                        <p className="text-sm font-medium text-slate-900">Sarah Manager</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manager Account</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Manager Profile</DropdownMenuItem>
                    <DropdownMenuItem>Account Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            <main className="min-h-0 flex-1 overflow-auto pb-24 lg:pb-0">{children}</main>
          </div>
        </div>

        <div className="lg:hidden">
          <nav className="fixed bottom-4 left-2 right-2 z-50 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:left-4 sm:right-4">
            <div className="mx-auto flex w-full max-w-md items-center justify-between gap-1">
              {mobilePrimary.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex flex-1 flex-col items-center rounded-xl px-1 py-2 transition-colors ${
                      isActive ? "bg-cyan-100 text-cyan-900 dark:bg-cyan-500/20 dark:text-cyan-300" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="mt-1 text-[10px] font-medium">{item.name}</span>
                  </Link>
                )
              })}
              <button
                onClick={() => setShowMobileMore(!showMobileMore)}
                className="flex flex-1 flex-col items-center rounded-xl px-1 py-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <Settings className="h-4 w-4" />
                <span className="mt-1 text-[10px] font-medium">More</span>
              </button>
            </div>
          </nav>

          {showMobileMore && (
            <>
              <div className="fixed inset-0 z-40 bg-slate-900/40" onClick={() => setShowMobileMore(false)} />
              <div className="fixed bottom-20 left-2 right-2 z-50 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 sm:bottom-24 sm:left-4 sm:right-4">
                <div className="space-y-1">
                  {[...sidebarItems.slice(4), { name: "Settings", href: "/manager/settings", icon: Settings }].map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setShowMobileMore(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                          isActive ? "bg-cyan-100 text-cyan-900 dark:bg-cyan-500/20 dark:text-cyan-300" : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
