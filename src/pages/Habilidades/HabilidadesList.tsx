"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Zap,
  Plus,
  Edit3,
  Trash2,
  AlertCircle,
  Loader2,
  FileText,
  Users,
  Settings,
  ArrowLeft,
  Search,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Habilidad {
  id: number
  nombre: string
  descripcion: string
}

const HabilidadesList: React.FC = () => {
  const [habilidades, setHabilidades] = useState<Habilidad[]>([])
  const [filteredHabilidades, setFilteredHabilidades] = useState<Habilidad[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState<Set<number>>(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHabilidades = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/api/Habilidad")
        setHabilidades(response.data)
        setFilteredHabilidades(response.data)
      } catch {
        setError("Error al cargar habilidades")
        toast.error("Error al cargar habilidades")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHabilidades()
  }, [])

  useEffect(() => {
    const filtered = habilidades.filter(
      (habilidad) =>
        habilidad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        habilidad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredHabilidades(filtered)
  }, [searchTerm, habilidades])

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta habilidad?")) return

    setLoadingDelete((prev) => new Set(prev).add(id))
    try {
      await axios.delete(`/api/Habilidad/${id}`)
      setHabilidades((prev) => prev.filter((h) => h.id !== id))
      toast.success("Habilidad eliminada correctamente")
    } catch {
      setError("No se pudo eliminar la habilidad")
      toast.error("No se pudo eliminar la habilidad")
    } finally {
      setLoadingDelete((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/habilidades/editar/${id}`)
  }

  const handleNuevaHabilidad = () => {
    navigate("/habilidades/nueva")
  }

  const handleBack = () => {
    navigate("/menu-admin") // o la ruta que corresponda
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
          <p className="text-[#7a5b4c] font-medium text-base sm:text-lg">Cargando habilidades...</p>
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
                  <Zap size={24} className="text-white sm:w-8 sm:h-8" />
                </motion.div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">Gestión de Habilidades</CardTitle>
                <p className="text-white/80 text-sm mt-2">
                  {filteredHabilidades.length} habilidad{filteredHabilidades.length !== 1 ? "es" : ""} registrada
                  {filteredHabilidades.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <CardContent className="p-3 sm:p-6">
              {/* Barra de acciones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6"
              >
                {/* Buscador */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c]/60 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Buscar habilidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                {/* Botón Nueva Habilidad */}
                <motion.button
                  onClick={handleNuevaHabilidad}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <Plus size={16} className="sm:w-5 sm:h-5" />
                  <span>Nueva Habilidad</span>
                </motion.button>
              </motion.div>

              {/* Estadísticas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6"
              >
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Zap size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-blue-600 font-medium">Total</p>
                      <p className="text-lg sm:text-2xl font-bold text-blue-700">{habilidades.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Search size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-green-600 font-medium">Filtradas</p>
                      <p className="text-lg sm:text-2xl font-bold text-green-700">{filteredHabilidades.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-purple-600 font-medium">Disponibles</p>
                      <p className="text-lg sm:text-2xl font-bold text-purple-700">{habilidades.length}</p>
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
                    className="flex items-center space-x-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl mb-6"
                  >
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0 sm:w-5 sm:h-5" />
                    <p className="text-sm sm:text-base text-red-600 font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

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
                            <Zap size={14} className="sm:w-4 sm:h-4" />
                            <span>Nombre</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <FileText size={14} className="sm:w-4 sm:h-4" />
                            <span>Descripción</span>
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
                      {filteredHabilidades.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="py-8 text-center">
                            <div className="flex flex-col items-center space-y-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <Zap size={24} className="text-gray-400" />
                              </div>
                              <div>
                                <p className="text-gray-500 font-medium">
                                  {searchTerm ? "No se encontraron habilidades" : "No hay habilidades registradas"}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                  {searchTerm
                                    ? "Intenta con otros términos de búsqueda"
                                    : "Agrega una nueva habilidad para comenzar"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredHabilidades.map((habilidad, index) => {
                          const isLoadingAction = loadingDelete.has(habilidad.id)

                          return (
                            <motion.tr
                              key={habilidad.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="border-b border-[#f0e6dc] hover:bg-[#fdf6f1] transition-colors"
                            >
                              <TableCell className="py-3 sm:py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#a37e63] rounded-full"></div>
                                  <span className="font-medium text-[#7a5b4c] text-sm sm:text-base">
                                    {habilidad.nombre}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-3 sm:py-4">
                                <span className="text-[#7a5b4c]/70 text-sm sm:text-base">{habilidad.descripcion}</span>
                              </TableCell>
                              <TableCell className="py-3 sm:py-4 text-center">
                                <div className="flex gap-2 justify-center">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleEdit(habilidad.id)}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                                  >
                                    <Edit3 size={12} className="sm:w-4 sm:h-4" />
                                    <span>Editar</span>
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: isLoadingAction ? 1 : 1.05 }}
                                    whileTap={{ scale: isLoadingAction ? 1 : 0.95 }}
                                    onClick={() => handleDelete(habilidad.id)}
                                    disabled={isLoadingAction}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isLoadingAction ? (
                                      <Loader2 size={12} className="animate-spin sm:w-4 sm:h-4" />
                                    ) : (
                                      <Trash2 size={12} className="sm:w-4 sm:h-4" />
                                    )}
                                    <span>Eliminar</span>
                                  </motion.button>
                                </div>
                              </TableCell>
                            </motion.tr>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>

              {/* Vista de cards para móvil/tablet */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="md:hidden space-y-3"
              >
                {filteredHabilidades.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      {searchTerm ? "No se encontraron habilidades" : "No hay habilidades registradas"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchTerm
                        ? "Intenta con otros términos de búsqueda"
                        : "Agrega una nueva habilidad para comenzar"}
                    </p>
                  </div>
                ) : (
                  filteredHabilidades.map((habilidad, index) => {
                    const isLoadingAction = loadingDelete.has(habilidad.id)

                    return (
                      <motion.div
                        key={habilidad.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white border border-[#e1cfc0] rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-8 h-8 bg-[#a37e63]/10 rounded-full flex items-center justify-center">
                              <Zap size={16} className="text-[#a37e63]" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-[#7a5b4c] text-sm">{habilidad.nombre}</h3>
                              <p className="text-[#7a5b4c]/70 text-xs mt-1">{habilidad.descripcion}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleEdit(habilidad.id)}
                            className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                          >
                            <Edit3 size={14} />
                            <span>Editar</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: isLoadingAction ? 1 : 1.02 }}
                            whileTap={{ scale: isLoadingAction ? 1 : 0.98 }}
                            onClick={() => handleDelete(habilidad.id)}
                            disabled={isLoadingAction}
                            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoadingAction ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            <span>Eliminar</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </motion.div>

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
                  <span>Volver al Menú</span>
                </motion.button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default HabilidadesList
