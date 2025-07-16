"use client"
import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useLocation } from "react-router-dom"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  User,
  Plus,
  ArrowLeft,
  Edit3,
  Trash2,
  AlertCircle,
  Loader2,
  CalendarDays,
  FileText,
  Timer,
  Coffee,
  Star,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PeriodoLaboral {
  id: number
  empleadaId: number
  tipo: "HorarioHabitual" | "Licencia"
  diaSemana?: string
  horaInicio?: string
  horaFin?: string
  desde?: string
  hasta?: string
  motivo?: string
}

interface HorarioAgrupado {
  diaSemana: string
  turnos: {
    id: number
    horaInicio: string
    horaFin: string
  }[]
}

const PeriodosLaboralesList: React.FC = () => {
  const [periodos, setPeriodos] = useState<PeriodoLaboral[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState<Set<number>>(new Set())
  const [empleadaNombre, setEmpleadaNombre] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const empleadaId = new URLSearchParams(location.search).get("empleadaId")

  useEffect(() => {
    const fetchData = async () => {
      if (empleadaId) {
        try {
          setIsLoading(true)
          const [periodosRes, empleadaRes] = await Promise.all([
            axios.get(`/api/PeriodoLaboral/empleada/${empleadaId}`),
            axios.get(`/api/Empleado/${empleadaId}`),
          ])
          setPeriodos(periodosRes.data)
          setEmpleadaNombre(`${empleadaRes.data.nombre} ${empleadaRes.data.apellido}`)
        } catch {
          setError("Error al cargar periodos laborales")
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchData()
  }, [empleadaId])

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este periodo laboral?")) return

    setLoadingDelete((prev) => new Set(prev).add(id))
    try {
      await axios.delete(`/api/PeriodoLaboral/${id}`)
      setPeriodos((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setError("No se pudo eliminar el periodo laboral")
    } finally {
      setLoadingDelete((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleDeleteDia = async (horariosDelDia: HorarioAgrupado) => {
    const idsAEliminar = horariosDelDia.turnos.map((t) => t.id)
    const mensaje =
      idsAEliminar.length > 1
        ? `¿Estás seguro de que deseas eliminar todos los turnos del ${formatearDia(horariosDelDia.diaSemana)}?`
        : `¿Estás seguro de que deseas eliminar el turno del ${formatearDia(horariosDelDia.diaSemana)}?`

    if (!window.confirm(mensaje)) return

    setLoadingDelete((prev) => {
      const newSet = new Set(prev)
      idsAEliminar.forEach((id) => newSet.add(id))
      return newSet
    })

    try {
      await Promise.all(idsAEliminar.map((id) => axios.delete(`/api/PeriodoLaboral/${id}`)))
      setPeriodos((prev) => prev.filter((p) => !idsAEliminar.includes(p.id)))
    } catch {
      setError("No se pudieron eliminar los periodos laborales")
    } finally {
      setLoadingDelete((prev) => {
        const newSet = new Set(prev)
        idsAEliminar.forEach((id) => newSet.delete(id))
        return newSet
      })
    }
  }

  const handleBack = () => {
    navigate("/empleados")
  }

  const handleNuevoPeriodo = () => {
    navigate(`/periodos-laborales/nuevo?empleadaId=${empleadaId}`)
  }

  const handleEdit = (periodoId: number) => {
    navigate(`/periodos-laborales/editar/${periodoId}?empleadaId=${empleadaId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-4 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-[#d4bfae] to-[#c4a484] rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#a37e63] to-[#8b6f56] rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-white/90 to-white/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-lg border border-white/30">
            <Loader2 size={40} className="text-[#7a5b4c] animate-spin sm:w-12 sm:h-12" />
          </div>
          <p className="text-[#7a5b4c] font-bold text-lg sm:text-xl mb-2">Cargando períodos laborales...</p>
          <p className="text-[#7a5b4c]/60 text-sm">Esto puede tomar unos segundos</p>
        </motion.div>
      </div>
    )
  }

  const horarios = periodos.filter((p) => p.tipo === "HorarioHabitual")
  const licencias = periodos.filter((p) => p.tipo === "Licencia")

  // Agrupar horarios por día
  const horariosAgrupados: HorarioAgrupado[] = horarios.reduce((acc, periodo) => {
    if (!periodo.diaSemana) return acc

    const diaExistente = acc.find((h) => h.diaSemana === periodo.diaSemana)

    if (diaExistente) {
      diaExistente.turnos.push({
        id: periodo.id,
        horaInicio: periodo.horaInicio || "",
        horaFin: periodo.horaFin || "",
      })
    } else {
      acc.push({
        diaSemana: periodo.diaSemana,
        turnos: [
          {
            id: periodo.id,
            horaInicio: periodo.horaInicio || "",
            horaFin: periodo.horaFin || "",
          },
        ],
      })
    }

    return acc
  }, [] as HorarioAgrupado[])

  // Ordenar por día de la semana
  const ordenDias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  horariosAgrupados.sort((a, b) => ordenDias.indexOf(a.diaSemana) - ordenDias.indexOf(b.diaSemana))

  // Ordenar turnos por hora de inicio
  horariosAgrupados.forEach((dia) => {
    dia.turnos.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
  })

  const formatearDia = (dia: string) => {
    const dias: { [key: string]: string } = {
      Monday: "Lunes",
      Tuesday: "Martes",
      Wednesday: "Miércoles",
      Thursday: "Jueves",
      Friday: "Viernes",
      Saturday: "Sábado",
      Sunday: "Domingo",
    }
    return dias[dia] || dia
  }

  const formatearHora = (hora: string) => {
    if (!hora) return "-"
    const fecha = new Date(`1970-01-01T${hora}`)
    return fecha.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDiaColor = (dia: string) => {
    const colores: { [key: string]: string } = {
      Monday: "from-blue-500 to-blue-600",
      Tuesday: "from-green-500 to-green-600",
      Wednesday: "from-purple-500 to-purple-600",
      Thursday: "from-orange-500 to-orange-600",
      Friday: "from-pink-500 to-pink-600",
      Saturday: "from-indigo-500 to-indigo-600",
      Sunday: "from-red-500 to-red-600",
    }
    return colores[dia] || "from-gray-500 to-gray-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-2 sm:px-4 py-4 sm:py-8 relative overflow-hidden">
      {/* Elementos decorativos de fondo mejorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-[#d4bfae] to-[#c4a484] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#a37e63] to-[#8b6f56] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#f3e9dc] to-[#e8d5c4] rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Partículas flotantes */}
        <div
          className="absolute top-20 left-20 w-2 h-2 bg-[#a37e63] rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-1 h-1 bg-[#d4bfae] rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-[#c4a484] rounded-full opacity-35 animate-bounce"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-[#a37e63] rounded-full opacity-25 animate-bounce"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Card className="bg-white/90 backdrop-blur-lg shadow-2xl border-0 rounded-2xl sm:rounded-3xl overflow-hidden relative">
            {/* Borde decorativo */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#7a5b4c] via-[#a37e63] to-[#7a5b4c] p-0.5 rounded-2xl sm:rounded-3xl">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl h-full w-full"></div>
            </div>

            <div className="relative z-10">
              {/* Header con gradiente mejorado */}
              <div className="bg-gradient-to-r from-[#7a5b4c] via-[#a37e63] to-[#8b6f56] p-4 sm:p-8 relative overflow-hidden">
                {/* Efectos de fondo en el header */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12 translate-x-full animate-pulse"></div>

                <button
                  onClick={handleBack}
                  className="absolute left-3 sm:left-6 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-white/20 backdrop-blur-sm"
                >
                  <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                </button>

                <div className="text-center relative z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
                    className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg backdrop-blur-sm border border-white/20"
                  >
                    <Calendar size={32} className="text-white sm:w-12 sm:h-12 drop-shadow-lg" />
                  </motion.div>
                  <CardTitle className="text-2xl sm:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                    Períodos Laborales
                  </CardTitle>
                  <div className="flex items-center justify-center space-x-3 text-white/90 mb-2">
                    <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                      <User size={16} className="sm:w-5 sm:h-5" />
                      <span className="font-semibold text-sm sm:text-lg">{empleadaNombre}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-6 text-white/80 text-sm sm:text-base">
                    <div className="flex items-center space-x-2">
                      <Sparkles size={16} />
                      <span>{horariosAgrupados.length} días con horarios</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star size={16} />
                      <span>{licencias.length} licencias</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 sm:p-8 bg-gradient-to-b from-white/95 to-white/90">
                {/* Botones de acción mejorados */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 mb-8"
                >
                  <motion.button
                    onClick={handleNuevoPeriodo}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 sm:flex-none px-6 sm:px-8 py-4 bg-gradient-to-r from-[#7a5b4c] via-[#a37e63] to-[#8b6f56] hover:from-[#6b4d3e] hover:via-[#8f6b50] hover:to-[#7a5b4c] text-white font-bold rounded-xl sm:rounded-2xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl hover:shadow-2xl text-sm sm:text-lg backdrop-blur-sm border border-white/20"
                  >
                    <Plus size={20} className="sm:w-6 sm:h-6" />
                    <span>Nuevo Período</span>
                  </motion.button>
                  <motion.button
                    onClick={handleBack}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 sm:flex-none px-6 sm:px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-[#7a5b4c] font-semibold rounded-xl sm:rounded-2xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-lg backdrop-blur-sm border border-gray-300"
                  >
                    <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                    <span>Volver a Empleados</span>
                  </motion.button>
                </motion.div>

                {/* Mensaje de error mejorado */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-3 p-4 sm:p-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl sm:rounded-2xl mb-8 shadow-lg backdrop-blur-sm"
                    >
                      <AlertCircle size={20} className="text-red-500 flex-shrink-0 sm:w-6 sm:h-6" />
                      <p className="text-sm sm:text-base text-red-700 font-semibold">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sección Horarios Habituales mejorada */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-10"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
                      <Clock size={20} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#7a5b4c]">Horarios Habituales</h3>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-[#e1cfc0] via-[#d4bfae] to-transparent rounded-full"></div>
                  </div>

                  {horariosAgrupados.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 shadow-inner"
                    >
                      <Timer size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold text-lg mb-2">No hay horarios habituales registrados</p>
                      <p className="text-gray-500 text-sm">Agrega un nuevo período para comenzar</p>
                    </motion.div>
                  ) : (
                    <>
                      {/* Vista de tabla para desktop mejorada */}
                      <div className="hidden lg:block bg-white/80 rounded-2xl border border-[#e1cfc0] overflow-hidden shadow-xl backdrop-blur-sm">
                        <div className="bg-gradient-to-r from-[#f8f0e8] via-[#f3e9dc] to-[#f8f0e8] px-8 py-6 border-b border-[#e1cfc0]">
                          <div className="grid grid-cols-7 gap-4 font-bold text-[#7a5b4c]">
                            <div className="flex items-center space-x-2">
                              <CalendarDays size={18} />
                              <span>Día</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock size={18} />
                              <span>Turno 1 - Inicio</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock size={18} />
                              <span>Turno 1 - Fin</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock size={18} />
                              <span>Turno 2 - Inicio</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock size={18} />
                              <span>Turno 2 - Fin</span>
                            </div>
                            <div className="text-center">Editar Turnos</div>
                            <div className="text-center">Eliminar Día</div>
                          </div>
                        </div>
                        {horariosAgrupados.map((horarioDelDia, index) => (
                          <motion.div
                            key={horarioDelDia.diaSemana}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="grid grid-cols-7 gap-4 px-8 py-6 border-b border-[#f0e6dc] last:border-none hover:bg-gradient-to-r hover:from-[#fdf6f1] hover:to-[#f8f0e8] transition-all duration-300"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-3 h-3 bg-gradient-to-r ${getDiaColor(horarioDelDia.diaSemana)} rounded-full shadow-sm`}
                              ></div>
                              <span className="font-semibold text-[#7a5b4c]">
                                {formatearDia(horarioDelDia.diaSemana)}
                              </span>
                            </div>
                            <div className="text-[#7a5b4c]/80 font-medium">
                              {formatearHora(horarioDelDia.turnos[0]?.horaInicio || "")}
                            </div>
                            <div className="text-[#7a5b4c]/80 font-medium">
                              {formatearHora(horarioDelDia.turnos[0]?.horaFin || "")}
                            </div>
                            <div className="text-[#7a5b4c]/80 font-medium">
                              {horarioDelDia.turnos[1] ? formatearHora(horarioDelDia.turnos[1].horaInicio) : "-"}
                            </div>
                            <div className="text-[#7a5b4c]/80 font-medium">
                              {horarioDelDia.turnos[1] ? formatearHora(horarioDelDia.turnos[1].horaFin) : "-"}
                            </div>
                            <div className="flex gap-2 justify-center">
                              {horarioDelDia.turnos.map((turno, turnoIndex) => (
                                <motion.button
                                  key={turno.id}
                                  whileHover={{ scale: 1.1, y: -2 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEdit(turno.id)}
                                  className={`px-3 py-2 ${turnoIndex === 0 ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gradient-to-r from-green-500 to-green-600"} hover:shadow-lg text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-1 text-sm shadow-md`}
                                >
                                  <Edit3 size={14} />
                                  <span>T{turnoIndex + 1}</span>
                                </motion.button>
                              ))}
                            </div>
                            <div className="flex justify-center">
                              <motion.button
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteDia(horarioDelDia)}
                                disabled={horarioDelDia.turnos.some((t) => loadingDelete.has(t.id))}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 text-sm disabled:opacity-50 shadow-md hover:shadow-lg"
                              >
                                {horarioDelDia.turnos.some((t) => loadingDelete.has(t.id)) ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                                <span>Día</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Vista de cards para móvil/tablet mejorada */}
                      <div className="lg:hidden space-y-4">
                        {horariosAgrupados.map((horarioDelDia, index) => (
                          <motion.div
                            key={horarioDelDia.diaSemana}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="bg-white/90 border-2 border-[#e1cfc0] rounded-2xl p-6 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`w-12 h-12 bg-gradient-to-br ${getDiaColor(horarioDelDia.diaSemana)} rounded-full flex items-center justify-center shadow-lg`}
                                >
                                  <CalendarDays size={20} className="text-white" />
                                </div>
                                <div>
                                  <p className="font-bold text-lg text-[#7a5b4c]">
                                    {formatearDia(horarioDelDia.diaSemana)}
                                  </p>
                                  <p className="text-sm text-[#7a5b4c]/60">
                                    {horarioDelDia.turnos.length} turno{horarioDelDia.turnos.length > 1 ? "s" : ""}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3 mb-4">
                              {horarioDelDia.turnos.map((turno, turnoIndex) => (
                                <div
                                  key={turno.id}
                                  className={`p-4 rounded-xl ${turnoIndex === 0 ? "bg-blue-50 border border-blue-200" : "bg-green-50 border border-green-200"}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div
                                        className={`w-8 h-8 ${turnoIndex === 0 ? "bg-blue-500" : "bg-green-500"} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                                      >
                                        {turnoIndex + 1}
                                      </div>
                                      <div>
                                        <p className="font-semibold text-[#7a5b4c]">
                                          {formatearHora(turno.horaInicio)} - {formatearHora(turno.horaFin)}
                                        </p>
                                        <p className="text-xs text-[#7a5b4c]/60">Turno {turnoIndex + 1}</p>
                                      </div>
                                    </div>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleEdit(turno.id)}
                                      className={`px-3 py-2 ${turnoIndex === 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"} text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 text-sm shadow-md`}
                                    >
                                      <Edit3 size={14} />
                                      <span>Editar</span>
                                    </motion.button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleDeleteDia(horarioDelDia)}
                              disabled={horarioDelDia.turnos.some((t) => loadingDelete.has(t.id))}
                              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
                            >
                              {horarioDelDia.turnos.some((t) => loadingDelete.has(t.id)) ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                              <span>Eliminar Día Completo</span>
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.section>

                {/* Sección Licencias mejorada */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-lg">
                      <FileText size={20} className="text-orange-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#7a5b4c]">Licencias</h3>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-[#e1cfc0] via-[#d4bfae] to-transparent rounded-full"></div>
                  </div>

                  {licencias.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 shadow-inner"
                    >
                      <Coffee size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold text-lg mb-2">No hay licencias registradas</p>
                      <p className="text-gray-500 text-sm">Las licencias aparecerán aquí cuando se agreguen</p>
                    </motion.div>
                  ) : (
                    <>
                      {/* Vista de tabla para desktop */}
                      <div className="hidden md:block bg-white/80 rounded-2xl border border-[#e1cfc0] overflow-hidden shadow-xl backdrop-blur-sm">
                        <div className="bg-gradient-to-r from-[#f8f0e8] via-[#f3e9dc] to-[#f8f0e8] px-8 py-6 border-b border-[#e1cfc0]">
                          <div className="grid grid-cols-4 gap-4 font-bold text-[#7a5b4c]">
                            <div className="flex items-center space-x-2">
                              <Calendar size={18} />
                              <span>Desde</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar size={18} />
                              <span>Hasta</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText size={18} />
                              <span>Motivo</span>
                            </div>
                            <div className="text-center">Acciones</div>
                          </div>
                        </div>
                        {licencias.map((periodo, index) => (
                          <motion.div
                            key={periodo.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="grid grid-cols-4 gap-4 px-8 py-6 border-b border-[#f0e6dc] last:border-none hover:bg-gradient-to-r hover:from-[#fdf6f1] hover:to-[#f8f0e8] transition-all duration-300"
                          >
                            <div className="text-[#7a5b4c]/80 font-medium">
                              {periodo.desde ? new Date(periodo.desde).toLocaleDateString("es-ES") : "-"}
                            </div>
                            <div className="text-[#7a5b4c]/80 font-medium">
                              {periodo.hasta ? new Date(periodo.hasta).toLocaleDateString("es-ES") : "-"}
                            </div>
                            <div className="font-semibold text-[#7a5b4c]">{periodo.motivo || "-"}</div>
                            <div className="flex gap-3 justify-center">
                              <motion.button
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(periodo.id)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 text-sm shadow-md hover:shadow-lg"
                              >
                                <Edit3 size={16} />
                                <span>Editar</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(periodo.id)}
                                disabled={loadingDelete.has(periodo.id)}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 text-sm disabled:opacity-50 shadow-md hover:shadow-lg"
                              >
                                {loadingDelete.has(periodo.id) ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                                <span>Eliminar</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Vista de cards para móvil/tablet */}
                      <div className="md:hidden space-y-4">
                        {licencias.map((periodo, index) => (
                          <motion.div
                            key={periodo.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="bg-white/90 border-2 border-[#e1cfc0] rounded-2xl p-6 shadow-xl backdrop-blur-sm"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-lg">
                                  <FileText size={20} className="text-orange-600" />
                                </div>
                                <div>
                                  <p className="font-bold text-lg text-[#7a5b4c]">{periodo.motivo || "Sin motivo"}</p>
                                  <p className="text-sm text-[#7a5b4c]/70 mt-1">
                                    {periodo.desde ? new Date(periodo.desde).toLocaleDateString("es-ES") : "-"} -{" "}
                                    {periodo.hasta ? new Date(periodo.hasta).toLocaleDateString("es-ES") : "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEdit(periodo.id)}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                              >
                                <Edit3 size={16} />
                                <span>Editar</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(periodo.id)}
                                disabled={loadingDelete.has(periodo.id)}
                                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
                              >
                                {loadingDelete.has(periodo.id) ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                                <span>Eliminar</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.section>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default PeriodosLaboralesList
