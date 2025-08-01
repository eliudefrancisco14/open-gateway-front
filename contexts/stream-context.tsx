"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { apiClient, type ApiStream, type ApiStats, type ApiActivity } from "@/lib/api"

export interface Stream {
  id: string
  title: string
  description: string
  thumbnail: string
  status: "live" | "starting" | "ending" | "offline"
  viewers: number
  likes: number
  duration: string
  category: string
  platform: "youtube" | "twitch" | "facebook" | "custom"
  resolution: string
  bitrate: string
  fps: number
  streamer: {
    name: string
    avatar: string
  }
}

export interface StreamSettings {
  streaming: {
    quality: string
    bitrate: number
    fps: number
    autoStart: boolean
    recordingEnabled: boolean
  }
  notifications: {
    emailAlerts: boolean
    pushNotifications: boolean
    streamStarted: boolean
    viewerMilestones: boolean
    chatMentions: boolean
  }
  security: {
    twoFactorAuth: boolean
    ipWhitelist: boolean
    streamKey: string
    moderationLevel: string
  }
  appearance: {
    theme: string
    language: string
    timezone: string
    compactMode: boolean
  }
  advanced: {
    apiAccess: boolean
    webhookUrl: string
    customDomain: string
    analyticsRetention: number
  }
}

export interface StreamStats {
  totalStreams: number
  activeStreams: number
  totalViewers: number
  totalWatchTime: string
  bandwidth: string
  uptime: string
}

interface StreamContextType {
  streams: ApiStream[]
  stats: ApiStats
  recentActivity: ApiActivity[]
  settings: StreamSettings
  isLoading: boolean
  error: string | null
  addStream: (data: { url: string; customId?: string }) => Promise<void>
  stopStream: (id: string) => Promise<void>
  refreshStreams: () => Promise<void>
  refreshStats: () => Promise<void>
  updateSettings: (newSettings: Partial<StreamSettings>) => void
  resetSettings: () => void
  testConnection: () => Promise<boolean>
}

const defaultSettings: StreamSettings = {
  streaming: {
    quality: "1080p",
    bitrate: 6000,
    fps: 60,
    autoStart: false,
    recordingEnabled: true,
  },
  notifications: {
    emailAlerts: true,
    pushNotifications: true,
    streamStarted: true,
    viewerMilestones: true,
    chatMentions: true,
  },
  security: {
    twoFactorAuth: false,
    ipWhitelist: false,
    streamKey: "sk_live_" + Math.random().toString(36).substr(2, 9),
    moderationLevel: "medium",
  },
  appearance: {
    theme: "system",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    compactMode: false,
  },
  advanced: {
    apiAccess: false,
    webhookUrl: "",
    customDomain: "",
    analyticsRetention: 30,
  },
}

const mockStreams: ApiStream[] = [
  {
    id: "1",
    title: "Desenvolvimento Web ao Vivo",
    description: "Criando uma aplicação React do zero com Next.js e TypeScript",
    thumbnail: "/placeholder.svg?height=180&width=320",
    status: "live",
    viewers: 1247,
    likes: 89,
    duration: "2:34:12",
    category: "Tecnologia",
    platform: "youtube",
    resolution: "1920x1080",
    bitrate: "6000 kbps",
    fps: 60,
    streamer: {
      name: "DevMaster",
      avatar: "/placeholder-user.jpg",
    },
  },
  {
    id: "2",
    title: "Gaming Session - Cyberpunk 2077",
    description: "Explorando Night City e completando missões secundárias",
    thumbnail: "/placeholder.svg?height=180&width=320",
    status: "live",
    viewers: 3421,
    likes: 234,
    duration: "4:12:45",
    category: "Gaming",
    platform: "twitch",
    resolution: "2560x1440",
    bitrate: "8000 kbps",
    fps: 60,
    streamer: {
      name: "GamerPro",
      avatar: "/placeholder-user.jpg",
    },
  },
  {
    id: "3",
    title: "Aula de Culinária - Pratos Italianos",
    description: "Aprendendo a fazer pasta caseira e molhos tradicionais",
    thumbnail: "/placeholder.svg?height=180&width=320",
    status: "starting",
    viewers: 567,
    likes: 45,
    duration: "0:05:23",
    category: "Culinária",
    platform: "facebook",
    resolution: "1920x1080",
    bitrate: "4000 kbps",
    fps: 30,
    streamer: {
      name: "ChefMaria",
      avatar: "/placeholder-user.jpg",
    },
  },
  {
    id: "4",
    title: "Música ao Vivo - Covers Acústicos",
    description: "Tocando sucessos nacionais e internacionais no violão",
    thumbnail: "/placeholder.svg?height=180&width=320",
    status: "live",
    viewers: 892,
    likes: 156,
    duration: "1:45:30",
    category: "Música",
    platform: "custom",
    resolution: "1920x1080",
    bitrate: "5000 kbps",
    fps: 30,
    streamer: {
      name: "MúsicoJoão",
      avatar: "/placeholder-user.jpg",
    },
  },
]

const StreamContext = createContext<StreamContextType | undefined>(undefined)

export function StreamProvider({ children }: { children: ReactNode }) {
  const [streams, setStreams] = useState<ApiStream[]>(mockStreams)
  const [stats, setStats] = useState<ApiStats>({
    activeStreams: 0,
    maxConcurrentStreams: 0,
    availableSlots: 0,
    totalStreams: 0,
    websocketConnections: 0,
  })
  const [recentActivity, setRecentActivity] = useState<ApiActivity[]>([])
  const [settings, setSettings] = useState<StreamSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("streamSettings")
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings((prev) => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }, [])

  // Fetch streams from API
  const refreshStreams = useCallback(async () => {
    try {
      setError(null)
      const apiStreams = await apiClient.getStreams()
      setStreams(apiStreams)
    } catch (error) {
      console.error("Error fetching streams:", error)
      setError("Failed to fetch streams")
    }
  }, [])

  // Fetch stats from API
  const refreshStats = useCallback(async () => {
    try {
      setError(null)
      const apiStats = await apiClient.getStats()
      setStats(apiStats)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setError("Failed to fetch stats")
    }
  }, [])

  // Fetch recent activity from API
  const refreshActivity = useCallback(async () => {
    try {
      const apiActivity = await apiClient.getActivity()
      setRecentActivity(apiActivity)
    } catch (error) {
      console.error("Error fetching activity:", error)
      // Don't set error for activity as it might not be implemented
    }
  }, [])

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([refreshStreams(), refreshStats(), refreshActivity()])
      } catch (error) {
        console.error("Error loading initial data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [refreshStreams, refreshStats, refreshActivity])

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStreams()
      refreshStats()
      refreshActivity()
    }, 30000)

    return () => clearInterval(interval)
  }, [refreshStreams, refreshStats, refreshActivity])

  // Add new stream
  const addStream = useCallback(
    async (data: { url: string; customId?: string }) => {
      try {
        setError(null)
        await apiClient.startStream(data.url, data.customId)
        // Refresh streams to get the new one
        await refreshStreams()
        await refreshStats()
      } catch (error) {
        console.error("Error starting stream:", error)
        setError("Failed to start stream")
        throw error
      }
    },
    [refreshStreams, refreshStats],
  )

  // Stop stream
  const stopStream = useCallback(
    async (id: string) => {
      try {
        setError(null)
        await apiClient.stopStream(id)
        // Refresh streams to get updated status
        await refreshStreams()
        await refreshStats()
      } catch (error) {
        console.error("Error stopping stream:", error)
        setError("Failed to stop stream")
        throw error
      }
    },
    [refreshStreams, refreshStats],
  )

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<StreamSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev }

      // Deep merge for nested objects
      Object.keys(newSettings).forEach((key) => {
        if (typeof newSettings[key as keyof StreamSettings] === "object") {
          updated[key as keyof StreamSettings] = {
            ...updated[key as keyof StreamSettings],
            ...newSettings[key as keyof StreamSettings],
          } as any
        } else {
          ;(updated as any)[key] = (newSettings as any)[key]
        }
      })

      // Save to localStorage
      try {
        localStorage.setItem("streamSettings", JSON.stringify(updated))
      } catch (error) {
        console.error("Error saving settings:", error)
      }

      return updated
    })
  }, [])

  // Reset settings
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
    try {
      localStorage.removeItem("streamSettings")
    } catch (error) {
      console.error("Error clearing settings:", error)
    }
  }, [])

  // Test connection
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      await apiClient.healthCheck()
      return true
    } catch (error) {
      console.error("Connection test failed:", error)
      return false
    }
  }, [])

  return (
    <StreamContext.Provider
      value={{
        streams,
        stats,
        recentActivity,
        settings,
        isLoading,
        error,
        addStream,
        stopStream,
        refreshStreams,
        refreshStats,
        updateSettings,
        resetSettings,
        testConnection,
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

// Alias for backward compatibility
export const useStream = useStreamContext
