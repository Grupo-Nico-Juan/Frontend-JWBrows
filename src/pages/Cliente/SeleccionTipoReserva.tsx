"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useTurno } from "@/context/TurnoContext"
import { Calendar, User, Clock, Users, ArrowRight, Building2, CheckCircle, Sparkles, CalendarDays } from "lucide-react"

const SeleccionTipoReserva: React.FC = () => {
  const navigate = useNavigate()
  const { sucursal, servicios } = useTurno()

  // Verificar que tengamos los datos necesarios
  if (!sucursal || servicios.length === 0) {
    navigate("/reserva/servicio")
    return null
  }

  const totalDuracion = servicios.reduce((sum, s) => sum + s.duracionMinutos, 0)
  const totalPrecio = servicios.reduce((sum, s) => sum + s.precio, 0)

  const handleSeleccionFlujo = (tipo: "horario" | "empleada") => {
    if (tipo === "horario") {
      // Flujo actual: fecha/hora primero
      navigate("/reserva/fecha-hora")
    } else {
      // Nuevo flujo: empleada primero
      navigate("/reserva/empleada-primero")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border-b border-[#e0d6cf] sticky top-0 z-20"
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-3 bg-[#a1887f]/10 rounded-full px-4 py-2 mb-3">
                <Building2 className="h-5 w-5 text-[#a1887f]" />
                <span className="text-[#6d4c41] font-medium">Paso 3 de 4</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#6d4c41] mb-2">¿Cómo querés reservar?</h1>
              <p className="text-[#8d6e63]">
                Elegí la forma que más te convenga para programar tu cita en{" "}
                <span className="font-medium">{sucursal?.nombre}</span>
              </p>
            </div>

            {/* Resumen de servicios */}
            <div className="hidden lg:block">
              <Card className="bg-[#f8f0ec] border-[#e0d6cf]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#6d4c41]">{servicios.length}</div>
                      <div className="text-xs text-[#8d6e63]">Servicios</div>
                    </div>
                    <div className="w-px h-8 bg-[#e0d6cf]" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#6d4c41]">{totalDuracion}min</div>
                      <div className="text-xs text-[#8d6e63]">Duración</div>
                    </div>
                    <div className="w-px h-8 bg-[#e0d6cf]" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#6d4c41]">${totalPrecio}</div>
                      <div className="text-xs text-[#8d6e63]">Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Opción 1: Elegir horario primero */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#e0d6cf] hover:border-[#a1887f] transition-all duration-300 cursor-pointer h-full">
              <CardContent className="p-8 h-full flex flex-col">
                {/* Header de la opción */}
                <div className="text-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-[#a1887f] to-[#8d6e63] rounded-full w-fit mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#6d4c41] mb-2">Elegir horario primero</h3>
                  <p className="text-[#8d6e63]">Seleccioná el día y hora que más te convenga</p>
                </div>

                {/* Características */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#6d4c41]">Flexibilidad de horarios</p>
                      <p className="text-sm text-[#8d6e63]">Ves todos los horarios disponibles de la sucursal</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#6d4c41]">Profesional asignado</p>
                      <p className="text-sm text-[#8d6e63]">Te mostramos qué especialista está disponible</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#6d4c41]">Reserva rápida</p>
                      <p className="text-sm text-[#8d6e63]">Proceso ágil si tenés horario definido</p>
                    </div>
                  </div>
                </div>

                {/* Proceso */}
                <div className="mt-6 p-4 bg-[#f8f0ec] rounded-lg border border-[#e0d6cf]">
                  <p className="text-sm font-medium text-[#6d4c41] mb-2">Proceso:</p>
                  <div className="space-y-1 text-sm text-[#8d6e63]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#a1887f] text-white rounded-full text-xs flex items-center justify-center">
                        1
                      </span>
                      <span>Elegís fecha y hora</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#a1887f] text-white rounded-full text-xs flex items-center justify-center">
                        2
                      </span>
                      <span>Te mostramos profesionales disponibles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#a1887f] text-white rounded-full text-xs flex items-center justify-center">
                        3
                      </span>
                      <span>Confirmás tu cita</span>
                    </div>
                  </div>
                </div>

                {/* Botón */}
                <Button
                  onClick={() => handleSeleccionFlujo("horario")}
                  className="w-full mt-6 bg-gradient-to-r from-[#a1887f] to-[#8d6e63] hover:from-[#8d6e63] hover:to-[#795548] text-white h-12 group-hover:scale-105 transition-all"
                >
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Elegir horario primero
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Opción 2: Elegir empleada primero */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#e0d6cf] hover:border-[#a1887f] transition-all duration-300 cursor-pointer h-full">
              <CardContent className="p-8 h-full flex flex-col">
                {/* Header de la opción */}
                <div className="text-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-[#8d6e63] to-[#795548] rounded-full w-fit mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#6d4c41] mb-2">Elegir profesional primero</h3>
                  <p className="text-[#8d6e63]">Seleccioná tu especialista preferido</p>
                </div>

                {/* Características */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#6d4c41]">Especialista preferido</p>
                      <p className="text-sm text-[#8d6e63]">Elegís exactamente con quién querés atenderte</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#6d4c41]">Horarios personalizados</p>
                      <p className="text-sm text-[#8d6e63]">Ves solo los horarios de tu profesional elegido</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#6d4c41]">Experiencia personalizada</p>
                      <p className="text-sm text-[#8d6e63]">Ideal si ya conocés a algún especialista</p>
                    </div>
                  </div>
                </div>

                {/* Proceso */}
                <div className="mt-6 p-4 bg-[#f8f0ec] rounded-lg border border-[#e0d6cf]">
                  <p className="text-sm font-medium text-[#6d4c41] mb-2">Proceso:</p>
                  <div className="space-y-1 text-sm text-[#8d6e63]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#8d6e63] text-white rounded-full text-xs flex items-center justify-center">
                        1
                      </span>
                      <span>Elegís tu profesional preferido</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#8d6e63] text-white rounded-full text-xs flex items-center justify-center">
                        2
                      </span>
                      <span>Ves sus horarios disponibles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#8d6e63] text-white rounded-full text-xs flex items-center justify-center">
                        3
                      </span>
                      <span>Confirmás tu cita</span>
                    </div>
                  </div>
                </div>

                {/* Badge de novedad */}
                <div className="mt-4 flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    Nuevo
                  </div>
                </div>

                {/* Botón */}
                <Button
                  onClick={() => handleSeleccionFlujo("empleada")}
                  className="w-full mt-6 bg-gradient-to-r from-[#8d6e63] to-[#795548] hover:from-[#795548] hover:to-[#6d4c41] text-white h-12 group-hover:scale-105 transition-all"
                >
                  <User className="h-5 w-5 mr-2" />
                  Elegir profesional primero
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-white/40 backdrop-blur-sm border-[#e0d6cf]">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">¿No estás seguro?</h3>
                <p className="text-[#8d6e63] mb-4">
                  Ambas opciones te llevan al mismo resultado: una cita perfectamente programada. La diferencia está en
                  el orden de selección.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 justify-center">
                    <Clock className="h-4 w-4 text-[#a1887f]" />
                    <span className="text-[#6d4c41]">
                      <strong>Horario primero:</strong> Ideal si tenés un horario específico en mente
                    </span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <User className="h-4 w-4 text-[#8d6e63]" />
                    <span className="text-[#6d4c41]">
                      <strong>Profesional primero:</strong> Perfecto si ya conocés a algún especialista
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default SeleccionTipoReserva
