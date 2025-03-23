"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("gainz-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // In a real app, this would call your API
    // return fetch('/api/users/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // }).then(res => res.json())
    

    // Mock implementation
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation - in a real app, this would be handled by your API
    if (email && password) {
      const response = await fetch('https://gainz-api.dcism.org/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (!result || result.id === -1) {
        setIsLoading(false)
        return false
      }

      const user = {
        id: result.id,
        name: result.username,
        email: result.email
      }

      setUser(user)
      localStorage.setItem("JWT", result.token);
      localStorage.setItem("JWTexpiry", new Date().getTime() + result.expiration);
      localStorage.setItem("gainz-user", JSON.stringify(user));
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    // Simple validation - in a real app, this would be handled by your API
    if (name && email && password) {
      const response = await fetch('https://gainz-api.dcism.org/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          username: name,
          email,
          password
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      setIsLoading(false)
      return (!result) ? false : true;
    }

    setIsLoading(false)
    return false;
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("JWT")
    localStorage.removeItem("gainz-user")
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

