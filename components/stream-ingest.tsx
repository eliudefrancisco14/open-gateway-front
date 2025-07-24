"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { useStreamContext } from "@/contexts/stream-context"

export function StreamIngest() {
  const [url, setUrl] = useState("")
  const [customId, setCustomId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const { addStream } = useStreamContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setFeedback({
        type: "error",
        message: "Por favor, insira uma URL válida",
      })
      return
    }

    setIsLoading(true)
    setFeedback({ type: null, message: "" })

    try {
      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular resposta da API
      const streamId = customId.trim() || `stream-${Date.now()}`

      addStream({
        id: streamId,
        url: url.trim(),
        title: `Stream from ${new URL(url).hostname}`,
        platform: new URL(url).hostname,
        status: "PENDING",
        currentQuality: "1080p",
        startTime: new Date().toISOString(),
        outputFolder: `/streams/${streamId}`,
        finalMp4Path: null,
        endTime: null,
        errorMessage: null,
      })

      setFeedback({
        type: "success",
        message: `Stream iniciado com sucesso! ID: ${streamId}`,
      })

      setUrl("")
      setCustomId("")
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Erro ao iniciar stream. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Nova Ingestão de Stream
          </CardTitle>
          <CardDescription>Inicie o processamento de um novo stream de vídeo fornecendo a URL</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL do Stream *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customId">ID Personalizado (opcional)</Label>
              <Input
                id="customId"
                type="text"
                placeholder="meu-stream-unico"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Se não fornecido, será gerado automaticamente</p>
            </div>

            {feedback.type && (
              <Alert variant={feedback.type === "error" ? "destructive" : "default"}>
                {feedback.type === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{feedback.message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando Ingestão...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Iniciar Ingestão
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Formatos Suportados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm">
            <div>
              <strong>Plataformas:</strong> YouTube, Twitch, Facebook Live, e outras
            </div>
            <div>
              <strong>Qualidades:</strong> Automática (até 1080p)
            </div>
            <div>
              <strong>Formato de Saída:</strong> MP4 (H.264)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
