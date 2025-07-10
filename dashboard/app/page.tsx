"use client"
import { Home, MessageSquare, Settings, Users, BarChart3, FileText } from "lucide-react"
import { ThemeProvider } from "../components/theme-provider"
import { DashboardLayout } from "../components/dashboard-layout"

const navigationItems = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", icon: Home, url: "#", isActive: true },
      { title: "Messages", icon: MessageSquare, url: "#" },
      { title: "Analytics", icon: BarChart3, url: "#" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", icon: Users, url: "#" },
      { title: "Documents", icon: FileText, url: "#" },
      { title: "Settings", icon: Settings, url: "#" },
    ],
  },
]

export default function Dashboard() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="dashboard-theme">
      <DashboardLayout />
    </ThemeProvider>
  )
}
