"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTurno } from "@/context/TurnoContext"
import axios from "@/api/AxiosInstance"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Users,
  Clock,
  Calendar,
  Building2,
  Star,
  Award,
  Mail,
  ChevronRight,
  UserCheck,
  Sparkles,
} from "lucide-react"

interface EmpleadoDisponible {
  id: number
  nombre: string
  apellido: string
  email?: string
  cargo?: string
}

interface HorarioDisponible {
  fechaHoraInicio: string
  fechaHoraFin: string
  empleadasDisponibles: EmpleadoDisponible[]
}

const SeleccionEmpleado: React.FC = () => {
  const navigate = useNavigate()
  const { fechaHora, setEmpleado, sucursal, servicios, detalles } = useTurno()
  const [empleadas, setEmpleadas] = useState<EmpleadoDisponible[]>([])
  const [cargando, setCargando] = useState(true)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<EmpleadoDisponible | null>(null)

  // Verificar que tengamos los datos necesarios
  useEffect(() => {
    if (!sucursal || !fechaHora || servicios.length === 0) {
      navigate("/reserva/fecha-hora")
    }
  }, [sucursal, fechaHora, servicios, navigate])

  useEffect(() => {
    const cargarEmpleadas = async () => {
      if (!sucursal || !fechaHora || servicios.length === 0) return

      const fecha = fechaHora.split("T")[0]
      setCargando(true)

      try {
        const response = await axios.post("/api/turnos/horarios-disponibles", {
          sucursalId: sucursal.id,
          servicioIds: servicios.map((s) => s.id),
          extraIds: detalles.flatMap((d) => d.extras.map((e) => e.id)),
          fecha,
        })

        const bloques: HorarioDisponible[] = response.data
        const bloqueSeleccionado = bloques.find((b) => b.fechaHoraInicio === fechaHora)

        if (bloqueSeleccionado) {
          setEmpleadas(bloqueSeleccionado.empleadasDisponibles)
        } else {
          setEmpleadas([])
        }
      } catch (error) {
        console.error("Error al obtener empleadas disponibles:", error)
        setEmpleadas([])
      } finally {
        setCargando(false)
      }
    }

    cargarEmpleadas()
  }, [fechaHora, sucursal, servicios, detalles])

  const seleccionarEmpleado = (empleado: EmpleadoDisponible) => {
    setEmpleadoSeleccionado(empleado)
    setTimeout(() => {
      setEmpleado(empleado)
      navigate("/reserva/confirmar")
    }, 300)
  }

  // Calcular totales
  const totalDuracion = detalles.reduce(
    (sum, d) => sum + d.servicio.duracionMinutos + d.extras.reduce((eSum, e) => eSum + e.duracionMinutos, 0),
    0,
  )

  const totalPrecio = detalles.reduce(
    (sum, d) => sum + d.servicio.precio + d.extras.reduce((eSum, e) => eSum + e.precio, 0),
    0,
  )

  // Formatear fecha y hora
  const fechaFormateada = fechaHora
    ? new Date(fechaHora).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : ""

  const horaFormateada = fechaHora ? fechaHora.split("T")[1].slice(0, 5) : ""

  // Generar iniciales para avatar
  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  // Skeleton loading component
  const SkeletonCard = () => (
    <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#f8f0ec] rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#f8f0ec] rounded animate-pulse" />
            <div className="h-3 bg-[#f8f0ec] rounded w-2/3 animate-pulse" />
            <div className="h-3 bg-[#f8f0ec] rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

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
                Seleccioná la profesional que prefieras para tu cita en{" "}
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
                      <span className="font-medium">{fechaFormateada}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6d4c41]">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{horaFormateada} hs</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6d4c41]">
                      <Sparkles className="h-4 w-4" />
                      <span className="font-medium">
                        ${totalPrecio} • {totalDuracion}min
                      </span>
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
        {/* Información de la cita - Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:hidden"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[#6d4c41]">
                  <Calendar className="h-4 w-4" />
                  <span>{fechaFormateada}</span>
                </div>
                <div className="flex items-center gap-2 text-[#6d4c41]">
                  <Clock className="h-4 w-4" />
                  <span>{horaFormateada} hs</span>
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
                  Profesionales disponibles
                </h2>
                <p className="text-[#8d6e63]">
                  {cargando
                    ? "Buscando profesionales..."
                    : `${empleadas.length} profesional${empleadas.length !== 1 ? "es" : ""} disponible${empleadas.length !== 1 ? "s" : ""} para tu horario`}
                </p>
              </div>

              {cargando ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : empleadas.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-[#f8f0ec] rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="h-10 w-10 text-[#8d6e63]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">No hay profesionales disponibles</h3>
                  <p className="text-[#8d6e63] mb-4">
                    No encontramos profesionales disponibles para este horario específico.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/reserva/fecha-hora")}
                    className="border-[#d2bfae] text-[#6d4c41] hover:bg-[#f8f0ec]"
                  >
                    Elegir otro horario
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {empleadas.map((empleado, index) => {
                      const esSeleccionado = empleadoSeleccionado?.id === empleado.id

                      return (
                        <motion.div
                          key={empleado.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-300 ${
                              esSeleccionado
                                ? "border-2 border-[#a1887f] bg-[#a1887f]/5 shadow-lg"
                                : "border border-[#e0d6cf] hover:border-[#d2bfae] hover:shadow-md bg-white/80 backdrop-blur-sm"
                            }`}
                            onClick={() => seleccionarEmpleado(empleado)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                  <Avatar className="w-16 h-16 border-2 border-[#e0d6cf]">
                                    <AvatarFallback className="bg-[#a1887f] text-white text-lg font-semibold">
                                      {getInitials(empleado.nombre, empleado.apellido)}
                                    </AvatarFallback>
                                  </Avatar>
                                  {esSeleccionado && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute -top-1 -right-1 w-6 h-6 bg-[#a1887f] rounded-full flex items-center justify-center"
                                    >
                                      <UserCheck className="h-3 w-3 text-white" />
                                    </motion.div>
                                  )}
                                </div>

                                {/* Información del empleado */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-[#6d4c41]">
                                      {empleado.nombre} {empleado.apellido}
                                    </h3>
                                    <Badge className="bg-[#a1887f]/10 text-[#6d4c41] border-[#d2bfae]">
                                      <Star className="h-3 w-3 mr-1" />
                                      Disponible
                                    </Badge>
                                  </div>

                                  {empleado.cargo && (
                                    <div className="flex items-center gap-2 mb-2">
                                      <Award className="h-4 w-4 text-[#8d6e63]" />
                                      <span className="text-[#8d6e63] font-medium">{empleado.cargo}</span>
                                    </div>
                                  )}

                                  {empleado.email && (
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4 text-[#8d6e63]" />
                                      <span className="text-sm text-[#8d6e63]">{empleado.email}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Botón de selección */}
                                <div className="flex items-center">
                                  {esSeleccionado ? (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="flex items-center gap-2 text-[#a1887f] font-medium"
                                    >
                                      <UserCheck className="h-5 w-5" />
                                      <span>Seleccionado</span>
                                    </motion.div>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-[#6d4c41] hover:bg-[#f8f0ec] hover:text-[#a1887f]"
                                    >
                                      Seleccionar
                                      <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Información adicional */}
        {!cargando && empleadas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-[#f8f0ec] border-[#e0d6cf]">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-[#a1887f] mt-0.5" />
                  <div className="text-sm text-[#6d4c41]">
                    <p className="font-medium mb-1">Sobre nuestras profesionales:</p>
                    <ul className="space-y-1 text-[#8d6e63]">
                      <li>• Todas nuestras profesionales están certificadas y capacitadas</li>
                      <li>• Podrás solicitar la misma profesional en futuras citas</li>
                      <li>• Si no tienes preferencia, cualquier profesional te brindará un excelente servicio</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SeleccionEmpleado
