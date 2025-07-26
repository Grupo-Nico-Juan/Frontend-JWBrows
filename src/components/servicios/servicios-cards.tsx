"use client"

import type React from "react"
import { motion } from "framer-motion"
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

interface ServiciosCardsProps {
  servicios: Servicio[]
  extrasCount: Record<number, number>
  onDelete: (id: number, nombre: string) => void
  formatDuration: (minutes: number) => string
  getPriceColor: (precio: number) => string
}

const ServiciosCards: React.FC<ServiciosCardsProps> = ({
  servicios,
  extrasCount,
  onDelete,
  formatDuration,
  getPriceColor,
}) => {
  return (
    <div className="lg:hidden space-y-4">
      {servicios.map((servicio, index) => (
        <motion.div
          key={servicio.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Scissors className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#7a5b4c] text-lg truncate">{servicio.nombre}</h3>
                      <p className="text-sm text-[#7a5b4c]/60">ID: {servicio.id}</p>
                    </div>
                    <ServicioActionsMenu
                      servicio={servicio}
                      extrasCount={extrasCount[servicio.id] ?? 0}
                      onDelete={onDelete}
                      variant="mobile"
                    />
                  </div>
                  <p className="text-[#7a5b4c] text-sm mb-3 line-clamp-2">{servicio.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-[#7a5b4c]/60" />
                        <span className="text-[#7a5b4c] font-medium text-sm">
                          {formatDuration(servicio.duracionMinutos)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-[#7a5b4c]/60" />
                        <Badge
                          className={`${getPriceColor(servicio.precio)} font-semibold text-sm px-2 py-1 rounded-lg`}
                        >
                          ${servicio.precio}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default ServiciosCards
