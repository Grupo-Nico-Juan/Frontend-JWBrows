"use client"

import type React from "react"
import { useEffect, useState, type FormEvent } from "react"
import axios from "../api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDownIcon, X, Plus, Clock, AlertCircle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Empleada {
  id: number
  nombre: string
  apellido: string
  sectorId: number
  email?: string
  cargo?: string
}

interface Servicio {
  id: number
  nombre: string
  duracionMinutos: number
  precio: number
  sectorId: number
}

interface Sucursal {
  id: number
  nombre: string
  direccion: string
}

interface Sector {
  id: number
  nombre: string
  sucursalId: number
}

interface Cliente {
  id: number
  nombre: string
  apellido: string
  telefono: string
}

interface DetalleTurno {
  servicioId: number
  extrasIds: number[]
}

interface FormData {
  fechaHora: string
  empleadaId: number
  clienteId: number
  sucursalId: number
  sectorId: number
  detalles: DetalleTurno[]
}

interface HorarioDisponible {
  fechaHoraInicio: string
  fechaHoraFin: string
  empleadasDisponibles: Empleada[]
}

interface HorarioOcupado {
  fechaHoraInicio: string
  fechaHoraFin: string
}

const AsignarTurno: React.FC = () => {
  const navigate = useNavigate()
  const [empleadas, setEmpleadas] = useState<Empleada[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [sectores, setSectores] = useState<Sector[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [horariosDisponibles, setHorariosDisponibles] = useState<HorarioDisponible[]>([])
  const [horariosOcupados, setHorariosOcupados] = useState<HorarioOcupado[]>([])

  const [formData, setFormData] = useState<FormData>({
    fechaHora: "",
    empleadaId: 0,
    clienteId: 0,
    sucursalId: 0,
    sectorId: 0,
    detalles: [],
  })

  const [servicioSeleccionado, setServicioSeleccionado] = useState<number>(0)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("10:00")
  const [loading, setLoading] = useState(false)
  const [loadingEmpleadas, setLoadingEmpleadas] = useState(false)
  const [loadingSectores, setLoadingSectores] = useState(false)
  const [loadingServicios, setLoadingServicios] = useState(false)
  const [loadingHorarios, setLoadingHorarios] = useState(false)
  const [horarioValido, setHorarioValido] = useState<boolean | null>(null)

  // Cargar datos iniciales (sucursales y clientes)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [sucursalesRes, clientesRes] = await Promise.all([
          axios.get<Sucursal[]>("/api/Sucursal"),
          axios.get<Cliente[]>("/api/Cliente"),
        ])

        setSucursales(sucursalesRes.data)
        setClientes(clientesRes.data)
      } catch (err) {
        console.error("Error cargando datos iniciales:", err)
        toast.error("Error cargando datos iniciales")
      }
    }

    fetchInitialData()
  }, [])

  // Cargar sectores cuando se selecciona una sucursal
  useEffect(() => {
    const fetchSectores = async () => {
      if (!formData.sucursalId) {
        setSectores([])
        setEmpleadas([])
        setServicios([])
        setHorariosDisponibles([])
        setHorariosOcupados([])
        setFormData((prev) => ({ ...prev, sectorId: 0, empleadaId: 0 }))
        return
      }

      setLoadingSectores(true)
      try {
        const response = await axios.get<Sector[]>(`/api/Sector/sucursal/${formData.sucursalId}`)
        setSectores(response.data)

        // Limpiar selecciones dependientes
        setEmpleadas([])
        setServicios([])
        setHorariosDisponibles([])
        setHorariosOcupados([])
        setFormData((prev) => ({ ...prev, sectorId: 0, empleadaId: 0 }))
      } catch (err) {
        console.error("Error cargando sectores:", err)
        toast.error("Error cargando sectores")
        setSectores([])
      } finally {
        setLoadingSectores(false)
      }
    }

    fetchSectores()
  }, [formData.sucursalId])

  // Cargar empleadas cuando se selecciona un sector
  useEffect(() => {
    const fetchEmpleadas = async () => {
      if (!formData.sectorId) {
        setEmpleadas([])
        setServicios([])
        setHorariosDisponibles([])
        setHorariosOcupados([])
        setFormData((prev) => ({ ...prev, empleadaId: 0 }))
        return
      }

      setLoadingEmpleadas(true)
      try {
        const response = await axios.get<Empleada[]>(`/api/Empleado/sector/${formData.sectorId}/empleadas`)
        setEmpleadas(response.data)

        // Limpiar servicios y empleada seleccionada
        setServicios([])
        setHorariosDisponibles([])
        setHorariosOcupados([])
        setFormData((prev) => ({ ...prev, empleadaId: 0 }))
      } catch (err) {
        console.error("Error cargando empleadas:", err)
        toast.error("Error cargando empleadas")
        setEmpleadas([])
      } finally {
        setLoadingEmpleadas(false)
      }
    }

    fetchEmpleadas()
  }, [formData.sectorId])

  // Cargar servicios cuando se selecciona una empleada (usando el nuevo endpoint)
  useEffect(() => {
    const fetchServicios = async () => {
      if (!formData.sectorId || !formData.empleadaId) {
        setServicios([])
        return
      }

      setLoadingServicios(true)
      try {
        // Usar el nuevo endpoint POST /api/Servicio/disponibles
        const response = await axios.post<Servicio[]>("/api/Servicio/disponibles", {
          sectorId: formData.sectorId,
          empleadaId: formData.empleadaId,
        })

        setServicios(response.data)
      } catch (err) {
        console.error("Error cargando servicios:", err)
        toast.error("Error cargando servicios disponibles")
        setServicios([])
      } finally {
        setLoadingServicios(false)
      }
    }

    fetchServicios()
  }, [formData.sectorId, formData.empleadaId])

  // Verificar horarios disponibles cuando cambian fecha, servicios o empleada
  useEffect(() => {
    const verificarHorarios = async () => {
      if (!date || !formData.sucursalId || formData.detalles.length === 0) {
        setHorariosDisponibles([])
        setHorariosOcupados([])
        setHorarioValido(null)
        return
      }

      setLoadingHorarios(true)
      try {
        const servicioIds = formData.detalles.map((d) => d.servicioId)
        const extraIds = formData.detalles.flatMap((d) => d.extrasIds)

        const requestData = {
          sucursalId: formData.sucursalId,
          fecha: date.toISOString(),
          servicioIds: servicioIds,
          extraIds: extraIds,
        }

        const [horariosDispRes, horariosOcupRes] = await Promise.all([
          axios.post<HorarioDisponible[]>("/api/Turnos/horarios-disponibles", requestData),
          axios.post<HorarioOcupado[]>("/api/Turnos/horarios-ocupados", requestData),
        ])

        setHorariosDisponibles(horariosDispRes.data)
        setHorariosOcupados(horariosOcupRes.data)

        // Verificar si el horario actual es válido
        if (time && formData.empleadaId) {
          verificarHorarioSeleccionado(horariosDispRes.data, horariosOcupRes.data)
        }
      } catch (err) {
        console.error("Error verificando horarios:", err)
        toast.error("Error verificando disponibilidad de horarios")
        setHorariosDisponibles([])
        setHorariosOcupados([])
      } finally {
        setLoadingHorarios(false)
      }
    }

    verificarHorarios()
  }, [date, formData.sucursalId, formData.detalles, formData.empleadaId, time])

  const verificarHorarioSeleccionado = (disponibles: HorarioDisponible[], ocupados: HorarioOcupado[]) => {
    if (!date || !time || !formData.empleadaId) {
      setHorarioValido(null)
      return
    }

    const fechaHoraSeleccionada = new Date(`${date.toISOString().split("T")[0]}T${time}:00`)

    // Verificar si está en horarios ocupados
    const estaOcupado = ocupados.some((ocupado) => {
      const inicio = new Date(ocupado.fechaHoraInicio)
      const fin = new Date(ocupado.fechaHoraFin)
      return fechaHoraSeleccionada >= inicio && fechaHoraSeleccionada < fin
    })

    if (estaOcupado) {
      setHorarioValido(false)
      return
    }

    // Verificar si está en horarios disponibles y la empleada está disponible
    const horarioDisponible = disponibles.find((disponible) => {
      const inicio = new Date(disponible.fechaHoraInicio)
      const fin = new Date(disponible.fechaHoraFin)
      const empleadaDisponible = disponible.empleadasDisponibles.some((emp) => emp.id === formData.empleadaId)

      return fechaHoraSeleccionada >= inicio && fechaHoraSeleccionada < fin && empleadaDisponible
    })

    setHorarioValido(!!horarioDisponible)
  }

  const handleAgregarServicio = () => {
    if (!servicioSeleccionado) {
      toast.warning("Selecciona un servicio")
      return
    }

    // Verificar si el servicio ya está agregado
    if (formData.detalles.some((d) => d.servicioId === servicioSeleccionado)) {
      toast.warning("Este servicio ya está agregado")
      return
    }

    const nuevoDetalle: DetalleTurno = {
      servicioId: servicioSeleccionado,
      extrasIds: [],
    }

    setFormData((prev) => ({
      ...prev,
      detalles: [...prev.detalles, nuevoDetalle],
    }))

    setServicioSeleccionado(0)
    toast.success("Servicio agregado")
  }

  const handleEliminarServicio = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index),
    }))
    toast.success("Servicio eliminado")
  }

  const calcularTotales = () => {
    let duracionTotal = 0
    let precioTotal = 0

    formData.detalles.forEach((detalle) => {
      const servicio = servicios.find((s) => s.id === detalle.servicioId)
      if (servicio) {
        duracionTotal += servicio.duracionMinutos
        precioTotal += servicio.precio
      }
    })

    return { duracionTotal, precioTotal }
  }

  const getHorariosDisponiblesParaEmpleada = () => {
    if (!formData.empleadaId) return []

    return horariosDisponibles.filter((horario) =>
      horario.empleadasDisponibles.some((emp) => emp.id === formData.empleadaId),
    )
  }

  const formatearHora = (fechaHora: string) => {
    return new Date(fechaHora).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!date) {
      toast.error("Selecciona una fecha")
      return
    }

    if (!formData.sucursalId) {
      toast.error("Selecciona una sucursal")
      return
    }

    if (!formData.sectorId) {
      toast.error("Selecciona un sector")
      return
    }

    if (!formData.empleadaId) {
      toast.error("Selecciona una empleada")
      return
    }

    if (!formData.clienteId) {
      toast.error("Selecciona un cliente")
      return
    }

    if (formData.detalles.length === 0) {
      toast.error("Debes agregar al menos un servicio")
      return
    }

    if (horarioValido === false) {
      toast.error("El horario seleccionado no está disponible")
      return
    }

    if (horarioValido === null) {
      toast.error("Verifica la disponibilidad del horario")
      return
    }

    setLoading(true)

    try {
      const fechaHoraStr = `${date.toISOString().split("T")[0]}T${time}:00`

      const turnoData = {
        fechaHora: fechaHoraStr,
        empleadaId: formData.empleadaId,
        clienteId: formData.clienteId,
        sucursalId: formData.sucursalId,
        sectorId: formData.sectorId,
        detalles: formData.detalles.map((detalle) => ({
          turnoId: 0, // Se asigna automáticamente
          servicioId: detalle.servicioId,
          extrasIds: detalle.extrasIds,
        })),
      }

      await axios.post("/api/Turnos", turnoData)

      toast.success("Turno creado exitosamente")
      // Limpiar formulario para permitir crear otro turno
      setFormData({
        fechaHora: "",
        empleadaId: 0,
        clienteId: 0,
        sucursalId: 0,
        sectorId: 0,
        detalles: [],
      })
      setDate(undefined)
      setTime("10:00")
      setServicioSeleccionado(0)
      setHorarioValido(null)
    } catch (err: any) {
      console.error("Error creando turno:", err)
      toast.error(err.response?.data?.message || "Error al crear el turno")
    } finally {
      setLoading(false)
    }
  }

  const { duracionTotal, precioTotal } = calcularTotales()
  const horariosEmpleada = getHorariosDisponiblesParaEmpleada()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1] p-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-[#fffaf5] border border-[#e6dcd4] shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6e4b3a] flex items-center gap-2">
              <Plus className="h-6 w-6" />
              Crear Nuevo Turno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Fecha y Hora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6e4b3a]">Fecha</label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between font-normal bg-transparent">
                        {date ? date.toLocaleDateString() : "Seleccionar fecha"}
                        <ChevronDownIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                          setDate(date)
                          setCalendarOpen(false)
                        }}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6e4b3a]">Hora</label>
                  <div className="relative">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={`bg-background ${
                        horarioValido === false ? "border-red-500" : horarioValido === true ? "border-green-500" : ""
                      }`}
                    />
                    {loadingHorarios && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6e4b3a]"></div>
                      </div>
                    )}
                  </div>

                  {/* Indicador de disponibilidad */}
                  {horarioValido === true && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Clock className="h-3 w-3" />
                      Horario disponible
                    </div>
                  )}
                  {horarioValido === false && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      Horario no disponible
                    </div>
                  )}
                </div>
              </div>

              {/* Sucursal y Sector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6e4b3a]">Sucursal</label>
                  <select
                    value={formData.sucursalId}
                    onChange={(e) => setFormData({ ...formData, sucursalId: Number.parseInt(e.target.value) })}
                    className="w-full border rounded-md px-3 py-2 bg-background"
                    required
                  >
                    <option value={0}>Seleccionar sucursal</option>
                    {sucursales.map((sucursal) => (
                      <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6e4b3a]">Sector</label>
                  <select
                    value={formData.sectorId}
                    onChange={(e) => setFormData({ ...formData, sectorId: Number.parseInt(e.target.value) })}
                    className="w-full border rounded-md px-3 py-2 bg-background"
                    required
                    disabled={!formData.sucursalId || loadingSectores}
                  >
                    <option value={0}>{loadingSectores ? "Cargando sectores..." : "Seleccionar sector"}</option>
                    {sectores.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cliente y Empleada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6e4b3a]">Cliente</label>
                  <select
                    value={formData.clienteId}
                    onChange={(e) => setFormData({ ...formData, clienteId: Number.parseInt(e.target.value) })}
                    className="w-full border rounded-md px-3 py-2 bg-background"
                    required
                  >
                    <option value={0}>Seleccionar cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellido} - {cliente.telefono}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6e4b3a]">Empleada</label>
                  <select
                    value={formData.empleadaId}
                    onChange={(e) => setFormData({ ...formData, empleadaId: Number.parseInt(e.target.value) })}
                    className="w-full border rounded-md px-3 py-2 bg-background"
                    required
                    disabled={!formData.sectorId || loadingEmpleadas}
                  >
                    <option value={0}>{loadingEmpleadas ? "Cargando empleadas..." : "Seleccionar empleada"}</option>
                    {empleadas.map((empleada) => (
                      <option key={empleada.id} value={empleada.id}>
                        {empleada.nombre} {empleada.apellido}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Servicios */}
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-[#6e4b3a] mb-4">Servicios</h3>

                  {/* Mensaje informativo sobre la dependencia empleada-servicios */}
                  {formData.sectorId && !formData.empleadaId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-700">
                        💡 Los servicios disponibles dependen de las habilidades de la empleada seleccionada
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mb-4">
                    <select
                      value={servicioSeleccionado}
                      onChange={(e) => setServicioSeleccionado(Number.parseInt(e.target.value))}
                      className="flex-1 border rounded-md px-3 py-2 bg-background"
                      disabled={!formData.empleadaId || loadingServicios}
                    >
                      <option value={0}>
                        {!formData.empleadaId
                          ? "Selecciona una empleada primero"
                          : loadingServicios
                            ? "Cargando servicios..."
                            : servicios.length === 0
                              ? "No hay servicios disponibles para esta empleada"
                              : "Seleccionar servicio"}
                      </option>
                      {servicios.map((servicio) => (
                        <option key={servicio.id} value={servicio.id}>
                          {servicio.nombre} - {servicio.duracionMinutos}min - ${servicio.precio}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      onClick={handleAgregarServicio}
                      disabled={!servicioSeleccionado || loadingServicios}
                      className="bg-[#6e4b3a] hover:bg-[#5a3d2e]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Lista de servicios agregados */}
                  {formData.detalles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-[#6e4b3a]">Servicios agregados:</h4>
                      <div className="space-y-2">
                        {formData.detalles.map((detalle, index) => {
                          const servicio = servicios.find((s) => s.id === detalle.servicioId)
                          return (
                            <div key={index} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary">{index + 1}</Badge>
                                <div>
                                  <p className="font-medium">{servicio?.nombre}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {servicio?.duracionMinutos} min - ${servicio?.precio}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEliminarServicio(index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>

                      {/* Resumen */}
                      <div className="bg-[#6e4b3a]/10 p-4 rounded-lg mt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-[#6e4b3a]">Total:</span>
                          <div className="text-right">
                            <p className="font-semibold text-[#6e4b3a]">${precioTotal}</p>
                            <p className="text-sm text-muted-foreground">{duracionTotal} minutos</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Horarios disponibles */}
              {horariosEmpleada.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[#6e4b3a]">Horarios disponibles para la empleada:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {horariosEmpleada.map((horario, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setTime(formatearHora(horario.fechaHoraInicio).slice(0, 5))}
                        className="text-xs"
                      >
                        {formatearHora(horario.fechaHoraInicio)} - {formatearHora(horario.fechaHoraFin)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Alerta de validación */}
              {horarioValido === false && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    El horario seleccionado no está disponible. Por favor, elige otro horario o verifica la
                    disponibilidad.
                  </AlertDescription>
                </Alert>
              )}

              {/* Botones */}
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate("/menu-admin")} disabled={loading}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || horarioValido === false || horarioValido === null}
                  className="bg-[#6e4b3a] hover:bg-[#5a3d2e] min-w-[120px]"
                >
                  {loading ? "Creando..." : "Crear Turno"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AsignarTurno
