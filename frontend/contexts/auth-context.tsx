"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserRole } from "@/types/user"

interface AuthContextType {
  user: UserRole | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers: (UserRole & { password: string })[] = [
  {
    id: "1",
    name: "Иван Петров",
    role: "chief_logistician",
    email: "chief@logistics.com",
    password: "chief123",
  },
  {
    id: "2",
    name: "Мария Сидорова",
    role: "logistician",
    email: "maria@logistics.com",
    password: "maria123",
  },
  {
    id: "3",
    name: "Алексей Козлов",
    role: "logistician",
    email: "alex@logistics.com",
    password: "alex123",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("logistics_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("logistics_user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("logistics_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
