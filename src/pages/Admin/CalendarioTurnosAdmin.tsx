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
  Building2,
  UserCheck,
  Activity,
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

interface PeriodoLaboralDTO {
  id: number
  empleadaId: number
  tipo: "HorarioHabitual" | "Licencia"
  diaSemana: string
  horaInicio: string
  horaFin: string
  desde: string
  hasta: string
  motivo: string
}

interface PeriodosLaboralesPorDia {
  Sunday: PeriodoLaboralDTO[]
  Monday: PeriodoLaboralDTO[]
  Tuesday: PeriodoLaboralDTO[]
  Wednesday: PeriodoLaboralDTO[]
  Thursday: PeriodoLaboralDTO[]
  Friday: PeriodoLaboralDTO[]
  Saturday: PeriodoLaboralDTO[]
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

// Hook para detectar tamaño de pantalla
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return screenSize
}

export default function CalendarioTurnosAdmin() {
  const [turnos, setTurnos] = useState<TurnoCalendarioDTO[]>([])
  const [estadoFiltro, setEstadoFiltro] = useState<string>("Todos")
  const [empleadas, setEmpleadas] = useState<{ id: number; nombre: string }[]>([])
  const [empleadaFiltro, setEmpleadaFiltro] = useState<string>("Todos")
  const [sucursales, setSucursales] = useState<{ id: number; nombre: string }[]>([])
  const [sucursalFiltro, setSucursalFiltro] = useState<string>("")
  const [fechaActual, setFechaActual] = useState<Date>(new Date())
  const [vista, setVista] = useState<VistaCalendario>("semana")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date())
  const [fechaFin, setFechaFin] = useState<Date>(new Date())
  const [periodosLaborales, setPeriodosLaborales] = useState<PeriodosLaboralesPorDia | null>(null)

  const screenSize = useScreenSize()
  const isMobile = screenSize.width < 640
  const isTablet = screenSize.width < 768

  // Forzar vista de día en pantallas muy pequeñas
  useEffect(() => {
    if (isMobile && vista === "semana") {
      setVista("dia")
    }
  }, [isMobile, vista])

  // Cargar sucursales al inicio
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await axios.get("/api/Sucursal")
        setSucursales(res.data)
        // Seleccionar la primera sucursal por defecto
        if (res.data.length > 0 && !sucursalFiltro) {
          setSucursalFiltro(res.data[0].id.toString())
        }
      } catch (error) {
        console.error("Error al cargar sucursales:", error)
        setError("Error al cargar sucursales")
      }
    }
    fetchSucursales()
  }, [])

  // Cargar períodos laborales cuando cambia la sucursal
  useEffect(() => {
    const fetchPeriodosLaborales = async () => {
      if (!sucursalFiltro) return

      try {
        const res = await axios.get<PeriodosLaboralesPorDia>(`/api/PeriodoLaboral/sucursal/${sucursalFiltro}`)
        setPeriodosLaborales(res.data)
      } catch (error) {
        console.error("Error al cargar períodos laborales:", error)
        setPeriodosLaborales(null)
      }
    }
    fetchPeriodosLaborales()
  }, [sucursalFiltro])

  // Calcular rango de fechas según la vista
  useEffect(() => {
    const fetchTurnos = async () => {
      if (!sucursalFiltro) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError("")
        const params: Record<string, string> = {}

        if (estadoFiltro !== "Todos") params.estado = estadoFiltro
        if (empleadaFiltro !== "Todos") params.empleadaId = empleadaFiltro
        params.sucursalId = sucursalFiltro

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

        setEmpleadas([{ id: -1, nombre: "Todos" }, ...empleadasUnicas])
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

  // Mapear días de la semana a nombres en inglés
  const mapearDiaAIngles = (dia: Date): keyof PeriodosLaboralesPorDia => {
    const diasIngles: (keyof PeriodosLaboralesPorDia)[] = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]
    return diasIngles[dia.getDay()]
  }

  // Obtener horas laborales para un día específico
  const getHorasLaboralesParaDia = (dia: Date): number[] => {
    if (!periodosLaborales) return []

    const diaIngles = mapearDiaAIngles(dia)
    const periodosDelDia = periodosLaborales[diaIngles] || []

    // Filtrar por empleada si está seleccionada
    const periodosFiltrados =
      empleadaFiltro !== "Todos"
        ? periodosDelDia.filter((p) => p.empleadaId === Number(empleadaFiltro))
        : periodosDelDia

    const horasSet = new Set<number>()

    periodosFiltrados.forEach((periodo) => {
      if (periodo.tipo === "HorarioHabitual" && periodo.horaInicio && periodo.horaFin) {
        const horaInicio = Number.parseInt(periodo.horaInicio.split(":")[0])
        const horaFin = Number.parseInt(periodo.horaFin.split(":")[0])

        for (let hora = horaInicio; hora <= horaFin; hora++) {
          horasSet.add(hora)
        }
      }
    })

    return Array.from(horasSet).sort((a, b) => a - b)
  }

  // Horas del día basadas en períodos laborales
  const horasDelDia = useMemo(() => {
    if (vista === "semana") {
      // Para vista semana, obtener todas las horas de todos los días
      const todasLasHoras = new Set<number>()
      diasSemana.forEach((dia) => {
        const horasDia = getHorasLaboralesParaDia(dia)
        horasDia.forEach((hora) => todasLasHoras.add(hora))
      })
      return Array.from(todasLasHoras).sort((a, b) => a - b)
    } else {
      // Para vista día, solo las horas del día actual
      return getHorasLaboralesParaDia(fechaActual)
    }
  }, [vista, diasSemana, fechaActual, periodosLaborales, empleadaFiltro])

  // Obtener turnos para un día y hora específicos
  const getTurnosParaDiaYHora = (dia: Date, hora: number) => {
    return turnos.filter((turno) => {
      const fechaTurno = parseISO(turno.fechaHoraInicio)
      return isSameDay(fechaTurno, dia) && fechaTurno.getHours() === hora
    })
  }

  // Verificar si una hora es laboral para un día específico
  const esHoraLaboral = (dia: Date, hora: number): boolean => {
    const horasLaborales = getHorasLaboralesParaDia(dia)
    return horasLaborales.includes(hora)
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

                  {/* Selector de vista - oculto en móviles muy pequeños */}
                  {!isMobile && (
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
                  )}
                </div>
              </div>
            </div>

            <CardContent className="p-0">
              {/* Filtros mejorados */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 sm:p-6 border-b border-[#e1cfc0] bg-gradient-to-r from-[#fdf6f1] to-[#f8f0e8]"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    className="w-8 h-8 bg-[#a37e63]/20 rounded-full flex items-center justify-center"
                  >
                    <Filter size={16} className="text-[#7a5b4c]" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-[#7a5b4c]">Filtros de Búsqueda</h3>
                    <p className="text-sm text-[#7a5b4c]/70">Personaliza la vista del calendario</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Filtro de Sucursal - Obligatorio */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                  >
                    <label className="block text-sm font-semibold text-[#7a5b4c] mb-2">
                      <div className="flex items-center space-x-2">
                        <Building2 size={16} className="text-[#a37e63]" />
                        <span>Sucursal *</span>
                      </div>
                    </label>
                    <Select value={sucursalFiltro} onValueChange={setSucursalFiltro}>
                      <SelectTrigger className="bg-white/80 border-2 border-[#e1cfc0] hover:border-[#a37e63] focus:border-[#a37e63] text-[#7a5b4c] text-sm h-12 rounded-xl transition-all duration-200">
                        <SelectValue placeholder="Seleccionar sucursal" />
                      </SelectTrigger>
                      <SelectContent>
                        {sucursales.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!sucursalFiltro && <p className="text-xs text-red-500 mt-1">* Campo obligatorio</p>}
                  </motion.div>

                  {/* Filtro de Empleada */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative"
                  >
                    <label className="block text-sm font-semibold text-[#7a5b4c] mb-2">
                      <div className="flex items-center space-x-2">
                        <UserCheck size={16} className="text-[#a37e63]" />
                        <span>Empleada</span>
                      </div>
                    </label>
                    <Select value={empleadaFiltro} onValueChange={setEmpleadaFiltro}>
                      <SelectTrigger className="bg-white/80 border-2 border-[#e1cfc0] hover:border-[#a37e63] focus:border-[#a37e63] text-[#7a5b4c] text-sm h-12 rounded-xl transition-all duration-200">
                        <SelectValue placeholder="Todas las empleadas" />
                      </SelectTrigger>
                      <SelectContent>
                        {empleadas.map((e) => (
                          <SelectItem key={e.id} value={e.id === -1 ? "Todos" : e.id.toString()}>
                            {e.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Filtro de Estado */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="relative"
                  >
                    <label className="block text-sm font-semibold text-[#7a5b4c] mb-2">
                      <div className="flex items-center space-x-2">
                        <Activity size={16} className="text-[#a37e63]" />
                        <span>Estado</span>
                      </div>
                    </label>
                    <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                      <SelectTrigger className="bg-white/80 border-2 border-[#e1cfc0] hover:border-[#a37e63] focus:border-[#a37e63] text-[#7a5b4c] text-sm h-12 rounded-xl transition-all duration-200">
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        {estados.map((e) => (
                          <SelectItem key={e} value={e}>
                            {e}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
              </motion.div>

              {/* Mensaje cuando no hay sucursal seleccionada */}
              {!sucursalFiltro && (
                <div className="p-8 text-center">
                  <Building2 size={48} className="mx-auto mb-4 text-[#7a5b4c]/40" />
                  <h3 className="text-lg font-semibold text-[#7a5b4c] mb-2">Selecciona una Sucursal</h3>
                  <p className="text-[#7a5b4c]/60">
                    Para ver el calendario de turnos, primero debes seleccionar una sucursal en los filtros.
                  </p>
                </div>
              )}

              {/* Vista de Semana */}
              {sucursalFiltro && vista === "semana" && (
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
                    {horasDelDia.length === 0 ? (
                      <div className="p-8 text-center">
                        <Clock size={48} className="mx-auto mb-4 text-[#7a5b4c]/40" />
                        <h3 className="text-lg font-semibold text-[#7a5b4c] mb-2">Sin Horarios Laborales</h3>
                        <p className="text-[#7a5b4c]/60">
                          No hay períodos laborales configurados para esta sucursal y filtros seleccionados.
                        </p>
                      </div>
                    ) : (
                      horasDelDia.map((hora) => (
                        <div key={hora} className="grid grid-cols-8 border-b border-[#e1cfc0] min-h-[80px]">
                          {/* Columna de hora */}
                          <div className="p-2 text-center text-sm text-[#7a5b4c]/60 border-r border-[#e1cfc0] bg-[#fdf6f1] flex items-start justify-center pt-3">
                            {hora.toString().padStart(2, "0")}:00
                          </div>
                          {/* Columnas de días */}
                          {diasSemana.map((dia) => {
                            const turnosDiaHora = getTurnosParaDiaYHora(dia, hora)
                            const esLaboral = esHoraLaboral(dia, hora)

                            return (
                              <div
                                key={`${dia.toISOString()}-${hora}`}
                                className={cn(
                                  "p-1 border-r border-[#e1cfc0] last:border-r-0 min-h-[80px] transition-colors",
                                  esLaboral ? "hover:bg-[#fdf6f1] bg-white" : "bg-gray-50 hover:bg-gray-100",
                                )}
                              >
                                {esLaboral ? (
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
                                          <span className="text-xs text-[#7a5b4c]/60 truncate">
                                            {turno.empleadaNombre}
                                          </span>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="h-full flex items-center justify-center">
                                    <span className="text-xs text-gray-400">Sin horario</span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* Vista de Día */}
              {sucursalFiltro && vista === "dia" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 sm:p-6"
                >
                  <div className="space-y-4">
                    {horasDelDia.length === 0 ? (
                      <div className="p-8 text-center">
                        <Clock size={48} className="mx-auto mb-4 text-[#7a5b4c]/40" />
                        <h3 className="text-lg font-semibold text-[#7a5b4c] mb-2">Sin Horarios Laborales</h3>
                        <p className="text-[#7a5b4c]/60">
                          No hay períodos laborales configurados para este día y filtros seleccionados.
                        </p>
                      </div>
                    ) : (
                      horasDelDia.map((hora) => {
                        const turnosHora = getTurnosParaDiaYHora(fechaActual, hora)
                        return (
                          <div key={hora} className="border border-[#e1cfc0] rounded-lg overflow-hidden">
                            <div className="bg-[#f8f0e8] px-4 py-2 border-b border-[#e1cfc0]">
                              <div className="flex items-center space-x-2">
                                <Clock size={16} className="text-[#7a5b4c]" />
                                <span className="font-medium text-[#7a5b4c]">
                                  {hora.toString().padStart(2, "0")}:00
                                </span>
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
                      })
                    )}
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
