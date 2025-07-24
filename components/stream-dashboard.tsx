"use client"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { StreamProvider } from "@/contexts/stream-context"

export function StreamDashboard() {
  return (
    <StreamProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <DashboardContent />
        </div>
      </SidebarProvider>
    </StreamProvider>
  )
}
