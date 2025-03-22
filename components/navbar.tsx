"use client"

import Link from "next/link"
import { Dumbbell, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-metal-gradient border-gray-700">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Dumbbell className="h-6 w-6 text-red-600" />
          <span className="font-bold text-xl text-white tracking-wider flex items-center">
            GAINZ <Flame className="h-4 w-4 ml-1 text-red-500" />
          </span>
        </Link>
        <NavigationMenu className="mx-6">
          <NavigationMenuList>
            {user && (
              <>
                <NavigationMenuItem>
                  <Link href="/workouts" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "font-bold text-gray-200 hover:text-white hover:bg-gray-700",
                      )}
                    >
                      WORKOUTS
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/exercises" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "font-bold text-gray-200 hover:text-white hover:bg-gray-700",
                      )}
                    >
                      EXERCISES
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/profile" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "font-bold text-gray-200 hover:text-white hover:bg-gray-700",
                      )}
                    >
                      PROFILE
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <Button
              variant="outline"
              className="border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white font-bold"
              onClick={handleSignOut}
            >
              SIGN OUT
            </Button>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white font-bold"
                >
                  SIGN IN
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-red-700 hover:bg-red-800 text-white font-bold">SIGN UP</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

