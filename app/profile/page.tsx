"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { AuthCheck } from "@/components/auth-check"
import { User, Loader2, Flame } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    height: "5'10\"",
    weight: "180",
    goal: "Build muscle",
  })

  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateMessage("")

    // Simulate API call
    setTimeout(() => {
      setUpdateMessage("Profile updated successfully!")
      setIsUpdating(false)
    }, 1000)
  }

  return (
    <AuthCheck>
      <div className="container py-10">
        <h1 className="text-3xl font-bold text-white uppercase flex items-center mb-10">
            MY PROFILE <Flame className="ml-2 h-6 w-6 text-red-500" />
          </h1>

        <Card className="border-gray-700 bg-gray-800 max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white">
              <User className="h-8 w-8 text-gray-800" />
            </div>
            <div>
              <CardTitle className="text-white">{user?.name}</CardTitle>
              <CardDescription className="text-white">{user?.email}</CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleProfileUpdate}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  className="select-none cursor-default"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  className="select-none cursor-default"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {updateMessage && <p className="text-sm text-green-600">{updateMessage}</p>}
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthCheck>
  )
}

