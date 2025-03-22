"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Flame, Trash2 } from "lucide-react"
import { AuthCheck } from "@/components/auth-check"
import { API_URL } from "@/lib/utils"

interface Exercise {
  id: number
  name: string
  description: string
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [newExercise, setNewExercise] = useState({
    name: "",
    description: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null)

  // Simulate fetching exercises from API
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('JWT') ?? '';

      if (!token) return

      const response = await fetch(API_URL + '/exercise', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token 
        },
      });

      const result: Exercise[] = await response.json();

      setExercises(result)
      setIsLoading(false)
    })()
  }, [])

  const handleCreateExercise = () => {
    (async () => {
      const token = localStorage.getItem('JWT') ?? '';

      if (!token) return

      const response = await fetch(API_URL + '/exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify(newExercise)
      });

      const result: Exercise = await response.json();

      setExercises(prev => [...prev, result])
      setIsLoading(false)
      setIsDialogOpen(false)
    })()
  }

  return (
    <AuthCheck>
      <div className="container py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white uppercase flex items-center">
            EXERCISE ARSENAL <Flame className="ml-2 h-6 w-6 text-red-500" />
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-700 hover:bg-red-800 text-white font-bold">
                <Plus className="mr-2 h-4 w-4" /> NEW EXERCISE
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">ADD NEW EXERCISE</DialogTitle>
                <DialogDescription className="text-gray-400">Create a new exercise for your workouts</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-gray-300">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    className="col-span-3 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right text-gray-300">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newExercise.description}
                    onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                    className="col-span-3 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="bg-red-700 hover:bg-red-800 text-white font-bold"
                  onClick={handleCreateExercise}
                  disabled={!newExercise.name || !newExercise.description}
                >
                  ADD EXERCISE
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse bg-gray-800 border-gray-700">
                <CardHeader className="h-24 bg-gray-700/50"></CardHeader>
                <CardContent className="h-20 mt-4 bg-gray-700/30"></CardContent>
                <CardFooter className="h-10 mt-2 bg-gray-700/20"></CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exercises.map((exercise) => (
              <Card
                key={exercise.id}
                className="border-gray-700 bg-gray-800 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Flame className="mr-2 h-5 w-5 text-red-500" />
                    {exercise.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">{exercise.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                 
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AuthCheck>
  )
}

