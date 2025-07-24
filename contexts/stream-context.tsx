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

interface StreamContextType {
  currentView: string
  setCurrentView: (view: string) => void
  streams: Stream[]
  stats: Stats
  recentActivity: Activity[]
  addStream: (stream: Stream) => void
  updateStream: (id: string, updates: Partial<Stream>) => void
  stopStream: (id: string) => Promise<void>
}

const StreamContext = createContext<StreamContextType | undefined>(undefined)

export function StreamProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState("dashboard")
  const [streams, setStreams] = useState<Stream[]>([])
  const [stats, setStats] = useState<Stats>({
    activeStreams: 0,
    availableSlots: 5,
    maxConcurrentStreams: 5,
    totalStreams: 0,
    websocketConnections: 1,
  })
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])

  // Simular dados iniciais
  useEffect(() => {
    const initialStreams: Stream[] = [
      {
        id: "stream-demo-1",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "Demo Stream 1",
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
        title: "Demo Stream 2",
        platform: "twitch.tv",
        status: "COMPLETED",
        currentQuality: "720p",
        startTime: new Date(Date.now() - 1800000).toISOString(),
        outputFolder: "/streams/stream-demo-2",
        finalMp4Path: "/streams/stream-demo-2/final.mp4",
        endTime: new Date(Date.now() - 600000).toISOString(),
        errorMessage: null,
      },
    ]

    setStreams(initialStreams)

    const initialActivity: Activity[] = [
      {
        title: "Stream Demo 1 iniciado",
        description: "Processamento de vídeo do YouTube",
        type: "started",
        time: "5 min atrás",
      },
      {
        title: "Stream Demo 2 concluído",
        description: "Arquivo MP4 disponível para download",
        type: "completed",
        time: "10 min atrás",
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
      availableSlots: prev.maxConcurrentStreams - activeCount,
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
            const qualities = ["480p", "720p", "1080p"]
            const newQuality = qualities[Math.floor(Math.random() * qualities.length)]
            return { ...stream, currentQuality: newQuality }
          }
          return stream
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const addStream = (stream: Stream) => {
    setStreams((prev) => [...prev, stream])
    setRecentActivity((prev) => [
      {
        title: `Stream ${stream.id} iniciado`,
        description: `Processamento de ${stream.platform || "stream"}`,
        type: "started",
        time: "agora",
      },
      ...prev.slice(0, 4),
    ])
  }

  const updateStream = (id: string, updates: Partial<Stream>) => {
    setStreams((prev) => prev.map((stream) => (stream.id === id ? { ...stream, ...updates } : stream)))
  }

  const stopStream = async (id: string): Promise<void> => {
    // Simular chamada à API
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
  }

  return (
    <StreamContext.Provider
      value={{
        currentView,
        setCurrentView,
        streams,
        stats,
        recentActivity,
        addStream,
        updateStream,
        stopStream,
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
