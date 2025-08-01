"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Video, Bell, Shield, Palette, Code, Save, RotateCcw, CheckCircle, AlertCircle, Wifi } from "lucide-react"
import { useStreamContext } from "@/contexts/stream-context"
import { useToast } from "@/hooks/use-toast"

export function SettingsPanel() {
  const { settings, updateSettings, resetSettings, testConnection } = useStreamContext()
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso",
    })
  }

  const handleReset = () => {
    resetSettings()
    toast({
      title: "Configurações resetadas",
      description: "Todas as configurações foram restauradas para os valores padrão",
    })
  }

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus("idle")

    try {
      const isConnected = await testConnection()
      setConnectionStatus(isConnected ? "success" : "error")

      toast({
        title: isConnected ? "Conexão bem-sucedida" : "Falha na conexão",
        description: isConnected
          ? "A conexão com a API está funcionando corretamente"
          : "Não foi possível conectar com a API",
        variant: isConnected ? "default" : "destructive",
      })
    } catch (error) {
      setConnectionStatus("error")
      toast({
        title: "Erro no teste de conexão",
        description: "Ocorreu um erro ao testar a conexão",
        variant: "destructive",
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações</h2>
        <p className="text-muted-foreground">Gerencie as configurações do sistema e preferências</p>
      </div>

      <Tabs defaultValue="streaming" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="streaming">
            <Video className="w-4 h-4 mr-2" />
            Streaming
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Code className="w-4 h-4 mr-2" />
            Avançado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="streaming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Streaming</CardTitle>
              <CardDescription>Configure as opções padrão para processamento de streams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quality">Qualidade Padrão</Label>
                  <Select
                    value={settings.streaming.quality}
                    onValueChange={(value) =>
                      updateSettings({
                        streaming: { ...settings.streaming, quality: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="1440p">1440p 2K</SelectItem>
                      <SelectItem value="2160p">2160p 4K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fps">FPS Padrão</Label>
                  <Select
                    value={settings.streaming.fps.toString()}
                    onValueChange={(value) =>
                      updateSettings({
                        streaming: { ...settings.streaming, fps: Number.parseInt(value) },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 FPS</SelectItem>
                      <SelectItem value="30">30 FPS</SelectItem>
                      <SelectItem value="60">60 FPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bitrate">Bitrate (kbps)</Label>
                <Input
                  id="bitrate"
                  type="number"
                  value={settings.streaming.bitrate}
                  onChange={(e) =>
                    updateSettings({
                      streaming: {
                        ...settings.streaming,
                        bitrate: Number.parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Início Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Iniciar processamento automaticamente ao adicionar stream
                    </p>
                  </div>
                  <Switch
                    checked={settings.streaming.autoStart}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        streaming: { ...settings.streaming, autoStart: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Gravação Habilitada</Label>
                    <p className="text-sm text-muted-foreground">Salvar arquivos processados automaticamente</p>
                  </div>
                  <Switch
                    checked={settings.streaming.recordingEnabled}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        streaming: { ...settings.streaming, recordingEnabled: checked },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Configure como e quando receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas por Email</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações importantes por email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailAlerts}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, emailAlerts: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações push no navegador</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, pushNotifications: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Stream Iniciado</Label>
                    <p className="text-sm text-muted-foreground">Notificar quando um stream for iniciado</p>
                  </div>
                  <Switch
                    checked={settings.notifications.streamStarted}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, streamStarted: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marcos de Visualização</Label>
                    <p className="text-sm text-muted-foreground">Notificar ao atingir marcos de visualização</p>
                  </div>
                  <Switch
                    checked={settings.notifications.viewerMilestones}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, viewerMilestones: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Menções no Chat</Label>
                    <p className="text-sm text-muted-foreground">Notificar quando for mencionado no chat</p>
                  </div>
                  <Switch
                    checked={settings.notifications.chatMentions}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, chatMentions: checked },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Gerencie a segurança e acesso ao sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Adicionar uma camada extra de segurança</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        security: { ...settings.security, twoFactorAuth: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lista Branca de IPs</Label>
                    <p className="text-sm text-muted-foreground">Restringir acesso a IPs específicos</p>
                  </div>
                  <Switch
                    checked={settings.security.ipWhitelist}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        security: { ...settings.security, ipWhitelist: checked },
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="streamKey">Chave de Stream</Label>
                <div className="flex gap-2">
                  <Input
                    id="streamKey"
                    value={settings.security.streamKey}
                    onChange={(e) =>
                      updateSettings({
                        security: { ...settings.security, streamKey: e.target.value },
                      })
                    }
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateSettings({
                        security: {
                          ...settings.security,
                          streamKey: "sk_live_" + Math.random().toString(36).substr(2, 9),
                        },
                      })
                    }
                  >
                    Gerar Nova
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="moderationLevel">Nível de Moderação</Label>
                <Select
                  value={settings.security.moderationLevel}
                  onValueChange={(value) =>
                    updateSettings({
                      security: { ...settings.security, moderationLevel: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixo</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Aparência</CardTitle>
              <CardDescription>Personalize a aparência da interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) =>
                      updateSettings({
                        appearance: { ...settings.appearance, theme: value },
                      })
                    }
                  >
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
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) =>
                      updateSettings({
                        appearance: { ...settings.appearance, language: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select
                  value={settings.appearance.timezone}
                  onValueChange={(value) =>
                    updateSettings({
                      appearance: { ...settings.appearance, timezone: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Compacto</Label>
                  <p className="text-sm text-muted-foreground">Usar interface mais compacta</p>
                </div>
                <Switch
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      appearance: { ...settings.appearance, compactMode: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>Configurações técnicas e de desenvolvimento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Acesso à API</Label>
                  <p className="text-sm text-muted-foreground">Habilitar acesso programático à API</p>
                </div>
                <Switch
                  checked={settings.advanced.apiAccess}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      advanced: { ...settings.advanced, apiAccess: checked },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">URL do Webhook</Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  placeholder="https://exemplo.com/webhook"
                  value={settings.advanced.webhookUrl}
                  onChange={(e) =>
                    updateSettings({
                      advanced: { ...settings.advanced, webhookUrl: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customDomain">Domínio Personalizado</Label>
                <Input
                  id="customDomain"
                  placeholder="meudominio.com"
                  value={settings.advanced.customDomain}
                  onChange={(e) =>
                    updateSettings({
                      advanced: { ...settings.advanced, customDomain: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="analyticsRetention">Retenção de Analytics (dias)</Label>
                <Input
                  id="analyticsRetention"
                  type="number"
                  value={settings.advanced.analyticsRetention}
                  onChange={(e) =>
                    updateSettings({
                      advanced: {
                        ...settings.advanced,
                        analyticsRetention: Number.parseInt(e.target.value) || 30,
                      },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Teste de Conexão</Label>
                    <p className="text-sm text-muted-foreground">Verificar conectividade com a API</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {connectionStatus === "success" && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Conectado
                      </Badge>
                    )}
                    {connectionStatus === "error" && (
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Erro
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={isTestingConnection}>
                      {isTestingConnection ? (
                        <>
                          <Wifi className="w-4 h-4 mr-2 animate-pulse" />
                          Testando...
                        </>
                      ) : (
                        <>
                          <Wifi className="w-4 h-4 mr-2" />
                          Testar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Resetar Configurações
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
