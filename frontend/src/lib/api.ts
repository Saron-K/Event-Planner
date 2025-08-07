import { setTokenInStorage } from "./auth-utils"
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/types"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005"


export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new ApiError(response.status, errorData.message || "An error occurred")
  }
  return response.json()
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log({API_BASE_URL})
    console.log({credentials})
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await handleResponse(response)

    setTokenInStorage(data.access_token)
    return data
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await handleResponse(response)

    setTokenInStorage(data.access_token)

    return data
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem("auth_token")
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      } catch (error) {
        console.error("Logout error:", error)
      }
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      throw new ApiError(401, "No token available")
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await handleResponse(response)

    setTokenInStorage(data.access_token)

    return data
  },
}
