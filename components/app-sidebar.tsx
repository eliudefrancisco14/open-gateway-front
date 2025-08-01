"use client"

import { Home, Radio, Video, Settings, BarChart3 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
    id: "overview",
  },
  {
    title: "Novo Stream",
    url: "#",
    icon: Radio,
    id: "ingest",
  },
  {
    title: "Streams Ativos",
    url: "#",
    icon: Video,
    id: "active",
  },
  {
    title: "Vídeos Processados",
    url: "#",
    icon: BarChart3,
    id: "processed",
  },
  {
    title: "Configurações",
    url: "#",
    icon: Settings,
    id: "settings",
  },
]

interface AppSidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export function AppSidebar({ activeSection = "overview", onSectionChange }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Stream Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={activeSection === item.id}>
                    <button onClick={() => onSectionChange?.(item.id)} className="w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
