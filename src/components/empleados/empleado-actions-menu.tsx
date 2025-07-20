"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Settings, MapPin, Clock } from "lucide-react"

interface EmpleadoActionsMenuProps {
  empleadoId: number
  empleadoNombre: string
  empleadoApellido: string
  onEdit: (id: number) => void
  onDelete: (id: number, nombre: string, apellido: string) => void
  onHabilidades: (id: number) => void
  onSectores: (id: number) => void
  onPeriodos: (id: number) => void
  variant?: "button" | "icon"
}

const EmpleadoActionsMenu: React.FC<EmpleadoActionsMenuProps> = ({
  empleadoId,
  empleadoNombre,
  empleadoApellido,
  onEdit,
  onDelete,
  onHabilidades,
  onSectores,
  onPeriodos,
  variant = "icon",
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#e1cfc0]">
            <MoreVertical className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full border border-[#e1cfc0] text-[#7a5b4c] hover:bg-[#f8f0ec] bg-transparent hover:border-[#a37e63] transition-all duration-200"
          >
            <MoreVertical className="h-4 w-4 mr-2" />
            Acciones
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border-[#e1cfc0]">
        <DropdownMenuItem onClick={() => onEdit(empleadoId)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onHabilidades(empleadoId)}>
          <Settings className="h-4 w-4 mr-2" />
          Habilidades
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSectores(empleadoId)}>
          <MapPin className="h-4 w-4 mr-2" />
          Sectores
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPeriodos(empleadoId)}>
          <Clock className="h-4 w-4 mr-2" />
          Períodos
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(empleadoId, empleadoNombre, empleadoApellido)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default EmpleadoActionsMenu
