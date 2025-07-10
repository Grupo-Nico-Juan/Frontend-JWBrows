"use client"

import type React from "react"
import { type ChangeEvent, useEffect, useState, type FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Star,
  Plus,
  Clock,
  DollarSign,
  Trash2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Wrench,
  Timer,
  Package,
  Settings,
  Save,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Extra {
  id: number
  nombre: string
  duracionMinutos: number
  precio: number
}

const AsignarExtrasServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const servicioId = Number(id)
  const navigate = useNavigate()

  const [extras, setExtras] = useState<Extra[]>([])
  const [nuevo, setNuevo] = useState<Omit<Extra, "id" | "servicioId">>({
    nombre: "",
    duracionMinutos: 0,
    precio: 0,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState<Set<number>>(new Set())
  const [servicioNombre, setServicioNombre] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [extrasRes, servicioRes] = await Promise.all([
          axios.get<Extra[]>(`/api/Servicio/${servicioId}/extras`),
          axios.get(`/api/Servicio/${servicioId}`),
        ])
        setExtras(extrasRes.data)
        setServicioNombre(servicioRes.data.nombre || `Servicio ${servicioId}`)
        setError("")
      } catch {
        setError("Error al cargar extras")
        toast.error("Error al cargar extras")
      } finally {
        setIsLoading(false)
      }
    }

    if (servicioId) {
      fetchData()
    }
  }, [servicioId])

  const borrarExtra = async (extraId: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este extra?")) return

    setLoadingDelete((prev) => new Set(prev).add(extraId))
    try {
      await axios.delete(`/api/Servicio/extras/${extraId}`)
      setExtras((prev) => prev.filter((e) => e.id !== extraId))
      toast.success("Extra eliminado correctamente")
    } catch {
      setError("No se pudo borrar el extra")
      toast.error("No se pudo eliminar el extra")
    } finally {
      setLoadingDelete((prev) => {
        const newSet = new Set(prev)
        newSet.delete(extraId)
        return newSet
      })
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNuevo((n) => ({
      ...n,
      [name]: name === "duracionMinutos" || name === "precio" ? Number(value) : value,
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("")
  }

  const agregarExtra = async (e: FormEvent) => {
    e.preventDefault()
    if (!nuevo.nombre.trim()) {
      setError("El nombre del extra es requerido")
      return
    }

    setError("")
    setIsAdding(true)
    try {
      await axios.post(`/api/Servicio/${servicioId}/extras`, {
        ...nuevo,
        servicioId: servicioId,
      })
      setNuevo({ nombre: "", duracionMinutos: 0, precio: 0 })
      const res = await axios.get<Extra[]>(`/api/Servicio/${servicioId}/extras`)
      setExtras(res.data)
      toast.success("Extra agregado correctamente")
    } catch {
      setError("No se pudo agregar el extra")
      toast.error("No se pudo agregar el extra")
    } finally {
      setIsAdding(false)
    }
  }

  const handleBack = () => {
    navigate("/servicios")
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
          <p className="text-[#7a5b4c] font-medium text-base sm:text-lg">Cargando extras...</p>
          <p className="text-[#7a5b4c]/60 text-sm mt-2">Esto puede tomar unos segundos</p>
        </motion.div>
      </div>
    )
  }

  const totalExtras = extras.length
  const duracionTotal = extras.reduce((sum, extra) => sum + extra.duracionMinutos, 0)
  const precioTotal = extras.reduce((sum, extra) => sum + extra.precio, 0)

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
                  <Star size={24} className="text-white sm:w-8 sm:h-8" />
                </motion.div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">Extras del Servicio</CardTitle>
                <div className="flex items-center justify-center space-x-2 text-white/90">
                  <Wrench size={14} className="sm:w-4 sm:h-4" />
                  <span className="font-medium text-sm sm:text-base">{servicioNombre}</span>
                </div>
                <p className="text-white/70 text-xs sm:text-sm mt-2">{totalExtras} extras configurados</p>
              </div>
            </div>

            <CardContent className="p-3 sm:p-6">
              {/* Estadísticas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6"
              >
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Package size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-blue-600 font-medium">Total Extras</p>
                      <p className="text-lg sm:text-2xl font-bold text-blue-700">{totalExtras}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Clock size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-green-600 font-medium">Duración Total</p>
                      <p className="text-lg sm:text-2xl font-bold text-green-700">{duracionTotal} min</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <DollarSign size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-purple-600 font-medium">Valor Total</p>
                      <p className="text-lg sm:text-2xl font-bold text-purple-700">${precioTotal}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Formulario para agregar extra */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-[#f8f0e8] to-[#f3e9dc] p-4 sm:p-6 rounded-xl border border-[#e1cfc0] mb-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-[#a37e63] rounded-full flex items-center justify-center">
                    <Plus size={16} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#7a5b4c]">Agregar Nuevo Extra</h3>
                </div>

                <form onSubmit={agregarExtra} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Nombre */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                        <div className="flex items-center space-x-2">
                          <Star size={14} />
                          <span>Nombre del Extra</span>
                        </div>
                      </label>
                      <div className="relative">
                        <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-4 h-4" />
                        <Input
                          name="nombre"
                          placeholder="Ej: Masaje adicional, Tratamiento premium..."
                          value={nuevo.nombre}
                          onChange={handleChange}
                          required
                          disabled={isAdding}
                          className="pl-9 h-11 bg-white text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-lg transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>

                    {/* Duración */}
                    <div>
                      <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                        <div className="flex items-center space-x-2">
                          <Timer size={14} />
                          <span>Duración (min)</span>
                        </div>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-4 h-4" />
                        <Input
                          name="duracionMinutos"
                          type="number"
                          placeholder="30"
                          value={nuevo.duracionMinutos || ""}
                          onChange={handleChange}
                          min={0}
                          disabled={isAdding}
                          className="pl-9 h-11 bg-white text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-lg transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>

                    {/* Precio */}
                    <div>
                      <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign size={14} />
                          <span>Precio ($)</span>
                        </div>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-4 h-4" />
                        <Input
                          name="precio"
                          type="number"
                          placeholder="25.00"
                          value={nuevo.precio || ""}
                          onChange={handleChange}
                          min={0}
                          step="0.01"
                          disabled={isAdding}
                          className="pl-9 h-11 bg-white text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-lg transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botón agregar */}
                  <div className="flex justify-end">
                    <motion.button
                      type="submit"
                      disabled={isAdding || !nuevo.nombre.trim()}
                      whileHover={{ scale: isAdding ? 1 : 1.02 }}
                      whileTap={{ scale: isAdding ? 1 : 0.98 }}
                      className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Agregando...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Agregar Extra</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
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

              {/* Lista de extras */}
              {totalExtras === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium text-lg">No hay extras configurados</p>
                  <p className="text-gray-400 text-sm mt-2">Agrega el primer extra usando el formulario de arriba</p>
                </motion.div>
              ) : (
                <>
                  {/* Vista de tabla para desktop */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="hidden md:block bg-white rounded-lg sm:rounded-xl border border-[#e1cfc0] overflow-hidden shadow-sm"
                  >
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-[#f8f0e8] to-[#f3e9dc] border-b border-[#e1cfc0]">
                            <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Star size={14} className="sm:w-4 sm:h-4" />
                                <span>Nombre del Extra</span>
                              </div>
                            </TableHead>
                            <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Clock size={14} className="sm:w-4 sm:h-4" />
                                <span>Duración</span>
                              </div>
                            </TableHead>
                            <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <DollarSign size={14} className="sm:w-4 sm:h-4" />
                                <span>Precio</span>
                              </div>
                            </TableHead>
                            <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-center text-sm">
                              <div className="flex items-center justify-center space-x-2">
                                <Settings size={14} className="sm:w-4 sm:h-4" />
                                <span>Acciones</span>
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {extras.map((extra, index) => {
                            const isLoadingAction = loadingDelete.has(extra.id)

                            return (
                              <motion.tr
                                key={extra.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="border-b border-[#f0e6dc] hover:bg-[#fdf6f1] transition-colors"
                              >
                                <TableCell className="py-3 sm:py-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#a37e63] rounded-full"></div>
                                    <span className="font-medium text-[#7a5b4c] text-sm sm:text-base">
                                      {extra.nombre}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3 sm:py-4">
                                  <div className="flex items-center space-x-2">
                                    <Timer size={14} className="text-[#7a5b4c]/60" />
                                    <span className="text-[#7a5b4c]/70 text-sm sm:text-base">
                                      {extra.duracionMinutos} min
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3 sm:py-4">
                                  <div className="flex items-center space-x-2">
                                    <DollarSign size={14} className="text-green-600" />
                                    <span className="font-semibold text-green-700 text-sm sm:text-base">
                                      ${extra.precio}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3 sm:py-4 text-center">
                                  <motion.button
                                    whileHover={{ scale: isLoadingAction ? 1 : 1.05 }}
                                    whileTap={{ scale: isLoadingAction ? 1 : 0.95 }}
                                    onClick={() => borrarExtra(extra.id)}
                                    disabled={isLoadingAction}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 sm:space-x-2 mx-auto text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isLoadingAction ? (
                                      <Loader2 size={12} className="animate-spin sm:w-4 sm:h-4" />
                                    ) : (
                                      <Trash2 size={12} className="sm:w-4 sm:h-4" />
                                    )}
                                    <span>Eliminar</span>
                                  </motion.button>
                                </TableCell>
                              </motion.tr>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </motion.div>

                  {/* Vista de cards para móvil */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="md:hidden space-y-3"
                  >
                    {extras.map((extra, index) => {
                      const isLoadingAction = loadingDelete.has(extra.id)

                      return (
                        <motion.div
                          key={extra.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="bg-white border border-[#e1cfc0] rounded-lg p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="w-8 h-8 bg-[#a37e63]/10 rounded-full flex items-center justify-center">
                                <Star size={16} className="text-[#a37e63]" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-[#7a5b4c] text-sm">{extra.nombre}</h3>
                                <div className="flex items-center space-x-4 mt-2">
                                  <div className="flex items-center space-x-1">
                                    <Clock size={12} className="text-[#7a5b4c]/60" />
                                    <span className="text-xs text-[#7a5b4c]/70">{extra.duracionMinutos} min</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <DollarSign size={12} className="text-green-600" />
                                    <span className="text-xs font-semibold text-green-700">${extra.precio}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: isLoadingAction ? 1 : 1.02 }}
                            whileTap={{ scale: isLoadingAction ? 1 : 0.98 }}
                            onClick={() => borrarExtra(extra.id)}
                            disabled={isLoadingAction}
                            className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoadingAction ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>Eliminando...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 size={14} />
                                <span>Eliminar Extra</span>
                              </>
                            )}
                          </motion.button>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </>
              )}

              {/* Botón de volver */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 flex justify-center"
              >
                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                  <span>Volver a Servicios</span>
                </motion.button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AsignarExtrasServicio
