"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { StreamIngest } from "@/components/stream-ingest"
import { ActiveStreams } from "@/components/active-streams"
import { ProcessedVideos } from "@/components/processed-videos"
import { SettingsPanel } from "@/components/settings-panel"

export function DashboardContent() {
  const [activeSection, setActiveSection] = useState("overview")

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />
      case "ingest":
        return <StreamIngest />
      case "active":
        return <ActiveStreams />
      case "processed":
        return <ProcessedVideos />
      case "settings":
        return <SettingsPanel />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen">
      <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 overflow-auto p-6">{renderContent()}</div>
    </div>
  )
}
