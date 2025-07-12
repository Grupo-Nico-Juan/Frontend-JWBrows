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
          <p className="text-[#7a5b4c] font-medium text-base sm:text-lg">Cargando períodos laborales...</p>
          <p className="text-[#7a5b4c]/60 text-sm mt-2">Esto puede tomar unos segundos</p>
        </motion.div>
      </div>
    )
  }

  const horarios = periodos.filter((p) => p.tipo === "HorarioHabitual")
  const licencias = periodos.filter((p) => p.tipo === "Licencia")

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-2 sm:px-4 py-4 sm:py-8">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#d4bfae] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#a37e63] rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-xl sm:rounded-2xl overflow-hidden">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] p-4 sm:p-6 relative">
              {/* Botón de volver */}
              <button
                onClick={handleBack}
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors p-1"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                >
                  <Calendar size={24} className="text-white sm:w-8 sm:h-8" />
                </motion.div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">Períodos Laborales</CardTitle>
                <div className="flex items-center justify-center space-x-2 text-white/90">
                  <User size={14} className="sm:w-4 sm:h-4" />
                  <span className="font-medium text-sm sm:text-base">{empleadaNombre}</span>
                </div>
                <p className="text-white/70 text-xs sm:text-sm mt-2">
                  {horarios.length} horarios • {licencias.length} licencias
                </p>
              </div>
            </div>

            <CardContent className="p-3 sm:p-6">
              {/* Botones de acción */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
              >
                <motion.button
                  onClick={handleNuevoPeriodo}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <Plus size={16} className="sm:w-5 sm:h-5" />
                  <span>Nuevo Período</span>
                </motion.button>

                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#7a5b4c] font-medium rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 text-sm sm:text-base"
                >
                  <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                  <span>Volver a Empleados</span>
                </motion.button>
              </motion.div>

              {/* Mensaje de error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl mb-6"
                  >
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0 sm:w-5 sm:h-5" />
                    <p className="text-sm sm:text-base text-red-600 font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sección Horarios Habituales */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock size={16} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#7a5b4c]">Horarios Habituales</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#e1cfc0] to-transparent"></div>
                </div>

                {horarios.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Timer size={32} className="text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No hay horarios habituales registrados</p>
                    <p className="text-gray-400 text-sm mt-1">Agrega un nuevo período para comenzar</p>
                  </div>
                ) : (
                  <>
                    {/* Vista de tabla para desktop */}
                    <div className="hidden md:block bg-white rounded-xl border border-[#e1cfc0] overflow-hidden shadow-sm">
                      <div className="bg-gradient-to-r from-[#f8f0e8] to-[#f3e9dc] px-6 py-4 border-b border-[#e1cfc0]">
                        <div className="grid grid-cols-5 gap-4 font-semibold text-[#7a5b4c]">
                          <div className="flex items-center space-x-2">
                            <CalendarDays size={16} />
                            <span>Día</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock size={16} />
                            <span>Hora Inicio</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock size={16} />
                            <span>Hora Fin</span>
                          </div>
                          <div className="text-center col-span-2">Acciones</div>
                        </div>
                      </div>
                      {horarios.map((periodo, index) => (
                        <motion.div
                          key={periodo.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-[#f0e6dc] last:border-none hover:bg-[#fdf6f1] transition-colors"
                        >
                          <div className="font-medium text-[#7a5b4c]">{formatearDia(periodo.diaSemana || "")}</div>
                          <div className="text-[#7a5b4c]/70">{formatearHora(periodo.horaInicio || "")}</div>
                          <div className="text-[#7a5b4c]/70">{formatearHora(periodo.horaFin || "")}</div>
                          <div className="flex gap-2 justify-center col-span-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(periodo.id)}
                              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 text-sm"
                            >
                              <Edit3 size={14} />
                              <span>Editar</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(periodo.id)}
                              disabled={loadingDelete.has(periodo.id)}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 text-sm disabled:opacity-50"
                            >
                              {loadingDelete.has(periodo.id) ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              <span>Eliminar</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Vista de cards para móvil/tablet */}
                    <div className="md:hidden space-y-3">
                      {horarios.map((periodo, index) => (
                        <motion.div
                          key={periodo.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="bg-white border border-[#e1cfc0] rounded-lg p-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <CalendarDays size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-[#7a5b4c]">{formatearDia(periodo.diaSemana || "")}</p>
                                <p className="text-sm text-[#7a5b4c]/70">
                                  {formatearHora(periodo.horaInicio || "")} - {formatearHora(periodo.horaFin || "")}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleEdit(periodo.id)}
                              className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                            >
                              <Edit3 size={14} />
                              <span>Editar</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleDelete(periodo.id)}
                              disabled={loadingDelete.has(periodo.id)}
                              className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                            >
                              {loadingDelete.has(periodo.id) ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
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

              {/* Sección Licencias */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FileText size={16} className="text-orange-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#7a5b4c]">Licencias</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#e1cfc0] to-transparent"></div>
                </div>

                {licencias.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Coffee size={32} className="text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No hay licencias registradas</p>
                    <p className="text-gray-400 text-sm mt-1">Las licencias aparecerán aquí cuando se agreguen</p>
                  </div>
                ) : (
                  <>
                    {/* Vista de tabla para desktop */}
                    <div className="hidden md:block bg-white rounded-xl border border-[#e1cfc0] overflow-hidden shadow-sm">
                      <div className="bg-gradient-to-r from-[#f8f0e8] to-[#f3e9dc] px-6 py-4 border-b border-[#e1cfc0]">
                        <div className="grid grid-cols-4 gap-4 font-semibold text-[#7a5b4c]">
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} />
                            <span>Desde</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} />
                            <span>Hasta</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText size={16} />
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
                          className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-[#f0e6dc] last:border-none hover:bg-[#fdf6f1] transition-colors"
                        >
                          <div className="text-[#7a5b4c]/70">
                            {periodo.desde ? new Date(periodo.desde).toLocaleDateString("es-ES") : "-"}
                          </div>
                          <div className="text-[#7a5b4c]/70">
                            {periodo.hasta ? new Date(periodo.hasta).toLocaleDateString("es-ES") : "-"}
                          </div>
                          <div className="font-medium text-[#7a5b4c]">{periodo.motivo || "-"}</div>
                          <div className="flex gap-2 justify-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(periodo.id)}
                              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 text-sm"
                            >
                              <Edit3 size={14} />
                              <span>Editar</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(periodo.id)}
                              disabled={loadingDelete.has(periodo.id)}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 text-sm disabled:opacity-50"
                            >
                              {loadingDelete.has(periodo.id) ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              <span>Eliminar</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Vista de cards para móvil/tablet */}
                    <div className="md:hidden space-y-3">
                      {licencias.map((periodo, index) => (
                        <motion.div
                          key={periodo.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="bg-white border border-[#e1cfc0] rounded-lg p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <FileText size={16} className="text-orange-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-[#7a5b4c]">{periodo.motivo || "Sin motivo"}</p>
                                <p className="text-sm text-[#7a5b4c]/70">
                                  {periodo.desde ? new Date(periodo.desde).toLocaleDateString("es-ES") : "-"} -{" "}
                                  {periodo.hasta ? new Date(periodo.hasta).toLocaleDateString("es-ES") : "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleEdit(periodo.id)}
                              className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                            >
                              <Edit3 size={14} />
                              <span>Editar</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleDelete(periodo.id)}
                              disabled={loadingDelete.has(periodo.id)}
                              className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                            >
                              {loadingDelete.has(periodo.id) ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
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
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default PeriodosLaboralesList
