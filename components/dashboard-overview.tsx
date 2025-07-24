"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Radio, Video, Users, TrendingUp } from "lucide-react"
import { useStreamContext } from "@/contexts/stream-context"

export function DashboardOverview() {
  const { stats, recentActivity } = useStreamContext()

  const utilizationPercentage = (stats.activeStreams / stats.maxConcurrentStreams) * 100

  return (
    <div className="space-y-6">
      {/* Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streams Ativos</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.activeStreams}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeStreams > 0 ? "Em processamento" : "Nenhum ativo"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slots Disponíveis</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.availableSlots}</div>
            <p className="text-xs text-muted-foreground">de {stats.maxConcurrentStreams} máximo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Processados</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStreams}</div>
            <p className="text-xs text-muted-foreground">Histórico completo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conexões WebSocket</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.websocketConnections}</div>
            <p className="text-xs text-muted-foreground">Clientes conectados</p>
          </CardContent>
        </Card>
      </div>

      {/* Utilização de Recursos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Utilização de Recursos
          </CardTitle>
          <CardDescription>Capacidade atual de processamento de streams</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Streams Ativos</span>
              <span>
                {stats.activeStreams}/{stats.maxConcurrentStreams}
              </span>
            </div>
            <Progress value={utilizationPercentage} className="h-2" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Utilização: {utilizationPercentage.toFixed(1)}%</span>
            <span>{utilizationPercentage < 50 ? "Baixa" : utilizationPercentage < 80 ? "Moderada" : "Alta"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Atividade Recente */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Últimas ações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        activity.type === "started"
                          ? "default"
                          : activity.type === "completed"
                            ? "secondary"
                            : activity.type === "error"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
