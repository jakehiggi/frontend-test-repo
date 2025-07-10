"use client"

import * as React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { TopNavigation } from "./top-navigation"
import { MainContent } from "./main-content"

export function DashboardLayout() {
  const [isNavVisible, setIsNavVisible] = React.useState(true)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen w-full">
        <TopNavigation isNavVisible={isNavVisible} setIsNavVisible={setIsNavVisible} />
        <MainContent />
      </SidebarInset>
    </SidebarProvider>
  )
}
