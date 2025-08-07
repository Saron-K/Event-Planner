import { getTokenFromStorage } from "@/lib/auth-utils"
import { User, Event, SubEvent, CreateEventRequest, CreateSubEventRequest } from "@/types/types"
import { API_BASE_URL } from "./api"

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: number
}

export interface UpdateSubEventRequest extends Partial<CreateSubEventRequest> {
  id: number
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

const getAuthHeaders = () => {
  const token = getTokenFromStorage()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`)
  }
  return response.json()
}

export const eventsApi = {
  async getEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/event`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return handleResponse(response)
  },

  async getEvent(id: number): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  async getSubEvents(eventId: number): Promise<SubEvent[]> {
    const response = await fetch(`${API_BASE_URL}/event/${eventId}/sub-events`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/event`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    })
    return handleResponse(response)
  },

  async updateEvent(eventData: UpdateEventRequest): Promise<Event> {
    const { id, ...updateData } = eventData
    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
      method: "PATCH", 
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    })
    return handleResponse(response)
  },

  async deleteEvent(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "An error occurred" }))
      throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`)
    }
  },

  async getEventsByCreator(creatorId: number): Promise<Event[]> {  
    const response = await fetch(`${API_BASE_URL}/event?creatorId=${creatorId}`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  async createSubEvent(subEventData: CreateSubEventRequest): Promise<SubEvent> {
    const response = await fetch(`${API_BASE_URL}/event/${subEventData.eventId}/sub-event`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(subEventData),
    })
    console.log(response)
    return handleResponse(response)
  },

  async getSubEvent(id: number): Promise<SubEvent> {
    const response = await fetch(`${API_BASE_URL}/event/${id}/sub-event`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  async updateSubEvent(subEventData: UpdateSubEventRequest): Promise<SubEvent> {
    const { id, ...updateData } = subEventData
    const response = await fetch(`${API_BASE_URL}/event/${subEventData.eventId}/sub-event/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    })
    return handleResponse(response)
  },

  async deleteSubEvent(id: number, eventId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/event/${eventId}/sub-event/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "An error occurred" }))
      throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`)
    }
  },

  async getSubEventsByCreator(creatorId: number): Promise<SubEvent[]> {
    const response = await fetch(`${API_BASE_URL}/event/${creatorId}/sub-event`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },
}
