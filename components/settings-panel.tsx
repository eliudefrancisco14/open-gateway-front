"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Save, RefreshCw, Database, Wifi } from "lucide-react"
import { useState } from "react"

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    maxConcurrentStreams: 5,
    defaultQuality: "1080p",
    autoReconnect: true,
    notifications: true,
    apiEndpoint: "https://a83edbd91ad5.ngrok-free.app",
    websocketEndpoint: "ws://a83edbd91ad5.ngrok-free.app",
  })

  const handleSave = () => {
    // Simular salvamento das configurações
    console.log("Configurações salvas:", settings)
  }

  const handleReset = () => {
    setSettings({
      maxConcurrentStreams: 5,
      defaultQuality: "1080p",
      autoReconnect: true,
      notifications: true,
      apiEndpoint: "https://a83edbd91ad5.ngrok-free.app",
      websocketEndpoint: "ws://a83edbd91ad5.ngrok-free.app",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Sistema
          </CardTitle>
          <CardDescription>Configure os parâmetros de funcionamento da dashboard</CardDescription>
        </CardHeader>
      </Card>

      {/* Configurações de Stream */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configurações de Stream</CardTitle>
          <CardDescription>Parâmetros para processamento de streams</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxStreams">Máximo de Streams Concorrentes</Label>
              <Input
                id="maxStreams"
                type="number"
                min="1"
                max="20"
                value={settings.maxConcurrentStreams}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    maxConcurrentStreams: Number.parseInt(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultQuality">Qualidade Padrão</Label>
              <Select
                value={settings.defaultQuality}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultQuality: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="480p">480p</SelectItem>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                  <SelectItem value="1440p">1440p</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            Configurações de Conexão
          </CardTitle>
          <CardDescription>Endpoints da API e WebSocket</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiEndpoint">Endpoint da API</Label>
            <Input
              id="apiEndpoint"
              value={settings.apiEndpoint}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  apiEndpoint: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="websocketEndpoint">Endpoint WebSocket</Label>
            <Input
              id="websocketEndpoint"
              value={settings.websocketEndpoint}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  websocketEndpoint: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reconexão Automática</Label>
              <p className="text-sm text-muted-foreground">Tentar reconectar automaticamente em caso de falha</p>
            </div>
            <Switch
              checked={settings.autoReconnect}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  autoReconnect: checked,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Interface</CardTitle>
          <CardDescription>Preferências de exibição e notificações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações</Label>
              <p className="text-sm text-muted-foreground">Receber notificações sobre mudanças de status</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: checked,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            Status do Sistema
          </CardTitle>
          <CardDescription>Informações sobre conectividade e saúde do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status da API</Label>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Conectado</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status WebSocket</Label>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Conectado</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Restaurar Padrões
        </Button>

        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
