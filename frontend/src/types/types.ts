
export interface LoginRequest {
    email: string
    password: string
  }
  
  export interface RegisterRequest {
    name: string
    email: string
    password: string
  }
  
  export interface AuthResponse {
    access_token: string
    user: {
      id: string
      email: string
      name: string
      role: "admin" | "viewer" | "organiser"
    }
  }
  export interface User {
    id: string
    email: string
    name: string
    role: "admin" | "viewer" | "organiser"
    imageUrl?: string
  }
  
  export interface JWTPayload {
    sub: string
    email: string
    name: string
    role: "admin" | "viewer" | "organiser"
    exp: number
  }
export interface SubEvent {
    id: string
    subEventName: string
    desc: string
    startDate: string
    endDate: string
    event: Event
    eventId: string
    creator: User
    creatorId: string
    image: string
   // type: "session" | "webinar" | "workshop" | "panel"
  }
  
  export interface Event {
    id: string
    eventName: string
    desc: string
    startDate: string
    endDate: string
    creator: User
    creatorId: string
    subEvents: SubEvent[]
    image: string

}
export interface CreateEventRequest {
  eventName: string
  desc: string
  startDate: string 
  endDate: string 
  image?: string
}

export interface CreateSubEventRequest {
  subEventName: string
  desc: string
  startDate: string 
  endDate: string 
  eventId: number
  image?: string
}
export interface DeleteSubEventParams  {
  id: number
  eventId: number
}
  