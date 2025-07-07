"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import axios from "@/api/AxiosInstance"
import { useTurno } from "@/context/TurnoContext"
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Building2,
  AlertCircle,
  CheckCircle,
  X,
  CalendarDays,
  Star,
  Loader2,
} from "lucide-react"

interface PeriodoLaboral {
  id: number
  empleadaId: number
  tipo: "HorarioHabitual" | "Licencia"
  diaSemana?: string // "Monday", "Tuesday", etc.
  horaInicio?: string
  horaFin?: string
  desde?: string
  hasta?: string
  motivo?: string

}

interface HorarioBloqueApi {
  fechaHoraInicio: string
  fechaHoraFin: string
  empleadasDisponibles: Array<{ id: number }>
}

const SeleccionFechaHoraEmpleada: React.FC = () => {
  const navigate = useNavigate()
  const { setFechaHora, sucursal, servicios, detalles, empleado } = useTurno()
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null)
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>("")
  const [semanaActual, setSemanaActual] = useState(0)
  const [periodosLaborales, setPeriodosLaborales] = useState<PeriodoLaboral[]>([])
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingHorarios, setLoadingHorarios] = useState(false)

  // Verificar que tengamos los datos necesarios
  useEffect(() => {
    if (!sucursal || servicios.length === 0 || !empleado) {
      navigate("/reserva/empleada-primero")
    }
  }, [sucursal, servicios, empleado, navigate])

  // Cargar períodos laborales del empleado
  useEffect(() => {
    const cargarPeriodosLaborales = async () => {
      if (!empleado) return

      setLoading(true)
      try {
        const response = await axios.get<PeriodoLaboral[]>(
          `/api/PeriodoLaboral/empleada/${empleado.id}`,
        )
        setPeriodosLaborales(
          response.data.filter((p) => p.tipo === "HorarioHabitual"),
        )
      } catch (error) {
        console.error("Error cargando períodos laborales:", error)
        setPeriodosLaborales([])
      } finally {
        setLoading(false)
      }
    }

    cargarPeriodosLaborales()
  }, [empleado])

  // Cargar horarios disponibles cuando se selecciona una fecha
  useEffect(() => {
    const cargarHorariosDisponibles = async () => {
      if (!fechaSeleccionada || !empleado) return

      setLoadingHorarios(true)
      try {
        const fechaStr = fechaSeleccionada.toISOString().split("T")[0]
        const serviciosIds = detalles.map((d) => d.servicio.id)

        const response = await axios.post<HorarioBloqueApi[]>("/api/Turnos/horarios-disponibles-empleada", {
          empleadaId: empleado.id,
          fecha: fechaStr,
          servicioIds: serviciosIds,
          sucursalId: sucursal?.id,
        })

        const horas = response.data
          .filter((bloque) =>
            bloque.empleadasDisponibles.some((e) => e.id === empleado.id),
          )
          .map((bloque) => bloque.fechaHoraInicio.slice(11, 16))

        setHorariosDisponibles(horas)
      } catch (error) {
        console.error("Error cargando horarios disponibles:", error)
        setHorariosDisponibles([])
      } finally {
        setLoadingHorarios(false)
      }
    }

    cargarHorariosDisponibles()
  }, [fechaSeleccionada, empleado, servicios, sucursal])

  // Generar días de la semana actual
  const generarDiasSemana = (offset = 0) => {
    const dias = []
    const hoy = new Date()
    const inicioSemana = new Date(hoy)
    inicioSemana.setDate(hoy.getDate() + offset * 7)

    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicioSemana)
      fecha.setDate(inicioSemana.getDate() + i)

      // Solo mostrar fechas futuras
      if (fecha >= hoy || fecha.toDateString() === hoy.toDateString()) {
        const diaSemanaNombre = fecha.toLocaleDateString('en-US', { weekday: 'long' })
        const periodoLaboral = periodosLaborales.find(
          (p) =>
            p.diaSemana?.toLowerCase() === diaSemanaNombre.toLowerCase(),
        )

        dias.push({
          fecha,
          periodoLaboral,
          esHoy: fecha.toDateString() === hoy.toDateString(),
          esPasado: fecha < hoy,
        })
      }
    }

    return dias
  }

  const diasSemana = generarDiasSemana(semanaActual)
  const totalDuracion = detalles.reduce(
    (sum, d) =>
      sum +
      d.servicio.duracionMinutos +
      d.extras.reduce((eSum, e) => eSum + e.duracionMinutos, 0),
    0,
  )
  const totalPrecio = detalles.reduce(
    (sum, d) =>
      sum + d.servicio.precio + d.extras.reduce((eSum, e) => eSum + e.precio, 0),
    0,
  )


  const handleSeleccionFecha = (fecha: Date) => {
    setFechaSeleccionada(fecha)
    setHoraSeleccionada("")
  }

  const handleSeleccionHora = (hora: string) => {
    setHoraSeleccionada(hora)
  }

  const handleConfirmar = () => {
    if (fechaSeleccionada && horaSeleccionada) {
      const fechaStr = fechaSeleccionada.toISOString().split("T")[0]
      const fechaHora = `${fechaStr}T${horaSeleccionada}:00`
      setFechaHora(fechaHora)
      navigate("/reserva/confirmar")
    }
  }

  const cambiarSemana = (direccion: "anterior" | "siguiente") => {
    if (direccion === "anterior" && semanaActual > 0) {
      setSemanaActual(semanaActual - 1)
    } else if (direccion === "siguiente") {
      setSemanaActual(semanaActual + 1)
    }
    setFechaSeleccionada(null)
    setHoraSeleccionada("")
  }

  const obtenerIniciales = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center p-4">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf] max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="p-4 bg-[#a1887f]/10 rounded-full w-fit mx-auto">
              <Loader2 className="h-8 w-8 animate-spin text-[#a1887f]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">Cargando horarios</h3>
              <p className="text-[#8d6e63]">Obteniendo la disponibilidad de {empleado?.nombre}...</p>
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
                <span className="text-[#6d4c41] font-medium">Paso 4 de 4</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#6d4c41] mb-2">Horarios de {empleado?.nombre}</h1>
              <p className="text-[#8d6e63]">Seleccioná el horario que más te convenga con tu especialista elegido</p>
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
        {/* Información del profesional seleccionado */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-gradient-to-r from-[#8d6e63] to-[#795548] text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
                    {empleado ? obtenerIniciales(empleado.nombre, empleado.apellido) : ""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">
                    {empleado?.nombre} {empleado?.apellido}
                  </h3>
                  <p className="text-white/90 text-sm mb-2">Tu especialista seleccionado</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm ml-1">4.8 • Especialista certificado</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate("/reserva/empleada-primero")}
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  Cambiar profesional
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selector de semana */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#6d4c41] flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Seleccionar fecha
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cambiarSemana("anterior")}
                    disabled={semanaActual === 0}
                    className="border-[#d2bfae] text-[#6d4c41] hover:bg-[#f8f0ec]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-[#8d6e63] min-w-[100px] text-center">
                    {semanaActual === 0 ? "Esta semana" : `+${semanaActual} semana${semanaActual > 1 ? "s" : ""}`}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cambiarSemana("siguiente")}
                    className="border-[#d2bfae] text-[#6d4c41] hover:bg-[#f8f0ec]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Grid de días */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {diasSemana.map((dia, index) => {
                  const esSeleccionado = fechaSeleccionada?.toDateString() === dia.fecha.toDateString()
                  const tieneHorarios = dia.periodoLaboral !== undefined

                  return (
                    <motion.div
                      key={dia.fecha.toDateString()}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: tieneHorarios ? 1.02 : 1 }}
                      whileTap={{ scale: tieneHorarios ? 0.98 : 1 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-300 ${!tieneHorarios
                          ? "opacity-50 cursor-not-allowed bg-gray-50"
                          : esSeleccionado
                            ? "border-2 border-[#8d6e63] bg-[#8d6e63]/5 shadow-md"
                            : "border border-[#e0d6cf] hover:border-[#d2bfae] hover:shadow-sm"
                          }`}
                        onClick={() => tieneHorarios && handleSeleccionFecha(dia.fecha)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="space-y-2">
                            <div className="text-xs text-[#8d6e63] uppercase tracking-wide">
                              {dia.fecha.toLocaleDateString("es-ES", { weekday: "short" })}
                            </div>
                            <div className="text-lg font-bold text-[#6d4c41]">{dia.fecha.getDate()}</div>
                            <div className="text-xs text-[#8d6e63]">
                              {dia.fecha.toLocaleDateString("es-ES", { month: "short" })}
                            </div>

                            {dia.esHoy && <div className="bg-[#8d6e63] text-white text-xs px-2 py-1 rounded">Hoy</div>}

                            {tieneHorarios ? (
                              <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Disponible
                              </div>
                            ) : (
                              <div className="text-xs text-red-500 flex items-center justify-center gap-1">
                                <X className="h-3 w-3" />
                                No trabaja
                              </div>
                            )}

                            {tieneHorarios && dia.periodoLaboral && (
                              <div className="text-xs text-[#8d6e63]">
                                {dia.periodoLaboral.horaInicio} - {dia.periodoLaboral.horaFin}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selector de horarios */}
        <AnimatePresence>
          {fechaSeleccionada && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#6d4c41] flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5" />
                      Horarios disponibles de {empleado?.nombre}
                    </h2>
                    <p className="text-[#8d6e63]">
                      {fechaSeleccionada.toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>

                  {loadingHorarios ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-[#a1887f]" />
                      <span className="ml-2 text-[#8d6e63]">Cargando horarios disponibles...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {horariosDisponibles.map((hora, index) => {
                        const esSeleccionado = horaSeleccionada === hora;
                        const key = `${hora}-${index}`;

                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant={esSeleccionado ? "default" : "outline"}
                              className={`w-full h-12 transition-all duration-300 ${esSeleccionado
                                  ? "bg-[#8d6e63] hover:bg-[#795548] text-white border-[#8d6e63]"
                                  : "border border-[#d2bfae] text-[#6d4c41] hover:bg-[#f8f0ec] hover:border-[#8d6e63]"
                                }`}
                              onClick={() => handleSeleccionHora(hora)}
                            >
                              <div className="flex flex-col items-center">
                                <span className="font-medium">{hora}</span>
                              </div>
                            </Button>
                          </motion.div>
                        );
                      })}

                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="mt-6 p-4 bg-[#f8f0ec] rounded-lg border border-[#e0d6cf]">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-[#8d6e63] mt-0.5" />
                      <div className="text-sm text-[#6d4c41]">
                        <p className="font-medium mb-1">Información importante:</p>
                        <ul className="space-y-1 text-[#8d6e63]">
                          <li>• Tu cita durará aproximadamente {totalDuracion} minutos</li>
                          <li>• Te recomendamos llegar 10 minutos antes</li>
                          <li>• Estos son los horarios exclusivos de {empleado?.nombre}</li>
                          <li>• Podrás reprogramar hasta 24hs antes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resumen y confirmación */}
        <AnimatePresence>
          {fechaSeleccionada && horaSeleccionada && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-[#8d6e63] to-[#795548] text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" />
                        Resumen de tu cita
                      </h3>
                      <div className="space-y-1 text-white/90">
                        <p>
                          👤 Con {empleado?.nombre} {empleado?.apellido}
                        </p>
                        <p>
                          📅{" "}
                          {fechaSeleccionada.toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p>🕐 {horaSeleccionada} hs</p>
                        <p>📍 {sucursal?.nombre}</p>
                        <p>⏱️ Duración: {totalDuracion} minutos</p>
                      </div>
                    </div>

                    <Button onClick={handleConfirmar} className="bg-white text-[#8d6e63] hover:bg-white/90 font-medium">
                      Continuar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SeleccionFechaHoraEmpleada
