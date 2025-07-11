"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import {
  Settings,
  User,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Zap,
  Users,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Habilidad {
  id: number
  nombre: string
}

const AsignarHabilidadesEmpleado: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [habilidades, setHabilidades] = useState<Habilidad[]>([])
  const [habilidadesAsignadas, setHabilidadesAsignadas] = useState<number[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingActions, setLoadingActions] = useState<Set<number>>(new Set())
  const [empleadoNombre, setEmpleadoNombre] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [todas, asignadas, empleado] = await Promise.all([
          axios.get<Habilidad[]>("/api/Habilidad"),
          axios.get<Habilidad[]>(`/api/Empleado/${id}/habilidades`),
          axios.get(`/api/Empleado/${id}`),
        ])
        setHabilidades(todas.data)
        setHabilidadesAsignadas(asignadas.data.map((h) => h.id))
        setEmpleadoNombre(`${empleado.data.nombre} ${empleado.data.apellido}`)
      } catch (err) {
        setError("Error al cargar habilidades")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const toggleHabilidad = async (habilidadId: number) => {
    const yaEstaAsignada = habilidadesAsignadas.includes(habilidadId)

    // Añadir a loading actions
    setLoadingActions((prev) => new Set(prev).add(habilidadId))

    try {
      if (yaEstaAsignada) {
        await axios.delete(`/api/Empleado/${id}/habilidades/${habilidadId}`)
        setHabilidadesAsignadas((prev) => prev.filter((id) => id !== habilidadId))
      } else {
        await axios.post(`/api/Empleado/${id}/habilidades/${habilidadId}`)
        setHabilidadesAsignadas((prev) => [...prev, habilidadId])
      }
      setError("") // Limpiar error en caso de éxito
    } catch (err) {
      setError("No se pudo actualizar la habilidad")
    } finally {
      // Remover de loading actions
      setLoadingActions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(habilidadId)
        return newSet
      })
    }
  }

  const handleBack = () => {
    navigate("/empleados")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 size={40} className="text-[#7a5b4c] animate-spin" />
          </div>
          <p className="text-[#7a5b4c] font-medium text-lg">Cargando habilidades...</p>
          <p className="text-[#7a5b4c]/60 text-sm mt-2">Esto puede tomar unos segundos</p>
        </motion.div>
      </div>
    )
  }

  const habilidadesAsignadasCount = habilidadesAsignadas.length
  const totalHabilidades = habilidades.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-4 py-8">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#d4bfae] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#a37e63] rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] p-6 relative">
              {/* Botón de volver */}
              <button
                onClick={handleBack}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Settings size={32} className="text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Gestionar Habilidades</CardTitle>
                <div className="flex items-center justify-center space-x-2 text-white/90">
                  <User size={16} />
                  <span className="font-medium">{empleadoNombre}</span>
                </div>
                <p className="text-white/70 text-sm mt-2">
                  {habilidadesAsignadasCount} de {totalHabilidades} habilidades asignadas
                </p>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Estadísticas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
              >
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Zap size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Habilidades</p>
                      <p className="text-2xl font-bold text-blue-700">{totalHabilidades}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">Asignadas</p>
                      <p className="text-2xl font-bold text-green-700">{habilidadesAsignadasCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Disponibles</p>
                      <p className="text-2xl font-bold text-orange-700">
                        {totalHabilidades - habilidadesAsignadasCount}
                      </p>
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
                    className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-6"
                  >
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                    <p className="text-red-600 font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tabla de habilidades */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl border border-[#e1cfc0] overflow-hidden shadow-sm"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-[#f8f0e8] to-[#f3e9dc] border-b border-[#e1cfc0]">
                        <TableHead className="text-[#7a5b4c] font-semibold py-4">
                          <div className="flex items-center space-x-2">
                            <Zap size={16} />
                            <span>Habilidad</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-[#7a5b4c] font-semibold py-4 text-center">Estado</TableHead>
                        <TableHead className="text-[#7a5b4c] font-semibold py-4 text-center">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {habilidades.map((hab, index) => {
                        const asignada = habilidadesAsignadas.includes(hab.id)
                        const isLoadingAction = loadingActions.has(hab.id)

                        return (
                          <motion.tr
                            key={hab.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="border-b border-[#f0e6dc] hover:bg-[#fdf6f1] transition-colors"
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    asignada ? "bg-green-500" : "bg-gray-300"
                                  } transition-colors`}
                                ></div>
                                <span className="font-medium text-[#7a5b4c]">{hab.nombre}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-center">
                              <div className="flex items-center justify-center">
                                {asignada ? (
                                  <div className="flex items-center space-x-2 text-green-600">
                                    <CheckCircle size={16} />
                                    <span className="font-medium">Asignada</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2 text-gray-500">
                                    <XCircle size={16} />
                                    <span>No asignada</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-center">
                              <motion.button
                                whileHover={{ scale: isLoadingAction ? 1 : 1.05 }}
                                whileTap={{ scale: isLoadingAction ? 1 : 0.95 }}
                                onClick={() => toggleHabilidad(hab.id)}
                                disabled={isLoadingAction}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 mx-auto ${
                                  asignada
                                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
                                    : "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {isLoadingAction ? (
                                  <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>...</span>
                                  </>
                                ) : asignada ? (
                                  <>
                                    <Minus size={16} />
                                    <span>Quitar</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus size={16} />
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

              {/* Botón de volver */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex justify-center"
              >
                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft size={18} />
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

export default AsignarHabilidadesEmpleado
