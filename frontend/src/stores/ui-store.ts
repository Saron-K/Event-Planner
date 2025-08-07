import { create } from "zustand"
import { Event, SubEvent } from "@/types/types" 
interface UIState {
  isEventFormOpen: boolean
  setEventFormOpen: (isOpen: boolean) => void
  isSubEventFormOpen: boolean
  setSubEventFormOpen: (isOpen: boolean, eventId?: string) => void 
  selectedEventId: string | null 
  editingEvent: Event | null
  setEditingEvent: (event: Event | null) => void
  isEditMode: boolean
  setIsEditMode: (isEdit: boolean) => void
  editingSubEvent: SubEvent | null 
  setEditingSubEvent: (subEvent: SubEvent | null) => void 
  isSubEventEditMode: boolean
  setIsSubEventEditMode: (isEdit: boolean) => void 
}

export const useUIStore = create<UIState>((set) => ({
  isEventFormOpen: false,
  setEventFormOpen: (isOpen: boolean) => set({ isEventFormOpen: isOpen }),
  isSubEventFormOpen: false,
  setSubEventFormOpen: (isOpen: boolean, eventId?: string) =>
    set({ isSubEventFormOpen: isOpen, selectedEventId: eventId ?? null }),
  selectedEventId: null,
  editingEvent: null,
  setEditingEvent: (event: Event | null) => set({ editingEvent: event }),
  isEditMode: false,
  setIsEditMode: (isEdit) => set({ isEditMode: isEdit }),
  editingSubEvent: null, 
  setEditingSubEvent: (subEvent) => set({ editingSubEvent: subEvent }),
  isSubEventEditMode: false, 
  setIsSubEventEditMode: (isEdit) => set({ isSubEventEditMode: isEdit }), 
}))
