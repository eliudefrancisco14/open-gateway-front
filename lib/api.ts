const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface ApiStream {
  id: string
  url: string
  title?: string
  platform: string
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "ERROR" | "STOPPED"
  currentQuality: string
  startTime: string
  endTime?: string
  outputFolder?: string
  finalMp4Path?: string
  errorMessage?: string
}

export interface ApiStats {
  activeStreams: number
  maxConcurrentStreams: number
  availableSlots: number
  totalStreams: number
  websocketConnections: number
}

export interface ApiActivity {
  title: string
  description: string
  type: "started" | "completed" | "error" | "stopped"
  time: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request("/health")
  }

  // Get all streams
  async getStreams(): Promise<ApiStream[]> {
    return this.request("/streams")
  }

  // Get stream by ID
  async getStream(id: string): Promise<ApiStream> {
    return this.request(`/streams/${id}`)
  }

  // Start a new stream
  async startStream(url: string, customId?: string): Promise<{ message: string; streamId: string }> {
    return this.request("/streams/start", {
      method: "POST",
      body: JSON.stringify({
        url,
        ...(customId && { customId }),
      }),
    })
  }

  // Stop a stream
  async stopStream(id: string): Promise<{ message: string }> {
    return this.request(`/streams/${id}/stop`, {
      method: "POST",
    })
  }

  // Get system stats
  async getStats(): Promise<ApiStats> {
    return this.request("/stats")
  }

  // Get recent activity (if available)
  async getActivity(): Promise<ApiActivity[]> {
    try {
      return this.request("/activity")
    } catch (error) {
      // Return empty array if endpoint doesn't exist
      return []
    }
  }

  // Download stream file
  getDownloadUrl(streamId: string): string {
    return `${this.baseUrl}/streams/${streamId}/download`
  }
}

export const apiClient = new ApiClient()
