"use client"

import { Home, Upload, Radio, Video, Settings, Activity } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useStreamContext } from "@/contexts/stream-context"

const menuItems = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Ingestão de Streams",
    url: "ingest",
    icon: Upload,
  },
  {
    title: "Streams Ativos",
    url: "active",
    icon: Radio,
  },
  {
    title: "Vídeos Processados",
    url: "processed",
    icon: Video,
  },
  {
    title: "Configurações",
    url: "settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { currentView, setCurrentView, stats } = useStreamContext()

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">Stream Manager</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => setCurrentView(item.url)}
                    isActive={currentView === item.url}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.url === "active" && stats.activeStreams > 0 && (
                      <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        {stats.activeStreams}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          <div>
            Slots: {stats.availableSlots}/{stats.maxConcurrentStreams}
          </div>
          <div>WebSocket: {stats.websocketConnections} conexões</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
