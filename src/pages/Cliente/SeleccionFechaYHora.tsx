"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
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
} from "lucide-react"

// Horarios laborales por día de la semana
const horariosLaborales: Record<string, { inicio: string; fin: string } | null> = {
  Monday: { inicio: "14:00", fin: "18:00" },
  Tuesday: { inicio: "10:00", fin: "18:00" },
  Wednesday: { inicio: "10:00", fin: "18:00" },
  Thursday: { inicio: "10:00", fin: "18:00" },
  Friday: { inicio: "10:00", fin: "18:00" },
  Saturday: { inicio: "10:00", fin: "14:00" },
  Sunday: null,
}

// Función para generar franjas horarias
function generarFranjas(horaInicio: string, horaFin: string): string[] {
  const franjas: string[] = []
  const [hi, mi] = horaInicio.split(":").map(Number)
  const [hf, mf] = horaFin.split(":").map(Number)
  const start = new Date(0, 0, 0, hi, mi)
  const end = new Date(0, 0, 0, hf, mf)

  while (start < end) {
    franjas.push(start.toTimeString().slice(0, 5))
    start.setMinutes(start.getMinutes() + 30) // Cambié a 30 min para menos opciones
  }

  return franjas
}

// Función para simular horarios ocupados (en producción vendría de la API)
function obtenerHorariosOcupados(fecha: Date): string[] {
  const ocupados = ["10:00", "14:30", "16:00"] // Simulación
  return ocupados
}

const SeleccionFechaHora: React.FC = () => {
  const navigate = useNavigate()
  const { setFechaHora, sucursal, servicios, detalles } = useTurno()
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null)
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>("")
  const [semanaActual, setSemanaActual] = useState(0)

  // Verificar que tengamos los datos necesarios
  useEffect(() => {
    if (!sucursal || servicios.length === 0) {
      navigate("/reserva/servicio")
    }
  }, [sucursal, servicios, navigate])

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
        const key = fecha.toLocaleDateString("en-US", { weekday: "long" })
        const horario = horariosLaborales[key]
        const horariosOcupados = obtenerHorariosOcupados(fecha)

        dias.push({
          fecha,
          horario,
          horariosOcupados,
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
                  const tieneHorarios = dia.horario !== null
                  const horariosDisponibles = dia.horario
                    ? generarFranjas(dia.horario.inicio, dia.horario.fin).filter(
                      (hora) => !dia.horariosOcupados.includes(hora),
                    ).length
                    : 0

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
                                {horariosDisponibles} disponibles
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
          {fechaSeleccionada && diaSeleccionado?.horario && (
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

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {generarFranjas(diaSeleccionado.horario.inicio, diaSeleccionado.horario.fin).map((hora) => {
                      const estaOcupado = diaSeleccionado.horariosOcupados.includes(hora)
                      const esSeleccionado = horaSeleccionada === hora

                      return (
                        <motion.div
                          key={hora}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ scale: !estaOcupado ? 1.05 : 1 }}
                          whileTap={{ scale: !estaOcupado ? 0.95 : 1 }}
                        >
                          <Button
                            variant={esSeleccionado ? "default" : "outline"}
                            className={`w-full h-12 transition-all duration-300 ${estaOcupado
                                ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                                : esSeleccionado
                                  ? "bg-[#a1887f] hover:bg-[#8d6e63] text-white border-[#a1887f]"
                                  : "border-[#d2bfae] text-[#6d4c41] hover:bg-[#f8f0ec] hover:border-[#a1887f]"
                              }`}
                            onClick={() => !estaOcupado && handleSeleccionHora(hora)}
                            disabled={estaOcupado}
                          >
                            <div className="flex flex-col items-center">
                              <span className="font-medium">{hora}</span>
                              {estaOcupado && <span className="text-xs opacity-75">Ocupado</span>}
                            </div>
                          </Button>
                        </motion.div>
                      )
                    })}
                  </div>

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
