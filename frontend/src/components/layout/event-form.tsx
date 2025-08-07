"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUIStore } from "@/stores/ui-store"
import { useAuthStore } from "@/stores/authStore"
import { useCreateEvent, useUpdateEvent } from "@/hooks/use-events"
import { Event } from "@/types/types"

interface EventFormProps {
  editingEvent: Event | null
  onClose: () => void
}

export function EventForm({ editingEvent, onClose }: EventFormProps) {
  const { isEventFormOpen, setEventFormOpen } = useUIStore()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    eventName: "",
    desc: "",
    startDate: "",
    endDate: "",
    image: "",
  })

  const [now, setNow] = useState("")

  const createEventMutation = useCreateEvent()
  const updateEventMutation = useUpdateEvent()
  const currentMutation = editingEvent ? updateEventMutation : createEventMutation
  const isPending = currentMutation.isPending

  useEffect(() => {
    const nowDate = new Date().toISOString().slice(0, 16)
    setNow(nowDate)

    if (editingEvent) {
      setFormData({
        eventName: editingEvent.eventName,
        desc: editingEvent.desc,
        startDate: new Date(editingEvent.startDate).toISOString().slice(0, 16),
        endDate: new Date(editingEvent.endDate).toISOString().slice(0, 16),
        image: editingEvent.image || "",
      })
    } else {
      setFormData({
        eventName: "",
        desc: "",
        startDate: "",
        endDate: "",
        image: "",
      })
    }
  }, [editingEvent])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (editingEvent) {
      updateEventMutation.mutate(
        { id: editingEvent.id, ...formData } as any,
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] })
            onClose()
          },
        }
      )
    } else {
      createEventMutation.mutate(
        { ...formData, organizerId: user.id } as any,
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] })
            onClose()
          },
        }
      )
    }
  }

  if (!isEventFormOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{editingEvent ? "Edit Event" : "Create New Event"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/placeholder.svg?height=200&width=400"
              />
            </div>

            <div>
              <Label htmlFor="startDate">Start Date & Time</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value
                  setFormData((prev) => ({
                    ...prev,
                    startDate: newStartDate,
                    // If endDate is earlier than new startDate, reset it
                    endDate: prev.endDate < newStartDate ? "" : prev.endDate,
                  }))
                }}
                required
                min={now}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date & Time</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                min={formData.startDate || now}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isPending ? "Saving..." : editingEvent ? "Save Changes" : "Create Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
