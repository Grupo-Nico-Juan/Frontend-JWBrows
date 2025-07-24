"use client"

import type React from "react"
import MotionWrapper from "@/components/animations/motion-wrapper"
import { motion } from "framer-motion"//HAY QUE SACARLO Y EL MOTION DE ABAJO TAMBIEN 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Scissors, Plus, Clock, DollarSign, X } from "lucide-react"

interface Servicio {
  id: number
  nombre: string
  duracionMinutos: number
  precio: number
  sectorId: number
}

interface DetalleTurno {
  servicioId: number
  extrasIds: number[]
}

interface ServiciosSectionProps {
  servicios: Servicio[]
  detalles: DetalleTurno[]
  servicioSeleccionado: number
  empleadaId: number
  sectorId: number
  loadingServicios: boolean
  onServicioSeleccionadoChange: (value: string) => void
  onAgregarServicio: () => void
  onEliminarServicio: (index: number) => void
}

const ServiciosSection: React.FC<ServiciosSectionProps> = ({
  servicios,
  detalles,
  servicioSeleccionado,
  empleadaId,
  sectorId,
  loadingServicios,
  onServicioSeleccionadoChange,
  onAgregarServicio,
  onEliminarServicio,
}) => {
  const calcularTotales = () => {
    let duracionTotal = 0
    let precioTotal = 0

    detalles.forEach((detalle) => {
      const servicio = servicios.find((s) => s.id === detalle.servicioId)
      if (servicio) {
        duracionTotal += servicio.duracionMinutos
        precioTotal += servicio.precio
      }
    })

    return { duracionTotal, precioTotal }
  }

  const { duracionTotal, precioTotal } = calcularTotales()

  return (
    <MotionWrapper animation="slideLeft"  delay={0.3}>
      <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
        <CardHeader>
          <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Servicios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mensaje informativo */}
          {sectorId && !empleadaId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                💡 Los servicios disponibles dependen de las habilidades de la empleada seleccionada
              </p>
            </div>
          )}

          {/* Selector de servicios */}
          <div className="flex gap-2">
            <Select
              value={servicioSeleccionado === 0 ? "" : String(servicioSeleccionado)}
              onValueChange={onServicioSeleccionadoChange}
              disabled={!empleadaId || loadingServicios}
            >
              <SelectTrigger className="flex-1 border-[#e0d6cf] focus:border-[#a1887f]">
                <SelectValue
                  placeholder={
                    !empleadaId
                      ? "Selecciona una empleada primero"
                      : loadingServicios
                        ? "Cargando servicios..."
                        : servicios.length === 0
                          ? "No hay servicios disponibles para esta empleada"
                          : "Seleccionar servicio"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {servicios.map((servicio) => (
                  <SelectItem key={servicio.id} value={String(servicio.id)}>
                    <div className="flex items-center gap-2">
                      <span>{servicio.nombre}</span>
                      <Clock className="h-3 w-3 text-[#8d6e63]" />
                      <span className="text-[#8d6e63]">{servicio.duracionMinutos}min</span>
                      <DollarSign className="h-3 w-3 text-[#8d6e63]" />
                      <span className="text-[#8d6e63]">${servicio.precio}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={onAgregarServicio}
              disabled={!servicioSeleccionado || loadingServicios}
              className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Lista de servicios agregados */}
          {detalles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#6d4c41]">Servicios agregados:</h4>
              <div className="space-y-2">
                {detalles.map((detalle, index) => {
                  const servicio = servicios.find((s) => s.id === detalle.servicioId)
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between bg-[#f3e5e1]/50 p-3 rounded-lg border border-[#e0d6cf]"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-[#a1887f] text-white">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium text-[#6d4c41]">{servicio?.nombre}</p>
                          <div className="flex items-center gap-3 text-sm text-[#8d6e63]">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {servicio?.duracionMinutos} min
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />${servicio?.precio}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onEliminarServicio(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )
                })}
              </div>

              {/* Resumen de totales */}
              <div className="bg-[#a1887f]/10 p-4 rounded-lg border border-[#e0d6cf] mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#6d4c41]">Total:</span>
                  <div className="text-right">
                    <p className="font-semibold text-[#6d4c41] text-lg">${precioTotal}</p>
                    <p className="text-sm text-[#8d6e63]">{duracionTotal} minutos</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </MotionWrapper>
  )
}

export default ServiciosSection
