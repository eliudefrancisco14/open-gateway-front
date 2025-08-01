"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Play, Square, Clock, Monitor, AlertCircle, CheckCircle } from "lucide-react"
import { useStreamContext } from "@/contexts/stream-context"
import { getStatusColor, getStatusText, formatDate, formatDuration } from "@/lib/utils"

export function ActiveStreams() {
  const { streams, stopStream, isLoading, error } = useStreamContext()
  const [stoppingStreams, setStoppingStreams] = useState<Set<string>>(new Set())

  const handleStopStream = async (streamId: string) => {
    setStoppingStreams((prev) => new Set(prev).add(streamId))
    try {
      await stopStream(streamId)
    } catch (error) {
      console.error("Error stopping stream:", error)
    } finally {
      setStoppingStreams((prev) => {
        const newSet = new Set(prev)
        newSet.delete(streamId)
        return newSet
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return <Play className="w-3 h-3" />
      case "COMPLETED":
        return <CheckCircle className="w-3 h-3" />
      case "ERROR":
        return <AlertCircle className="w-3 h-3" />
      case "PENDING":
        return <Clock className="w-3 h-3" />
      case "STOPPED":
        return <Square className="w-3 h-3" />
      default:
        return <Monitor className="w-3 h-3" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando streams...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Erro ao carregar streams: {error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Streams Ativos</h2>
        <p className="text-muted-foreground">
          {streams.length === 0 ? "Nenhum stream ativo no momento" : `${streams.length} stream(s) encontrado(s)`}
        </p>
      </div>

      {streams.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Monitor className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Nenhum stream ativo</h3>
            <p className="text-muted-foreground">Inicie um novo stream para vê-lo aparecer aqui.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {streams.map((stream) => (
            <Card key={stream.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-2">{stream.title || `Stream ${stream.id}`}</CardTitle>
                    <CardDescription className="text-xs">ID: {stream.id}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(stream.status)} flex items-center gap-1`}>
                    {getStatusIcon(stream.status)}
                    {getStatusText(stream.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">URL:</span>
                    <p className="text-muted-foreground break-all text-xs mt-1">{stream.url}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Qualidade:</span>
                      <p className="text-muted-foreground">{stream.currentQuality}</p>
                    </div>
                    <div>
                      <span className="font-medium">Plataforma:</span>
                      <p className="text-muted-foreground capitalize">{stream.platform}</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Iniciado em:</span>
                    <p className="text-muted-foreground">{formatDate(stream.startTime)}</p>
                  </div>

                  {stream.endTime && (
                    <div className="text-sm">
                      <span className="font-medium">Finalizado em:</span>
                      <p className="text-muted-foreground">{formatDate(stream.endTime)}</p>
                    </div>
                  )}

                  <div className="text-sm">
                    <span className="font-medium">Duração:</span>
                    <p className="text-muted-foreground">{formatDuration(stream.startTime, stream.endTime)}</p>
                  </div>

                  {stream.outputFolder && (
                    <div className="text-sm">
                      <span className="font-medium">Pasta de saída:</span>
                      <p className="text-muted-foreground text-xs break-all">{stream.outputFolder}</p>
                    </div>
                  )}

                  {stream.finalMp4Path && (
                    <div className="text-sm">
                      <span className="font-medium">Arquivo final:</span>
                      <p className="text-muted-foreground text-xs break-all">{stream.finalMp4Path}</p>
                    </div>
                  )}

                  {stream.errorMessage && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">{stream.errorMessage}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {(stream.status === "PROCESSING" || stream.status === "PENDING") && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleStopStream(stream.id)}
                    disabled={stoppingStreams.has(stream.id)}
                  >
                    {stoppingStreams.has(stream.id) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Parando...
                      </>
                    ) : (
                      <>
                        <Square className="mr-2 h-4 w-4" />
                        Parar Stream
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
