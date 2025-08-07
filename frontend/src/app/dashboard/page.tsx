"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/layout/event-card"
import { EventForm } from "@/components/layout/event-form"
import { SubEventForm } from "@/components/layout/subevent-form"
import { Navbar } from "@/components/layout/navbar"
import { useAuthStore } from "@/stores/authStore"
import { useUIStore } from "@/stores/ui-store"
import { useEvents } from "@/hooks/use-events"
import { useEffect, useState } from "react" 
import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Event } from "@/types/types" 

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore()
  const { setEventFormOpen } = useUIStore()
  const router = useRouter()
  const [editingEvent, setEditingEvent] = useState<Event | null>(null) 

  const { data: events, isLoading: eventsLoading, error, refetch } = useEvents()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, authLoading, router])

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setEventFormOpen(true)
  }

  const handleCreateEvent = () => {
    setEditingEvent(null)
    setEventFormOpen(true)
  }

  const handleCloseForm = () => {
    setEditingEvent(null)
    setEventFormOpen(false)
  }

  const getPageTitle = () => {
    if (!isAuthenticated) return "Upcoming Events"
    if (user?.role === "admin") return "Event Dashboard"
    return "Event Listings"
  }

  const getPageDescription = () => {
    if (!isAuthenticated) return "Discover amazing events happening around you"
    if (user?.role === "admin") return "Manage your events and subEvents"
    return "Browse and join events that interest you"
  }

  if (authLoading || eventsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{getPageTitle()}</h1>
              <p className="text-muted-foreground mt-2">{getPageDescription()}</p>
            </div>
            <div className="flex items-center gap-4">
            </div>
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg shadow-sm animate-pulse border">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center max-w-md">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {error instanceof Error ? error.message : "Failed to load events. Please try again later."}
                </AlertDescription>
              </Alert>
              <div className="space-x-2">
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => window.location.reload()}>Refresh Page</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{getPageTitle()}</h1>
            <p className="text-muted-foreground mt-2">{getPageDescription()}</p>
            {events && (
              <p className="text-sm text-muted-foreground mt-1">
                {events.length} {events.length === 1 ? "event" : "events"} found
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
          </div>
        </div>

        {/* Events Grid */}
        {events && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onEdit={handleEditEvent} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {events?.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              {user?.role === "admin"
                ? "Create your first event to get started"
                : "Check back later for new events"}
            </p>
            {user?.role === "admin" && (
              <Button onClick={handleCreateEvent}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
        )}

        {/* Floating Action Button for Organizers */}
        {user?.role === "admin" && events && events.length > 0 && (
          <Button
            onClick={handleCreateEvent}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-sky-600 hover:bg-sky-700 shadow-lg z-40"
            size="icon"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}

        {/* Forms */}
        <EventForm editingEvent={editingEvent} onClose={handleCloseForm} />
        <SubEventForm />
      </div>
    </div>
  )
}