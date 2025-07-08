"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Building,
  Users,
  Map,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Sector {
  id: number
  nombre: string
  descripcion: string
  sucursalId: number
}

interface Sucursal {
  id: number
  nombre: string
  direccion?: string
}

const AsignarSectoresEmpleado: React.FC = () => {
  const { id } = useParams()
  const empleadoId = Number(id)
  const navigate = useNavigate()

  const [sectores, setSectores] = useState<Sector[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [asignados, setAsignados] = useState<number[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingActions, setLoadingActions] = useState<Set<number>>(new Set())
  const [empleadoNombre, setEmpleadoNombre] = useState("")

  // Función para obtener el nombre de la sucursal
  const getSucursalNombre = (sucursalId: number): string => {
    const sucursal = sucursales.find((s) => s.id === sucursalId)
    return sucursal?.nombre || `Sucursal ${sucursalId}`
  }

  // Función para obtener la inicial de la sucursal para el círculo
  const getSucursalInicial = (sucursalId: number): string => {
    const sucursal = sucursales.find((s) => s.id === sucursalId)
    if (sucursal?.nombre) {
      return sucursal.nombre.charAt(0).toUpperCase()
    }
    return sucursalId.toString()
  }

  const fetchSectores = async () => {
    try {
      setIsLoading(true)
      const [todos, actuales, empleado, sucursalesData] = await Promise.all([
        axios.get<Sector[]>("/api/Sector"),
        axios.get<Sector[]>(`/api/Empleado/${empleadoId}/sectores`),
        axios.get(`/api/Empleado/${empleadoId}`),
        axios.get<Sucursal[]>("/api/Sucursal"), // Asumiendo que existe este endpoint
      ])
      setSectores(todos.data)
      setSucursales(sucursalesData.data)
      setAsignados(actuales.data.map((s) => s.id))
      setEmpleadoNombre(`${empleado.data.nombre} ${empleado.data.apellido}`)
      setError("")
    } catch (error) {
      setError("Error al cargar los sectores")
      toast.error("Error al cargar los sectores")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAsignacion = async (sectorId: number, asignado: boolean) => {
    setLoadingActions((prev) => new Set(prev).add(sectorId))

    try {
      if (asignado) {
        await axios.delete(`/api/Empleado/${empleadoId}/sectores/${sectorId}`)
        toast.success("Sector quitado correctamente")
        setAsignados((prev) => prev.filter((id) => id !== sectorId))
      } else {
        await axios.post(`/api/Empleado/${empleadoId}/sectores/${sectorId}`)
        toast.success("Sector asignado correctamente")
        setAsignados((prev) => [...prev, sectorId])
      }
      setError("")
    } catch {
      setError("Error al modificar el sector")
      toast.error("Error al modificar el sector")
    } finally {
      setLoadingActions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(sectorId)
        return newSet
      })
    }
  }

  const handleBack = () => {
    navigate("/empleados")
  }

  useEffect(() => {
    if (empleadoId) {
      fetchSectores()
    }
  }, [empleadoId])

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
          <p className="text-[#7a5b4c] font-medium text-base sm:text-lg">Cargando sectores...</p>
          <p className="text-[#7a5b4c]/60 text-sm mt-2">Esto puede tomar unos segundos</p>
        </motion.div>
      </div>
    )
  }

  const sectoresAsignadosCount = asignados.length
  const totalSectores = sectores.length
  const sucursalesUnicas = new Set(sectores.map((s) => s.sucursalId)).size

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
            {/* Header con gradiente - Responsivo */}
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
                  <MapPin size={24} className="text-white sm:w-8 sm:h-8" />
                </motion.div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">Gestionar Sectores</CardTitle>
                <div className="flex items-center justify-center space-x-2 text-white/90">
                  <User size={14} className="sm:w-4 sm:h-4" />
                  <span className="font-medium text-sm sm:text-base">{empleadoNombre}</span>
                </div>
                <p className="text-white/70 text-xs sm:text-sm mt-2">
                  {sectoresAsignadosCount} de {totalSectores} sectores asignados
                </p>
              </div>
            </div>

            <CardContent className="p-3 sm:p-6">
              {/* Estadísticas - Grid responsivo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6"
              >
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Map size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-blue-600 font-medium">Total</p>
                      <p className="text-lg sm:text-2xl font-bold text-blue-700">{totalSectores}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-green-600 font-medium">Asignados</p>
                      <p className="text-lg sm:text-2xl font-bold text-green-700">{sectoresAsignadosCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-orange-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-orange-600 font-medium">Disponibles</p>
                      <p className="text-lg sm:text-2xl font-bold text-orange-700">
                        {totalSectores - sectoresAsignadosCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-purple-200 col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Building size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-purple-600 font-medium">Sucursales</p>
                      <p className="text-lg sm:text-2xl font-bold text-purple-700">{sucursalesUnicas}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mensaje de error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl mb-4 sm:mb-6"
                  >
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0 sm:w-5 sm:h-5" />
                    <p className="text-sm sm:text-base text-red-600 font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Vista de tabla para desktop y tablet */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="hidden sm:block bg-white rounded-lg sm:rounded-xl border border-[#e1cfc0] overflow-hidden shadow-sm"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-[#f8f0e8] to-[#f3e9dc] border-b border-[#e1cfc0]">
                        <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Building size={14} className="sm:w-4 sm:h-4" />
                            <span>Sucursal</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin size={14} className="sm:w-4 sm:h-4" />
                            <span>Sector</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm hidden md:table-cell">
                          Descripción
                        </TableHead>
                        <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-center text-sm">
                          Estado
                        </TableHead>
                        <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-center text-sm">
                          Acción
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sectores.map((sector, index) => {
                        const estaAsignado = asignados.includes(sector.id)
                        const isLoadingAction = loadingActions.has(sector.id)
                        const sucursalNombre = getSucursalNombre(sector.sucursalId)
                        const sucursalInicial = getSucursalInicial(sector.sucursalId)

                        return (
                          <motion.tr
                            key={sector.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="border-b border-[#f0e6dc] hover:bg-[#fdf6f1] transition-colors"
                          >
                            <TableCell className="py-3 sm:py-4">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-purple-600 font-bold text-xs sm:text-sm">
                                    {sucursalInicial}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-[#7a5b4c] text-sm sm:text-base">
                                    {sucursalNombre}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 sm:py-4">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div
                                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                                    estaAsignado ? "bg-green-500" : "bg-gray-300"
                                  } transition-colors`}
                                ></div>
                                <span className="font-medium text-[#7a5b4c] text-sm sm:text-base">{sector.nombre}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 sm:py-4 hidden md:table-cell">
                              <span className="text-[#7a5b4c]/70 text-sm">{sector.descripcion}</span>
                            </TableCell>
                            <TableCell className="py-3 sm:py-4 text-center">
                              <div className="flex items-center justify-center">
                                {estaAsignado ? (
                                  <div className="flex items-center space-x-1 sm:space-x-2 text-green-600">
                                    <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                                    <span className="font-medium text-xs sm:text-sm">Asignado</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1 sm:space-x-2 text-gray-500">
                                    <XCircle size={14} className="sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm">No asignado</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 sm:py-4 text-center">
                              <motion.button
                                whileHover={{ scale: isLoadingAction ? 1 : 1.05 }}
                                whileTap={{ scale: isLoadingAction ? 1 : 0.95 }}
                                onClick={() => toggleAsignacion(sector.id, estaAsignado)}
                                disabled={isLoadingAction}
                                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 sm:space-x-2 mx-auto text-xs sm:text-sm ${
                                  estaAsignado
                                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
                                    : "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {isLoadingAction ? (
                                  <>
                                    <Loader2 size={14} className="animate-spin sm:w-4 sm:h-4" />
                                    <span>...</span>
                                  </>
                                ) : estaAsignado ? (
                                  <>
                                    <Minus size={14} className="sm:w-4 sm:h-4" />
                                    <span>Quitar</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus size={14} className="sm:w-4 sm:h-4" />
                                    <span>Asignar</span>
                                  </>
                                )}
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
                transition={{ delay: 0.4 }}
                className="sm:hidden space-y-3"
              >
                {sectores.map((sector, index) => {
                  const estaAsignado = asignados.includes(sector.id)
                  const isLoadingAction = loadingActions.has(sector.id)
                  const sucursalNombre = getSucursalNombre(sector.sucursalId)
                  const sucursalInicial = getSucursalInicial(sector.sucursalId)

                  return (
                    <motion.div
                      key={sector.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white border border-[#e1cfc0] rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-sm">{sucursalInicial}</span>
                          </div>
                          <div>
                            <p className="font-medium text-[#7a5b4c] text-sm">{sucursalNombre}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  estaAsignado ? "bg-green-500" : "bg-gray-300"
                                } transition-colors`}
                              ></div>
                              <span className="font-semibold text-[#7a5b4c]">{sector.nombre}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {estaAsignado ? (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle size={14} />
                              <span className="font-medium text-xs">Asignado</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-gray-500">
                              <XCircle size={14} />
                              <span className="text-xs">No asignado</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-[#7a5b4c]/70 text-sm mb-3">{sector.descripcion}</p>

                      <motion.button
                        whileHover={{ scale: isLoadingAction ? 1 : 1.02 }}
                        whileTap={{ scale: isLoadingAction ? 1 : 0.98 }}
                        onClick={() => toggleAsignacion(sector.id, estaAsignado)}
                        disabled={isLoadingAction}
                        className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm ${
                          estaAsignado
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
                            : "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isLoadingAction ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Procesando...</span>
                          </>
                        ) : estaAsignado ? (
                          <>
                            <Minus size={16} />
                            <span>Quitar Sector</span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            <span>Asignar Sector</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Botón de volver */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 sm:mt-6 flex justify-center"
              >
                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                  <span>Volver a Empleados</span>
                </motion.button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AsignarSectoresEmpleado
