"use client"

import { Bell, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "./theme-toggle"

interface TopNavigationProps {
  isNavVisible: boolean
  setIsNavVisible: (visible: boolean) => void
}

export function TopNavigation({ isNavVisible, setIsNavVisible }: TopNavigationProps) {
  return (
    <>
      {/* Collapsible Top Navigation */}
      <div
        className={`transition-all duration-300 ease-in-out ${isNavVisible ? "h-16" : "h-0"} overflow-hidden border-b`}
      >
        <header className="flex h-16 shrink-0 items-center justify-between bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsNavVisible(!isNavVisible)}>
              {isNavVisible ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </header>
      </div>

      {/* Toggle button when navbar is hidden */}
      {!isNavVisible && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2 z-10 bg-transparent"
          onClick={() => setIsNavVisible(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
    </>
  )
}
