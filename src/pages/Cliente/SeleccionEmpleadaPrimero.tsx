"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import axios from "@/api/AxiosInstance"
import { useTurno } from "@/context/TurnoContext"
import { User, Star, Award, CheckCircle, Building2, Loader2, AlertCircle, Users, Sparkles } from "lucide-react"

interface EmpleadaCompleta {
  id: number
  nombre: string
  apellido: string
  nombreCompleto: string
  habilidades?: Array<{
    id: number
    nombre: string
  }>
}

const SeleccionEmpleadaPrimero: React.FC = () => {
  const navigate = useNavigate()
  const [empleadas, setEmpleadas] = useState<EmpleadaCompleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<number | null>(null)
  const { detalles, setEmpleado, sucursal, servicios } = useTurno()

  useEffect(() => {
    if (!sucursal || detalles.length === 0) {
      navigate("/reserva/servicio")
      return
    }

    const cargarEmpleadas = async () => {
      setLoading(true)
      setError("")

      try {
        // Obtener habilidades requeridas para los servicios seleccionados
        const habilidadesRequeridas = new Set<number>()

        for (const detalle of detalles) {
          try {
            const habilidadesResponse = await axios.get(`/api/Servicio/${detalle.servicio.id}/habilidades`)
            habilidadesResponse.data.forEach((habilidad: any) => {
              habilidadesRequeridas.add(habilidad.id)
            })
          } catch (err) {
            console.error(`Error obteniendo habilidades para servicio ${detalle.servicio.id}:`, err)
          }
        }

        // Si no hay habilidades específicas, obtener todos los empleados
        if (habilidadesRequeridas.size === 0) {
          const response = await axios.get<EmpleadaCompleta[]>("/api/Empleado")
          setEmpleadas(response.data)
        } else {
          // Obtener empleados que tengan las habilidades requeridas
          const empleadosConHabilidades = new Set<number>()

          for (const habilidadId of habilidadesRequeridas) {
            try {
              const response = await axios.get(`/api/Empleado/habilidad/${habilidadId}`)
              response.data.forEach((empleado: any) => {
                empleadosConHabilidades.add(empleado.id)
              })
            } catch (err) {
              console.error(`Error obteniendo empleados para habilidad ${habilidadId}:`, err)
            }
          }

          // Obtener detalles completos de los empleados filtrados
          const empleadosCompletos: EmpleadaCompleta[] = []
          for (const empleadoId of empleadosConHabilidades) {
            try {
              const response = await axios.get(`/api/Empleado/${empleadoId}`)
              const habilidadesResponse = await axios.get(`/api/Empleado/${empleadoId}/habilidades`)

              empleadosCompletos.push({
                ...response.data,
                nombreCompleto: `${response.data.nombre} ${response.data.apellido}`,
                habilidades: habilidadesResponse.data,
              })
            } catch (err) {
              console.error(`Error obteniendo detalles del empleado ${empleadoId}:`, err)
            }
          }

          setEmpleadas(empleadosCompletos)
        }
      } catch (err) {
        setError("Error al cargar los profesionales. Por favor, intenta nuevamente.")
        console.error("Error cargando empleadas", err)
      } finally {
        setLoading(false)
      }
    }

    cargarEmpleadas()
  }, [detalles, navigate, sucursal])

  const handleSeleccion = (emp: EmpleadaCompleta) => {
    setEmpleadoSeleccionado(emp.id)

    setEmpleado({
      id: emp.id,
      nombre: emp.nombre,
      apellido: emp.apellido,
    })

    // Pequeño delay para mostrar la selección antes de navegar
    setTimeout(() => {
      navigate("/reserva/fecha-hora-empleada")
    }, 300)
  }

  const obtenerIniciales = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const totalDuracion = servicios.reduce((sum, s) => sum + s.duracionMinutos, 0)
  const totalPrecio = servicios.reduce((sum, s) => sum + s.precio, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center p-4">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf] max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="p-4 bg-[#a1887f]/10 rounded-full w-fit mx-auto">
              <Loader2 className="h-8 w-8 animate-spin text-[#a1887f]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">Cargando profesionales</h3>
              <p className="text-[#8d6e63]">Encontrando los mejores especialistas para tus servicios...</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center p-4">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf] max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="p-4 bg-red-100 rounded-full w-fit mx-auto">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">Error al cargar</h3>
              <p className="text-[#8d6e63] mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-[#a1887f] hover:bg-[#8d6e63] text-white">
                Reintentar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
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
              <div className="inline-flex items-center gap-3 bg-[#8d6e63]/10 rounded-full px-4 py-2 mb-3">
                <Building2 className="h-5 w-5 text-[#8d6e63]" />
                <span className="text-[#6d4c41] font-medium">Paso 3 de 4</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#6d4c41] mb-2">Elegí tu profesional</h1>
              <p className="text-[#8d6e63]">
                Seleccioná el especialista que realizará tus servicios en{" "}
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
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {empleadas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Card className="bg-white/60 backdrop-blur-sm border-[#e0d6cf] p-8">
              <Users className="h-16 w-16 text-[#d2bfae] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">No hay profesionales disponibles</h3>
              <p className="text-[#8d6e63] mb-4">
                No encontramos especialistas que puedan realizar todos tus servicios. Te sugerimos contactarnos
                directamente.
              </p>
              <Button
                onClick={() => navigate("/reserva/servicio")}
                variant="outline"
                className="border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white"
              >
                Volver a servicios
              </Button>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Información del flujo */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-gradient-to-r from-[#8d6e63] to-[#795548] text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Flujo personalizado
                      </h3>
                      <p className="text-white/90 text-sm">
                        Después de elegir tu profesional, verás solo sus horarios disponibles para una experiencia más
                        personalizada
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Profesional → Horario</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Lista de profesionales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#6d4c41] flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5" />
                      Nuestros especialistas
                    </h2>
                    <p className="text-[#8d6e63]">
                      {empleadas.length} profesional{empleadas.length > 1 ? "es" : ""} especializado
                      {empleadas.length > 1 ? "s" : ""} en tus servicios
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {empleadas.map((empleado, index) => {
                        const esSeleccionado = empleadoSeleccionado === empleado.id

                        return (
                          <motion.div
                            key={empleado.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group"
                          >
                            <Card
                              className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                                esSeleccionado
                                  ? "border-2 border-[#8d6e63] shadow-lg scale-105"
                                  : "border border-[#e0d6cf] hover:border-[#d2bfae] hover:shadow-md"
                              }`}
                              onClick={() => handleSeleccion(empleado)}
                            >
                              <CardContent className="p-6">
                                <div className="space-y-4">
                                  {/* Header del profesional */}
                                  <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                      <AvatarFallback className="bg-[#8d6e63] text-white text-lg font-semibold">
                                        {obtenerIniciales(empleado.nombre, empleado.apellido)}
                                      </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 space-y-2">
                                      <div>
                                        <h3 className="text-lg font-bold text-[#6d4c41]">
                                          {empleado.nombre} {empleado.apellido}
                                        </h3>
                                        <p className="text-sm text-[#8d6e63]">Especialista en belleza</p>
                                      </div>

                                      {/* Rating simulado */}
                                      <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`h-4 w-4 ${
                                                i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                              }`}
                                            />
                                          ))}
                                          <span className="text-sm text-[#8d6e63] ml-1">4.8</span>
                                        </div>

                                        <div className="flex items-center gap-1 text-[#8d6e63]">
                                          <Award className="h-4 w-4" />
                                          <span className="text-sm">Certificado</span>
                                        </div>
                                      </div>
                                    </div>

                                    {esSeleccionado && (
                                      <div className="p-2 bg-[#8d6e63] rounded-full">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Habilidades */}
                                  {empleado.habilidades && empleado.habilidades.length > 0 && (
                                    <div>
                                      <p className="text-sm font-medium text-[#6d4c41] mb-2">Especialidades:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {empleado.habilidades.map((habilidad) => (
                                          <Badge
                                            key={habilidad.id}
                                            variant="secondary"
                                            className="bg-[#f8f0ec] text-[#6d4c41] border border-[#e0d6cf]"
                                          >
                                            {habilidad.nombre}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Servicios compatibles */}
                                  <div className="pt-3 border-t border-[#e0d6cf]">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-[#8d6e63]">Puede realizar tus servicios seleccionados</span>
                                      <div className="flex items-center gap-1 text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                        <span className="font-medium">Disponible</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Botón de selección */}
                                  <Button
                                    className={`w-full transition-all duration-300 ${
                                      esSeleccionado
                                        ? "bg-[#8d6e63] hover:bg-[#795548] text-white"
                                        : "bg-transparent border-2 border-[#8d6e63] text-[#8d6e63] hover:bg-[#8d6e63] hover:text-white"
                                    }`}
                                    disabled={esSeleccionado}
                                  >
                                    {esSeleccionado ? (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Seleccionado
                                      </>
                                    ) : (
                                      <>
                                        <User className="h-4 w-4 mr-2" />
                                        Seleccionar profesional
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Información adicional */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white/40 backdrop-blur-sm border-[#e0d6cf]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#8d6e63] mt-0.5" />
                    <div className="text-sm text-[#6d4c41]">
                      <p className="font-medium mb-1">Ventajas de elegir profesional primero:</p>
                      <ul className="space-y-1 text-[#8d6e63]">
                        <li>• Verás solo los horarios disponibles de tu especialista elegido</li>
                        <li>• Experiencia más personalizada y consistente</li>
                        <li>• Ideal si ya conocés y confiás en algún profesional</li>
                        <li>• Garantía de atención con tu especialista preferido</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default SeleccionEmpleadaPrimero
