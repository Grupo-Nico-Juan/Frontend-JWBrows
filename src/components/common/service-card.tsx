"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, Plus, Check, Info } from "lucide-react"
import ServiceImage from "./service-image"
import AnimatedCard from "./animated-card"

interface Extra {
  id: number
  nombre: string
  duracionMinutos: number
  precio: number
}

interface ImagenServicio {
  id: number
  url: string
}

interface Servicio {
  id: number
  nombre: string
  descripcion?: string
  duracionMinutos: number
  precio: number
  extras?: Extra[]
  imagenes?: ImagenServicio[]
}

interface ServiceCardProps {
  servicio: Servicio
  isSelected: boolean
  onToggle: (servicio: Servicio) => void
  onShowInfo: (servicio: Servicio, e: React.MouseEvent) => void
  index: number
}

const ServiceCard: React.FC<ServiceCardProps> = ({ servicio, isSelected, onToggle, onShowInfo, index }) => {
  return (
    <AnimatedCard delay={index * 0.1} className="group">
      <Card
        className={`cursor-pointer transition-all duration-300 overflow-hidden ${
          isSelected
            ? "border-2 border-[#a1887f] shadow-lg scale-105"
            : "border border-[#e0d6cf] hover:border-[#d2bfae] hover:shadow-md hover:scale-102"
        }`}
        onClick={() => onToggle(servicio)}
      >
        <div className="relative">
          <ServiceImage
            imagenes={servicio.imagenes}
            serviceName={servicio.nombre}
            className="h-48 w-full object-cover"
          />

          {isSelected && (
            <div className="absolute top-3 right-3 bg-[#a1887f] text-white rounded-full p-2">
              <Check className="h-4 w-4" />
            </div>
          )}

          {servicio.extras && servicio.extras.length > 0 && (
            <Badge className="absolute top-3 left-3 bg-[#8d6e63] text-white">
              <Plus className="h-3 w-3 mr-1" />
              Extras
            </Badge>
          )}

          <Button
            size="sm"
            variant="secondary"
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-[#6d4c41] p-2 h-8 w-8"
            onClick={(e) => onShowInfo(servicio, e)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-[#6d4c41] text-lg">{servicio.nombre}</h3>
              {servicio.descripcion && (
                <p className="text-sm text-[#8d6e63] mt-1 line-clamp-2">{servicio.descripcion}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[#8d6e63]">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{servicio.duracionMinutos}min</span>
                </div>
                <div className="flex items-center gap-1 text-[#8d6e63]">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">${servicio.precio}</span>
                </div>
              </div>
            </div>

            <Button
              className={`w-full transition-all duration-300 ${
                isSelected
                  ? "bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                  : "bg-transparent border-2 border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white"
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Seleccionado
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar servicio
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  )
}

export default ServiceCard
