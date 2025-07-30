"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Stream {
  id: string
  url: string
  title?: string
  platform?: string
  status: "PENDING" | "INGESTING" | "COMPLETED" | "STOPPED" | "ERROR"
  currentQuality: string
  startTime: string
  outputFolder: string
  finalMp4Path: string | null
  endTime: string | null
  errorMessage: string | null
}

interface Stats {
  activeStreams: number
  availableSlots: number
  maxConcurrentStreams: number
  totalStreams: number
  websocketConnections: number
}

interface Activity {
  title: string
  description: string
  type: "started" | "completed" | "error" | "stopped"
  time: string
}

interface StreamSettings {
  // Streaming
  rtmpUrl: string
  streamKey: string
  resolution: string
  fps: number
  bitrate: number
  audioQuality: string
  audioVolume: number

  // Notifications
  notifications: {
    push: boolean
    email: boolean
    streamAlerts: boolean
  }
  notificationEmail: string

  // Security
  security: {
    twoFactor: boolean
    privateStream: boolean
    streamPassword: string
  }

  // Appearance
  theme: string
  layout: string
  animations: boolean
  autoRefresh: number

  // Advanced
  apiEndpoint: string
  webhookUrl: string
  debugMode: boolean
  bufferSize: number
}

interface StreamContextType {
  currentView: string
  setCurrentView: (view: string) => void
  streams: Stream[]
  stats: Stats
  recentActivity: Activity[]
  settings: StreamSettings
  addStream: (stream: Stream) => void
  updateStream: (id: string, updates: Partial<Stream>) => void
  stopStream: (id: string) => Promise<void>
  updateSettings: (newSettings: Partial<StreamSettings>) => void
  resetSettings: () => void
}

const defaultSettings: StreamSettings = {
  // Streaming
  rtmpUrl: "rtmp://live.twitch.tv/live/",
  streamKey: "",
  resolution: "1920x1080",
  fps: 30,
  bitrate: 5000,
  audioQuality: "high",
  audioVolume: 80,

  // Notifications
  notifications: {
    push: true,
    email: false,
    streamAlerts: true,
  },
  notificationEmail: "",

  // Security
  security: {
    twoFactor: false,
    privateStream: false,
    streamPassword: "",
  },

  // Appearance
  theme: "system",
  layout: "grid",
  animations: true,
  autoRefresh: 30,

  // Advanced
  apiEndpoint: "https://api.streamdashboard.com/v1",
  webhookUrl: "",
  debugMode: false,
  bufferSize: 256,
}

const StreamContext = createContext<StreamContextType | undefined>(undefined)

export function StreamProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState("dashboard")
  const [streams, setStreams] = useState<Stream[]>([])
  const [settings, setSettings] = useState<StreamSettings>(defaultSettings)
  const [stats, setStats] = useState<Stats>({
    activeStreams: 0,
    availableSlots: 5,
    maxConcurrentStreams: 5,
    totalStreams: 0,
    websocketConnections: 1,
  })
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("streamSettings")
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          setSettings({ ...defaultSettings, ...parsed })
        } catch (error) {
          console.error("Erro ao carregar configurações:", error)
          setSettings(defaultSettings)
        }
      }
    }
  }, [])

  // Salvar configurações no localStorage sempre que mudarem
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("streamSettings", JSON.stringify(settings))
    }
  }, [settings])

  // Simular dados iniciais
  useEffect(() => {
    const initialStreams: Stream[] = [
      {
        id: "stream-demo-1",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "Live Gaming Session - Minecraft Speedrun",
        platform: "youtube.com",
        status: "INGESTING",
        currentQuality: "1080p",
        startTime: new Date(Date.now() - 300000).toISOString(),
        outputFolder: "/streams/stream-demo-1",
        finalMp4Path: null,
        endTime: null,
        errorMessage: null,
      },
      {
        id: "stream-demo-2",
        url: "https://www.twitch.tv/demo",
        title: "Just Chatting - Q&A com a Comunidade",
        platform: "twitch.tv",
        status: "COMPLETED",
        currentQuality: "720p",
        startTime: new Date(Date.now() - 1800000).toISOString(),
        outputFolder: "/streams/stream-demo-2",
        finalMp4Path: "/streams/stream-demo-2/final.mp4",
        endTime: new Date(Date.now() - 600000).toISOString(),
        errorMessage: null,
      },
      {
        id: "stream-demo-3",
        url: "https://www.youtube.com/watch?v=example3",
        title: "Tutorial de Programação - React Avançado",
        platform: "youtube.com",
        status: "PENDING",
        currentQuality: "1080p",
        startTime: new Date().toISOString(),
        outputFolder: "/streams/stream-demo-3",
        finalMp4Path: null,
        endTime: null,
        errorMessage: null,
      },
    ]

    setStreams(initialStreams)

    const initialActivity: Activity[] = [
      {
        title: "Stream Demo 1 iniciado",
        description: "Processamento de vídeo do YouTube - Gaming",
        type: "started",
        time: "5 min atrás",
      },
      {
        title: "Stream Demo 2 concluído",
        description: "Arquivo MP4 disponível para download",
        type: "completed",
        time: "10 min atrás",
      },
      {
        title: "Stream Demo 3 iniciando",
        description: "Preparando processamento do stream",
        type: "started",
        time: "agora",
      },
    ]

    setRecentActivity(initialActivity)
  }, [])

  // Atualizar estatísticas baseado nos streams
  useEffect(() => {
    const activeCount = streams.filter((s) => s.status === "PENDING" || s.status === "INGESTING").length
    setStats((prev) => ({
      ...prev,
      activeStreams: activeCount,
      availableSlots: 5 - activeCount,
      totalStreams: streams.length,
    }))
  }, [streams])

  // Simular atualizações em tempo real via WebSocket
  useEffect(() => {
    const interval = setInterval(() => {
      setStreams((prev) =>
        prev.map((stream) => {
          if (stream.status === "INGESTING" && Math.random() > 0.7) {
            // Simular mudança de qualidade
            const qualities = ["480p", "720p", "1080p", "1440p"]
            const currentIndex = qualities.indexOf(stream.currentQuality)
            const newQuality =
              qualities[Math.max(0, Math.min(qualities.length - 1, currentIndex + (Math.random() > 0.5 ? 1 : -1)))]
            return { ...stream, currentQuality: newQuality }
          }

          // Simular transição de PENDING para INGESTING
          if (stream.status === "PENDING" && Math.random() > 0.8) {
            return { ...stream, status: "INGESTING" as const }
          }

          return stream
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const addStream = (stream: Stream) => {
    const activeCount = streams.filter((s) => s.status === "PENDING" || s.status === "INGESTING").length

    if (activeCount >= 5) {
      console.warn("Limite de streams concorrentes atingido")
      return
    }

    setStreams((prev) => [...prev, stream])

    setRecentActivity((prev) => [
      {
        title: `Stream ${stream.title || stream.id} iniciado`,
        description: `Processamento de ${stream.platform || "stream"}`,
        type: "started",
        time: "agora",
      },
      ...prev.slice(0, 4),
    ])
  }

  const updateStream = (id: string, updates: Partial<Stream>) => {
    setStreams((prev) => prev.map((stream) => (stream.id === id ? { ...stream, ...updates } : stream)))

    if (updates.status) {
      const stream = streams.find((s) => s.id === id)
      if (stream) {
        let activityType: Activity["type"] = "started"
        let description = ""

        switch (updates.status) {
          case "COMPLETED":
            activityType = "completed"
            description = "Stream processado com sucesso"
            break
          case "ERROR":
            activityType = "error"
            description = updates.errorMessage || "Erro no processamento"
            break
          case "STOPPED":
            activityType = "stopped"
            description = "Stream interrompido"
            break
        }

        setRecentActivity((prev) => [
          {
            title: `Stream ${stream.title || id} ${updates.status.toLowerCase()}`,
            description,
            type: activityType,
            time: "agora",
          },
          ...prev.slice(0, 4),
        ])
      }
    }
  }

  const stopStream = async (id: string): Promise<void> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      updateStream(id, {
        status: "STOPPED",
        endTime: new Date().toISOString(),
      })

      setRecentActivity((prev) => [
        {
          title: `Stream ${id} parado`,
          description: "Stream interrompido pelo usuário",
          type: "stopped",
          time: "agora",
        },
        ...prev.slice(0, 4),
      ])
    } catch (error) {
      console.error("Erro ao parar stream:", error)
    }
  }

  const updateSettings = (newSettings: Partial<StreamSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }

      // Merge nested objects properly
      if (newSettings.notifications) {
        updated.notifications = { ...prev.notifications, ...newSettings.notifications }
      }
      if (newSettings.security) {
        updated.security = { ...prev.security, ...newSettings.security }
      }

      return updated
    })
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    if (typeof window !== "undefined") {
      localStorage.removeItem("streamSettings")
    }
  }

  return (
    <StreamContext.Provider
      value={{
        currentView,
        setCurrentView,
        streams,
        stats,
        recentActivity,
        settings,
        addStream,
        updateStream,
        stopStream,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </StreamContext.Provider>
  )
}

export function useStreamContext() {
  const context = useContext(StreamContext)
  if (context === undefined) {
    throw new Error("useStreamContext must be used within a StreamProvider")
  }
  return context
}
