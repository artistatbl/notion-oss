import WaitlistPage from "@/components/waitlist/waitlist-page"
import { cn } from "@/lib/utils"


export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative isolate">
      <WaitlistPage/>
    </main>
  )
}
