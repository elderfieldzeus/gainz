import Link from "next/link"
import { Dumbbell, Flame } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-metal-gradient">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-red-600" />
          <p className="text-sm text-gray-300 font-medium flex items-center">
            GAINZ <Flame className="h-3 w-3 ml-1 mr-4 text-red-500" /> © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}

