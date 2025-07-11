"use client"
import { useEffect, useState, useMemo } from "react"
import axios from "@/api/AxiosInstance"
import { format, parseISO, addDays, startOfWeek, endOfWeek, isSameDay, addWeeks, subWeeks, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  Users,
  Filter,
  User,
  Phone,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface TurnoCalendarioDTO {
  id: number
  fechaHoraInicio: string
  fechaHoraFin: string
  empleadaNombre: string
  empleadaColor: string | null
  clienteNombre: string
  clienteApellido: string
  clienteTelefono: string
  servicios: string[]
  extras: string[]
  estado: string
  empleadaId: number
  sucursalId: number
  sucursalNombre: string
}

const estados = ["Todos", "Pendiente", "Confirmado", "Realizado", "Cancelado"]

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "Pendiente":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Confirmado":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Realizado":
      return "bg-green-100 text-green-800 border-green-200"
    case "Cancelado":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getEstadoIcon = (estado: string) => {
  switch (estado) {
    case "Pendiente":
      return <AlertCircle size={10} />
    case "Confirmado":
      return <CheckCircle size={10} />
    case "Realizado":
      return <CheckCircle size={10} />
    case "Cancelado":
      return <XCircle size={10} />
    default:
      return <Clock size={10} />
  }
}

type VistaCalendario = "semana" | "dia"

export default function CalendarioTurnosAdmin() {
  const [turnos, setTurnos] = useState<TurnoCalendarioDTO[]>([])
  const [estadoFiltro, setEstadoFiltro] = useState<string>("Todos")
  const [empleadas, setEmpleadas] = useState<{ id: number; nombre: string }[]>([])
  const [empleadaFiltro, setEmpleadaFiltro] = useState<string>("Todos")
  const [sucursales, setSucursales] = useState<{ id: number; nombre: string }[]>([])
  const [sucursalFiltro, setSucursalFiltro] = useState<string>("Todos")
  const [fechaActual, setFechaActual] = useState<Date>(new Date())
  const [vista, setVista] = useState<VistaCalendario>("semana")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date())
  const [fechaFin, setFechaFin] = useState<Date>(new Date())

  // Calcular rango de fechas según la vista

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        setIsLoading(true)
        setError("")
        const params: Record<string, string> = {}

        if (estadoFiltro !== "Todos") params.estado = estadoFiltro
        if (empleadaFiltro !== "Todos") params.empleadaId = empleadaFiltro
        if (sucursalFiltro !== "Todos") params.sucursalId = sucursalFiltro

        // Calcular rango de fechas dentro del useEffect
        let fechaInicio: Date, fechaFin: Date

        if (vista === "semana") {
          fechaInicio = startOfWeek(fechaActual, { weekStartsOn: 1 })
          fechaFin = endOfWeek(fechaActual, { weekStartsOn: 1 })
        } else {
          fechaInicio = startOfDay(fechaActual)
          fechaFin = startOfDay(fechaActual)
        }

        setFechaInicio(fechaInicio)
        setFechaFin(fechaFin)

        params.fechaInicio = format(fechaInicio, "yyyy-MM-dd'T00:00:00'")
        params.fechaFin = format(fechaFin, "yyyy-MM-dd'T23:59:59'")

        const res = await axios.get<TurnoCalendarioDTO[]>("/api/Turnos/filtrar", { params })
        setTurnos(res.data)

        const empleadasUnicas = Array.from(
          new Map(res.data.map((t) => [t.empleadaId, t.empleadaNombre])).entries(),
        ).map(([id, nombre]) => ({ id, nombre }))

        const sucursalesUnicas = Array.from(
          new Map(res.data.map((t) => [t.sucursalId, t.sucursalNombre])).entries(),
        ).map(([id, nombre]) => ({ id, nombre }))

        setEmpleadas([{ id: -1, nombre: "Todos" }, ...empleadasUnicas])
        setSucursales([{ id: -1, nombre: "Todos" }, ...sucursalesUnicas])
      } catch (error) {
        console.error("Error al cargar los turnos:", error)
        setError("Error al cargar los turnos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTurnos()
  }, [estadoFiltro, empleadaFiltro, sucursalFiltro, fechaActual, vista])

  // Navegación
  const navegarAnterior = () => {
    if (vista === "semana") {
      setFechaActual(subWeeks(fechaActual, 1))
    } else {
      setFechaActual(addDays(fechaActual, -1))
    }
  }

  const navegarSiguiente = () => {
    if (vista === "semana") {
      setFechaActual(addWeeks(fechaActual, 1))
    } else {
      setFechaActual(addDays(fechaActual, 1))
    }
  }

  const irHoy = () => {
    setFechaActual(new Date())
  }

  // Generar días de la semana
  const diasSemana = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      return addDays(startOfWeek(fechaActual, { weekStartsOn: 1 }), i)
    })
  }, [fechaActual])

  // Horas del día (6 AM a 10 PM)
  const horasDelDia = Array.from({ length: 17 }, (_, i) => i + 6)

  // Obtener turnos para un día y hora específicos
  const getTurnosParaDiaYHora = (dia: Date, hora: number) => {
    return turnos.filter((turno) => {
      const fechaTurno = parseISO(turno.fechaHoraInicio)
      return isSameDay(fechaTurno, dia) && fechaTurno.getHours() === hora
    })
  }

  // Obtener todos los turnos para un día
  const getTurnosParaDia = (dia: Date) => {
    return turnos.filter((turno) => {
      const fechaTurno = parseISO(turno.fechaHoraInicio)
      return isSameDay(fechaTurno, dia)
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 size={32} className="text-[#7a5b4c] animate-spin sm:w-10 sm:h-10" />
          </div>
          <p className="text-[#7a5b4c] font-medium text-base sm:text-lg">Cargando calendario...</p>
          <p className="text-[#7a5b4c]/60 text-sm mt-2">Esto puede tomar unos segundos</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-2 sm:px-4 py-4 sm:py-8">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#d4bfae] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#a37e63] rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-xl sm:rounded-2xl overflow-hidden">
            {/* Header del calendario */}
            <div className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Título y navegación */}
                <div className="flex items-center space-x-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <CalendarDays size={20} className="text-white" />
                  </motion.div>

                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Calendario de Turnos</h1>
                    <p className="text-white/80 text-sm">
                      {vista === "semana"
                        ? `${format(fechaInicio, "d MMM", { locale: es })} - ${format(fechaFin, "d MMM yyyy", { locale: es })}`
                        : format(fechaActual, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                  </div>
                </div>

                {/* Controles de navegación y vista */}
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={irHoy}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    Hoy
                  </Button>

                  <div className="flex items-center bg-white/20 rounded-lg">
                    <Button
                      onClick={navegarAnterior}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <Button
                      onClick={navegarSiguiente}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>

                  {/* Selector de vista */}
                  <div className="flex items-center bg-white/20 rounded-lg">
                    <Button
                      onClick={() => setVista("dia")}
                      variant="ghost"
                      size="sm"
                      className={cn("text-white hover:bg-white/20", vista === "dia" && "bg-white/30")}
                    >
                      <List size={16} />
                    </Button>
                    <Button
                      onClick={() => setVista("semana")}
                      variant="ghost"
                      size="sm"
                      className={cn("text-white hover:bg-white/20", vista === "semana" && "bg-white/30")}
                    >
                      <Grid3X3 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-0">
              {/* Filtros */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 sm:p-6 border-b border-[#e1cfc0] bg-[#fdf6f1]"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Filter size={16} className="text-[#7a5b4c]" />
                  <h3 className="text-sm font-semibold text-[#7a5b4c]">Filtros</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                    <SelectTrigger className="bg-white border-[#e1cfc0] text-[#7a5b4c] text-sm">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={empleadaFiltro} onValueChange={setEmpleadaFiltro}>
                    <SelectTrigger className="bg-white border-[#e1cfc0] text-[#7a5b4c] text-sm">
                      <SelectValue placeholder="Empleada" />
                    </SelectTrigger>
                    <SelectContent>
                      {empleadas.map((e) => (
                        <SelectItem key={e.id} value={e.id === -1 ? "Todos" : e.id.toString()}>
                          {e.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sucursalFiltro} onValueChange={setSucursalFiltro}>
                    <SelectTrigger className="bg-white border-[#e1cfc0] text-[#7a5b4c] text-sm">
                      <SelectValue placeholder="Sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      {sucursales.map((s) => (
                        <SelectItem key={s.id} value={s.id === -1 ? "Todos" : s.id.toString()}>
                          {s.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              {/* Vista de Semana */}
              {vista === "semana" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-x-auto"
                >
                  {/* Header de días */}
                  <div className="grid grid-cols-8 border-b border-[#e1cfc0] bg-[#f8f0e8]">
                    <div className="p-3 text-center text-sm font-medium text-[#7a5b4c] border-r border-[#e1cfc0]">
                      Hora
                    </div>
                    {diasSemana.map((dia) => (
                      <div
                        key={dia.toISOString()}
                        className="p-3 text-center border-r border-[#e1cfc0] last:border-r-0"
                      >
                        <div className="text-xs text-[#7a5b4c]/60 uppercase">{format(dia, "EEE", { locale: es })}</div>
                        <div
                          className={cn(
                            "text-lg font-semibold mt-1",
                            isSameDay(dia, new Date())
                              ? "text-[#a37e63] bg-[#a37e63]/10 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                              : "text-[#7a5b4c]",
                          )}
                        >
                          {format(dia, "d")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Grid de horas y turnos */}
                  <div className="max-h-[600px] overflow-y-auto">
                    {horasDelDia.map((hora) => (
                      <div key={hora} className="grid grid-cols-8 border-b border-[#e1cfc0] min-h-[80px]">
                        {/* Columna de hora */}
                        <div className="p-2 text-center text-sm text-[#7a5b4c]/60 border-r border-[#e1cfc0] bg-[#fdf6f1] flex items-start justify-center pt-3">
                          {hora.toString().padStart(2, "0")}:00
                        </div>

                        {/* Columnas de días */}
                        {diasSemana.map((dia) => {
                          const turnosDiaHora = getTurnosParaDiaYHora(dia, hora)
                          return (
                            <div
                              key={`${dia.toISOString()}-${hora}`}
                              className="p-1 border-r border-[#e1cfc0] last:border-r-0 min-h-[80px] hover:bg-[#fdf6f1] transition-colors"
                            >
                              <div className="space-y-1">
                                {turnosDiaHora.map((turno) => (
                                  <motion.div
                                    key={turno.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white border border-[#e1cfc0] rounded p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    style={{
                                      borderLeftColor: turno.empleadaColor || "#a37e63",
                                      borderLeftWidth: "3px",
                                    }}
                                  >
                                    <div className="text-xs font-medium text-[#7a5b4c] truncate">
                                      {turno.clienteNombre} {turno.clienteApellido}
                                    </div>
                                    <div className="text-xs text-[#7a5b4c]/60 truncate">
                                      {format(parseISO(turno.fechaHoraInicio), "HH:mm")} -{" "}
                                      {format(parseISO(turno.fechaHoraFin), "HH:mm")}
                                    </div>
                                    <div className="flex items-center space-x-1 mt-1">
                                      <Badge className={`${getEstadoColor(turno.estado)} text-xs px-1 py-0`}>
                                        {getEstadoIcon(turno.estado)}
                                      </Badge>
                                      <span className="text-xs text-[#7a5b4c]/60 truncate">{turno.empleadaNombre}</span>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Vista de Día */}
              {vista === "dia" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 sm:p-6"
                >
                  <div className="space-y-4">
                    {horasDelDia.map((hora) => {
                      const turnosHora = getTurnosParaDiaYHora(fechaActual, hora)
                      return (
                        <div key={hora} className="border border-[#e1cfc0] rounded-lg overflow-hidden">
                          <div className="bg-[#f8f0e8] px-4 py-2 border-b border-[#e1cfc0]">
                            <div className="flex items-center space-x-2">
                              <Clock size={16} className="text-[#7a5b4c]" />
                              <span className="font-medium text-[#7a5b4c]">{hora.toString().padStart(2, "0")}:00</span>
                              <span className="text-sm text-[#7a5b4c]/60">
                                ({turnosHora.length} turno{turnosHora.length !== 1 ? "s" : ""})
                              </span>
                            </div>
                          </div>

                          <div className="p-4">
                            {turnosHora.length === 0 ? (
                              <div className="text-center py-8 text-[#7a5b4c]/60">
                                <Clock size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Sin turnos programados</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {turnosHora.map((turno) => (
                                  <motion.div
                                    key={turno.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-white to-[#fdf6f1] border border-[#e1cfc0] rounded-lg p-4 hover:shadow-md transition-all duration-200"
                                    style={{
                                      borderLeftColor: turno.empleadaColor || "#a37e63",
                                      borderLeftWidth: "4px",
                                    }}
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center space-x-2">
                                        <Clock size={14} className="text-[#7a5b4c]" />
                                        <span className="font-semibold text-[#7a5b4c] text-sm">
                                          {format(parseISO(turno.fechaHoraInicio), "HH:mm")} -{" "}
                                          {format(parseISO(turno.fechaHoraFin), "HH:mm")}
                                        </span>
                                      </div>
                                      <Badge className={`${getEstadoColor(turno.estado)} text-xs`}>
                                        {getEstadoIcon(turno.estado)}
                                        <span className="ml-1">{turno.estado}</span>
                                      </Badge>
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <User size={12} className="text-[#7a5b4c]/60" />
                                        <span className="text-sm font-medium text-[#7a5b4c]">
                                          {turno.clienteNombre} {turno.clienteApellido}
                                        </span>
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        <Phone size={12} className="text-[#7a5b4c]/60" />
                                        <span className="text-sm text-[#7a5b4c]/70">{turno.clienteTelefono}</span>
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        <Users size={12} className="text-[#7a5b4c]/60" />
                                        <span
                                          className="text-sm font-medium"
                                          style={{ color: turno.empleadaColor || "#7a5b4c" }}
                                        >
                                          {turno.empleadaNombre}
                                        </span>
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        <MapPin size={12} className="text-[#7a5b4c]/60" />
                                        <span className="text-sm text-[#7a5b4c]/70">{turno.sucursalNombre}</span>
                                      </div>

                                      {turno.servicios.length > 0 && (
                                        <div className="mt-2">
                                          <div className="flex flex-wrap gap-1">
                                            {turno.servicios.map((servicio, i) => (
                                              <Badge
                                                key={i}
                                                variant="secondary"
                                                className="bg-blue-100 text-blue-800 text-xs"
                                              >
                                                {servicio}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {turno.extras.length > 0 && (
                                        <div className="mt-2">
                                          <div className="flex flex-wrap gap-1">
                                            {turno.extras.map((extra, i) => (
                                              <Badge
                                                key={i}
                                                variant="secondary"
                                                className="bg-purple-100 text-purple-800 text-xs"
                                              >
                                                <Star size={8} className="mr-1" />
                                                {extra}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Mensaje de error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="m-4 sm:m-6 flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle size={16} className="text-red-500" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
