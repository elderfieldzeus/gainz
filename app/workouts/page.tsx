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
import { Dumbbell, Plus, Trash2, Flame } from "lucide-react"
import Link from "next/link"
import { AuthCheck } from "@/components/auth-check"
import { API_URL } from "@/lib/utils"

interface Workout {
  id: number
  title: string
  description: string
  userId: number
  date: string
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [newWorkout, setNewWorkout] = useState({ title: "", description: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [workoutToDelete, setWorkoutToDelete] = useState<number | null>(null)

  // Simulate fetching workouts from API
  useEffect(() => {
    (async () => {
      const user = JSON.parse(localStorage.getItem('gainz-user') ?? '')
      const token = localStorage.getItem('JWT') ?? '';

      if (!user || !token) return

      const response = await fetch(API_URL + '/workout/user/' + user.id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token 
        }
      });

      const result: Workout[]  = await response.json();

      setWorkouts(result);
      setIsLoading(false)
    })()

  }, [])

  const handleCreateWorkout = async () => {
    const user = JSON.parse(localStorage.getItem('gainz-user') ?? '')
    const token = localStorage.getItem('JWT') ?? '';

    if (!user || !token) return

    const response = await fetch(API_URL + '/workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token 
      },
      body: JSON.stringify({
        ...newWorkout,
        userId: user.id
      })
    });

    const result: Workout = await response.json();

    setWorkouts(prev => [...prev, result])
    setNewWorkout({ title: "", description: "" })
    setIsDialogOpen(false)
  }

  const handleDeleteWorkout = async (id: number) => {
    const token = localStorage.getItem('JWT') ?? '';

    if (!token) return

    const response = await fetch(API_URL + '/workout/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token 
      }
    });

    const result = await response.json();

    if (result) {
      setWorkouts(workouts.filter((workout) => workout.id !== id))
    }
   
    setWorkoutToDelete(null)
  }

  return (
    <AuthCheck>
      <div className="container py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white uppercase flex items-center">
            MY WORKOUTS <Flame className="ml-2 h-6 w-6 text-red-500" />
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-700 hover:bg-red-800 text-white font-bold">
                <Plus className="mr-2 h-4 w-4" /> NEW WORKOUT
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">CREATE NEW WORKOUT</DialogTitle>
                <DialogDescription className="text-gray-400">Add a new workout to your collection</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-gray-300">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newWorkout.title}
                    onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
                    className="col-span-3 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right text-gray-300">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newWorkout.description}
                    onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
                    className="col-span-3 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="bg-red-700 hover:bg-red-800 text-white font-bold"
                  onClick={handleCreateWorkout}
                  disabled={!newWorkout.title}
                >
                  CREATE WORKOUT
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse bg-gray-800 border-gray-700">
                <CardHeader className="h-24 bg-gray-700/50"></CardHeader>
                <CardContent className="h-20 mt-4 bg-gray-700/30"></CardContent>
                <CardFooter className="h-10 mt-2 bg-gray-700/20"></CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <Card
                key={workout.id}
                className="border-gray-700 bg-gray-800 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Dumbbell className="mr-2 h-5 w-5 text-red-500" />
                    {workout.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">{workout.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Created: {new Date(workout.date ?? '').toLocaleDateString()}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/workouts/${workout.id}`}>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white font-bold"
                    >
                      VIEW DETAILS
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-400 hover:bg-gray-700"
                    onClick={() => setWorkoutToDelete(workout.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        <Dialog open={workoutToDelete !== null} onOpenChange={(open) => !open && setWorkoutToDelete(null)}>
          <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">CONFIRM DELETION</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete this workout? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setWorkoutToDelete(null)}
                className="border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white"
              >
                CANCEL
              </Button>
              <Button
                variant="destructive"
                onClick={() => workoutToDelete && handleDeleteWorkout(workoutToDelete)}
                className="bg-red-700 hover:bg-red-800 text-white font-bold"
              >
                DELETE
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthCheck>
  )
}

