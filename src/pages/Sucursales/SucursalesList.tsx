"use client"
import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Building2,
  Plus,
  Search,
  X,
  MapPin,
  Phone,
  MoreVertical,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Store,
} from "lucide-react"

interface Sucursal {
  id: number
  nombre: string
  direccion: string
  telefono: string
}

const SucursalesList: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSucursales = async () => {
      setLoading(true)
      try {
        const res = await axios.get("/api/Sucursal")
        setSucursales(res.data)
      } catch {
        setError("Error al cargar sucursales")
      } finally {
        setLoading(false)
      }
    }
    fetchSucursales()
  }, [])

  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar la sucursal "${nombre}"?`)) return

    try {
      await axios.delete(`/api/Sucursal/${id}`)
      setSucursales(sucursales.filter((s) => s.id !== id))
      toast.success("Sucursal eliminada correctamente")
    } catch {
      setError("No se pudo eliminar la sucursal")
      toast.error("Error al eliminar la sucursal")
    }
  }

  // Filtrar sucursales basado en el término de búsqueda
  const sucursalesFiltradas = sucursales.filter(
    (sucursal) =>
      sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sucursal.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sucursal.telefono.includes(searchTerm),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#a1887f]" />
            <span className="text-[#6d4c41] font-medium">Cargando sucursales...</span>
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
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#6d4c41]">Gestión de Sucursales</h1>
                <p className="text-[#8d6e63]">
                  {searchTerm
                    ? `${sucursalesFiltradas.length} de ${sucursales.length} sucursales`
                    : `${sucursales.length} sucursales registradas`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8d6e63] h-4 w-4" />
                <Input
                  placeholder="Buscar sucursales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 w-64 border-[#e0d6cf] focus:border-[#a1887f]"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8d6e63] hover:text-[#6d4c41]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                onClick={() => navigate("/sucursales/nueva")}
                className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Sucursal
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
          {sucursalesFiltradas.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Card className="bg-white/60 backdrop-blur-sm border-[#e0d6cf] p-8">
                <Building2 className="h-16 w-16 text-[#d2bfae] mx-auto mb-4" />
                {searchTerm ? (
                  <>
                    <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">No se encontraron sucursales</h3>
                    <p className="text-[#8d6e63] mb-4">No hay sucursales que coincidan con "{searchTerm}"</p>
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
                    <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">No hay sucursales</h3>
                    <p className="text-[#8d6e63] mb-4">Comienza agregando tu primera sucursal</p>
                    <Button
                      onClick={() => navigate("/sucursales/nueva")}
                      className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Sucursal
                    </Button>
                  </>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {sucursalesFiltradas.map((sucursal, index) => (
                <motion.div
                  key={sucursal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf] hover:shadow-lg transition-all duration-200 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#a1887f] rounded-lg">
                            <Store className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-[#6d4c41] line-clamp-1">{sucursal.nombre}</CardTitle>
                            <Badge variant="secondary" className="text-xs mt-1">
                              ID: {sucursal.id}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => navigate(`/sucursales/editar/${sucursal.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(sucursal.id, sucursal.nombre)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-[#8d6e63] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-[#6d4c41]">Dirección</p>
                            <p className="text-sm text-[#8d6e63] line-clamp-2">{sucursal.direccion}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-[#8d6e63] flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-[#6d4c41]">Teléfono</p>
                            <p className="text-sm text-[#8d6e63]">{sucursal.telefono}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#e0d6cf]">
                        <Button
                          onClick={() => navigate(`/sucursales/editar/${sucursal.id}`)}
                          variant="outline"
                          size="sm"
                          className="w-full border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Sucursal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SucursalesList
