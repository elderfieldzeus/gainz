"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { Dumbbell } from "lucide-react"

export function AuthCheck({ children }: { children: ReactNode }) {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const expirationTime = localStorage.getItem('JWTexpiry') ?? '';

    if (!isLoading && (!user || !expirationTime || Number(expirationTime) < new Date().getTime())) {
      signOut()
      router.push("/signin")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center">
          <Dumbbell className="h-12 w-12 text-pink-500 animate-pulse" />
          <p className="mt-4 text-pink-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

