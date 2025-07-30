"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useStreamContext } from "@/contexts/stream-context"
import {
  Settings,
  Wifi,
  Bell,
  Shield,
  Palette,
  Code,
  Save,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

export function SettingsPanel() {
  const { settings, updateSettings, resetSettings } = useStreamContext()
  const { toast } = useToast()
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso.",
    })
  }

  const handleReset = () => {
    resetSettings()
    toast({
      title: "Configurações restauradas",
      description: "Todas as configurações foram restauradas para os valores padrão.",
    })
  }

  const testConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus("idle")

    try {
      // Simular teste de conexão
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular resultado aleatório
      const success = Math.random() > 0.3
      setConnectionStatus(success ? "success" : "error")

      toast({
        title: success ? "Conexão bem-sucedida" : "Falha na conexão",
        description: success
          ? "Todos os serviços estão funcionando corretamente."
          : "Verifique suas configurações de rede e tente novamente.",
        variant: success ? "default" : "destructive",
      })
    } catch (error) {
      setConnectionStatus("error")
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar a conexão.",
        variant: "destructive",
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações do Sistema
        </CardTitle>
        <CardDescription>
          Gerencie as configurações de streaming, notificações e preferências do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="streaming" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="streaming" className="flex items-center gap-1">
              <Wifi className="h-4 w-4" />
              <span className="hidden sm:inline">Streaming</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Aparência</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Avançado</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="streaming" className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rtmp-url">URL RTMP</Label>
                  <Input
                    id="rtmp-url"
                    value={settings.rtmpUrl}
                    onChange={(e) => updateSettings({ rtmpUrl: e.target.value })}
                    placeholder="rtmp://live.twitch.tv/live/"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream-key">Chave de Stream</Label>
                  <Input
                    id="stream-key"
                    type="password"
                    value={settings.streamKey}
                    onChange={(e) => updateSettings({ streamKey: e.target.value })}
                    placeholder="Sua chave de stream"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resolution">Resolução</Label>
                  <Select value={settings.resolution} onValueChange={(value) => updateSettings({ resolution: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1920x1080">1920x1080 (1080p)</SelectItem>
                      <SelectItem value="1280x720">1280x720 (720p)</SelectItem>
                      <SelectItem value="854x480">854x480 (480p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fps">FPS</Label>
                  <Select
                    value={settings.fps.toString()}
                    onValueChange={(value) => updateSettings({ fps: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 FPS</SelectItem>
                      <SelectItem value="60">60 FPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audio-quality">Qualidade do Áudio</Label>
                  <Select
                    value={settings.audioQuality}
                    onValueChange={(value) => updateSettings({ audioQuality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta (320 kbps)</SelectItem>
                      <SelectItem value="medium">Média (192 kbps)</SelectItem>
                      <SelectItem value="low">Baixa (128 kbps)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bitrate: {settings.bitrate} kbps</Label>
                  <Slider
                    value={[settings.bitrate]}
                    onValueChange={(value) => updateSettings({ bitrate: value[0] })}
                    max={10000}
                    min={1000}
                    step={500}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Volume do Áudio: {settings.audioVolume}%</Label>
                  <Slider
                    value={[settings.audioVolume]}
                    onValueChange={(value) => updateSettings({ audioVolume: value[0] })}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, push: checked },
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">Receba alertas importantes por email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, email: checked },
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Stream</Label>
                    <p className="text-sm text-muted-foreground">Notificações sobre status dos streams</p>
                  </div>
                  <Switch
                    checked={settings.notifications.streamAlerts}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, streamAlerts: checked },
                      })
                    }
                  />
                </div>
              </div>

              {settings.notifications.email && (
                <div className="space-y-2">
                  <Label htmlFor="notification-email">Email para Notificações</Label>
                  <Input
                    id="notification-email"
                    type="email"
                    value={settings.notificationEmail}
                    onChange={(e) => updateSettings({ notificationEmail: e.target.value })}
                    placeholder="seu@email.com"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                </div>
                <Switch
                  checked={settings.security.twoFactor}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      security: { ...settings.security, twoFactor: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Stream Privado</Label>
                  <p className="text-sm text-muted-foreground">Requer senha para visualizar streams</p>
                </div>
                <Switch
                  checked={settings.security.privateStream}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      security: { ...settings.security, privateStream: checked },
                    })
                  }
                />
              </div>

              {settings.security.privateStream && (
                <div className="space-y-2">
                  <Label htmlFor="stream-password">Senha do Stream</Label>
                  <Input
                    id="stream-password"
                    type="password"
                    value={settings.security.streamPassword}
                    onChange={(e) =>
                      updateSettings({
                        security: { ...settings.security, streamPassword: e.target.value },
                      })
                    }
                    placeholder="Digite uma senha segura"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select value={settings.theme} onValueChange={(value) => updateSettings({ theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="layout">Layout</Label>
                  <Select value={settings.layout} onValueChange={(value) => updateSettings({ layout: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grade</SelectItem>
                      <SelectItem value="list">Lista</SelectItem>
                      <SelectItem value="compact">Compacto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animações</Label>
                  <p className="text-sm text-muted-foreground">Habilitar animações na interface</p>
                </div>
                <Switch
                  checked={settings.animations}
                  onCheckedChange={(checked) => updateSettings({ animations: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Atualização Automática: {settings.autoRefresh}s</Label>
                <Slider
                  value={[settings.autoRefresh]}
                  onValueChange={(value) => updateSettings({ autoRefresh: value[0] })}
                  max={120}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api-endpoint">Endpoint da API</Label>
                  <Input
                    id="api-endpoint"
                    value={settings.apiEndpoint}
                    onChange={(e) => updateSettings({ apiEndpoint: e.target.value })}
                    placeholder="https://api.streamdashboard.com/v1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">URL do Webhook</Label>
                  <Input
                    id="webhook-url"
                    value={settings.webhookUrl}
                    onChange={(e) => updateSettings({ webhookUrl: e.target.value })}
                    placeholder="https://seu-webhook.com/endpoint"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Debug</Label>
                  <p className="text-sm text-muted-foreground">Habilitar logs detalhados para depuração</p>
                </div>
                <Switch
                  checked={settings.debugMode}
                  onCheckedChange={(checked) => updateSettings({ debugMode: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Buffer Size: {settings.bufferSize} MB</Label>
                <Slider
                  value={[settings.bufferSize]}
                  onValueChange={(value) => updateSettings({ bufferSize: value[0] })}
                  max={1024}
                  min={64}
                  step={64}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Status da Conexão</Label>
                  <div className="flex items-center gap-2">
                    {getConnectionStatusIcon()}
                    <Badge variant={connectionStatus === "success" ? "default" : "secondary"}>
                      {connectionStatus === "success"
                        ? "Conectado"
                        : connectionStatus === "error"
                          ? "Erro"
                          : "Não testado"}
                    </Badge>
                  </div>
                </div>
                <Button onClick={testConnection} disabled={isTestingConnection} className="w-full">
                  {isTestingConnection ? "Testando..." : "Testar Conexão"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar Padrões
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
