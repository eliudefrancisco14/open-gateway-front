"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Video, Download, Play, Search, Calendar, Clock, FileVideo, ExternalLink } from "lucide-react"
import { useStreamContext } from "@/contexts/stream-context"
import { useState } from "react"

export function ProcessedVideos() {
  const { streams } = useStreamContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const processedStreams = streams.filter((stream) => stream.status === "COMPLETED" || stream.status === "STOPPED")

  const filteredStreams = processedStreams.filter(
    (stream) =>
      stream.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stream.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stream.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredStreams.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStreams = filteredStreams.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "secondary"
      case "STOPPED":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Concluído"
      case "STOPPED":
        return "Parado"
      default:
        return status
    }
  }

  const handleDownload = (stream: any) => {
    if (stream.finalMp4Path) {
      // Simular download
      const link = document.createElement("a")
      link.href = `/api/download/${stream.id}`
      link.download = `${stream.id}.mp4`
      link.click()
    }
  }

  const formatDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return "N/A"
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime()
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (processedStreams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Video className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum Vídeo Processado</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Ainda não há vídeos processados. Os streams concluídos aparecerão aqui.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Vídeos Processados ({processedStreams.length})
          </CardTitle>
          <CardDescription>Histórico de streams concluídos e arquivos disponíveis para download</CardDescription>
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
        {paginatedStreams.map((stream) => (
          <Card key={stream.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-base line-clamp-1">{stream.id}</CardTitle>
                  <Badge variant={getStatusColor(stream.status)}>{getStatusText(stream.status)}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Thumbnail Placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <FileVideo className="h-8 w-8 text-muted-foreground" />
              </div>

              {/* Informações do Vídeo */}
              <div className="space-y-2 text-sm">
                {stream.title && (
                  <div>
                    <span className="font-medium line-clamp-2">{stream.title}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-muted-foreground">
                  <ExternalLink className="h-3 w-3" />
                  <span className="truncate">{new URL(stream.url).hostname}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(stream.startTime).toLocaleDateString()}</span>
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
                {stream.finalMp4Path && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleDownload(stream)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Play className="h-4 w-4 mr-1" />
                      Reproduzir
                    </Button>
                  </>
                )}
              </div>

              {/* Caminho do Arquivo */}
              {stream.finalMp4Path && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Arquivo:</span>
                  <div className="font-mono bg-muted p-1 rounded mt-1 truncate">{stream.finalMp4Path}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Próximo
          </Button>
        </div>
      )}

      {filteredStreams.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum vídeo encontrado para "{searchTerm}"</p>
        </div>
      )}
    </div>
  )
}
