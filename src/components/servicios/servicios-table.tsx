"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scissors, Clock, DollarSign } from "lucide-react"
import ServicioActionsMenu from "./servicio-actions-menu"

interface Servicio {
  id: number
  nombre: string
  descripcion: string
  duracionMinutos: number
  precio: number
}

interface ServiciosTableProps {
  servicios: Servicio[]
  extrasCount: Record<number, number>
  onDelete: (id: number, nombre: string) => void
  formatDuration: (minutes: number) => string
  getPriceColor: (precio: number) => string
}

const ServiciosTable: React.FC<ServiciosTableProps> = ({
  servicios,
  extrasCount,
  onDelete,
  formatDuration,
  getPriceColor,
}) => {
  return (
    <div className="hidden lg:block">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#7a5b4c]/10 to-[#a37e63]/10 hover:from-[#7a5b4c]/10 hover:to-[#a37e63]/10 border-b border-[#e1cfc0]">
                  <TableHead className="text-[#7a5b4c] font-semibold py-4">Servicio</TableHead>
                  <TableHead className="text-[#7a5b4c] font-semibold py-4">Descripción</TableHead>
                  <TableHead className="text-[#7a5b4c] font-semibold py-4">Duración</TableHead>
                  <TableHead className="text-[#7a5b4c] font-semibold py-4">Precio</TableHead>
                  <TableHead className="text-[#7a5b4c] font-semibold text-center py-4">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicios.map((servicio, index) => (
                  <motion.tr
                    key={servicio.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-[#fdf6f1]/50 transition-colors border-b border-[#e1cfc0]/30"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] rounded-xl flex items-center justify-center">
                          <Scissors className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#7a5b4c]">{servicio.nombre}</div>
                          <div className="text-sm text-[#7a5b4c]/60">ID: {servicio.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="max-w-xs">
                        <p className="text-[#7a5b4c] text-sm line-clamp-2">{servicio.descripcion}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#7a5b4c]/60" />
                        <span className="text-[#7a5b4c] font-medium text-sm">
                          {formatDuration(servicio.duracionMinutos)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#7a5b4c]/60" />
                        <Badge
                          className={`${getPriceColor(servicio.precio)} font-semibold text-sm px-2 py-1 rounded-lg`}
                        >
                          ${servicio.precio}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center">
                        <ServicioActionsMenu
                          servicio={servicio}
                          extrasCount={extrasCount[servicio.id] ?? 0}
                          onDelete={onDelete}
                          variant="desktop"
                        />
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ServiciosTable
