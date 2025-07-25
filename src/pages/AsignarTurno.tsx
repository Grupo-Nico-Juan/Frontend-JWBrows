"use client"

import type React from "react"
import { useEffect, useState, type FormEvent } from "react"
import axios from "@/api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { ArrowLeft, Save, X, CalendarDays, AlertCircle, Loader2 } from "lucide-react"

// Componentes específicos
import FechaHoraSection from "@/components/turnos/fecha-hora-section"
import UbicacionSection from "@/components/turnos/ubicacion-section"
import ClienteEmpleadaSection from "@/components/turnos/cliente-empleada-section"
import ServiciosSection from "@/components/turnos/servicios-section"
import HorariosDisponibles from "@/components/turnos/horarios-disponibles"
import NuevoClienteModal from "@/components/turnos/nuevo-cliente-modal"

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

interface NuevoClienteData {
  nombre: string
  apellido: string
  telefono: string
  email?: string
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

  // Estados para el modal de nuevo cliente
  const [modalClienteOpen, setModalClienteOpen] = useState(false)
  const [loadingNuevoCliente, setLoadingNuevoCliente] = useState(false)

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

  // Cargar servicios cuando se selecciona una empleada
  useEffect(() => {
    const fetchServicios = async () => {
      if (!formData.sectorId || !formData.empleadaId) {
        setServicios([])
        return
      }

      setLoadingServicios(true)
      try {
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

  // Verificar horarios disponibles
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

    // Verificar si está ocupado
    const estaOcupado = ocupados.some((ocupado) => {
      const inicio = new Date(ocupado.fechaHoraInicio)
      const fin = new Date(ocupado.fechaHoraFin)
      return fechaHoraSeleccionada >= inicio && fechaHoraSeleccionada < fin
    })

    if (estaOcupado) {
      setHorarioValido(false)
      return
    }

    // Verificar si está disponible
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

  const getHorariosDisponiblesParaEmpleada = () => {
    if (!formData.empleadaId) return []
    return horariosDisponibles.filter((horario) =>
      horario.empleadasDisponibles.some((emp) => emp.id === formData.empleadaId),
    )
  }

  // Manejar creación de nuevo cliente
  const handleNuevoCliente = () => {
    setModalClienteOpen(true)
  }

  const handleCrearCliente = async (clienteData: NuevoClienteData) => {
    setLoadingNuevoCliente(true)
    try {
      const requestData = {
        nombre: clienteData.nombre,
        apellido: clienteData.apellido,
        telefono: clienteData.telefono,
        email: clienteData.email || "",
      }

      const response = await axios.post<Cliente>("/api/Cliente/registrar-sin-cuenta", requestData)
      const nuevoCliente = response.data

      // Agregar el nuevo cliente a la lista
      setClientes((prev) => [...prev, nuevoCliente])

      // Seleccionar automáticamente el nuevo cliente
      setFormData((prev) => ({ ...prev, clienteId: nuevoCliente.id }))

      // Cerrar modal
      setModalClienteOpen(false)

      toast.success(`Cliente ${nuevoCliente.nombre} ${nuevoCliente.apellido} creado exitosamente`)
    } catch (err: any) {
      console.error("Error creando cliente:", err)
      toast.error(err.response?.data?.message || "Error al crear el cliente")
      throw err // Re-lanzar para que el modal maneje el error
    } finally {
      setLoadingNuevoCliente(false)
    }
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

      const turnoData = {
        fechaHora: fechaHoraStr,
        empleadaId: formData.empleadaId,
        clienteId: formData.clienteId,
        sucursalId: formData.sucursalId,
        sectorId: formData.sectorId,
        detalles: formData.detalles.map((detalle) => ({
          turnoId: 0,
          servicioId: detalle.servicioId,
          extrasIds: detalle.extrasIds,
        })),
      }

      await axios.post("/api/Turnos", turnoData)

      toast.success("Turno creado exitosamente")

      // Limpiar formulario
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fecha y Hora */}
          <FechaHoraSection
            date={date}
            time={time}
            calendarOpen={calendarOpen}
            horarioValido={horarioValido}
            loadingHorarios={loadingHorarios}
            onDateChange={setDate}
            onTimeChange={setTime}
            onCalendarOpenChange={setCalendarOpen}
          />

          {/* Ubicación */}
          <UbicacionSection
            sucursales={sucursales}
            sectores={sectores}
            sucursalId={formData.sucursalId}
            sectorId={formData.sectorId}
            loadingSectores={loadingSectores}
            onSucursalChange={(value) => setFormData({ ...formData, sucursalId: Number.parseInt(value) })}
            onSectorChange={(value) => setFormData({ ...formData, sectorId: Number.parseInt(value) })}
          />

          {/* Cliente y Empleada */}
          <ClienteEmpleadaSection
            clientes={clientes}
            empleadas={empleadas}
            clienteId={formData.clienteId}
            empleadaId={formData.empleadaId}
            sectorId={formData.sectorId}
            loadingEmpleadas={loadingEmpleadas}
            onClienteChange={(value) => setFormData({ ...formData, clienteId: Number.parseInt(value) })}
            onEmpleadaChange={(value) => setFormData({ ...formData, empleadaId: Number.parseInt(value) })}
            onNuevoCliente={handleNuevoCliente}
          />

          {/* Servicios */}
          <ServiciosSection
            servicios={servicios}
            detalles={formData.detalles}
            servicioSeleccionado={servicioSeleccionado}
            empleadaId={formData.empleadaId}
            sectorId={formData.sectorId}
            loadingServicios={loadingServicios}
            onServicioSeleccionadoChange={(value) => setServicioSeleccionado(Number.parseInt(value))}
            onAgregarServicio={handleAgregarServicio}
            onEliminarServicio={handleEliminarServicio}
          />

          {/* Horarios disponibles */}
          <HorariosDisponibles horarios={horariosEmpleada} onTimeSelect={setTime} />

          {/* Alerta de validación */}
          {horarioValido === false && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                El horario seleccionado no está disponible. Por favor, elige otro horario o verifica la disponibilidad.
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

        {/* Modal para crear nuevo cliente */}
        <NuevoClienteModal
          isOpen={modalClienteOpen}
          onClose={() => setModalClienteOpen(false)}
          onClienteCreado={(cliente) => {
            setClientes((prev) => [...prev, cliente])
            setFormData((prev) => ({ ...prev, clienteId: cliente.id }))
          }}
          isLoading={loadingNuevoCliente}
          onSubmit={handleCrearCliente}
        />
      </div>
    </div>
  )
}

export default AsignarTurno
