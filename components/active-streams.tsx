"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Pause, Square, Eye, Heart, Clock, Monitor, Wifi, Volume2 } from "lucide-react"
import { useStreamContext } from "@/contexts/stream-context"

export function ActiveStreams() {
  const { streams, stopStream } = useStreamContext()
  const [selectedStream, setSelectedStream] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({})

  const activeStreams = streams.filter((stream) => stream.status === "INGESTING" || stream.status === "PENDING")

  const selectedStreamData = selectedStream ? streams.find((s) => s.id === selectedStream) : null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "INGESTING":
        return (
          <Badge className="bg-red-500 text-white animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-ping" />
            AO VIVO
          </Badge>
        )
      case "PENDING":
        return (
          <Badge className="bg-yellow-500 text-white">
            <Clock className="w-3 h-3 mr-1" />
            INICIANDO
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime)
    const now = new Date()
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000)
    const hours = Math.floor(diff / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    const seconds = diff % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const togglePlay = (streamId: string) => {
    setIsPlaying((prev) => ({
      ...prev,
      [streamId]: !prev[streamId],
    }))
  }

  if (activeStreams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Streams Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum stream ativo no momento</p>
            <p className="text-sm">Inicie um novo stream para vê-lo aqui</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Streams Ativos ({activeStreams.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeStreams.map((stream) => (
              <Card
                key={stream.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedStream(stream.id)}
              >
                <div className="relative">
                  {/* Video Preview */}
                  <div className="aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-t-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-2 left-2">{getStatusBadge(stream.status)}</div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {stream.currentQuality}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {formatDuration(stream.startTime)}
                      </Badge>
                    </div>
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePlay(stream.id)
                        }}
                      >
                        {isPlaying[stream.id] ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                      </Button>
                    </div>
                  </div>

                  {/* Stream Info */}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{stream.title || `Stream ${stream.id}`}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        {stream.platform}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {Math.floor(Math.random() * 1000) + 100}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-red-500">
                        <Heart className="h-3 w-3" />
                        {Math.floor(Math.random() * 50) + 10}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          stopStream(stream.id)
                        }}
                      >
                        <Square className="h-3 w-3 mr-1" />
                        Parar
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Full-Screen */}
      <Dialog open={!!selectedStream} onOpenChange={() => setSelectedStream(null)}>
        <DialogContent className="max-w-6xl w-[90vw] h-[90vh] p-0">
          {selectedStreamData && (
            <>
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="flex items-center gap-2">
                  {getStatusBadge(selectedStreamData.status)}
                  <span>{selectedStreamData.title || `Stream ${selectedStreamData.id}`}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Player */}
                <div className="lg:col-span-2">
                  <div className="aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="rounded-full w-20 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                        onClick={() => togglePlay(selectedStreamData.id)}
                      >
                        {isPlaying[selectedStreamData.id] ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8 ml-1" />
                        )}
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center justify-between text-white text-sm">
                          <span className="flex items-center gap-2">
                            <Volume2 className="h-4 w-4" />
                            Audio: {Math.floor(Math.random() * 100)}%
                          </span>
                          <span>{formatDuration(selectedStreamData.startTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stream Details */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Estatísticas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Visualizações:</span>
                        <span className="font-semibold">{Math.floor(Math.random() * 1000) + 100}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Curtidas:</span>
                        <span className="font-semibold">{Math.floor(Math.random() * 50) + 10}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duração:</span>
                        <span className="font-semibold">{formatDuration(selectedStreamData.startTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Qualidade:</span>
                        <Badge variant="secondary">{selectedStreamData.currentQuality}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Detalhes Técnicos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plataforma:</span>
                        <span className="font-semibold">{selectedStreamData.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resolução:</span>
                        <span className="font-semibold">
                          {selectedStreamData.currentQuality === "1080p"
                            ? "1920x1080"
                            : selectedStreamData.currentQuality === "720p"
                              ? "1280x720"
                              : "854x480"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bitrate:</span>
                        <span className="font-semibold">{Math.floor(Math.random() * 3000) + 2000} kbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">FPS:</span>
                        <span className="font-semibold">{Math.floor(Math.random() * 30) + 30}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Descrição</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {selectedStreamData.title === "Live Gaming Session - Minecraft Speedrun"
                          ? "Tentativa de speedrun do Minecraft! Vamos tentar bater o recorde pessoal de 25 minutos. Chat ativo e dicas são bem-vindas!"
                          : selectedStreamData.title === "Just Chatting - Q&A com a Comunidade"
                            ? "Sessão de perguntas e respostas com a comunidade. Fale sobre qualquer assunto e vamos conversar!"
                            : "Stream ao vivo com conteúdo variado. Participe do chat e interaja conosco!"}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        stopStream(selectedStreamData.id)
                        setSelectedStream(null)
                      }}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Parar Stream
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
