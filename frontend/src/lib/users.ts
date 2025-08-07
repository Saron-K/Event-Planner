import { getTokenFromStorage } from "@/lib/auth-utils"
import { User } from "@/types/types"
import { API_BASE_URL } from "./api"

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

export const usersApi = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  async updateUserRole(userId: string, newRole: "viewer" | "admin" | "organiser"): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role: newRole }),
    })
    return handleResponse(response)
  },
}
