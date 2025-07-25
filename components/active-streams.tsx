"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Users, Heart, Eye, Clock, Settings, Maximize2 } from "lucide-react"

interface StreamData {
  id: string
  title: string
  streamer: string
  viewers: number
  likes: number
  duration: string
  status: "live" | "starting" | "ending"
  thumbnail: string
  description: string
  category: string
  quality: string
  bitrate: string
  fps: number
  resolution: string
}

const mockStreams: StreamData[] = [
  {
    id: "1",
    title: "Gameplay ao Vivo - Aventura Épica",
    streamer: "GamerPro123",
    viewers: 1247,
    likes: 89,
    duration: "02:34:12",
    status: "live",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Stream+1",
    description: "Explorando novos mundos neste jogo incrível! Venham participar da aventura comigo.",
    category: "Gaming",
    quality: "1080p",
    bitrate: "6000 kbps",
    fps: 60,
    resolution: "1920x1080",
  },
  {
    id: "2",
    title: "Tutorial de Programação React",
    streamer: "DevMaster",
    viewers: 892,
    likes: 156,
    duration: "01:45:30",
    status: "live",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Stream+2",
    description: "Aprendendo React do zero! Construindo uma aplicação completa passo a passo.",
    category: "Education",
    quality: "720p",
    bitrate: "4500 kbps",
    fps: 30,
    resolution: "1280x720",
  },
  {
    id: "3",
    title: "Música ao Vivo - Covers Acústicos",
    streamer: "MusicLover",
    viewers: 634,
    likes: 203,
    duration: "00:58:45",
    status: "live",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Stream+3",
    description: "Tocando seus sucessos favoritos no violão. Deixem suas sugestões nos comentários!",
    category: "Music",
    quality: "1080p",
    bitrate: "5000 kbps",
    fps: 30,
    resolution: "1920x1080",
  },
  {
    id: "4",
    title: "Culinária Italiana Tradicional",
    streamer: "ChefItalia",
    viewers: 445,
    likes: 78,
    duration: "01:12:20",
    status: "starting",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Stream+4",
    description: "Preparando uma autêntica pasta italiana com ingredientes frescos.",
    category: "Cooking",
    quality: "720p",
    bitrate: "3500 kbps",
    fps: 30,
    resolution: "1280x720",
  },
  {
    id: "5",
    title: "Arte Digital - Speedpainting",
    streamer: "ArtistPro",
    viewers: 789,
    likes: 134,
    duration: "03:15:08",
    status: "live",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Stream+5",
    description: "Criando uma ilustração fantástica do zero usando Photoshop.",
    category: "Art",
    quality: "1080p",
    bitrate: "6500 kbps",
    fps: 60,
    resolution: "1920x1080",
  },
  {
    id: "6",
    title: "Fitness em Casa - Treino Completo",
    streamer: "FitCoach",
    viewers: 523,
    likes: 92,
    duration: "00:45:30",
    status: "ending",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Stream+6",
    description: "Treino funcional para fazer em casa, sem equipamentos. Vamos juntos!",
    category: "Fitness",
    quality: "720p",
    bitrate: "4000 kbps",
    fps: 30,
    resolution: "1280x720",
  },
]

export function ActiveStreams() {
  const [streams, setStreams] = useState<StreamData[]>(mockStreams)
  const [selectedStream, setSelectedStream] = useState<StreamData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setStreams((prevStreams) =>
        prevStreams.map((stream) => ({
          ...stream,
          viewers: stream.viewers + Math.floor(Math.random() * 20) - 10,
          likes: stream.likes + Math.floor(Math.random() * 3),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white"
      case "starting":
        return "bg-yellow-500 text-black"
      case "ending":
        return "bg-orange-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "AO VIVO"
      case "starting":
        return "INICIANDO"
      case "ending":
        return "FINALIZANDO"
      default:
        return "OFFLINE"
    }
  }

  const handleStreamClick = (stream: StreamData) => {
    setSelectedStream(stream)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Streams Ativos</h2>
        <Badge variant="secondary" className="text-sm font-medium">
          {streams.filter((s) => s.status === "live").length} ao vivo
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {streams.map((stream) => (
          <Card
            key={stream.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-border/50 hover:border-border"
            onClick={() => handleStreamClick(stream)}
          >
            <CardContent className="p-0">
              {/* Thumbnail do Vídeo */}
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={stream.thumbnail || "/placeholder.svg"}
                  alt={stream.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay com Play Button */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3">
                    <Play className="h-6 w-6 text-black fill-black" />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={`${getStatusColor(stream.status)} text-xs font-semibold px-2 py-1`}>
                    {getStatusText(stream.status)}
                  </Badge>
                </div>

                {/* Duração */}
                <div className="absolute bottom-3 right-3">
                  <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {stream.duration}
                  </Badge>
                </div>
              </div>

              {/* Informações do Stream */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight">{stream.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">por {stream.streamer}</p>
                </div>

                {/* Estatísticas */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span className="font-medium">{stream.viewers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      <span className="font-medium">{stream.likes}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stream.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Visualização Completa */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl w-[90vw] h-[90vh] p-0 overflow-hidden">
          {selectedStream && (
            <div className="flex flex-col h-full">
              {/* Header do Modal */}
              <DialogHeader className="p-6 pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getStatusColor(selectedStream.status)} text-sm font-semibold`}>
                      {getStatusText(selectedStream.status)}
                    </Badge>
                    <DialogTitle className="text-xl font-semibold">{selectedStream.title}</DialogTitle>
                  </div>
                  <Button variant="outline" size="sm">
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Tela Cheia
                  </Button>
                </div>
              </DialogHeader>

              {/* Conteúdo Principal */}
              <div className="flex-1 flex overflow-hidden">
                {/* Player de Vídeo */}
                <div className="flex-1 bg-black flex items-center justify-center">
                  <div className="relative w-full h-full max-h-[60vh]">
                    <img
                      src={selectedStream.thumbnail || "/placeholder.svg"}
                      alt={selectedStream.title}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button size="lg" className="bg-white/90 hover:bg-white text-black">
                        <Play className="h-8 w-8 mr-2 fill-black" />
                        Reproduzir Stream
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Painel de Informações */}
                <div className="w-80 bg-muted/30 p-6 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Informações do Streamer */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Canal</h3>
                      <p className="text-muted-foreground">{selectedStream.streamer}</p>
                    </div>

                    {/* Estatísticas em Tempo Real */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Estatísticas</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-background rounded-lg">
                          <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                          <p className="text-sm font-semibold">{selectedStream.viewers.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Visualizações</p>
                        </div>
                        <div className="text-center p-3 bg-background rounded-lg">
                          <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
                          <p className="text-sm font-semibold">{selectedStream.likes}</p>
                          <p className="text-xs text-muted-foreground">Curtidas</p>
                        </div>
                        <div className="text-center p-3 bg-background rounded-lg">
                          <Clock className="h-5 w-5 mx-auto mb-1 text-green-500" />
                          <p className="text-sm font-semibold">{selectedStream.duration}</p>
                          <p className="text-xs text-muted-foreground">Duração</p>
                        </div>
                        <div className="text-center p-3 bg-background rounded-lg">
                          <Eye className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                          <p className="text-sm font-semibold">{selectedStream.quality}</p>
                          <p className="text-xs text-muted-foreground">Qualidade</p>
                        </div>
                      </div>
                    </div>

                    {/* Descrição */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Descrição</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{selectedStream.description}</p>
                    </div>

                    {/* Detalhes Técnicos */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Detalhes Técnicos</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Resolução:</span>
                          <span className="font-medium">{selectedStream.resolution}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bitrate:</span>
                          <span className="font-medium">{selectedStream.bitrate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">FPS:</span>
                          <span className="font-medium">{selectedStream.fps}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Categoria:</span>
                          <Badge variant="outline" className="text-xs">
                            {selectedStream.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="space-y-2">
                      <Button className="w-full" variant="default">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurações do Stream
                      </Button>
                      <Button className="w-full bg-transparent" variant="outline">
                        Compartilhar Stream
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
