"use client"

import type React from "react"
import MotionWrapper from "@/components/animations/motion-wrapper"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MapPin, Phone, MoreVertical, Edit, Trash2, Store } from "lucide-react"

interface Sucursal {
  id: number
  nombre: string
  direccion: string
  telefono: string
}

interface SucursalCardProps {
  sucursal: Sucursal
  index: number
  onEdit: (id: number) => void
  onDelete: (id: number, nombre: string) => void
}

const SucursalCard: React.FC<SucursalCardProps> = ({ sucursal, index, onEdit, onDelete }) => {
  return (
    <MotionWrapper animation="fadeIn" delay={index * 0.05}>
      <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf] hover:shadow-lg transition-all duration-200 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#a1887f] rounded-lg">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-[#6d4c41] line-clamp-1">{sucursal.nombre}</CardTitle>
                <Badge variant="secondary" className="text-xs mt-1">
                  ID: {sucursal.id}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(sucursal.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(sucursal.id, sucursal.nombre)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#8d6e63] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#6d4c41]">Dirección</p>
                <p className="text-sm text-[#8d6e63] line-clamp-2">{sucursal.direccion}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#8d6e63] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#6d4c41]">Teléfono</p>
                <p className="text-sm text-[#8d6e63]">{sucursal.telefono}</p>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-[#e0d6cf]">
            <Button
              onClick={() => onEdit(sucursal.id)}
              variant="outline"
              size="sm"
              className="w-full border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Sucursal
            </Button>
          </div>
        </CardContent>
      </Card>
    </MotionWrapper>
  )
}

export default SucursalCard
