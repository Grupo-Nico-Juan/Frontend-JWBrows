"use client"

import type React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface EmpleadoAvatarProps {
  nombre: string
  apellido: string
  color?: string
  size?: "sm" | "md" | "lg"
}

const EmpleadoAvatar: React.FC<EmpleadoAvatarProps> = ({ nombre, apellido, color = "#7a5b4c", size = "md" }) => {
  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8 text-xs"
      case "md":
        return "h-10 w-10 text-sm"
      case "lg":
        return "h-16 w-16 text-lg"
      default:
        return "h-10 w-10 text-sm"
    }
  }

  return (
    <Avatar className={`${getSizeClasses()} shadow-md`}>
      <AvatarFallback className="text-white font-semibold" style={{ backgroundColor: color }}>
        {getInitials(nombre, apellido)}
      </AvatarFallback>
    </Avatar>
  )
}

export default EmpleadoAvatar
