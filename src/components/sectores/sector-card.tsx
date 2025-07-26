"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Layers, FileText, Building2, MoreVertical, Edit, Trash2 } from "lucide-react"

interface Sector {
  id: number
  nombre: string
  descripcion: string | null
  sucursalId: number
}

interface SectorCardProps {
  sector: Sector
  index: number
  getSucursalNombre: (sucursalId: number) => string
  onEdit: (id: number) => void
  onDelete: (id: number, nombre: string) => void
}

const SectorCard: React.FC<SectorCardProps> = ({ sector, index, getSucursalNombre, onEdit, onDelete }) => {
  return (
    <motion.div
      key={sector.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf] hover:shadow-lg transition-all duration-200 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#a1887f] rounded-lg">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-[#6d4c41] line-clamp-1">{sector.nombre}</CardTitle>
                <Badge variant="secondary" className="text-xs mt-1">
                  ID: {sector.id}
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
                <DropdownMenuItem onClick={() => onEdit(sector.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(sector.id, sector.nombre)}
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
              <FileText className="h-4 w-4 text-[#8d6e63] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#6d4c41]">Descripción</p>
                <p className="text-sm text-[#8d6e63] line-clamp-2">{sector.descripcion || "Sin descripción"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-[#8d6e63] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#6d4c41]">Sucursal</p>
                <Badge
                  variant={sector.sucursalId ? "default" : "secondary"}
                  className={sector.sucursalId ? "bg-[#a1887f] text-white" : "bg-gray-100 text-gray-600"}
                >
                  {getSucursalNombre(sector.sucursalId)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-[#e0d6cf]">
            <Button
              onClick={() => onEdit(sector.id)}
              variant="outline"
              size="sm"
              className="w-full border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Sector
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SectorCard
