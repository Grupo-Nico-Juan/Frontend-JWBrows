"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  ArrowLeft,
  Settings,
  Search,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Minus,
  Users,
  Filter,
  RotateCcw,
} from "lucide-react"

interface Habilidad {
  id: number
  nombre: string
  descripcion: string
}

interface ServicioInfo {
  id: number
  nombre: string
}

const AsignarHabilidadesServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [habilidades, setHabilidades] = useState<Habilidad[]>([])
  const [habilidadesAsignadas, setHabilidadesAsignadas] = useState<number[]>([])
  const [servicioInfo, setServicioInfo] = useState<ServicioInfo | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"todas" | "asignadas" | "disponibles">("todas")
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set())

  // Filtrar habilidades
  const habilidadesFiltradas = habilidades.filter((hab) => {
    const matchesSearch =
      hab.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hab.descripcion.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    const isAssigned = habilidadesAsignadas.includes(hab.id)

    switch (filter) {
      case "asignadas":
        return isAssigned
      case "disponibles":
        return !isAssigned
      default:
        return true
    }
  })

  const habilidadesAsignadasCount = habilidadesAsignadas.length
  const habilidadesDisponiblesCount = habilidades.length - habilidadesAsignadas.length

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [todas, asignadas, servicio] = await Promise.all([
          axios.get<Habilidad[]>("/api/Habilidad"),
          axios.get<Habilidad[]>(`/api/Servicio/${id}/habilidades`),
          axios.get<ServicioInfo>(`/api/Servicio/${id}`),
        ])

        setHabilidades(todas.data)
        setHabilidadesAsignadas(asignadas.data.map((h) => h.id))
        setServicioInfo(servicio.data)
      } catch (err) {
        setError("Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const toggleHabilidad = async (habilidadId: number) => {
    if (processingIds.has(habilidadId)) return

    setProcessingIds((prev) => new Set(prev).add(habilidadId))
    const yaAsignada = habilidadesAsignadas.includes(habilidadId)

    try {
      if (yaAsignada) {
        await axios.delete(`/api/Servicio/${id}/habilidades/${habilidadId}`)
        setHabilidadesAsignadas((prev) => prev.filter((hid) => hid !== habilidadId))
        toast.success("Habilidad removida correctamente")
      } else {
        await axios.post(`/api/Servicio/${id}/habilidades/${habilidadId}`)
        setHabilidadesAsignadas((prev) => [...prev, habilidadId])
        toast.success("Habilidad asignada correctamente")
      }
    } catch (err) {
      setError("No se pudo actualizar la habilidad")
      toast.error("Error al actualizar la habilidad")
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(habilidadId)
        return newSet
      })
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setFilter("todas")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#a1887f]" />
            <span className="text-[#6d4c41] font-medium">Cargando habilidades...</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg border border-[#e0d6cf] p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/servicios")}
              className="text-[#8d6e63] hover:text-[#6d4c41] hover:bg-[#f3e5e1]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#a1887f] rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#6d4c41]">Gestión de Habilidades</h1>
                <p className="text-[#8d6e63]">{servicioInfo ? `Servicio: ${servicioInfo.nombre}` : "Cargando..."}</p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#f3e5e1] rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#a1887f]" />
                <span className="text-[#6d4c41] font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold text-[#6d4c41]">{habilidades.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Asignadas</span>
              </div>
              <p className="text-2xl font-bold text-green-800">{habilidadesAsignadasCount}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">Disponibles</span>
              </div>
              <p className="text-2xl font-bold text-blue-800">{habilidadesDisponiblesCount}</p>
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

        {/* Filtros y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8d6e63] h-4 w-4" />
                  <Input
                    placeholder="Buscar habilidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 border-[#e0d6cf] focus:border-[#a1887f]"
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

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#8d6e63]" />
                  <div className="flex gap-2">
                    {(["todas", "asignadas", "disponibles"] as const).map((filterType) => (
                      <Button
                        key={filterType}
                        variant={filter === filterType ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(filterType)}
                        className={
                          filter === filterType
                            ? "bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                            : "border-[#e0d6cf] text-[#8d6e63] hover:bg-[#f3e5e1]"
                        }
                      >
                        {filterType === "todas" && "Todas"}
                        {filterType === "asignadas" && "Asignadas"}
                        {filterType === "disponibles" && "Disponibles"}
                      </Button>
                    ))}
                  </div>

                  {(searchTerm || filter !== "todas") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-[#8d6e63] hover:text-[#6d4c41] hover:bg-[#f3e5e1]"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 text-sm text-[#8d6e63]">
                Mostrando {habilidadesFiltradas.length} de {habilidades.length} habilidades
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de habilidades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
            <CardHeader>
              <CardTitle className="text-lg text-[#6d4c41]">
                Habilidades {filter !== "todas" && `(${filter})`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {habilidadesFiltradas.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                  >
                    <Settings className="h-16 w-16 text-[#d2bfae] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">
                      {searchTerm || filter !== "todas"
                        ? "No se encontraron habilidades"
                        : "No hay habilidades disponibles"}
                    </h3>
                    <p className="text-[#8d6e63] mb-4">
                      {searchTerm || filter !== "todas"
                        ? "Intenta ajustar los filtros de búsqueda"
                        : "No hay habilidades registradas en el sistema"}
                    </p>
                    {(searchTerm || filter !== "todas") && (
                      <Button
                        onClick={resetFilters}
                        variant="outline"
                        className="border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white bg-transparent"
                      >
                        Limpiar filtros
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  <div className="grid gap-4">
                    {habilidadesFiltradas.map((hab, index) => {
                      const asignada = habilidadesAsignadas.includes(hab.id)
                      const isProcessing = processingIds.has(hab.id)

                      return (
                        <motion.div
                          key={hab.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`p-4 rounded-lg border transition-all duration-200 ${
                            asignada
                              ? "bg-green-50 border-green-200 hover:bg-green-100"
                              : "bg-white border-[#e0d6cf] hover:bg-[#f8f0ec]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-[#6d4c41]">{hab.nombre}</h3>
                                <Badge
                                  variant={asignada ? "default" : "secondary"}
                                  className={
                                    asignada
                                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                                      : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {asignada ? "Asignada" : "Disponible"}
                                </Badge>
                              </div>
                              <p className="text-sm text-[#8d6e63] line-clamp-2">{hab.descripcion}</p>
                            </div>

                            <Button
                              size="sm"
                              onClick={() => toggleHabilidad(hab.id)}
                              disabled={isProcessing}
                              className={
                                asignada
                                  ? "bg-red-500 hover:bg-red-600 text-white ml-4"
                                  : "bg-green-600 hover:bg-green-700 text-white ml-4"
                              }
                            >
                              {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : asignada ? (
                                <>
                                  <Minus className="h-4 w-4 mr-1" />
                                  Quitar
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Asignar
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AsignarHabilidadesServicio
