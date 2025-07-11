"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { useTurno } from "@/context/TurnoContext"
import {
  User,
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle,
  Loader2,
  AlertCircle,
  Sparkles,
  Shield,
  Info,
  ArrowLeft,
  Star,
  CreditCard,
} from "lucide-react"

const ConfirmarTurnoCliente: React.FC = () => {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [telefono, setTelefono] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [aceptaNotificaciones, setAceptaNotificaciones] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { sucursal, detalles, fechaHora, empleado, resetTurno } = useTurno()

  // Validaciones
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!apellido.trim()) newErrors.apellido = "El apellido es requerido"
    if (!telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    } else if (!/^\+?[\d\s-()]{8,}$/.test(telefono)) {
      newErrors.telefono = "Formato de teléfono inválido"
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Formato de email inválido"
    }
    if (!aceptaTerminos) {
      newErrors.terminos = "Debes aceptar los términos y condiciones"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Por favor, corrige los errores en el formulario")
      return
    }

    if (!sucursal || detalles.length === 0 || !fechaHora || !empleado) {
      toast.error("Faltan datos para confirmar el turno")
      return
    }

    setLoading(true)

    try {
      // 1. Verificar si el cliente ya existe
      let clienteId: number
      try {
        const res = await axios.get(`/api/Cliente/telefono/${telefono}`)
        clienteId = res.data.id
      } catch (err: any) {
        if (err.response?.status === 404) {
          const res = await axios.post("/api/Cliente/registrar-sin-cuenta", {
            nombre,
            apellido,
            telefono,
            email: email || undefined,
          })
          clienteId = res.data.id
        } else {
          throw err
        }
      }

      // 2. Preparar el body del turno
      const body = {
        fechaHora,
        empleadaId: empleado.id,
        clienteId,
        sucursalId: sucursal.id,
        detalles: detalles.map((d) => ({
          turnoId: 0,
          servicioId: d.servicio.id,
          extrasIds: d.extras.map((e) => e.id), // También agregamos extrasIds
        })),
      }

      console.log("📤 Body del POST /api/Turnos:", body)

      // 3. Enviar el turno
      await axios.post("/api/Turnos", body)

      toast.success("¡Turno agendado con éxito!")

      // Mostrar confirmación y luego navegar
      setTimeout(() => {
        resetTurno()
        navigate("/")
      }, 2000)
    } catch (err: any) {
      console.error("Error al agendar el turno:", err.response?.data)
      toast.error("Hubo un error al agendar el turno. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  // Calcular totales
  const totalServicios = detalles.length
  const totalDuracion = detalles.reduce(
    (sum, d) => sum + d.servicio.duracionMinutos + d.extras.reduce((eSum, e) => eSum + e.duracionMinutos, 0),
    0,
  )
  const totalPrecio = detalles.reduce(
    (sum, d) => sum + d.servicio.precio + d.extras.reduce((eSum, e) => eSum + e.precio, 0),
    0,
  )

  const fechaFormateada = fechaHora
    ? new Date(fechaHora).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : ""

  const horaFormateada = fechaHora
    ? new Date(fechaHora).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    : ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border-b border-[#e0d6cf] sticky top-0 z-20"
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-3 bg-green-100 rounded-full px-4 py-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Último paso</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#6d4c41] mb-2">Confirmar tu cita</h1>
              <p className="text-[#8d6e63]">Revisá los detalles y completá tus datos para finalizar la reserva</p>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate("/reserva/empleado")}
              className="border-[#d2bfae] text-[#6d4c41] hover:bg-[#f8f0ec] hidden lg:flex"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumen de la cita */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Información principal */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#6d4c41] mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Resumen de tu cita
                </h2>

                <div className="space-y-4">
                  {/* Fecha y hora */}
                  <div className="flex items-center gap-3 p-3 bg-[#f8f0ec] rounded-lg">
                    <Calendar className="h-5 w-5 text-[#a1887f]" />
                    <div>
                      <p className="font-medium text-[#6d4c41] capitalize">{fechaFormateada}</p>
                      <p className="text-sm text-[#8d6e63]">{horaFormateada} hs</p>
                    </div>
                  </div>

                  {/* Sucursal */}
                  <div className="flex items-center gap-3 p-3 bg-[#f8f0ec] rounded-lg">
                    <MapPin className="h-5 w-5 text-[#a1887f]" />
                    <div>
                      <p className="font-medium text-[#6d4c41]">{sucursal?.nombre}</p>
                      <p className="text-sm text-[#8d6e63]">{sucursal?.direccion}</p>
                    </div>
                  </div>

                  {/* Profesional */}
                  <div className="flex items-center gap-3 p-3 bg-[#f8f0ec] rounded-lg">
                    <User className="h-5 w-5 text-[#a1887f]" />
                    <div>
                      <p className="font-medium text-[#6d4c41]">
                        {empleado?.nombre} {empleado?.apellido}
                      </p>
                      <p className="text-sm text-[#8d6e63] flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        Especialista certificado
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Servicios seleccionados */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#6d4c41] mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Servicios seleccionados
                </h3>

                <div className="space-y-3">
                  {detalles.map((detalle, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-[#e0d6cf] rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-[#6d4c41]">{detalle.servicio.nombre}</h4>
                        <div className="text-right">
                          <p className="font-medium text-[#6d4c41]">${detalle.servicio.precio}</p>
                          <p className="text-sm text-[#8d6e63]">{detalle.servicio.duracionMinutos}min</p>
                        </div>
                      </div>

                      {detalle.extras.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#e0d6cf]">
                          <p className="text-sm font-medium text-[#8d6e63] mb-2">Extras:</p>
                          {detalle.extras.map((extra, extraIndex) => (
                            <div key={extraIndex} className="flex justify-between text-sm">
                              <span className="text-[#8d6e63]">+ {extra.nombre}</span>
                              <span className="text-[#6d4c41]">
                                ${extra.precio} ({extra.duracionMinutos}min)
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Totales */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-[#8d6e63]">
                    <span>
                      {totalServicios} servicio{totalServicios > 1 ? "s" : ""}
                    </span>
                    <span>{totalDuracion} minutos total</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-[#6d4c41]">
                    <span>Total a pagar:</span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-5 w-5" />${totalPrecio}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Formulario de datos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#6d4c41] mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Tus datos
                </h2>

                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-[#6d4c41] mb-2">Nombre *</label>
                    <Input
                      placeholder="Ingresá tu nombre"
                      value={nombre}
                      onChange={(e) => {
                        setNombre(e.target.value)
                        if (errors.nombre) setErrors({ ...errors, nombre: "" })
                      }}
                      className={`border-[#d2bfae] focus:ring-[#a1887f] focus:border-[#a1887f] ${errors.nombre ? "border-red-500" : ""
                        }`}
                    />
                    {errors.nombre && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.nombre}
                      </p>
                    )}
                  </div>

                  {/* Apellido */}
                  <div>
                    <label className="block text-sm font-medium text-[#6d4c41] mb-2">Apellido *</label>
                    <Input
                      placeholder="Ingresá tu apellido"
                      value={apellido}
                      onChange={(e) => {
                        setApellido(e.target.value)
                        if (errors.apellido) setErrors({ ...errors, apellido: "" })
                      }}
                      className={`border-[#d2bfae] focus:ring-[#a1887f] focus:border-[#a1887f] ${errors.apellido ? "border-red-500" : ""
                        }`}
                    />
                    {errors.apellido && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.apellido}
                      </p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-[#6d4c41] mb-2">Teléfono *</label>
                    <Input
                      placeholder="Ej: +549 98123123"
                      value={telefono}
                      onChange={(e) => {
                        setTelefono(e.target.value)
                        if (errors.telefono) setErrors({ ...errors, telefono: "" })
                      }}
                      className={`border-[#d2bfae] focus:ring-[#a1887f] focus:border-[#a1887f] ${errors.telefono ? "border-red-500" : ""
                        }`}
                    />
                    {errors.telefono && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.telefono}
                      </p>
                    )}
                  </div>

                  {/* Email (opcional) */}
                  <div>
                    <label className="block text-sm font-medium text-[#6d4c41] mb-2">Email (opcional)</label>
                    <Input
                      placeholder="tu@email.com"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors({ ...errors, email: "" })
                      }}
                      className={`border-[#d2bfae] focus:ring-[#a1887f] focus:border-[#a1887f] ${errors.email ? "border-red-500" : ""
                        }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                    <p className="text-xs text-[#8d6e63] mt-1">Para recibir confirmaciones y recordatorios</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Términos y condiciones */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#6d4c41] mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Términos y condiciones
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terminos"
                      checked={aceptaTerminos}
                      onCheckedChange={(checked) => {
                        setAceptaTerminos(checked as boolean)
                        if (errors.terminos) setErrors({ ...errors, terminos: "" })
                      }}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <label
                        htmlFor="terminos"
                        className={`text-sm font-medium cursor-pointer ${errors.terminos ? "text-red-500" : "text-[#6d4c41]"
                          }`}
                      >
                        Acepto los términos y condiciones *
                      </label>
                      <p className="text-xs text-[#8d6e63]">
                        Al confirmar, aceptas nuestras políticas de cancelación y reprogramación
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="notificaciones"
                      checked={aceptaNotificaciones}
                      onCheckedChange={(checked) => setAceptaNotificaciones(checked as boolean)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <label htmlFor="notificaciones" className="text-sm font-medium text-[#6d4c41] cursor-pointer">
                        Recibir recordatorios por WhatsApp
                      </label>
                      <p className="text-xs text-[#8d6e63]">Te enviaremos un recordatorio 24hs antes de tu cita</p>
                    </div>
                  </div>

                  {errors.terminos && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.terminos}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información importante */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Información importante:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Llegá 10 minutos antes de tu cita</li>
                      <li>• Podés reprogramar hasta 24hs antes</li>
                      <li>• El pago se realiza en el local</li>
                      <li>• Recibirás confirmación por WhatsApp</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botón de confirmación */}
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[#a1887f] hover:bg-[#8d6e63] text-white h-12 text-lg font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Confirmando tu cita...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Confirmar cita - ${totalPrecio}
                    </>
                  )}
                </Button>
              </motion.div>
            </AnimatePresence>

            {/* Métodos de pago */}
            <Card className="bg-[#f8f0ec] border-[#e0d6cf]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-[#a1887f]" />
                  <div>
                    <p className="text-sm font-medium text-[#6d4c41]">Métodos de pago aceptados</p>
                    <p className="text-xs text-[#8d6e63]">Efectivo, tarjetas de débito y crédito</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmarTurnoCliente
