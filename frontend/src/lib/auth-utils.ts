import { jwtDecode } from "jwt-decode"
import { User, JWTPayload } from "@/types/types"

export const getTokenFromStorage = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export const setTokenInStorage = (token: string): void => {
  localStorage.setItem("auth_token", token)
}

export const removeTokenFromStorage = (): void => {
  localStorage.removeItem("auth_token")
}

export const decodeToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    if (decoded.exp * 1000 < Date.now()) {
      removeTokenFromStorage()
      return null
    }
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    }
  } catch {
    return null
  }
}

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    return decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}
