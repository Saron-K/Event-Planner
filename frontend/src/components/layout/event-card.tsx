"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { DeleteEventDialog } from "./delete-event-dialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Event } from "@/types/types"
import { useAuthStore } from "@/stores/authStore"
import { Button } from "@/components/ui/button"
import { useDeleteEvent } from "@/hooks/use-events"
import { useState } from "react"
import { Calendar, Pencil } from "lucide-react"

interface EventCardProps {
  event: Event
  onEdit?: (event: Event) => void
  onDelete?: (eventId: string) => void
}


export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleClick = () => {
    if(!isAuthenticated){
      router.push(`/auth/login`)
    }else{
      router.push(`/events/${event.id}`)
    }
  }

  const canEditOrDelete = user?.role === "admin"

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
      onClick={handleClick}
    >
      <div className="relative h-48">
        <Image
          src={event.image || "/event.jpg"}
          alt={event.eventName}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      {canEditOrDelete && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(event)
            }}
          >
            <Pencil className="w-4 h-4 text-blue-600" />
          </Button>

          <DeleteEventDialog
            eventId={Number(event.id)}
            onClose={() => {
              if (onDelete) onDelete(event.id.toString())
            }}
          />
        </div>
      )}

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{event.eventName}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDate(event.startDate)} - {formatDate(event.endDate)}
        </div>
      </CardContent>
    </Card>
  )
}
