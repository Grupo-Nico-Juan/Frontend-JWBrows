"use client"

import type React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Clock, DollarSign, Plus, Info, Award, Check } from "lucide-react"
import ServiceImage from "./service-image"

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
  incluye?: string[]
}

interface ServiceInfoModalProps {
  servicio: Servicio | null
  isOpen: boolean
  onClose: () => void
  onAddService?: () => void
  showAddButton?: boolean
}

const ServiceInfoModal: React.FC<ServiceInfoModalProps> = ({
  servicio,
  isOpen,
  onClose,
  onAddService,
  showAddButton = false,
}) => {
  if (!servicio) return null

  const hasImages = servicio.imagenes && servicio.imagenes.length > 0
  const hasMultipleImages = hasImages && servicio.imagenes!.length > 1

  console.log("Servicio en modal:", servicio.nombre, "Imágenes:", servicio.imagenes)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-[#e0d6cf]">
        <DialogHeader>
          <DialogTitle className="text-[#6d4c41] text-xl flex items-center gap-2">
            <Info className="h-6 w-6 text-[#a1887f]" />
            {servicio.nombre}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Carrusel de imágenes o imagen única */}
          {hasMultipleImages ? (
            <Carousel className="w-full">
              <CarouselContent>
                {servicio.imagenes!.map((imagen) => (
                  <CarouselItem key={imagen.id}>
                    <div className="aspect-video bg-[#f8f0ec] rounded-lg overflow-hidden">
                      <img
                        src={imagen.url || "/placeholder.svg"}
                        alt={`${servicio.nombre} - Imagen ${imagen.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log("Error cargando imagen en carrusel:", imagen.url)
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=300&width=400&text=Error+al+cargar"
                        }}
                        onLoad={() => console.log("Imagen del carrusel cargada:", imagen.url)}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <ServiceImage
              imagenes={servicio.imagenes}
              serviceName={servicio.nombre}
              className="aspect-video w-full object-cover"
            />
          )}

          {/* Información básica en cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-[#f8f0ec] border-[#e0d6cf]">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-[#a1887f] mx-auto mb-2" />
                <div className="text-lg font-bold text-[#6d4c41]">{servicio.duracionMinutos}</div>
                <div className="text-xs text-[#8d6e63]">minutos</div>
              </CardContent>
            </Card>

            <Card className="bg-[#f8f0ec] border-[#e0d6cf]">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-6 w-6 text-[#a1887f] mx-auto mb-2" />
                <div className="text-lg font-bold text-[#6d4c41]">${servicio.precio}</div>
                <div className="text-xs text-[#8d6e63]">precio</div>
              </CardContent>
            </Card>
          </div>

          {/* Descripción */}
          {servicio.descripcion && (
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-[#a1887f]" />
                Descripción
              </h3>
              <p className="text-[#8d6e63] leading-relaxed">{servicio.descripcion}</p>
            </div>
          )}

          {/* Lo que incluye */}
          {servicio.incluye && servicio.incluye.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-[#a1887f]" />
                Incluye
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {servicio.incluye.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-[#8d6e63]">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extras disponibles */}
          {servicio.extras && servicio.extras.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-3 flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#a1887f]" />
                Extras disponibles
              </h3>
              <div className="space-y-2">
                {servicio.extras.map((extra) => (
                  <div
                    key={extra.id}
                    className="flex items-center justify-between p-3 bg-[#f8f0ec] rounded-lg border border-[#e0d6cf]"
                  >
                    <div>
                      <div className="font-medium text-[#6d4c41]">{extra.nombre}</div>
                      <div className="text-sm text-[#8d6e63]">{extra.duracionMinutos} min adicionales</div>
                    </div>
                    <div className="text-[#6d4c41] font-semibold">+${extra.precio}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#d2bfae] text-[#6d4c41] hover:bg-[#f8f0ec] bg-transparent"
          >
            Cerrar
          </Button>
          {showAddButton && onAddService && (
            <Button onClick={onAddService} className="bg-[#a1887f] hover:bg-[#8d6e63] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Agregar servicio
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ServiceInfoModal
