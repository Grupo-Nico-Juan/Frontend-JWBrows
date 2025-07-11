"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import axios from "@/api/AxiosInstance"
import { motion } from "framer-motion"
import { Building2, Users, ArrowRight, Loader2, AlertCircle, ChevronRight, MapPin, Briefcase } from "lucide-react"

interface Sucursal {
  id: number
  nombre: string
  direccion: string
}

interface Sector {
  id: number
  nombre: string
  descripcion: string
  sucursalId: number
}

const SeleccionSucursalSector: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [sectores, setSectores] = useState<Sector[]>([])
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null)
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  const [loadingSucursales, setLoadingSucursales] = useState(true)
  const [loadingSectores, setLoadingSectores] = useState(false)
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()

  // Cargar sucursales al montar el componente
  useEffect(() => {
    const fetchSucursales = async () => {
      setLoadingSucursales(true)
      try {
        const response = await axios.get("/api/Sucursal")
        setSucursales(response.data)
      } catch (err) {
        setError("Error al cargar las sucursales")
        console.error("Error cargando sucursales", err)
      } finally {
        setLoadingSucursales(false)
      }
    }

    fetchSucursales()
  }, [])

  // Cargar sectores cuando se selecciona una sucursal
  useEffect(() => {
    if (selectedSucursal) {
      const fetchSectores = async () => {
        setLoadingSectores(true)
        try {
          const response = await axios.get(`/api/Sector/sucursal/${selectedSucursal.id}`)
          setSectores(response.data)
        } catch (err) {
          setError("Error al cargar los sectores")
          console.error("Error cargando sectores", err)
        } finally {
          setLoadingSectores(false)
        }
      }

      fetchSectores()
    }
  }, [selectedSucursal])

  const handleSucursalSelection = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal)
    setSelectedSector(null)
    setSectores([])
  }

  const handleSectorSelection = (sector: Sector) => {
    setSelectedSector(sector)
    // Navegar a la vista de empleadas con los parámetros
    navigate(`/empleadas/turnos?sucursalId=${selectedSucursal!.id}&sectorId=${sector.id}`)
  }

  if (loadingSucursales) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center p-4">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf] max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="p-4 bg-[#a1887f]/10 rounded-full w-fit mx-auto">
              <Loader2 className="h-8 w-8 animate-spin text-[#a1887f]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">Cargando sucursales</h3>
              <p className="text-[#8d6e63]">Preparando la información...</p>
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-[#e0d6cf] mb-6">
            <Users className="h-6 w-6 text-[#a1887f]" />
            <span className="text-[#6d4c41] font-medium">Panel de Empleadas</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#6d4c41] mb-3">Gestión de Turnos por Sector</h1>
          <p className="text-[#8d6e63] text-lg max-w-2xl mx-auto">
            Selecciona la sucursal y sector para acceder a la gestión de turnos de las empleadas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Selección de Sucursal */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf] h-fit pt-0">
              <CardHeader className="bg-gradient-to-r from-[#a1887f] to-[#8d6e63] text-white rounded-t-lg py-3">
                <CardTitle className="flex items-center gap-3">
                  <Building2 className="h-6 w-6" />
                  Seleccionar Sucursal
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {sucursales.map((sucursal) => (
                    <motion.div key={sucursal.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedSucursal?.id === sucursal.id
                            ? "border-[#a1887f] bg-[#a1887f]/5 shadow-md"
                            : "border-[#e0d6cf] hover:border-[#d2bfae] hover:shadow-sm"
                        }`}
                        onClick={() => handleSucursalSelection(sucursal)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-full ${
                                  selectedSucursal?.id === sucursal.id
                                    ? "bg-[#a1887f] text-white"
                                    : "bg-[#f8f0ec] text-[#a1887f]"
                                }`}
                              >
                                <MapPin className="h-4 w-4" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-[#6d4c41]">{sucursal.nombre}</h3>
                                <p className="text-sm text-[#8d6e63]">{sucursal.direccion}</p>
                              </div>
                            </div>
                            {selectedSucursal?.id === sucursal.id && (
                              <Badge className="bg-[#a1887f] text-white">Seleccionada</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Selección de Sector */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf] h-fit pt-0">
              <CardHeader className="bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] text-white rounded-t-lg  py-3">
                <CardTitle className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6" />
                  Seleccionar Sector
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!selectedSucursal ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-[#d2bfae] mx-auto mb-4" />
                    <p className="text-[#8d6e63]">Primero selecciona una sucursal para ver los sectores disponibles</p>
                  </div>
                ) : loadingSectores ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-[#a1887f] mx-auto mb-4" />
                    <p className="text-[#8d6e63]">Cargando sectores...</p>
                  </div>
                ) : sectores.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-[#d2bfae] mx-auto mb-4" />
                    <p className="text-[#8d6e63]">No hay sectores disponibles en esta sucursal</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sectores.map((sector) => (
                      <motion.div key={sector.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className={`cursor-pointer transition-all duration-300 ${
                            selectedSector?.id === sector.id
                              ? "border-[#8d6e63] bg-[#8d6e63]/5 shadow-md"
                              : "border-[#e0d6cf] hover:border-[#d2bfae] hover:shadow-sm"
                          }`}
                          onClick={() => handleSectorSelection(sector)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-full ${
                                    selectedSector?.id === sector.id
                                      ? "bg-[#8d6e63] text-white"
                                      : "bg-[#f8f0ec] text-[#8d6e63]"
                                  }`}
                                >
                                  <Briefcase className="h-4 w-4" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-[#6d4c41]">{sector.nombre}</h3>
                                  <p className="text-sm text-[#8d6e63]">{sector.descripcion}</p>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-[#8d6e63]" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Información adicional */}
        {selectedSucursal && selectedSector && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-white/60 backdrop-blur-sm border-[#e0d6cf]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#a1887f]/10 rounded-full">
                      <Users className="h-6 w-6 text-[#a1887f]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#6d4c41]">
                        {selectedSucursal.nombre} - {selectedSector.nombre}
                      </h3>
                      <p className="text-[#8d6e63]">Accede a la gestión de turnos de las empleadas de este sector</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSectorSelection(selectedSector)}
                    className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SeleccionSucursalSector
