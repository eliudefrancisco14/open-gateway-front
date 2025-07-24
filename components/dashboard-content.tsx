"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useStreamContext } from "@/contexts/stream-context"
import { DashboardOverview } from "@/components/dashboard-overview"
import { StreamIngest } from "@/components/stream-ingest"
import { ActiveStreams } from "@/components/active-streams"
import { ProcessedVideos } from "@/components/processed-videos"
import { SettingsPanel } from "@/components/settings-panel"

export function DashboardContent() {
  const { currentView } = useStreamContext()

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
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
    <main className="flex-1 flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4">
          <SidebarTrigger />
          <div className="flex-1">
            <h2 className="text-lg font-semibold capitalize">
              {currentView === "dashboard"
                ? "Visão Geral"
                : currentView === "ingest"
                  ? "Ingestão de Streams"
                  : currentView === "active"
                    ? "Streams Ativos"
                    : currentView === "processed"
                      ? "Vídeos Processados"
                      : "Configurações"}
            </h2>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6">{renderContent()}</div>
    </main>
  )
}
