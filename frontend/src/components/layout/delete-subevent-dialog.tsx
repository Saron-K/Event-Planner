"use client"

import { useState } from "react"
import { Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteSubEvent } from "@/hooks/use-events"
import { SubEvent } from "@/types/types"

export function DeleteSubEventDialog({
  subEvent,
  onClose,
}: {
  subEvent: SubEvent
  onClose: () => void
}) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const deleteSubEventMutation = useDeleteSubEvent()

  const handleDelete = () => {
    deleteSubEventMutation.mutate(
      { id: Number(subEvent.id), eventId: Number(subEvent.eventId) },
      {
        onSuccess: () => {
          setShowConfirmDialog(false)
          onClose()
        },
    })
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="bg-white/80 hover:bg-white rounded-full"
        onClick={(e) => {
          e.stopPropagation()
          setShowConfirmDialog(true)
        }}
      >
        <Trash className="w-4 h-4 text-red-600" />
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delete Sub-event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the sub-event{" "}
              <span className="font-semibold">
                {subEvent?.subEventName || "Untitled"}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={deleteSubEventMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleteSubEventMutation.isPending}
            >
              {deleteSubEventMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
