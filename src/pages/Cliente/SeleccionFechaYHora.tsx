"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useTurno } from "@/context/TurnoContext"
import axios from "@/api/AxiosInstance"
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
} from "lucide-react"

const SeleccionFechaHora: React.FC = () => {
  const navigate = useNavigate()
  const { setFechaHora, sucursal, servicios, detalles } = useTurno()
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null)
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>("")
  const [semanaActual, setSemanaActual] = useState(0)
  const [diasConHorario, setDiasConHorario] = useState<Set<string>>(new Set())
  const [horariosDisponibles, setHorariosDisponibles] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)

  // Verificar que tengamos los datos necesarios
  useEffect(() => {
    if (!sucursal || servicios.length === 0) {
      navigate("/reserva/servicio")
    }
  }, [sucursal, servicios, navigate])

  // Cargar días con horario laboral
  useEffect(() => {
    const cargarDiasConHorario = async () => {
      if (!sucursal) return
      try {
        const response = await axios.get(`/api/PeriodoLaboral/sucursal/${sucursal.id}`)
        const dias = Object.keys(response.data)
        setDiasConHorario(new Set(dias))
      } catch (error) {
        console.error("Error al cargar dias con horario laboral", error)
      }
    }
    cargarDiasConHorario()
  }, [sucursal])

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
        const diaNombre = fecha.toLocaleDateString("en-US", { weekday: "long" })
        const abierto = diasConHorario.has(diaNombre)
        const fechaStr = fecha.toISOString().split("T")[0]
        const horariosDelDia = horariosDisponibles[fechaStr] || []

        dias.push({
          fecha,
          abierto,
          horariosDelDia,
          esHoy: fecha.toDateString() === hoy.toDateString(),
          esPasado: fecha < hoy,
        })
      }
    }
    return dias
  }

  // Obtener horarios disponibles para una fecha
  const fetchHorarios = async (fecha: Date) => {
    const fechaStr = fecha.toISOString().split("T")[0]
    setLoading(true)

    try {
      const response = await axios.post("/api/turnos/horarios-disponibles", {
        sucursalId: sucursal?.id,
        servicioIds: servicios.map((s) => s.id),
        extraIds: detalles.flatMap((d) => d.extras.map((e) => e.id)),
        fecha: fechaStr,
      })

      const bloques = response.data
      const horarios = bloques.map((b: any) => b.fechaHoraInicio.slice(11, 16))
      setHorariosDisponibles((prev) => ({ ...prev, [fechaStr]: horarios }))
    } catch (error) {
      console.error("Error al cargar horarios disponibles", error)
      setHorariosDisponibles((prev) => ({ ...prev, [fechaStr]: [] }))
    } finally {
      setLoading(false)
    }
  }

  const diasSemana = generarDiasSemana(semanaActual)

  const totalDuracion = detalles.reduce(
    (sum, d) => sum + d.servicio.duracionMinutos + d.extras.reduce((eSum, e) => eSum + e.duracionMinutos, 0),
    0,
  )

  const totalPrecio = detalles.reduce(
    (sum, d) => sum + d.servicio.precio + d.extras.reduce((eSum, e) => eSum + e.precio, 0),
    0,
  )

  const handleSeleccionFecha = (fecha: Date) => {
    setFechaSeleccionada(fecha)
    setHoraSeleccionada("")
    fetchHorarios(fecha)
  }

  const handleSeleccionHora = (hora: string) => {
    setHoraSeleccionada(hora)
  }

  const handleConfirmar = () => {
    if (fechaSeleccionada && horaSeleccionada) {
      const [hora, minuto] = horaSeleccionada.split(":")
      const fecha = new Date(fechaSeleccionada)
      fecha.setHours(parseInt(hora, 10))
      fecha.setMinutes(parseInt(minuto, 10))
      setFechaHora(fecha.toJSON())
      navigate("/reserva/empleado")
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

  const diaSeleccionado = diasSemana.find(
    (dia) => fechaSeleccionada && dia.fecha.toDateString() === fechaSeleccionada.toDateString(),
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
                <span className="text-[#6d4c41] font-medium">Paso 3 de 4</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#6d4c41] mb-2">Elegí fecha y hora</h1>
              <p className="text-[#8d6e63]">
                Seleccioná el momento perfecto para tu cita en <span className="font-medium">{sucursal?.nombre}</span>
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
        {/* Selector de semana */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
                  const tieneHorarios = dia.abierto
                  const horariosDisponiblesCount = dia.horariosDelDia.length

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
                        className={`cursor-pointer transition-all duration-300 ${
                          !tieneHorarios
                            ? "opacity-50 cursor-not-allowed bg-gray-50"
                            : esSeleccionado
                              ? "border-2 border-[#a1887f] bg-[#a1887f]/5 shadow-md"
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
                            {dia.esHoy && <Badge className="bg-[#a1887f] text-white text-xs">Hoy</Badge>}
                            {tieneHorarios ? (
                              <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {horariosDisponiblesCount > 0
                                  ? `${horariosDisponiblesCount} disponibles`
                                  : "Disponible"}
                              </div>
                            ) : (
                              <div className="text-xs text-red-500 flex items-center justify-center gap-1">
                                <X className="h-3 w-3" />
                                Cerrado
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
          {fechaSeleccionada && diaSeleccionado?.abierto && (
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
                      Horarios disponibles
                    </h2>
                    <p className="text-[#8d6e63]">
                      {fechaSeleccionada.toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a1887f]"></div>
                      <span className="ml-2 text-[#8d6e63]">Cargando horarios...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {(horariosDisponibles[fechaSeleccionada.toISOString().split("T")[0]] || []).map((hora) => {
                        const esSeleccionado = horaSeleccionada === hora

                        return (
                          <motion.div
                            key={hora}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant={esSeleccionado ? "default" : "outline"}
                              className={`w-full h-12 transition-all duration-300 ${
                                esSeleccionado
                                  ? "bg-[#a1887f] hover:bg-[#8d6e63] text-white border-[#a1887f]"
                                  : "border-[#d2bfae] text-[#6d4c41] hover:bg-[#f8f0ec] hover:border-[#a1887f]"
                              }`}
                              onClick={() => handleSeleccionHora(hora)}
                            >
                              <div className="flex flex-col items-center">
                                <span className="font-medium">{hora}</span>
                              </div>
                            </Button>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}

                  {!loading && horariosDisponibles[fechaSeleccionada.toISOString().split("T")[0]]?.length === 0 && (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-[#8d6e63] mx-auto mb-2" />
                      <p className="text-[#8d6e63]">No hay horarios disponibles para esta fecha</p>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="mt-6 p-4 bg-[#f8f0ec] rounded-lg border border-[#e0d6cf]">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-[#a1887f] mt-0.5" />
                      <div className="text-sm text-[#6d4c41]">
                        <p className="font-medium mb-1">Información importante:</p>
                        <ul className="space-y-1 text-[#8d6e63]">
                          <li>• Tu cita durará aproximadamente {totalDuracion} minutos</li>
                          <li>• Te recomendamos llegar 10 minutos antes</li>
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
              <Card className="bg-gradient-to-r from-[#a1887f] to-[#8d6e63] text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" />
                        Resumen de tu cita
                      </h3>
                      <div className="space-y-1 text-white/90">
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
                    <Button onClick={handleConfirmar} className="bg-white text-[#a1887f] hover:bg-white/90 font-medium">
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

export default SeleccionFechaHora
