"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { useTurno } from "@/context/TurnoContext"
import ImagenServicio from "@/assets/jmbrows.jpg"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  DollarSign,
  Plus,
  ShoppingCart,
  ArrowRight,
  Star,
  Sparkles,
  Check,
  X,
  Loader2,
  AlertCircle,
  Building2,
} from "lucide-react"

interface Extra {
  id: number
  nombre: string
  duracionMinutos: number
  precio: number
}

interface Servicio {
  id: number
  nombre: string
  descripcion?: string
  duracionMinutos: number
  precio: number
  extras?: Extra[]
}

interface Sector {
  id: number
  nombre: string
  descripcion?: string
  sucursalId: number
  servicios: Servicio[]
}

const SeleccionServicio: React.FC = () => {
  const [sectores, setSectores] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [sectorActivo, setSectorActivo] = useState<string>("")
  const [servicioExtras, setServicioExtras] = useState<Servicio | null>(null)
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<Extra[]>([])
  const navigate = useNavigate()
  const { agregarDetalle, agregarDetalles, quitarDetalle, sucursal, servicios } = useTurno()

  useEffect(() => {
    if (!sucursal) {
      navigate("/reserva/sucursal")
      return
    }

    const fetchSectores = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/api/Sector/sucursal/${sucursal.id}`)
        setSectores(response.data)
        if (response.data.length > 0) {
          setSectorActivo(response.data[0].id.toString())
        }
      } catch (err) {
        setError("Error al cargar los servicios. Por favor, intenta nuevamente.")
        console.error("Error cargando sectores", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSectores()
  }, [sucursal, navigate])

  const toggleServicio = (servicio: Servicio) => {
    const yaSeleccionado = servicios.some((s) => s.id === servicio.id)

    if (yaSeleccionado) {
      quitarDetalle(servicio.id)
    } else {
      agregarDetalle(servicio)
      // Si tiene extras, mostrar modal
      if (servicio.extras && servicio.extras.length > 0) {
        setServicioExtras(servicio)
        setExtrasSeleccionados([])
      }
    }
  }

  const toggleExtra = (extra: Extra) => {
    const yaSeleccionado = extrasSeleccionados.some((e) => e.id === extra.id)
    if (yaSeleccionado) {
      setExtrasSeleccionados((prev) => prev.filter((e) => e.id !== extra.id))
    } else {
      setExtrasSeleccionados((prev) => [...prev, extra])
    }
  }

  const confirmarExtras = () => {
    if (extrasSeleccionados.length > 0) {
      agregarDetalles(extrasSeleccionados)
    }
    setServicioExtras(null)
    setExtrasSeleccionados([])
  }

  const totalPrecio = servicios.reduce((sum, s) => sum + s.precio, 0)
  const totalDuracion = servicios.reduce((sum, s) => sum + s.duracionMinutos, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center p-4">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf] max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="p-4 bg-[#a1887f]/10 rounded-full w-fit mx-auto">
              <Loader2 className="h-8 w-8 animate-spin text-[#a1887f]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">Cargando servicios</h3>
              <p className="text-[#8d6e63]">Preparando los mejores tratamientos para ti...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border-b border-[#e0d6cf] sticky top-0 z-20"
      >
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-3 bg-[#a1887f]/10 rounded-full px-4 py-2 mb-3">
                <Building2 className="h-5 w-5 text-[#a1887f]" />
                <span className="text-[#6d4c41] font-medium">Paso 2 de 4</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#6d4c41] mb-2">Elegí tus servicios</h1>
              <p className="text-[#8d6e63]">
                Seleccioná los tratamientos que deseas en <span className="font-medium">{sucursal?.nombre}</span>
              </p>
            </div>
            {servicios.length > 0 && (
              <div className="hidden lg:flex items-center gap-4 bg-[#f8f0ec] rounded-lg p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-[#6d4c41]">{servicios.length}</div>
                  <div className="text-xs text-[#8d6e63]">Servicios</div>
                </div>
                <div className="w-px h-8 bg-[#e0d6cf]" />
                <div className="text-center">
                  <div className="text-lg font-bold text-[#6d4c41]">{totalDuracion}min</div>
                  <div className="text-xs text-[#8d6e63]">Duración</div>
                </div>
                <div className="w-px h-8 bg-[#e0d6cf]" />
                <div className="text-center">
                  <div className="text-lg font-bold text-[#6d4c41]">${totalPrecio}</div>
                  <div className="text-xs text-[#8d6e63]">Total</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto p-6 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs value={sectorActivo} onValueChange={setSectorActivo} className="space-y-6">
            {/* Navegación de sectores */}
            <Card className="bg-white/60 backdrop-blur-sm border-[#e0d6cf]">
              <CardContent className="p-4">
                <TabsList className="grid w-full grid-cols-1 lg:grid-cols-4 gap-2 bg-transparent h-auto p-0">
                  {sectores.map((sector) => (
                    <TabsTrigger
                      key={sector.id}
                      value={sector.id.toString()}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#e0d6cf] bg-white data-[state=active]:bg-[#a1887f] data-[state=active]:text-white data-[state=active]:border-[#a1887f] transition-all"
                    >
                      <Sparkles className="h-5 w-5" />
                      <div className="text-center">
                        <div className="font-medium">{sector.nombre}</div>
                        <div className="text-xs opacity-75">{sector.servicios.length} servicios</div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardContent>
            </Card>

            {/* Servicios por sector */}
            {sectores.map((sector) => (
              <TabsContent key={sector.id} value={sector.id.toString()} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-[#6d4c41] mb-2">{sector.nombre}</h2>
                        {sector.descripcion && <p className="text-[#8d6e63]">{sector.descripcion}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sector.servicios.map((servicio, index) => {
                          const yaSeleccionado = servicios.some((s) => s.id === servicio.id)

                          return (
                            <motion.div
                              key={servicio.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="group"
                            >
                              <Card
                                className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                                  yaSeleccionado
                                    ? "border-2 border-[#a1887f] shadow-lg scale-105"
                                    : "border border-[#e0d6cf] hover:border-[#d2bfae] hover:shadow-md hover:scale-102"
                                }`}
                                onClick={() => toggleServicio(servicio)}
                              >
                                <div className="relative">
                                  <img
                                    src={ImagenServicio || "/placeholder.svg"}
                                    alt={servicio.nombre}
                                    className="h-48 w-full object-cover"
                                  />
                                  {yaSeleccionado && (
                                    <div className="absolute top-3 right-3 bg-[#a1887f] text-white rounded-full p-2">
                                      <Check className="h-4 w-4" />
                                    </div>
                                  )}
                                  {servicio.extras && servicio.extras.length > 0 && (
                                    <Badge className="absolute top-3 left-3 bg-[#8d6e63] text-white">
                                      <Plus className="h-3 w-3 mr-1" />
                                      Extras
                                    </Badge>
                                  )}
                                </div>

                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    <div>
                                      <h3 className="font-semibold text-[#6d4c41] text-lg">{servicio.nombre}</h3>
                                      {servicio.descripcion && (
                                        <p className="text-sm text-[#8d6e63] mt-1">{servicio.descripcion}</p>
                                      )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-[#8d6e63]">
                                          <Clock className="h-4 w-4" />
                                          <span className="text-sm">{servicio.duracionMinutos}min</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[#8d6e63]">
                                          <DollarSign className="h-4 w-4" />
                                          <span className="text-sm font-medium">${servicio.precio}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        ))}
                                      </div>
                                    </div>

                                    <Button
                                      className={`w-full transition-all duration-300 ${
                                        yaSeleccionado
                                          ? "bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                                          : "bg-transparent border-2 border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white"
                                      }`}
                                    >
                                      {yaSeleccionado ? (
                                        <>
                                          <Check className="h-4 w-4 mr-2" />
                                          Seleccionado
                                        </>
                                      ) : (
                                        <>
                                          <Plus className="h-4 w-4 mr-2" />
                                          Agregar servicio
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>

      {/* Menú fijo inferior */}
      <AnimatePresence>
        {servicios.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#e0d6cf] shadow-lg z-30"
          >
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-[#a1887f]" />
                    <span className="font-medium text-[#6d4c41]">{servicios.length} servicios</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-sm text-[#8d6e63]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{totalDuracion} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">${totalPrecio}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/reserva/fecha-hora")}
                  className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Resumen móvil */}
              <div className="sm:hidden mt-3 pt-3 border-t border-[#e0d6cf] flex justify-between text-sm">
                <div className="flex items-center gap-1 text-[#8d6e63]">
                  <Clock className="h-4 w-4" />
                  <span>{totalDuracion} min</span>
                </div>
                <div className="flex items-center gap-1 text-[#6d4c41] font-medium">
                  <DollarSign className="h-4 w-4" />
                  <span>${totalPrecio}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de extras */}
      <Dialog open={!!servicioExtras} onOpenChange={() => setServicioExtras(null)}>
        <DialogContent className="max-w-md bg-white border-[#e0d6cf]">
          <DialogHeader>
            <DialogTitle className="text-[#6d4c41] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#a1887f]" />
              Extras para {servicioExtras?.nombre}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-[#8d6e63] text-sm">Mejorá tu experiencia agregando estos extras opcionales:</p>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {servicioExtras?.extras?.map((extra) => {
                const yaSeleccionado = extrasSeleccionados.some((e) => e.id === extra.id)

                return (
                  <div
                    key={extra.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      yaSeleccionado ? "border-[#a1887f] bg-[#a1887f]/5" : "border-[#e0d6cf] hover:border-[#d2bfae]"
                    }`}
                    onClick={() => toggleExtra(extra)}
                  >
                    <Checkbox checked={yaSeleccionado} onChange={() => toggleExtra(extra)} />
                    <div className="flex-1">
                      <div className="font-medium text-[#6d4c41]">{extra.nombre}</div>
                      <div className="text-sm text-[#8d6e63] flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {extra.duracionMinutos}min
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />${extra.precio}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {extrasSeleccionados.length > 0 && (
              <div className="bg-[#f8f0ec] rounded-lg p-3 border border-[#e0d6cf]">
                <div className="text-sm text-[#6d4c41] font-medium mb-1">Resumen de extras:</div>
                <div className="text-sm text-[#8d6e63] flex justify-between">
                  <span>
                    {extrasSeleccionados.length} extra{extrasSeleccionados.length > 1 ? "s" : ""} •{" "}
                    {extrasSeleccionados.reduce((sum, e) => sum + e.duracionMinutos, 0)} min
                  </span>
                  <span className="font-medium">+${extrasSeleccionados.reduce((sum, e) => sum + e.precio, 0)}</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setServicioExtras(null)}
              className="border-[#d2bfae] text-[#6d4c41] hover:bg-[#f8f0ec]"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={confirmarExtras} className="bg-[#a1887f] hover:bg-[#8d6e63] text-white">
              <Check className="h-4 w-4 mr-2" />
              Confirmar extras
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SeleccionServicio
