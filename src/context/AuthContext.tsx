"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// 1. Define la interfaz para el objeto de usuario
interface Usuario {
  correo: string
  tipoUsuario: string // Puedes hacer esto más específico si los roles son fijos, ej: "Administrador" | "Empleado" | "Cliente"
}

// 2. Define la interfaz para el valor del contexto
interface AuthContextType {
  token: string | null
  usuario: Usuario | null
  login: (nuevoToken: string) => void
  logout: () => void
  estaAutenticado: boolean
}

// 3. Crea el contexto con el tipo definido y un valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"))
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"

  // Para mantener la sesión viva al recargar y parsear el token
  useEffect(() => {
    if (token) {
      // Aseguramos que token no es null
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUsuario({
          correo: payload.email,
          tipoUsuario: payload[ROLE_CLAIM] || payload.role, // Intenta ambos por compatibilidad
        })
      } catch (e) {
        console.error("Token inválido o corrupto:", e)
        logout() // Si el token es inválido, cierra la sesión
      }
    } else {
      setUsuario(null) // Si no hay token, asegúrate de que el usuario sea null
    }
  }, [token]) // Dependencia solo de token, ya que usuario se deriva de él

  const login = (nuevoToken: string) => {
    localStorage.setItem("token", nuevoToken)
    setToken(nuevoToken)
    try {
      const payload = JSON.parse(atob(nuevoToken.split(".")[1]))
      setUsuario({
        correo: payload.email,
        tipoUsuario: payload[ROLE_CLAIM] || payload.role,
      })
    } catch (e) {
      console.error("Error al decodificar el nuevo token:", e)
      logout() // Si el nuevo token es inválido, cierra la sesión
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUsuario(null)
  }

  const estaAutenticado = !!token && !!usuario // Considera autenticado si hay token Y usuario parseado

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, estaAutenticado }}>{children}</AuthContext.Provider>
  )
}

// Hook para acceder fácilmente desde otros componentes
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
