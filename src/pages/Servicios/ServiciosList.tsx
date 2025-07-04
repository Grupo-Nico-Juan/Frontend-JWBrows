"use client"
import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    if (precio >= 100) return "bg-green-100 text-green-800"
    if (precio >= 50) return "bg-blue-100 text-blue-800"
    return "bg-gray-100 text-gray-800"
  }

  // Filtrar servicios por término de búsqueda
  const serviciosFiltrados = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#a1887f]" />
            <span className="text-[#6d4c41] font-medium">Cargando servicios...</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg border border-[#e0d6cf] p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#a1887f] rounded-lg">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#6d4c41]">Gestión de Servicios</h1>
                <p className="text-[#8d6e63]">
                  {searchTerm
                    ? `${serviciosFiltrados.length} de ${servicios.length} servicios`
                    : `${servicios.length} servicios disponibles`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8d6e63]" />
                <Input
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white/80 border-[#e0d6cf] focus:border-[#a1887f] focus:ring-[#a1887f]"
                />
              </div>
              <Button
                onClick={() => navigate("/servicios/nuevo")}
                className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Servicio
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </motion.div>
        )}

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
              <Card className="bg-white/60 backdrop-blur-sm border-[#e0d6cf] p-8">
                <Scissors className="h-16 w-16 text-[#d2bfae] mx-auto mb-4" />
                {searchTerm ? (
                  <>
                    <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">No se encontraron servicios</h3>
                    <p className="text-[#8d6e63] mb-4">No hay servicios que coincidan con "{searchTerm}"</p>
                    <Button
                      onClick={() => setSearchTerm("")}
                      variant="outline"
                      className="border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white"
                    >
                      Limpiar búsqueda
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">No hay servicios</h3>
                    <p className="text-[#8d6e63] mb-4">Comienza agregando tu primer servicio</p>
                    <Button
                      onClick={() => navigate("/servicios/nuevo")}
                      className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Servicio
                    </Button>
                  </>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#f3e5e1] hover:bg-[#f3e5e1]">
                          <TableHead className="text-[#6d4c41] font-semibold">Servicio</TableHead>
                          <TableHead className="text-[#6d4c41] font-semibold">Descripción</TableHead>
                          <TableHead className="text-[#6d4c41] font-semibold">Duración</TableHead>
                          <TableHead className="text-[#6d4c41] font-semibold">Precio</TableHead>
                          <TableHead className="text-[#6d4c41] font-semibold text-center">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviciosFiltrados.map((servicio, index) => (
                          <motion.tr
                            key={servicio.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-[#f8f0ec] transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#a1887f] rounded-lg">
                                  <Scissors className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <div className="font-medium text-[#6d4c41]">{servicio.nombre}</div>
                                  <div className="text-sm text-[#8d6e63]">ID: {servicio.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <p className="text-[#6d4c41] text-sm line-clamp-2">{servicio.descripcion}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-[#8d6e63]" />
                                <span className="text-[#6d4c41] font-medium">
                                  {formatDuration(servicio.duracionMinutos)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-[#8d6e63]" />
                                <Badge className={getPriceColor(servicio.precio)}>${servicio.precio}</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => navigate(`/servicios/editar/${servicio.id}`)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate(`/servicios/${servicio.id}/habilidades`)}>
                                      <Settings className="h-4 w-4 mr-2" />
                                      Habilidades
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate(`/servicios/${servicio.id}/sectores`)}>
                                      <MapPin className="h-4 w-4 mr-2" />
                                      Sectores
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate(`/servicios/${servicio.id}/extras`)}>
                                      <Star className="h-4 w-4 mr-2" />
                                      Extras ({extrasCount[servicio.id] ?? 0})
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDelete(servicio.id, servicio.nombre)}
                                      className="text-red-600 focus:text-red-600"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ServiciosList
