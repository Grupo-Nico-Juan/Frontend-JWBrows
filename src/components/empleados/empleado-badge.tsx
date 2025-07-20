"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"

interface EmpleadoBadgeProps {
  cargo: string
}

const EmpleadoBadge: React.FC<EmpleadoBadgeProps> = ({ cargo }) => {
  const getCargoColor = (cargo: string) => {
    const colors = {
      Administrador: "bg-red-100 text-red-800",
      Gerente: "bg-blue-100 text-blue-800",
      Empleado: "bg-green-100 text-green-800",
      Supervisor: "bg-purple-100 text-purple-800",
      Manicurista: "bg-pink-100 text-pink-800",
      Esteticista: "bg-purple-100 text-purple-800",
      default: "bg-gray-100 text-gray-800",
    }
    return colors[cargo as keyof typeof colors] || colors.default
  }

  return <Badge className={getCargoColor(cargo)}>{cargo}</Badge>
}

export default EmpleadoBadge
