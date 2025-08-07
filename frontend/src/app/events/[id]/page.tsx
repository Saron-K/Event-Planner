// src/app/events/[id]/page.tsx

"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Calendar, MapPin, Clock, Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { eventsApi } from "@/lib/event"
import { useAuthStore } from "@/stores/authStore"
import { Navbar } from "@/components/layout/navbar"
import { useEvent } from "@/hooks/use-events"
import { useUIStore } from "@/stores/ui-store"
import { SubEventForm } from "@/components/layout/subevent-form"
import { DeleteSubEventDialog } from "@/components/layout/delete-subevent-dialog" // <-- Import new component
import { useEffect } from "react"

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore() // <-- Get user for role check
  const eventId = params.id as string
  const { setSubEventFormOpen, setEditingSubEvent, setIsSubEventEditMode } = useUIStore() // <-- Add new functions

  const { data: event, isLoading: eventLoading, error: eventError, refetch } = useEvent(Number(eventId))

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleEditSubEvent = (subEvent: any) => {
    setEditingSubEvent(subEvent)
    setIsSubEventEditMode(true)
    setSubEventFormOpen(true, eventId)
  }

  const handleDeleteSuccess = () => {
    refetch()
  }

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (eventError || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-600 mb-4">The event you are looking for does not exist.</p>
          <Button onClick={() => router.push("/")}>Back to Events</Button>
        </div>
      </div>
    )
  }

  const canEditOrDelete = user?.role === "organiser" || user?.role === "admin"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          <Navbar />
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <Image src={event.image || "/event.jpg"}
              alt={event.eventName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover" />
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.eventName}</h1>
            <p className="text-gray-600 mb-6">{event.desc}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">Start Date</p>
                  <p className="text-sm">{formatDate(event.startDate)}</p>
                  <p className="text-sm">{formatTime(event.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">End Date</p>
                  <p className="text-sm">{formatDate(event.endDate)}</p>
                  <p className="text-sm">{formatTime(event.endDate)}</p>
                </div>
              </div>
              {canEditOrDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSubEventFormOpen(true, event.id.toString())
                    setEditingSubEvent(null)
                    setIsSubEventEditMode(false)
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" /> Add SubEvent
                </Button>
              )}
            </div>
          </div>
        </div>

        {event.subEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Event Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.subEvents.map((subEvent: any) => (
                  <div key={subEvent.id} className="border rounded-lg p-4 relative">
                    {canEditOrDelete && (
                      <div className="absolute top-2 right-2 flex gap-2 z-10">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/80 hover:bg-white rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditSubEvent(subEvent)
                          }}
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </Button>
                        <DeleteSubEventDialog
                          subEvent={subEvent}
                          onClose={handleDeleteSuccess}
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary">{subEvent.subEventName}</Badge>
                          <h3 className="font-semibold">{subEvent.subEventName}</h3>
                        </div>
                        <p className="text-gray-600 mb-2">{subEvent.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatDate(subEvent.startDate)} at {formatTime(subEvent.startDate)}
                      {` - `}
                      {formatDate(subEvent.endDate)} at {formatTime(subEvent.endDate)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {event.subEvents.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No subEvents scheduled yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
      <SubEventForm />
    </div>
  )
}