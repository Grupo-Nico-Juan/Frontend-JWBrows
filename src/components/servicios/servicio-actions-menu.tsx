"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Settings, MapPin, Star, ImageIcon, Trash2 } from "lucide-react"

interface ServicioActionsMenuProps {
  servicio: {
    id: number
    nombre: string
  }
  extrasCount: number
  onDelete: (id: number, nombre: string) => void
  variant?: "desktop" | "mobile"
}

const ServicioActionsMenu: React.FC<ServicioActionsMenuProps> = ({
  servicio,
  extrasCount,
  onDelete,
  variant = "desktop",
}) => {
  const navigate = useNavigate()

  const buttonClass =
    variant === "desktop" ? "h-10 w-10 p-0 hover:bg-[#fdf6f1]" : "h-8 w-8 p-0 hover:bg-[#fdf6f1] flex-shrink-0"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={buttonClass}>
          <MoreVertical className="h-4 w-4 text-[#7a5b4c]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-white/95 backdrop-blur-sm border border-[#e1cfc0] rounded-xl shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => navigate(`/servicios/editar/${servicio.id}`)}
          className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#e1cfc0]" />
        <DropdownMenuItem
          onClick={() => navigate(`/servicios/${servicio.id}/habilidades`)}
          className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
        >
          <Settings className="h-4 w-4 mr-2" />
          Habilidades
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate(`/servicios/${servicio.id}/sectores`)}
          className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Sectores
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate(`/servicios/${servicio.id}/extras`)}
          className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
        >
          <Star className="h-4 w-4 mr-2" />
          Extras ({extrasCount})
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate(`/servicios/${servicio.id}/imagenes`)}
          className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Imágenes
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#e1cfc0]" />
        <DropdownMenuItem
          onClick={() => onDelete(servicio.id, servicio.nombre)}
          className="text-red-600 focus:text-red-600 hover:bg-red-50 rounded-lg mx-1 my-1"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServicioActionsMenu
