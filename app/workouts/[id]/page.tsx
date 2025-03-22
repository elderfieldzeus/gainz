"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ArrowLeft, Plus, Trash2, Activity } from "lucide-react"
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

interface Exercise {
  id: number
  name: string
  description: string
}

interface WorkoutExercise {
  id: number
  workoutId: number
  sets: number
  reps: number
  weight: number
  exercise: Exercise
}

export default function WorkoutDetailPage() {
  const params = useParams()
  const workoutId = Number(params.id)

  const [workout, setWorkout] = useState<Workout | null>(null)
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([])
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [newWorkoutExercise, setNewWorkoutExercise] = useState({
    exerciseId: 0,
    sets: 3,
    reps: 10,
    weight: 0,
  })

  const [exerciseToRemove, setExerciseToRemove] = useState<number | null>(null)

  // Simulate fetching workout details from API
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('JWT') ?? '';

        if (!token) return
  
        const response = await fetch(API_URL + '/workout/' + workoutId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
          }
        });
  
        const result: Workout  = await response.json();
  
        setWorkout({
          ...result
        });
        setIsLoading(false)
      })()
  }, [workoutId])

  // Simulate fetching workout exercises from API
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('JWT') ?? '';

        if (!token) return
  
        const response = await fetch(API_URL + '/workout/' + workoutId + '/exercise', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
          }
        });
  
        const result: WorkoutExercise[]  = await response.json();
  
        setWorkoutExercises(result);
        setIsLoading(false)
      })()
  }, [workoutId])

  // Simulate fetching available exercises from API
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('JWT') ?? '';

      if (!token) return

      const response = await fetch(API_URL + '/exercise', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token 
        }
      });

      const result: Exercise[]  = await response.json();

      setAvailableExercises(result);
      setIsLoading(false)
    })()
  }, [])

  const handleAddExerciseToWorkout = async () => {
    const exercise = availableExercises.find((ex) => ex.id === newWorkoutExercise.exerciseId)

    if (exercise) {
      const token = localStorage.getItem('JWT') ?? '';

      if (!token) return

      const response = await fetch(API_URL + '/workout/' + workoutId + '/exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify(newWorkoutExercise)
      });

      const result: WorkoutExercise  = await response.json();

      setWorkoutExercises(prev => [...prev, result]);
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  const handleRemoveExerciseFromWorkout = async (id: number) => {
    const exercise = workoutExercises.find((ex) => ex.id === id)

    if (exercise) {
      const token = localStorage.getItem('JWT') ?? '';

      if (!token) return

      const response = await fetch(API_URL + '/workout-exercise/' + exercise.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token 
        }
      });

      const result: WorkoutExercise  = await response.json();

      if (result) {
        setWorkoutExercises(prev => prev.filter((we) => we.id !== id));
      }

      setIsLoading(false)
      setExerciseToRemove(null)
    }
  }

  return (
    <AuthCheck>
      {isLoading ? (
        <div className="container py-10">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-100 rounded mb-4"></div>
            <div className="h-4 w-full max-w-md bg-gray-100/70 rounded mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-100/50 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ) : !workout ? (
        <div className="container py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Workout not found</h1>
            <p className="mt-2 text-muted-foreground">The workout you're looking for doesn't exist.</p>
            <Link href="/workouts">
              <Button className="mt-4 bg-red-500 hover:bg-white">Back to Workouts</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="container py-10">
          <Link href="/workouts" className="flex items-center text-white hover:text-red-700 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workouts
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">{workout.title}</h1>
            <p className="text-muted-foreground mt-2">{workout.description}</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Exercises</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-700 hover:bg-red-800">
                  <Plus className="mr-2 h-4 w-4" /> Add Exercise
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Exercise to Workout</DialogTitle>
                  <DialogDescription>Select an exercise and specify sets, reps, and weight</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="exercise" className="text-right">
                      Exercise
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setNewWorkoutExercise({ ...newWorkoutExercise, exerciseId: Number(value) })
                      }
                      value={newWorkoutExercise.exerciseId.toString()}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select exercise" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableExercises.map((exercise) => (
                          <SelectItem key={exercise.id} value={exercise.id.toString()}>
                            {exercise.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sets" className="text-right">
                      Sets
                    </Label>
                    <Input
                      id="sets"
                      type="number"
                      value={newWorkoutExercise.sets}
                      onChange={(e) => setNewWorkoutExercise({ ...newWorkoutExercise, sets: Number(e.target.value) })}
                      min={1}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reps" className="text-right">
                      Reps
                    </Label>
                    <Input
                      id="reps"
                      type="number"
                      value={newWorkoutExercise.reps}
                      onChange={(e) => setNewWorkoutExercise({ ...newWorkoutExercise, reps: Number(e.target.value) })}
                      min={1}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="weight" className="text-right">
                      Weight (lbs)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={newWorkoutExercise.weight}
                      onChange={(e) => setNewWorkoutExercise({ ...newWorkoutExercise, weight: Number(e.target.value) })}
                      min={0}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    className="bg-red-500 hover:bg-white"
                    onClick={handleAddExerciseToWorkout}
                    disabled={!newWorkoutExercise.exerciseId}
                  >
                    Add to Workout
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {workoutExercises.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-700 bg-gray-800 rounded-lg">
              <p className="text-muted-foreground">No exercises added to this workout yet.</p>
              <Button className="mt-4 bg-red-500 hover:bg-white" onClick={() => setIsDialogOpen(true)}>
                Add Your First Exercise
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {workoutExercises.map((workoutExercise) => (
                <Card key={workoutExercise.id} className="border-gray-700 bg-gray-800">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                      <CardTitle className="text-white flex items-center">
                        <Activity className="mr-2 h-5 w-5" />
                        {workoutExercise.exercise.name}
                      </CardTitle>
                      <CardDescription>
                        {workoutExercise.exercise.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setExerciseToRemove(workoutExercise.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <p className="text-xs text-muted-foreground">Sets</p>
                        <p className="font-medium text-gray-800">{workoutExercise.sets}</p>
                      </div>
                      <div className="bg-gray-100 p-2 rounded-md">
                        <p className="text-xs text-muted-foreground">Reps</p>
                        <p className="font-medium text-gray-800">{workoutExercise.reps}</p>
                      </div>
                      <div className="bg-gray-100 p-2 rounded-md">
                        <p className="text-xs text-muted-foreground">Weight</p>
                        <p className="font-medium text-gray-800">{workoutExercise.weight} lbs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <Dialog open={exerciseToRemove !== null} onOpenChange={(open) => !open && setExerciseToRemove(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove this exercise from the workout? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setExerciseToRemove(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => exerciseToRemove && handleRemoveExerciseFromWorkout(exerciseToRemove)}
                >
                  Remove
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </AuthCheck>
  )
}

