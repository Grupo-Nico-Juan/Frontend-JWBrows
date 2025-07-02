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
import {
  User,
  Star,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Building2,
  Loader2,
  AlertCircle,
  Users,
  Sparkles,
  Calendar,
  DollarSign,
} from "lucide-react"

interface EmpleadaDisponible {
  id: number
  nombreCompleto: string
  serviciosQuePuedeRealizar: number[]
  especialidades?: string[]
  rating?: number
  experiencia?: number
  imagen?: string
}

// Datos mock para enriquecer la información (en producción vendrían de la API)
const enriquecerDatosEmpleado = (empleado: EmpleadaDisponible): EmpleadaDisponible => ({
  ...empleado,
  especialidades: empleado.especialidades || ["Cejas", "Pestañas", "Microblading"],
  rating: empleado.rating || 4.5 + Math.random() * 0.5,
  experiencia: empleado.experiencia || Math.floor(Math.random() * 8) + 2,
})

const SeleccionEmpleado: React.FC = () => {
  const navigate = useNavigate()
  const [empleadas, setEmpleadas] = useState<EmpleadaDisponible[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<number | null>(null)
  const { detalles, fechaHora, setEmpleado, sucursal, servicios } = useTurno()

  useEffect(() => {
    if (!fechaHora || detalles.length === 0) {
      navigate("/reserva/fecha-hora")
      return
    }

    const cargarEmpleadas = async () => {
      setLoading(true)
      setError("")

      try {
        const serviciosSeleccionados = detalles.map((d) => d.servicio.id)

        const response = await axios.post<EmpleadaDisponible[]>("/api/Empleado/disponibles", {
          fechaHoraInicio: fechaHora,
          serviciosSeleccionados,
        })

        setEmpleadas(response.data)
      } catch (err) {
        setError("Error al cargar los profesionales disponibles. Por favor, intenta nuevamente.")
        console.error("Error cargando empleadas disponibles", err)
      } finally {
        setLoading(false)
      }
    }

    cargarEmpleadas()
  }, [fechaHora, detalles, navigate])

  const handleSeleccion = (emp: EmpleadaDisponible) => {
    setEmpleadoSeleccionado(emp.id)

    const [nombre, ...apellidoParts] = emp.nombreCompleto.split(" ")
    const apellido = apellidoParts.join(" ")

    setEmpleado({
      id: emp.id,
      nombre: nombre,
      apellido: apellido,
    })

    // Pequeño delay para mostrar la selección antes de navegar
    setTimeout(() => {
      navigate("/reserva/confirmar")
    }, 300)
  }

  const handleSeleccionAutomatica = () => {
    if (empleadas.length > 0) {
      // Seleccionar el empleado con mejor rating
      const mejorEmpleado = empleadas.reduce((mejor, actual) => {
        const ratingMejor = enriquecerDatosEmpleado(mejor).rating!
        const ratingActual = enriquecerDatosEmpleado(actual).rating!
        return ratingActual > ratingMejor ? actual : mejor
      })
      handleSeleccion(mejorEmpleado)
    }
  }

  const obtenerIniciales = (nombreCompleto: string) => {
    const nombres = nombreCompleto.split(" ")
    return nombres.length >= 2 ? `${nombres[0][0]}${nombres[1][0]}` : nombres[0][0]
  }

  const totalDuracion = servicios.reduce((sum, s) => sum + s.duracionMinutos, 0)
  const totalPrecio = servicios.reduce((sum, s) => sum + s.precio, 0)

  const fechaFormateada = fechaHora
    ? new Date(fechaHora).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center p-4">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf] max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="p-4 bg-[#a1887f]/10 rounded-full w-fit mx-auto">
              <Loader2 className="h-8 w-8 animate-spin text-[#a1887f]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">Buscando profesionales</h3>
              <p className="text-[#8d6e63]">Encontrando los mejores especialistas disponibles para ti...</p>
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
              <div className="inline-flex items-center gap-3 bg-[#a1887f]/10 rounded-full px-4 py-2 mb-3">
                <Building2 className="h-5 w-5 text-[#a1887f]" />
                <span className="text-[#6d4c41] font-medium">Paso 4 de 4</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#6d4c41] mb-2">Elegí tu profesional</h1>
              <p className="text-[#8d6e63]">
                Seleccioná el especialista que realizará tus servicios en{" "}
                <span className="font-medium">{sucursal?.nombre}</span>
              </p>
            </div>

            {/* Resumen de la cita */}
            <div className="hidden lg:block">
              <Card className="bg-[#f8f0ec] border-[#e0d6cf]">
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[#6d4c41]">
                      <Calendar className="h-4 w-4" />
                      <span>{fechaFormateada}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6d4c41]">
                      <Clock className="h-4 w-4" />
                      <span>{totalDuracion} minutos</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6d4c41]">
                      <DollarSign className="h-4 w-4" />
                      <span>${totalPrecio}</span>
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
                No encontramos especialistas disponibles para el horario seleccionado. Te sugerimos elegir otro horario.
              </p>
              <Button
                onClick={() => navigate("/reserva/fecha-hora")}
                variant="outline"
                className="border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white"
              >
                Cambiar horario
              </Button>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Opción de selección automática */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-gradient-to-r from-[#a1887f] to-[#8d6e63] text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Selección automática
                      </h3>
                      <p className="text-white/90 text-sm">
                        Dejanos elegir el mejor profesional disponible para ti basado en experiencia y calificaciones
                      </p>
                    </div>
                    <Button
                      onClick={handleSeleccionAutomatica}
                      className="bg-white text-[#a1887f] hover:bg-white/90 font-medium"
                    >
                      Elegir automáticamente
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
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
                      Profesionales disponibles
                    </h2>
                    <p className="text-[#8d6e63]">
                      {empleadas.length} especialista{empleadas.length > 1 ? "s" : ""} disponible
                      {empleadas.length > 1 ? "s" : ""} para tu horario
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {empleadas.map((empleado, index) => {
                        const empleadoEnriquecido = enriquecerDatosEmpleado(empleado)
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
                                  ? "border-2 border-[#a1887f] shadow-lg scale-105"
                                  : "border border-[#e0d6cf] hover:border-[#d2bfae] hover:shadow-md"
                              }`}
                              onClick={() => handleSeleccion(empleado)}
                            >
                              <CardContent className="p-6">
                                <div className="space-y-4">
                                  {/* Header del profesional */}
                                  <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                      <AvatarFallback className="bg-[#a1887f] text-white text-lg font-semibold">
                                        {obtenerIniciales(empleado.nombreCompleto)}
                                      </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 space-y-2">
                                      <div>
                                        <h3 className="text-lg font-bold text-[#6d4c41]">{empleado.nombreCompleto}</h3>
                                        <p className="text-sm text-[#8d6e63]">Especialista en belleza</p>
                                      </div>

                                      {/* Rating y experiencia */}
                                      <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`h-4 w-4 ${
                                                i < Math.floor(empleadoEnriquecido.rating!)
                                                  ? "fill-yellow-400 text-yellow-400"
                                                  : "text-gray-300"
                                              }`}
                                            />
                                          ))}
                                          <span className="text-sm text-[#8d6e63] ml-1">
                                            {empleadoEnriquecido.rating!.toFixed(1)}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1 text-[#8d6e63]">
                                          <Award className="h-4 w-4" />
                                          <span className="text-sm">{empleadoEnriquecido.experiencia} años exp.</span>
                                        </div>
                                      </div>
                                    </div>

                                    {esSeleccionado && (
                                      <div className="p-2 bg-[#a1887f] rounded-full">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Especialidades */}
                                  <div>
                                    <p className="text-sm font-medium text-[#6d4c41] mb-2">Especialidades:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {empleadoEnriquecido.especialidades!.map((especialidad, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="secondary"
                                          className="bg-[#f8f0ec] text-[#6d4c41] border border-[#e0d6cf]"
                                        >
                                          {especialidad}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Servicios que puede realizar */}
                                  <div className="pt-3 border-t border-[#e0d6cf]">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-[#8d6e63]">
                                        Puede realizar {empleado.serviciosQuePuedeRealizar.length} de tus servicios
                                      </span>
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
                                        ? "bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                                        : "bg-transparent border-2 border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white"
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
                    <AlertCircle className="h-5 w-5 text-[#a1887f] mt-0.5" />
                    <div className="text-sm text-[#6d4c41]">
                      <p className="font-medium mb-1">Información sobre nuestros profesionales:</p>
                      <ul className="space-y-1 text-[#8d6e63]">
                        <li>• Todos nuestros especialistas están certificados y capacitados</li>
                        <li>• Las calificaciones se basan en reseñas reales de clientes</li>
                        <li>• Podés solicitar cambio de profesional hasta 2 horas antes de tu cita</li>
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

export default SeleccionEmpleado
