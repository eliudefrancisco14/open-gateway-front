import { StreamDashboard } from "@/components/stream-dashboard"
import { StreamProvider } from "@/contexts/stream-context"

export default function Home() {
  return (
    <StreamProvider>
      <StreamDashboard />
    </StreamProvider>
  )
}
