"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import axios from "@/api/AxiosInstance"
import { motion, AnimatePresence } from "framer-motion"
import { useTurno } from "@/context/TurnoContext"
import {
  MapPin,
  Search,
  Clock,
  Phone,
  Star,
  ArrowRight,
  Building2,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react"

interface Sucursal {
  id: number
  nombre: string
  direccion: string
  telefono?: string
  horario?: string
  rating?: number
  servicios?: string[]
  imagen?: string
}

const SeleccionSucursal: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [filteredSucursales, setFilteredSucursales] = useState<Sucursal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedSucursal, setSelectedSucursal] = useState<number | null>(null)
  const navigate = useNavigate()
  const { setSucursal, resetTurno } = useTurno()

  // Ejecutar resetTurno solo una vez al montar el componente
  useEffect(() => {
    resetTurno()
  }, []) // ✅ Sin dependencias para evitar el bucle infinito

  // Cargar sucursales en un useEffect separado
  useEffect(() => {
    const fetchSucursales = async () => {
      setLoading(true)
      try {
        const response = await axios.get("/api/Sucursal")
        setSucursales(response.data)
        setFilteredSucursales(response.data)
      } catch (err) {
        setError("Error al cargar las sucursales. Por favor, intenta nuevamente.")
        console.error("Error cargando sucursales", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSucursales()
  }, []) // ✅ Sin dependencias, solo se ejecuta al montar

  // Filtrar sucursales por búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = sucursales.filter(
        (sucursal) =>
          sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sucursal.direccion.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredSucursales(filtered)
    } else {
      setFilteredSucursales(sucursales)
    }
  }, [sucursales, searchTerm])

  const handleSeleccion = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal.id)
    setSucursal(sucursal)

    // Pequeño delay para mostrar la selección antes de navegar
    setTimeout(() => {
      navigate("/reserva/servicio")
    }, 300)
  }

  // Datos mock para mejorar la presentación (en producción vendrían de la API)
  const enhanceSucursalData = (sucursal: Sucursal): Sucursal => ({
    ...sucursal,
    telefono: sucursal.telefono || "+54 11 1234-5678",
    horario: sucursal.horario || "Lun-Vie: 9:00-18:00, Sáb: 9:00-15:00",
    rating: sucursal.rating || 4.5 + Math.random() * 0.5,
    servicios: sucursal.servicios || ["Cejas", "Pestañas", "Uñas", "Depilación"],
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center p-4">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf] max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="p-4 bg-[#a1887f]/10 rounded-full w-fit mx-auto">
              <Loader2 className="h-8 w-8 animate-spin text-[#a1887f]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">Cargando sucursales</h3>
              <p className="text-[#8d6e63]">Estamos preparando las mejores opciones para ti...</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center p-4">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf] max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="p-4 bg-red-100 rounded-full w-fit mx-auto">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">Error al cargar</h3>
              <p className="text-[#8d6e63] mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-[#a1887f] hover:bg-[#8d6e63] text-white">
                Reintentar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-[#e0d6cf] mb-6">
            <Building2 className="h-6 w-6 text-[#a1887f]" />
            <span className="text-[#6d4c41] font-medium">Paso 1 de 4</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#6d4c41] mb-3">Elegí tu sucursal preferida</h1>
          <p className="text-[#8d6e63] text-lg max-w-2xl mx-auto">
            Seleccioná la ubicación más conveniente para tu cita. Todas nuestras sucursales ofrecen los mismos servicios
            de calidad.
          </p>
        </motion.div>

        {/* Búsqueda */}
        {sucursales.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-white/60 backdrop-blur-sm border-[#e0d6cf]">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8d6e63]" />
                  <Input
                    placeholder="Buscar por nombre o dirección..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-[#d2bfae] focus:ring-[#a1887f] focus:border-[#a1887f] bg-white/80"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Lista de sucursales */}
        <AnimatePresence>
          {filteredSucursales.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <Card className="bg-white/60 backdrop-blur-sm border-[#e0d6cf] p-8">
                <Building2 className="h-16 w-16 text-[#d2bfae] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">No se encontraron sucursales</h3>
                <p className="text-[#8d6e63] mb-4">Intenta ajustar tu búsqueda o contactanos para más información.</p>
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="outline"
                  className="border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white"
                >
                  Limpiar búsqueda
                </Button>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSucursales.map((sucursal, index) => {
                const enhancedSucursal = enhanceSucursalData(sucursal)
                const isSelected = selectedSucursal === sucursal.id

                return (
                  <motion.div
                    key={sucursal.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card
                      className={`bg-white/80 backdrop-blur-sm border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                        isSelected
                          ? "border-[#a1887f] shadow-lg scale-105"
                          : "border-[#e0d6cf] hover:border-[#d2bfae] hover:shadow-lg"
                      }`}
                      onClick={() => handleSeleccion(sucursal)}
                    >
                      <CardContent className="p-0">
                        {/* Header de la card */}
                        <div className="bg-gradient-to-r from-[#a1887f] to-[#8d6e63] p-6 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold mb-1">{sucursal.nombre}</h3>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.floor(enhancedSucursal.rating!)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-white/50"
                                      }`}
                                    />
                                  ))}
                                  <span className="text-sm ml-1">{enhancedSucursal.rating!.toFixed(1)}</span>
                                </div>
                              </div>
                              <div
                                className={`p-2 rounded-full transition-transform duration-300 ${
                                  isSelected ? "bg-white/20 scale-110" : "bg-white/10 group-hover:scale-110"
                                }`}
                              >
                                {isSelected ? <ArrowRight className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contenido de la card */}
                        <div className="p-6 space-y-4">
                          {/* Dirección */}
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-[#a1887f] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-[#6d4c41] font-medium">{sucursal.direccion}</p>
                              <p className="text-sm text-[#8d6e63]">Fácil acceso y estacionamiento</p>
                            </div>
                          </div>

                          {/* Horario */}
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-[#a1887f] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-[#6d4c41] font-medium">Horarios de atención</p>
                              <p className="text-sm text-[#8d6e63]">{enhancedSucursal.horario}</p>
                            </div>
                          </div>

                          {/* Teléfono */}
                          <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-[#a1887f] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-[#6d4c41] font-medium">{enhancedSucursal.telefono}</p>
                              <p className="text-sm text-[#8d6e63]">Consultas y reservas</p>
                            </div>
                          </div>

                          {/* Servicios */}
                          <div>
                            <p className="text-sm font-medium text-[#6d4c41] mb-2">Servicios disponibles:</p>
                            <div className="flex flex-wrap gap-2">
                              {enhancedSucursal.servicios!.slice(0, 4).map((servicio, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-[#f8f0ec] text-[#6d4c41] border border-[#e0d6cf]"
                                >
                                  {servicio}
                                </Badge>
                              ))}
                              {enhancedSucursal.servicios!.length > 4 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-[#a1887f]/10 text-[#a1887f] border border-[#a1887f]/20"
                                >
                                  +{enhancedSucursal.servicios!.length - 4} más
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Botón de selección */}
                          <div className="pt-4 border-t border-[#e0d6cf]">
                            <Button
                              className={`w-full transition-all duration-300 ${
                                isSelected
                                  ? "bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                                  : "bg-transparent border-2 border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white"
                              }`}
                              disabled={isSelected}
                            >
                              {isSelected ? (
                                <>
                                  <ArrowRight className="h-4 w-4 mr-2" />
                                  Seleccionada
                                </>
                              ) : (
                                <>
                                  Seleccionar sucursal
                                  <ChevronRight className="h-4 w-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Footer informativo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Card className="bg-white/40 backdrop-blur-sm border-[#e0d6cf] p-6">
            <p className="text-[#8d6e63] mb-2">¿No encontrás la sucursal que buscás?</p>
            <Button
              variant="outline"
              className="border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white bg-transparent"
            >
              <Phone className="h-4 w-4 mr-2" />
              Contactanos
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default SeleccionSucursal
