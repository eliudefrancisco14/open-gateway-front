"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Radio, Square, Eye, Search, AlertTriangle, Clock, Monitor, ExternalLink } from "lucide-react"
import { useStreamContext } from "@/contexts/stream-context"
import { useState } from "react"

export function ActiveStreams() {
  const { streams, stopStream } = useStreamContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedStream, setExpandedStream] = useState<string | null>(null)

  const activeStreams = streams.filter((stream) => stream.status === "PENDING" || stream.status === "INGESTING")

  const filteredStreams = activeStreams.filter(
    (stream) =>
      stream.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stream.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stream.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500"
      case "INGESTING":
        return "bg-green-500"
      case "ERROR":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendente"
      case "INGESTING":
        return "Processando"
      case "ERROR":
        return "Erro"
      default:
        return status
    }
  }

  const handleStopStream = async (streamId: string) => {
    try {
      await stopStream(streamId)
    } catch (error) {
      console.error("Erro ao parar stream:", error)
    }
  }

  const toggleExpanded = (streamId: string) => {
    setExpandedStream(expandedStream === streamId ? null : streamId)
  }

  if (activeStreams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Radio className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum Stream Ativo</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Não há streams sendo processados no momento. Inicie uma nova ingestão para ver os streams aqui.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Streams Ativos ({activeStreams.length})
          </CardTitle>
          <CardDescription>Streams atualmente em processamento com atualizações em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por ID, URL ou título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Streams */}
      <div className="grid gap-4">
        {filteredStreams.map((stream) => (
          <Card key={stream.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(stream.status)} animate-pulse`} />
                    <CardTitle className="text-base">{stream.id}</CardTitle>
                    <Badge variant="outline">{getStatusText(stream.status)}</Badge>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate">{stream.url}</span>
                    </div>
                    {stream.title && <div className="font-medium text-foreground">{stream.title}</div>}
                    {stream.platform && (
                      <div className="flex items-center gap-2">
                        <Monitor className="h-3 w-3" />
                        <span>{stream.platform}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleExpanded(stream.id)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Detalhes
                  </Button>

                  {(stream.status === "PENDING" || stream.status === "INGESTING") && (
                    <Button variant="destructive" size="sm" onClick={() => handleStopStream(stream.id)}>
                      <Square className="h-4 w-4 mr-1" />
                      Parar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Qualidade:</span>
                  <div className="font-medium">{stream.currentQuality}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Início:</span>
                  <div className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(stream.startTime).toLocaleTimeString()}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Duração:</span>
                  <div className="font-medium">
                    {Math.floor((Date.now() - new Date(stream.startTime).getTime()) / 60000)}min
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="font-medium">{getStatusText(stream.status)}</div>
                </div>
              </div>

              {stream.errorMessage && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{stream.errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Detalhes Expandidos */}
              {expandedStream === stream.id && (
                <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Pasta de Saída:</span>
                    <div className="font-mono bg-muted p-2 rounded mt-1">{stream.outputFolder}</div>
                  </div>
                  {stream.finalMp4Path && (
                    <div>
                      <span className="text-muted-foreground">Arquivo Final:</span>
                      <div className="font-mono bg-muted p-2 rounded mt-1">{stream.finalMp4Path}</div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStreams.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum stream encontrado para "{searchTerm}"</p>
        </div>
      )}
    </div>
  )
}
