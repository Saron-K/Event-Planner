import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog"
  import { Calendar, Pencil, Trash } from "lucide-react"
import { useDeleteEvent } from "@/hooks/use-events"
  import { useState, useEffect } from "react"
import { Button } from "../ui/button"


export function DeleteEventDialog({
    eventId,
    onClose,
  }: {
    eventId: number
    onClose: () => void
  }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const deleteEventMutation = useDeleteEvent()
  
    const handleDelete = () => {
      deleteEventMutation.mutate(eventId, {
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
              <DialogTitle>Delete Event</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this event? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                disabled={deleteEventMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
                disabled={deleteEventMutation.isPending}
              >
                {deleteEventMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }