"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, AlertCircle, CheckCircle, Radio } from "lucide-react"
import { useStreamContext } from "@/contexts/stream-context"
import { useToast } from "@/hooks/use-toast"

export function StreamIngest() {
  const [url, setUrl] = useState("")
  const [customId, setCustomId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addStream, stats, error } = useStreamContext()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await addStream({
        url: url.trim(),
        customId: customId.trim() || undefined,
      })

      toast({
        title: "Stream iniciado com sucesso!",
        description: "O stream foi adicionado à fila de processamento",
      })

      setUrl("")
      setCustomId("")
    } catch (error) {
      toast({
        title: "Erro ao iniciar stream",
        description: "Não foi possível iniciar o stream. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isAtCapacity = stats.availableSlots === 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ingestão de Stream</h2>
        <p className="text-muted-foreground">Adicione novos streams para processamento e monitoramento</p>
      </div>

      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Streams Ativos</span>
              <Badge variant="default">{stats.activeStreams}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Slots Disponíveis</span>
              <Badge variant={stats.availableSlots > 0 ? "secondary" : "destructive"}>{stats.availableSlots}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Capacidade Máxima</span>
              <Badge variant="outline">{stats.maxConcurrentStreams}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Ingestão */}
      <Card>
        <CardHeader>
          <CardTitle>Novo Stream</CardTitle>
          <CardDescription>Insira a URL do stream que deseja processar</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isAtCapacity && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Sistema em capacidade máxima. Aguarde a conclusão de outros streams.</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL do Stream *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://exemplo.com/stream"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isSubmitting || isAtCapacity}
                required
              />
              <p className="text-xs text-muted-foreground">Insira a URL completa do stream que deseja processar</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customId">ID Personalizado (opcional)</Label>
              <Input
                id="customId"
                type="text"
                placeholder="meu-stream-personalizado"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                disabled={isSubmitting || isAtCapacity}
              />
              <p className="text-xs text-muted-foreground">Se não fornecido, será gerado automaticamente</p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || isAtCapacity || !url.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando Stream...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Iniciar Stream
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Processamento Automático</p>
              <p className="text-sm text-muted-foreground">
                O stream será processado automaticamente após ser adicionado
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Monitoramento em Tempo Real</p>
              <p className="text-sm text-muted-foreground">Acompanhe o progresso na seção "Streams Ativos"</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Download Automático</p>
              <p className="text-sm text-muted-foreground">
                Vídeos processados ficam disponíveis na seção "Vídeos Processados"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
