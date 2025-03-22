import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dumbbell, Users, ListChecks, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-carbon-fiber relative overflow-hidden">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl text-white uppercase">
                  <span className="text-red-600">FORGE</span> YOUR <span className="text-red-600">LEGACY</span>
                </h1>
                <p className="max-w-[700px] text-gray-300 md:text-xl font-medium">
                  Track your workouts, crush your goals, and dominate the gym!
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/workouts">
                  <Button className="bg-red-700 hover:bg-red-800 text-white font-bold text-lg px-8 py-6 rounded-md">
                    GET STARTED <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border border-gray-800 p-6 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all transform hover:scale-105 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                <div className="p-3 rounded-full bg-gray-700">
                  <Users className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">USER PROFILES</h3>
                <p className="text-center text-gray-400">Create your profile and track your fitness journey</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-gray-800 p-6 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all transform hover:scale-105 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                <div className="p-3 rounded-full bg-gray-700">
                  <Dumbbell className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">EXERCISE LIBRARY</h3>
                <p className="text-center text-gray-400">Browse and add exercises to your workout routines</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-gray-800 p-6 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all transform hover:scale-105 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                <div className="p-3 rounded-full bg-gray-700">
                  <ListChecks className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">WORKOUT TRACKING</h3>
                <p className="text-center text-gray-400">Log your workouts and monitor your progress</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

