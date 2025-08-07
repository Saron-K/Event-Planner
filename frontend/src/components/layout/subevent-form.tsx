"use client"

import type React from "react"
import { useState, useEffect } from "react" // Import useEffect
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { eventsApi } from "@/lib/event"
import { useUIStore } from "@/stores/ui-store"
import { useCreateSubEvent, useUpdateSubEvent } from "@/hooks/use-events" // Import useUpdateSubEvent

export function SubEventForm() {
  const {
    isSubEventFormOpen,
    selectedEventId,
    setSubEventFormOpen,
    editingSubEvent,
    setEditingSubEvent,
    isSubEventEditMode,
    setIsSubEventEditMode,
  } = useUIStore()

  const initialFormData = {
    subEventName: "",
    desc: "",
    startDate: "",
    endDate: "",
    image: undefined as File | undefined,
  }

  const [formData, setFormData] = useState(initialFormData)

  const createSubEventMutation = useCreateSubEvent()
  const updateSubEventMutation = useUpdateSubEvent()

  useEffect(() => {
    if (isSubEventEditMode && editingSubEvent) {
      setFormData({
        subEventName: editingSubEvent.subEventName,
        desc: editingSubEvent.desc,
        startDate: editingSubEvent.startDate.substring(0, 16),
        endDate: editingSubEvent.endDate.substring(0, 16),
        image: undefined,
      })
    } else {
      setFormData(initialFormData)
    }
  }, [isSubEventEditMode, editingSubEvent, isSubEventFormOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEventId && !isSubEventEditMode) return
    const subEventData = {
      ...formData,
      eventId: isSubEventEditMode && editingSubEvent ? editingSubEvent.eventId : Number(selectedEventId),
    }

    if (!subEventData.image) {
      delete (subEventData as any).image
    }

    if (isSubEventEditMode && editingSubEvent) {
      updateSubEventMutation.mutate({ id: editingSubEvent.id, ...subEventData } as any)
    } else {
      createSubEventMutation.mutate(subEventData as any)
    }

    setSubEventFormOpen(false)
    setEditingSubEvent(null)
    setIsSubEventEditMode(false)
    setFormData(initialFormData)
  }

  if (!isSubEventFormOpen) return null

  const isPending = createSubEventMutation.isPending || updateSubEventMutation.isPending

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isSubEventEditMode ? "Edit Sub-event" : "Add Sub-event"}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSubEventFormOpen(false)
              setEditingSubEvent(null)
              setIsSubEventEditMode(false)
              setFormData(initialFormData)
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Sub-event Title</Label>
              <Input
                id="title"
                value={formData.subEventName}
                onChange={(e) => setFormData({ ...formData, subEventName: e.target.value })}
                required
              />
            </div>
            {/* <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "session" | "webinar" | "workshop" | "panel") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="session">Session</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="panel">Panel</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <div>
              <Label htmlFor="startDate">Start Date & Time</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date & Time</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                min={formData.startDate} // 👈 prevents choosing a time earlier than start
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSubEventFormOpen(false)
                  setEditingSubEvent(null)
                  setIsSubEventEditMode(false)
                  setFormData(initialFormData) // Ensure form is reset on cancel
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isPending ? (isSubEventEditMode ? "Updating..." : "Adding...") : isSubEventEditMode ? "Update Sub-event" : "Add Sub-event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
