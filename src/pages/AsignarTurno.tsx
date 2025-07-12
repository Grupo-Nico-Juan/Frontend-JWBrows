"use client"

import type React from "react"
import { useEffect, useState, type FormEvent } from "react"
import axios from "@/api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {ArrowLeft,Plus,Clock,AlertCircle,Save,X,CalendarDays,Users,Building2,MapPin,Scissors,DollarSign, User, Phone, Loader2, CheckCircle,} from "lucide-react"

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
  const [initialLoading, setInitialLoading] = useState(true)
  const [horarioValido, setHorarioValido] = useState<boolean | null>(null)
  const [error, setError] = useState<string>("")

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
        setError("Error cargando datos iniciales")
      } finally {
        setInitialLoading(false)
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
        setError("Error cargando sectores")
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
        setError("Error cargando empleadas")
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
        setError("Error cargando servicios disponibles")
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
        setError("Error verificando disponibilidad de horarios")
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
    setError("")

    if (!date) {
      setError("Selecciona una fecha")
      return
    }

    if (!formData.sucursalId) {
      setError("Selecciona una sucursal")
      return
    }

    if (!formData.sectorId) {
      setError("Selecciona un sector")
      return
    }

    if (!formData.empleadaId) {
      setError("Selecciona una empleada")
      return
    }

    if (!formData.clienteId) {
      setError("Selecciona un cliente")
      return
    }

    if (formData.detalles.length === 0) {
      setError("Debes agregar al menos un servicio")
      return
    }

    if (horarioValido === false) {
      setError("El horario seleccionado no está disponible")
      return
    }

    if (horarioValido === null) {
      setError("Verifica la disponibilidad del horario")
      return
    }

    setLoading(true)

    try {
      const fechaHoraStr = `${date.toISOString().split("T")[0]}T${time}:00`
      const fechaHoraIso = new Date(fechaHoraStr).toJSON()

      const turnoData = {
        fechaHora: fechaHoraIso,
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
      setError(err.response?.data?.message || "Error al crear el turno")
    } finally {
      setLoading(false)
    }
  }

  const { duracionTotal, precioTotal } = calcularTotales()
  const horariosEmpleada = getHorariosDisponiblesParaEmpleada()

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#a1887f]" />
            <span className="text-[#6d4c41] font-medium">Cargando...</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg border border-[#e0d6cf] p-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/menu-admin")}
              className="text-[#8d6e63] hover:text-[#6d4c41] hover:bg-[#f3e5e1]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#a1887f] rounded-lg">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#6d4c41]">Crear Nuevo Turno</h1>
                <p className="text-[#8d6e63]">Completa la información para agendar un nuevo turno</p>
              </div>
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

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fecha y Hora */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardHeader>
                <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Fecha y Hora
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#6d4c41] flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Fecha
                    </Label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between font-normal border-[#e0d6cf] focus:border-[#a1887f] bg-transparent"
                        >
                          {date ? date.toLocaleDateString() : "Seleccionar fecha"}
                          <CalendarDays className="h-4 w-4" />
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
                    <Label className="text-[#6d4c41] flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Hora
                    </Label>
                    <div className="relative">
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={`border-[#e0d6cf] focus:border-[#a1887f] ${
                          horarioValido === false ? "border-red-500" : horarioValido === true ? "border-green-500" : ""
                        }`}
                      />
                      {loadingHorarios && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-[#a1887f]" />
                        </div>
                      )}
                    </div>

                    {/* Indicador de disponibilidad */}
                    {horarioValido === true && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle className="h-3 w-3" />
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
              </CardContent>
            </Card>

            {/* Ubicación */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardHeader>
                <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#6d4c41] flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Sucursal
                    </Label>
                    <Select
                      value={formData.sucursalId === 0 ? "" : String(formData.sucursalId)}
                      onValueChange={(value) => setFormData({ ...formData, sucursalId: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="border-[#e0d6cf] focus:border-[#a1887f]">
                        <SelectValue placeholder="Seleccionar sucursal" />
                      </SelectTrigger>
                      <SelectContent>
                        {sucursales.map((sucursal) => (
                          <SelectItem key={sucursal.id} value={String(sucursal.id)}>
                            {sucursal.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#6d4c41] flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Sector
                    </Label>
                    <Select
                      value={formData.sectorId === 0 ? "" : String(formData.sectorId)}
                      onValueChange={(value) => setFormData({ ...formData, sectorId: Number.parseInt(value) })}
                      disabled={!formData.sucursalId || loadingSectores}
                    >
                      <SelectTrigger className="border-[#e0d6cf] focus:border-[#a1887f]">
                        <SelectValue placeholder={loadingSectores ? "Cargando sectores..." : "Seleccionar sector"} />
                      </SelectTrigger>
                      <SelectContent>
                        {sectores.map((sector) => (
                          <SelectItem key={sector.id} value={String(sector.id)}>
                            {sector.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!formData.sucursalId && <p className="text-sm text-[#8d6e63]">Primero selecciona una sucursal</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cliente y Empleada */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardHeader>
                <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Cliente y Empleada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#6d4c41] flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Cliente
                    </Label>
                    <Select
                      value={formData.clienteId === 0 ? "" : String(formData.clienteId)}
                      onValueChange={(value) => setFormData({ ...formData, clienteId: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="border-[#e0d6cf] focus:border-[#a1887f]">
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={String(cliente.id)}>
                            <div className="flex items-center gap-2">
                              <span>
                                {cliente.nombre} {cliente.apellido}
                              </span>
                              <Phone className="h-3 w-3 text-[#8d6e63]" />
                              <span className="text-[#8d6e63]">{cliente.telefono}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#6d4c41] flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Empleada
                    </Label>
                    <Select
                      value={formData.empleadaId === 0 ? "" : String(formData.empleadaId)}
                      onValueChange={(value) => setFormData({ ...formData, empleadaId: Number.parseInt(value) })}
                      disabled={!formData.sectorId || loadingEmpleadas}
                    >
                      <SelectTrigger className="border-[#e0d6cf] focus:border-[#a1887f]">
                        <SelectValue
                          placeholder={loadingEmpleadas ? "Cargando empleadas..." : "Seleccionar empleada"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {empleadas.map((empleada) => (
                          <SelectItem key={empleada.id} value={String(empleada.id)}>
                            {empleada.nombre} {empleada.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!formData.sectorId && <p className="text-sm text-[#8d6e63]">Primero selecciona un sector</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Servicios */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardHeader>
                <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Servicios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mensaje informativo sobre la dependencia empleada-servicios */}
                {formData.sectorId && !formData.empleadaId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      💡 Los servicios disponibles dependen de las habilidades de la empleada seleccionada
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Select
                    value={servicioSeleccionado === 0 ? "" : String(servicioSeleccionado)}
                    onValueChange={(value) => setServicioSeleccionado(Number.parseInt(value))}
                    disabled={!formData.empleadaId || loadingServicios}
                  >
                    <SelectTrigger className="flex-1 border-[#e0d6cf] focus:border-[#a1887f]">
                      <SelectValue
                        placeholder={
                          !formData.empleadaId
                            ? "Selecciona una empleada primero"
                            : loadingServicios
                              ? "Cargando servicios..."
                              : servicios.length === 0
                                ? "No hay servicios disponibles para esta empleada"
                                : "Seleccionar servicio"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {servicios.map((servicio) => (
                        <SelectItem key={servicio.id} value={String(servicio.id)}>
                          <div className="flex items-center gap-2">
                            <span>{servicio.nombre}</span>
                            <Clock className="h-3 w-3 text-[#8d6e63]" />
                            <span className="text-[#8d6e63]">{servicio.duracionMinutos}min</span>
                            <DollarSign className="h-3 w-3 text-[#8d6e63]" />
                            <span className="text-[#8d6e63]">${servicio.precio}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={handleAgregarServicio}
                    disabled={!servicioSeleccionado || loadingServicios}
                    className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Lista de servicios agregados */}
                {formData.detalles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-[#6d4c41]">Servicios agregados:</h4>
                    <div className="space-y-2">
                      {formData.detalles.map((detalle, index) => {
                        const servicio = servicios.find((s) => s.id === detalle.servicioId)
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-[#f3e5e1]/50 p-3 rounded-lg border border-[#e0d6cf]"
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary" className="bg-[#a1887f] text-white">
                                {index + 1}
                              </Badge>
                              <div>
                                <p className="font-medium text-[#6d4c41]">{servicio?.nombre}</p>
                                <div className="flex items-center gap-3 text-sm text-[#8d6e63]">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {servicio?.duracionMinutos} min
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />${servicio?.precio}
                                  </div>
                                </div>
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
                    <div className="bg-[#a1887f]/10 p-4 rounded-lg border border-[#e0d6cf] mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#6d4c41]">Total:</span>
                        <div className="text-right">
                          <p className="font-semibold text-[#6d4c41] text-lg">${precioTotal}</p>
                          <p className="text-sm text-[#8d6e63]">{duracionTotal} minutos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Horarios disponibles */}
            {horariosEmpleada.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
                <CardHeader>
                  <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Horarios Disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {horariosEmpleada.map((horario, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setTime(formatearHora(horario.fechaHoraInicio).slice(0, 5))}
                        className="text-xs border-[#e0d6cf] hover:bg-[#f3e5e1] hover:border-[#a1887f]"
                      >
                        {formatearHora(horario.fechaHoraInicio)} - {formatearHora(horario.fechaHoraFin)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
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

            {/* Botones de acción */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardContent className="pt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/menu-admin")}
                    disabled={loading}
                    className="border-[#e0d6cf] text-[#8d6e63] hover:bg-[#f3e5e1] hover:text-[#6d4c41]"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || horarioValido === false || horarioValido === null}
                    className="bg-[#a1887f] hover:bg-[#8d6e63] text-white min-w-[140px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Crear Turno
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AsignarTurno
