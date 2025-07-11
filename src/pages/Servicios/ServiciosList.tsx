"use client"
import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import {
  Scissors,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Settings,
  MapPin,
  Clock,
  DollarSign,
  Loader2,
  AlertCircle,
  Star,
  Search,
  X,
} from "lucide-react"

interface Servicio {
  id: number
  nombre: string
  descripcion: string
  duracionMinutos: number
  precio: number
}

interface Extra {
  id: number
}

const ServiciosList: React.FC = () => {
  const navigate = useNavigate()
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [extrasCount, setExtrasCount] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    const fetchServicios = async () => {
      setLoading(true)
      try {
        const res = await axios.get<Servicio[]>("/api/Servicio")
        setServicios(res.data)
      } catch {
        setError("Error al cargar los servicios")
      } finally {
        setLoading(false)
      }
    }
    fetchServicios()
  }, [])

  useEffect(() => {
    if (servicios.length === 0) return
    const fetchCounts = async () => {
      try {
        const countsArr = await Promise.all(
          servicios.map(async (s) => {
            const res = await axios.get<Extra[]>(`/api/Servicio/${s.id}/extras`)
            return [s.id, res.data.length] as const
          }),
        )
        const counts: Record<number, number> = {}
        countsArr.forEach(([id, count]) => {
          counts[id] = count
        })
        setExtrasCount(counts)
      } catch {
        // ignore
      }
    }
    fetchCounts()
  }, [servicios])

  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el servicio "${nombre}"?`)) return
    try {
      await axios.delete(`/api/Servicio/${id}`)
      setServicios(servicios.filter((s) => s.id !== id))
    } catch {
      setError("No se pudo eliminar el servicio")
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
    }
    return `${minutes}m`
  }

  const getPriceColor = (precio: number) => {
    if (precio >= 100) return "bg-emerald-100 text-emerald-800"
    if (precio >= 50) return "bg-amber-100 text-amber-800"
    return "bg-slate-100 text-slate-800"
  }

  // Filtrar servicios por término de búsqueda
  const serviciosFiltrados = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
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
          <p className="text-[#7a5b4c] font-medium text-base sm:text-lg">Cargando servicios...</p>
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

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border-0 shadow-xl p-4 sm:p-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] rounded-xl flex items-center justify-center"
                >
                  <Scissors className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#7a5b4c]">Gestión de Servicios</h1>
                  <p className="text-[#7a5b4c]/70 text-sm sm:text-base">
                    {searchTerm
                      ? `${serviciosFiltrados.length} de ${servicios.length} servicios`
                      : `${servicios.length} servicios disponibles`}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate("/servicios/nuevo")}
                className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Nuevo Servicio</span>
                <span className="hidden sm:inline">Nuevo Servicio</span>
              </Button>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7a5b4c]/60" />
              <Input
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c]/60 hover:text-[#7a5b4c] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 sm:w-5 sm:h-5" />
              <p className="text-sm sm:text-base text-red-600 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenido principal */}
        <AnimatePresence mode="wait">
          {serviciosFiltrados.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#7a5b4c]/20 to-[#a37e63]/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Scissors className="h-8 w-8 sm:h-10 sm:w-10 text-[#7a5b4c]/60" />
                </motion.div>
                {searchTerm ? (
                  <>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#7a5b4c] mb-2">
                      No se encontraron servicios
                    </h3>
                    <p className="text-[#7a5b4c]/70 mb-4 text-sm sm:text-base">
                      No hay servicios que coincidan con "{searchTerm}"
                    </p>
                    <Button
                      onClick={() => setSearchTerm("")}
                      variant="outline"
                      className="border-[#a37e63] text-[#a37e63] hover:bg-[#a37e63] hover:text-white"
                    >
                      Limpiar búsqueda
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#7a5b4c] mb-2">No hay servicios</h3>
                    <p className="text-[#7a5b4c]/70 mb-4 text-sm sm:text-base">Comienza agregando tu primer servicio</p>
                    <Button
                      onClick={() => navigate("/servicios/nuevo")}
                      className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span>Agregar Servicio</span>
                    </Button>
                  </>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Vista de tabla para desktop */}
              <div className="hidden lg:block">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-[#7a5b4c]/10 to-[#a37e63]/10 hover:from-[#7a5b4c]/10 hover:to-[#a37e63]/10 border-b border-[#e1cfc0]">
                            <TableHead className="text-[#7a5b4c] font-semibold py-4">Servicio</TableHead>
                            <TableHead className="text-[#7a5b4c] font-semibold py-4">Descripción</TableHead>
                            <TableHead className="text-[#7a5b4c] font-semibold py-4">Duración</TableHead>
                            <TableHead className="text-[#7a5b4c] font-semibold py-4">Precio</TableHead>
                            <TableHead className="text-[#7a5b4c] font-semibold text-center py-4">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {serviciosFiltrados.map((servicio, index) => (
                            <motion.tr
                              key={servicio.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="hover:bg-[#fdf6f1]/50 transition-colors border-b border-[#e1cfc0]/30"
                            >
                              <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] rounded-xl flex items-center justify-center">
                                    <Scissors className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-[#7a5b4c]">{servicio.nombre}</div>
                                    <div className="text-sm text-[#7a5b4c]/60">ID: {servicio.id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="max-w-xs">
                                  <p className="text-[#7a5b4c] text-sm line-clamp-2">{servicio.descripcion}</p>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-[#7a5b4c]/60" />
                                  <span className="text-[#7a5b4c] font-medium text-sm">
                                    {formatDuration(servicio.duracionMinutos)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-[#7a5b4c]/60" />
                                  <Badge
                                    className={`${getPriceColor(servicio.precio)} font-semibold text-sm px-2 py-1 rounded-lg`}
                                  >
                                    ${servicio.precio}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center justify-center">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-[#fdf6f1]">
                                        <MoreVertical className="h-4 w-4 text-[#7a5b4c]" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-48 bg-white/95 backdrop-blur-sm border border-[#e1cfc0] rounded-xl shadow-xl"
                                    >
                                      <DropdownMenuItem
                                        onClick={() => navigate(`/servicios/editar/${servicio.id}`)}
                                        className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator className="bg-[#e1cfc0]" />
                                      <DropdownMenuItem
                                        onClick={() => navigate(`/servicios/${servicio.id}/habilidades`)}
                                        className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
                                      >
                                        <Settings className="h-4 w-4 mr-2" />
                                        Habilidades
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => navigate(`/servicios/${servicio.id}/sectores`)}
                                        className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
                                      >
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Sectores
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => navigate(`/servicios/${servicio.id}/extras`)}
                                        className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
                                      >
                                        <Star className="h-4 w-4 mr-2" />
                                        Extras ({extrasCount[servicio.id] ?? 0})
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator className="bg-[#e1cfc0]" />
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(servicio.id, servicio.nombre)}
                                        className="text-red-600 focus:text-red-600 hover:bg-red-50 rounded-lg mx-1 my-1"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Eliminar
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vista de cards para móvil y tablet */}
              <div className="lg:hidden space-y-4">
                {serviciosFiltrados.map((servicio, index) => (
                  <motion.div
                    key={servicio.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] rounded-xl flex items-center justify-center flex-shrink-0">
                            <Scissors className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-[#7a5b4c] text-lg truncate">{servicio.nombre}</h3>
                                <p className="text-sm text-[#7a5b4c]/60">ID: {servicio.id}</p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[#fdf6f1] flex-shrink-0">
                                    <MoreVertical className="h-4 w-4 text-[#7a5b4c]" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48 bg-white/95 backdrop-blur-sm border border-[#e1cfc0] rounded-xl shadow-xl"
                                >
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/servicios/editar/${servicio.id}`)}
                                    className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-[#e1cfc0]" />
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/servicios/${servicio.id}/habilidades`)}
                                    className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
                                  >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Habilidades
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/servicios/${servicio.id}/sectores`)}
                                    className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
                                  >
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Sectores
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/servicios/${servicio.id}/extras`)}
                                    className="text-[#7a5b4c] hover:bg-[#fdf6f1] rounded-lg mx-1 my-1"
                                  >
                                    <Star className="h-4 w-4 mr-2" />
                                    Extras ({extrasCount[servicio.id] ?? 0})
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-[#e1cfc0]" />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(servicio.id, servicio.nombre)}
                                    className="text-red-600 focus:text-red-600 hover:bg-red-50 rounded-lg mx-1 my-1"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <p className="text-[#7a5b4c] text-sm mb-3 line-clamp-2">{servicio.descripcion}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-[#7a5b4c]/60" />
                                  <span className="text-[#7a5b4c] font-medium text-sm">
                                    {formatDuration(servicio.duracionMinutos)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4 text-[#7a5b4c]/60" />
                                  <Badge
                                    className={`${getPriceColor(servicio.precio)} font-semibold text-sm px-2 py-1 rounded-lg`}
                                  >
                                    ${servicio.precio}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ServiciosList
