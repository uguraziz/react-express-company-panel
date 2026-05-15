import { createContext, useContext, useState, ReactNode } from 'react'
import api from '../services/api'

interface User {
  id: number
  username: string
}

interface AuthContextType {
  currentUser: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (username: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { username, password })
      setCurrentUser(data.user)
      localStorage.setItem('currentUser', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Giriş başarısız'
      }
    }
  }

  const register = async (username: string, password: string) => {
    try {
      await api.post('/auth/register', { username, password })
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Kayıt başarısız'
      }
    }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}