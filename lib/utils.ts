import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(startTime: string, endTime?: string): string {
  if (!endTime) return "Em andamento"

  const start = new Date(startTime)
  const end = new Date(endTime)
  const diff = end.getTime() - start.getTime()

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "PROCESSING":
      return "bg-blue-500 text-white"
    case "COMPLETED":
      return "bg-green-500 text-white"
    case "ERROR":
      return "bg-red-500 text-white"
    case "PENDING":
      return "bg-yellow-500 text-white"
    case "STOPPED":
      return "bg-gray-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case "PROCESSING":
      return "Processando"
    case "COMPLETED":
      return "Concluído"
    case "ERROR":
      return "Erro"
    case "PENDING":
      return "Pendente"
    case "STOPPED":
      return "Parado"
    default:
      return status
  }
}
