import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { eventsApi, type ApiError } from "@/lib/event"
import { Event, SubEvent, DeleteSubEventParams } from "@/types/types"
import { useAuthStore } from "@/stores/authStore"

// Query Keys
export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
  byCreator: (creatorId: number) => [...eventKeys.all, "creator", creatorId] as const,
}

export const subEventKeys = {
  all: ["subevents"] as const,
  lists: () => [...subEventKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...subEventKeys.lists(), { filters }] as const,
  details: () => [...subEventKeys.all, "detail"] as const,
  detail: (id: number) => [...subEventKeys.details(), id] as const,
  byEvent: (eventId: number) => [...subEventKeys.all, "event", eventId] as const,
  byCreator: (creatorId: number) => [...subEventKeys.all, "creator", creatorId] as const,
}

// Event Hooks
export function useEvents() {
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: eventsApi.getEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useEvent(id: number) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getEvent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useEventsByCreator(creatorId: number) {
  const { user } = useAuthStore()
  const isAdmin = user?.role === "admin"

  return useQuery({
    queryKey: eventKeys.byCreator(creatorId),
    queryFn: () => eventsApi.getEventsByCreator(creatorId),
    enabled: !!creatorId && isAdmin, 
    staleTime: 5 * 60 * 1000,
  })
}

export function useSubEvents(eventId: number) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: subEventKeys.byEvent(eventId),
    queryFn: () => eventsApi.getSubEvents(eventId),
    enabled: !!eventId , 
    staleTime: 5 * 60 * 1000,
  })
}

export function useSubEvent(id: number) {
  const { user } = useAuthStore()
  const isAdmin = user?.role === "admin"

  return useQuery({
    queryKey: subEventKeys.detail(id),
    queryFn: () => eventsApi.getSubEvent(id),
    enabled: !!id && isAdmin,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSubEventsByCreator(creatorId: number) {
  const { user } = useAuthStore()
  const isAdmin = user?.role === "admin"

  return useQuery({
    queryKey: subEventKeys.byCreator(creatorId),
    queryFn: () => eventsApi.getSubEventsByCreator(creatorId),
    enabled: !!creatorId && isAdmin,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: eventsApi.createEvent,
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

      queryClient.setQueryData(eventKeys.detail(Number(newEvent.id)), newEvent)

      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: eventKeys.byCreator(Number(user.id)) })
      }

      toast.success("Event created successfully!")
    },
    onError: (error: ApiError) => {
      if (error.status === 403) {
        toast.error("You don't have permission to create events. Admin access required.")
      } else {
        toast.error(error.message || "Failed to create event")
      }
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: eventsApi.updateEvent,
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(eventKeys.detail(Number(updatedEvent.id)), updatedEvent)

      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: eventKeys.byCreator(Number(user.id)) })
      }

      toast.success("Event updated successfully!")
    },
    onError: (error: ApiError) => {
      if (error.status === 403) {
        toast.error("You don't have permission to update events. Admin access required.")
      } else {
        toast.error(error.message || "Failed to update event")
      }
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: eventsApi.deleteEvent,
    onSuccess: (_, deletedEventId) => {
      queryClient.removeQueries({ queryKey: eventKeys.detail(deletedEventId) })

      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

      queryClient.invalidateQueries({ queryKey: eventKeys.all })

      queryClient.invalidateQueries({ queryKey: subEventKeys.all })

      toast.success("Event deleted successfully!")
    },
    onError: (error: ApiError) => {
      if (error.status === 403) {
        toast.error("You don't have permission to delete events. Admin access required.")
      } else {
        toast.error(error.message || "Failed to delete event")
      }
    },
  })
}

// SubEvent Mutations (Admin only)
export function useCreateSubEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eventsApi.createSubEvent,
    onSuccess: (newSubEvent) => {
      // Invalidate the parent event to refetch with new subevent
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(Number(newSubEvent.eventId)) })

      // Invalidate subevents for this event
      queryClient.invalidateQueries({ queryKey: subEventKeys.byEvent(Number(newSubEvent.eventId)) })

      // Invalidate creator's subevents
      queryClient.invalidateQueries({ queryKey: subEventKeys.byCreator(Number(newSubEvent.creatorId)) })

      // Invalidate events list to show updated subevent count
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })

      toast.success("Sub-event created successfully!")
    },
    onError: (error: ApiError) => {
      if (error.status === 403) {
        toast.error("You don't have permission to create sub-events. Admin access required.")
      } else {
        toast.error(error.message || "Failed to create sub-event")
      }
    },
  })
}

export function useUpdateSubEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eventsApi.updateSubEvent,
    onSuccess: (updatedSubEvent) => {
      // Update the specific subevent in cache
      queryClient.setQueryData(subEventKeys.detail(Number(updatedSubEvent.id)), updatedSubEvent)

      // Invalidate the parent event
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(Number(updatedSubEvent.eventId)) })

      // Invalidate subevents for this event
      queryClient.invalidateQueries({ queryKey: subEventKeys.byEvent(Number(updatedSubEvent.eventId)) })

      // Invalidate creator's subevents
      queryClient.invalidateQueries({ queryKey: subEventKeys.byCreator(Number(updatedSubEvent.creatorId)) })

      toast.success("Sub-event updated successfully!")
    },
    onError: (error: ApiError) => {
      if (error.status === 403) {
        toast.error("You don't have permission to update sub-events. Admin access required.")
      } else {
        toast.error(error.message || "Failed to update sub-event")
      }
    },
  })
}

export function useDeleteSubEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:({ id, eventId }: DeleteSubEventParams) =>
      eventsApi.deleteSubEvent(id, eventId),

     onSuccess: (_, { id }) => {
      queryClient.removeQueries({ queryKey: subEventKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
      queryClient.invalidateQueries({ queryKey: subEventKeys.all })

      toast.success("Sub-event deleted successfully!")
    },
    onError: (error: ApiError) => {
      if (error.status === 403) {
        toast.error("You don't have permission to delete sub-events. Admin access required.")
      } else {
        toast.error(error.message || "Failed to delete sub-event")
      }
    },
  })
}


export function useCanEditEvent(event: Event, currentUserId?: string) {
  const { user } = useAuthStore()
  return user?.role === "admin" && event.creatorId === currentUserId
}

export function useCanEditSubEvent(subEvent: SubEvent, currentUserId?: string) {
  const { user } = useAuthStore()
  return user?.role === "admin" && subEvent.creatorId === currentUserId
}

// Check if user can perform admin actions
export function useIsAdmin() {
  const { user } = useAuthStore()
  return user?.role === "admin"
}

// Combined hook for dashboard data (Admin only)
export function useDashboardData(userId?: number) {
  const { user } = useAuthStore()
  const isAdmin = user?.role === "admin"

  const eventsQuery = useEvents()
  const userEventsQuery = useEventsByCreator(userId || 0)
  const userSubEventsQuery = useSubEventsByCreator(userId || 0)

  return {
    allEvents: eventsQuery,
    userEvents: isAdmin ? userEventsQuery : { data: [], isLoading: false, error: null },
    userSubEvents: isAdmin ? userSubEventsQuery : { data: [], isLoading: false, error: null },
    isLoading: eventsQuery.isLoading || (isAdmin && (userEventsQuery.isLoading || userSubEventsQuery.isLoading)),
    error: eventsQuery.error || (isAdmin && (userEventsQuery.error || userSubEventsQuery.error)),
    isAdmin,
  }
}
