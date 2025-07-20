"use client"

import type React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface EmpleadoAvatarProps {
  nombre: string
  apellido: string
  color?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const EmpleadoAvatar: React.FC<EmpleadoAvatarProps> = ({
  nombre,
  apellido,
  color = "#7a5b4c",
  size = "md",
  className = "",
}) => {
  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  }

  return (
    <Avatar className={`${sizeClasses[size]} shadow-md ${className}`}>
      <AvatarFallback
        className={`text-white ${textSizeClasses[size]} font-semibold`}
        style={{ backgroundColor: color }}
      >
        {getInitials(nombre, apellido)}
      </AvatarFallback>
    </Avatar>
  )
}

export default EmpleadoAvatar
