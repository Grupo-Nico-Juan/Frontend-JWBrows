"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import axios from "@/api/AxiosInstance"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Clock,
  User,
  Calendar,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Check,
} from "lucide-react"

interface Empleada {
  id: number
  nombre: string
  apellido: string
  email: string
  cargo: string
  sucursalId: number
}

interface TurnoDetalle {
  id: number
  turnoId: number
  servicioId: number
  duracionMinutos: number
  precio: number
  servicio?: {
    id: number
    nombre: string
    duracionMinutos: number
    precio: number
  }
}

interface Turno {
  id: number
  fechaHora: string
  empleadaId: number
  clienteId: number
  sucursalId: number
  sectorId: number
  realizado: boolean
  detalles: TurnoDetalle[]
  cliente?: {
    id: number
    nombre: string
    apellido: string
  }
}

const TurnosEmpleadasSector: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sucursalId = searchParams.get("sucursalId")
  const sectorId = searchParams.get("sectorId")

  const [empleadas, setEmpleadas] = useState<Empleada[]>([])
  const [selectedEmpleada, setSelectedEmpleada] = useState<Empleada | null>(null)
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loadingEmpleadas, setLoadingEmpleadas] = useState(true)
  const [loadingTurnos, setLoadingTurnos] = useState(false)
  const [processingTurno, setProcessingTurno] = useState<number | null>(null)
  const [error, setError] = useState<string>("")

  // Cargar empleadas del sector
  useEffect(() => {
    if (sectorId) {
      const fetchEmpleadas = async () => {
        setLoadingEmpleadas(true)
        try {
          const response = await axios.get(`/api/Empleado/sector/${sectorId}/empleadas`)
          setEmpleadas(response.data)
          // Seleccionar la primera empleada por defecto
          if (response.data.length > 0) {
            setSelectedEmpleada(response.data[0])
          }
        } catch (err) {
          setError("Error al cargar las empleadas")
          console.error("Error cargando empleadas", err)
        } finally {
          setLoadingEmpleadas(false)
        }
      }

      fetchEmpleadas()
    }
  }, [sectorId])

  // Cargar turnos de la empleada seleccionada
  useEffect(() => {
    if (selectedEmpleada) {
      const fetchTurnos = async () => {
        setLoadingTurnos(true)
        try {
          const response = await axios.get(`/api/Empleado/${selectedEmpleada.id}/turnos-del-dia`)
          const turnosData = response.data

          // Cargar información adicional para cada turno
          const turnosConInfo = await Promise.all(
            turnosData.map(async (turno: Turno) => {
              try {
                // Cargar información del cliente
                const clienteResponse = await axios.get(`/api/Cliente/${turno.clienteId}`)
                turno.cliente = clienteResponse.data

                // Cargar información de los servicios
                const detallesConServicios = await Promise.all(
                  turno.detalles.map(async (detalle) => {
                    try {
                      const servicioResponse = await axios.get(`/api/Servicio/${detalle.servicioId}`)
                      return {
                        ...detalle,
                        servicio: servicioResponse.data,
                      }
                    } catch (err) {
                      console.error(`Error cargando servicio ${detalle.servicioId}`, err)
                      return detalle
                    }
                  }),
                )
                turno.detalles = detallesConServicios

                return turno
              } catch (err) {
                console.error(`Error cargando información adicional para turno ${turno.id}`, err)
                return turno
              }
            }),
          )

          setTurnos(turnosConInfo)
        } catch (err) {
          setError("Error al cargar los turnos")
          console.error("Error cargando turnos", err)
        } finally {
          setLoadingTurnos(false)
        }
      }

      fetchTurnos()
    }
  }, [selectedEmpleada])

  const formatHora = (fechaHora: string) => {
    return new Date(fechaHora).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalDuracion = (detalles: TurnoDetalle[]) => {
    // Usar la duración del servicio si está disponible, sino usar la del detalle
    return detalles.reduce((total, detalle) => {
      const duracion = detalle.servicio?.duracionMinutos || detalle.duracionMinutos
      return total + duracion
    }, 0)
  }

  const getTotalPrecio = (detalles: TurnoDetalle[]) => {
    // Usar el precio del servicio si está disponible, sino usar el del detalle
    return detalles.reduce((total, detalle) => {
      const precio = detalle.servicio?.precio || detalle.precio
      return total + precio
    }, 0)
  }

  const marcarTurnoRealizado = async (turnoId: number) => {
    setProcessingTurno(turnoId)
    try {
      console.log(turnoId);
      // Llamada al endpoint para marcar el turno como realizado
      await axios.put(`/api/Turnos/${turnoId}/marcar-realizado`)

      // Actualizar el estado local
      setTurnos((prevTurnos) =>
        prevTurnos.map((turno) => (turno.id === turnoId ? { ...turno, realizado: true } : turno)),
      )

     
    } catch (err) {
      console.error("Error marcando turno como realizado", err)
    } finally {
      setProcessingTurno(null)
    }
  }

  const refreshTurnos = () => {
    if (selectedEmpleada) {
      const fetchTurnos = async () => {
        setLoadingTurnos(true)
        try {
          const response = await axios.get(`/api/Empleado/${selectedEmpleada.id}/turnos-del-dia`)
          const turnosData = response.data

          // Cargar información adicional para cada turno
          const turnosConInfo = await Promise.all(
            turnosData.map(async (turno: Turno) => {
              try {
                // Cargar información del cliente
                const clienteResponse = await axios.get(`/api/Cliente/${turno.clienteId}`)
                turno.cliente = clienteResponse.data

                // Cargar información de los servicios
                const detallesConServicios = await Promise.all(
                  turno.detalles.map(async (detalle) => {
                    try {
                      const servicioResponse = await axios.get(`/api/Servicio/${detalle.servicioId}`)
                      return {
                        ...detalle,
                        servicio: servicioResponse.data,
                      }
                    } catch (err) {
                      console.error(`Error cargando servicio ${detalle.servicioId}`, err)
                      return detalle
                    }
                  }),
                )
                turno.detalles = detallesConServicios

                return turno
              } catch (err) {
                console.error(`Error cargando información adicional para turno ${turno.id}`, err)
                return turno
              }
            }),
          )

          setTurnos(turnosConInfo)
        } catch (err) {
          setError("Error al actualizar los turnos")
        } finally {
          setLoadingTurnos(false)
        }
      }
      fetchTurnos()
    }
  }

  if (!sucursalId || !sectorId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center p-4">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf] max-w-md w-full ">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">Parámetros faltantes</h3>
              <p className="text-[#8d6e63] mb-4">No se especificó la sucursal o sector</p>
              <Button
                onClick={() => navigate("/turnos-del-dia")}
                className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
              >
                Volver a selección
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (loadingEmpleadas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center p-4">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf] max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="p-4 bg-[#a1887f]/10 rounded-full w-fit mx-auto">
              <Loader2 className="h-8 w-8 animate-spin text-[#a1887f]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">Cargando empleadas</h3>
              <p className="text-[#8d6e63]">Preparando la información del sector...</p>
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/turnos-del-dia")}
                variant="outline"
                className="border-[#a1887f] text-[#a1887f] hover:bg-[#a1887f] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#6d4c41]">Turnos del Día</h1>
                <p className="text-[#8d6e63]">
                  {new Date().toLocaleDateString("es-AR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <Button
              onClick={refreshTurnos}
              className="bg-[#a1887f] hover:bg-[#8d6e63] text-white shadow-md"
              disabled={loadingTurnos}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingTurnos ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lista de empleadas */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf] sticky top-4 pt-0">
              <CardHeader className="bg-gradient-to-r from-[#a1887f] to-[#8d6e63] text-white rounded-t-lg py-3">
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  Empleadas ({empleadas.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {empleadas.map((empleada) => (
                    <motion.div key={empleada.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedEmpleada?.id === empleada.id
                            ? "border-[#a1887f] bg-[#a1887f]/5 shadow-md"
                            : "border-[#e0d6cf] hover:border-[#d2bfae] hover:shadow-sm"
                        }`}
                        onClick={() => setSelectedEmpleada(empleada)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-[#a1887f] text-white">
                                {empleada.nombre.charAt(0)}
                                {empleada.apellido.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-[#6d4c41] truncate">
                                {empleada.nombre} {empleada.apellido}
                              </h3>
                              <p className="text-sm text-[#8d6e63] truncate">{empleada.cargo}</p>
                            </div>
                            {selectedEmpleada?.id === empleada.id && (
                              <div className="w-2 h-2 bg-[#a1887f] rounded-full" />
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

          {/* Turnos de la empleada seleccionada */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {selectedEmpleada ? (
              <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf] pt-0">
                <CardHeader className="bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] text-white rounded-t-lg py-3">
                  <CardTitle className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    Turnos de {selectedEmpleada.nombre} {selectedEmpleada.apellido}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingTurnos ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-[#a1887f] mx-auto mb-4" />
                      <p className="text-[#8d6e63]">Cargando turnos...</p>
                    </div>
                  ) : turnos.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-[#d2bfae] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">No hay turnos programados</h3>
                      <p className="text-[#8d6e63]">Esta empleada no tiene turnos asignados para hoy</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {turnos
                          .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
                          .map((turno, index) => (
                            <motion.div
                              key={turno.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Card
                                className={`border-l-4 ${
                                  turno.realizado ? "border-l-green-500 bg-green-50/50" : "border-l-[#a1887f] bg-white"
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-3">
                                        <div
                                          className={`p-2 rounded-full ${
                                            turno.realizado
                                              ? "bg-green-100 text-green-600"
                                              : "bg-[#a1887f]/10 text-[#a1887f]"
                                          }`}
                                        >
                                          <Clock className="h-4 w-4" />
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-[#6d4c41] text-lg">
                                            {formatHora(turno.fechaHora)}
                                          </h3>
                                          <p className="text-sm text-[#8d6e63]">
                                            Duración: {getTotalDuracion(turno.detalles)} min
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-full bg-[#f8f0ec] text-[#6d4c41]">
                                          <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-[#6d4c41]">
                                            {turno.cliente?.nombre} {turno.cliente?.apellido}
                                          </h4>
                                          <p className="text-sm text-[#8d6e63]">Cliente</p>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <h5 className="font-medium text-[#6d4c41] text-sm">Servicios a realizar:</h5>
                                        <div className="flex flex-wrap gap-2">
                                          {turno.detalles.map((detalle) => (
                                            <Badge
                                              key={detalle.id}
                                              variant="secondary"
                                              className="bg-[#f8f0ec] text-[#6d4c41] border border-[#e0d6cf]"
                                            >
                                              {detalle.servicio?.nombre || `Servicio ${detalle.servicioId}`}
                                              <span className="ml-1 text-xs">
                                                ({detalle.servicio?.duracionMinutos || detalle.duracionMinutos}min)
                                              </span>
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                      <Badge
                                        className={
                                          turno.realizado
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                        }
                                      >
                                        {turno.realizado ? (
                                          <>
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Realizado
                                          </>
                                        ) : (
                                          <>
                                            <Clock className="h-3 w-3 mr-1" />
                                            Pendiente
                                          </>
                                        )}
                                      </Badge>

                                      <p className="text-sm font-semibold text-[#6d4c41]">
                                        ${getTotalPrecio(turno.detalles)}
                                      </p>

                                      {/* Botón para marcar como realizado */}
                                      {!turno.realizado && (
                                        <Button
                                          onClick={() => marcarTurnoRealizado(turno.id)}
                                          disabled={processingTurno === turno.id}
                                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-8"
                                        >
                                          {processingTurno === turno.id ? (
                                            <>
                                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                              Procesando...
                                            </>
                                          ) : (
                                            <>
                                              <Check className="h-3 w-3 mr-1" />
                                              Marcar Realizado
                                            </>
                                          )}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-[#d2bfae] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#6d4c41] mb-2">Selecciona una empleada</h3>
                  <p className="text-[#8d6e63]">Elige una empleada de la lista para ver sus turnos del día</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TurnosEmpleadasSector
