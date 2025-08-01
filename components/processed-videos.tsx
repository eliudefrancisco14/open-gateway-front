"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Play, Search, Calendar, Clock, HardDrive, Video } from "lucide-react"
import { useStreamContext } from "@/contexts/stream-context"
import { useState } from "react"
import { formatDate, formatDuration, getStatusText } from "@/lib/utils"
import { apiClient } from "@/lib/api"

export function ProcessedVideos() {
  const { streams } = useStreamContext()
  const [searchTerm, setSearchTerm] = useState("")

  const completedStreams = streams.filter((stream) => stream.status === "COMPLETED" && stream.finalMp4Path)

  const filteredStreams = completedStreams.filter(
    (stream) =>
      stream.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stream.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stream.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDownload = (stream: any) => {
    if (stream.finalMp4Path) {
      const downloadUrl = apiClient.getDownloadUrl(stream.id)
      window.open(downloadUrl, "_blank")
    }
  }

  if (completedStreams.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Vídeos Processados</h2>
          <p className="text-muted-foreground">Nenhum vídeo processado ainda</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Nenhum Vídeo Processado</h3>
            <p className="text-muted-foreground text-center max-w-md mx-auto">
              Ainda não há vídeos processados. Os streams concluídos aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vídeos Processados</h2>
        <p className="text-muted-foreground">{completedStreams.length} vídeo(s) processado(s) com sucesso</p>
      </div>

      {/* Cabeçalho e Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Histórico de Streams ({completedStreams.length})
          </CardTitle>
          <CardDescription>Arquivos disponíveis para download</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar vídeos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid de Vídeos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStreams.map((stream) => (
          <Card key={stream.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-base line-clamp-1">{stream.title || stream.id}</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Play className="w-3 h-3 mr-1" />
                    {getStatusText(stream.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Thumbnail Placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Video className="h-8 w-8 text-muted-foreground" />
              </div>

              {/* Informações do Vídeo */}
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground">
                  <span className="truncate block">{new URL(stream.url).hostname}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{stream.endTime ? formatDate(stream.endTime) : "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDuration(stream.startTime, stream.endTime)}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">Qualidade: {stream.currentQuality}</div>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleDownload(stream)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>

              {/* Caminho do Arquivo */}
              {stream.finalMp4Path && (
                <div className="text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    <HardDrive className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Arquivo:</span>
                  </div>
                  <div className="font-mono bg-muted p-1 rounded truncate text-xs">{stream.finalMp4Path}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStreams.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum vídeo encontrado para "{searchTerm}"</p>
        </div>
      )}
    </div>
  )
}
