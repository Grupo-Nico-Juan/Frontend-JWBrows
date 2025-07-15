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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
  MessageCircle,
  Smartphone,
  UserCheck,
  Phone,
} from "lucide-react"

interface ClienteData {
  id: number
  telefono: string
  nombre: string
  apellido: string
  email?: string
}

const ConfirmarTurnoCliente: React.FC = () => {
  const navigate = useNavigate()

  // Estados del formulario
  const [telefono, setTelefono] = useState("")
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [email, setEmail] = useState("")
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [aceptaNotificaciones, setAceptaNotificaciones] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Estados del flujo de validación
  const [pasoActual, setPasoActual] = useState<"telefono" | "datos" | "confirmacion">("telefono")
  const [telefonoVerificado, setTelefonoVerificado] = useState(false)
  const [clienteExistente, setClienteExistente] = useState<ClienteData | null>(null)
  const [loading, setLoading] = useState(false)

  // Estados para validación WhatsApp
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false)
  const [codigoWhatsApp, setCodigoWhatsApp] = useState("")
  const [codigoError, setCodigoError] = useState("")
  const [enviandoCodigo, setEnviandoCodigo] = useState(false)
  const [confirmandoCodigo, setConfirmandoCodigo] = useState(false)
  const [codigoEnviado, setCodigoEnviado] = useState(false)

  const { sucursal, detalles, fechaHora, empleado, resetTurno } = useTurno()

  // Validar solo teléfono
  const validateTelefono = () => {
    const newErrors: Record<string, string> = {}
    if (!telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    } else if (!/^\+?[\d\s-()]{8,}$/.test(telefono)) {
      newErrors.telefono = "Formato de teléfono inválido"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validar formulario completo
  const validateFormularioCompleto = () => {
    const newErrors: Record<string, string> = {}
    if (!nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!apellido.trim()) newErrors.apellido = "El apellido es requerido"
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Formato de email inválido"
    }
    if (!aceptaTerminos) {
      newErrors.terminos = "Debes aceptar los términos y condiciones"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Iniciar validación de teléfono
  const iniciarValidacionTelefono = async () => {
    if (!validateTelefono()) {
      toast.error("Por favor, ingresa un teléfono válido")
      return
    }

    setShowWhatsAppDialog(true)
    await enviarCodigoWhatsApp()
  }

  // Enviar código de verificación por WhatsApp
  const enviarCodigoWhatsApp = async () => {
    setEnviandoCodigo(true)
    setCodigoError("")

    try {
      // Primero verificamos si el cliente existe
      let clienteTemp: ClienteData | null = null
      try {
        const res = await axios.get(`/api/Cliente/telefono/${telefono}`)
        clienteTemp = res.data
      } catch (err: any) {
        if (err.response?.status !== 404) {
          throw err
        }
        // Cliente no existe, continuamos con el proceso
      }

      // Enviar código de verificación
      await axios.post("/api/WhatsApp/verificar", {
        telefonoDestino: telefono,
        nombreCliente: clienteTemp?.nombre || "Cliente",
        clienteId: clienteTemp ? 1 : 0, // Usamos 1 si existe, 0 si no existe
      })

      setClienteExistente(clienteTemp)
      setCodigoEnviado(true)
      toast.success("Código de verificación enviado por WhatsApp")
    } catch (err: any) {
      console.error("Error al enviar código:", err.response?.data)
      setCodigoError("Error al enviar el código. Verifica tu número de teléfono.")
      toast.error("Error al enviar el código de verificación")
    } finally {
      setEnviandoCodigo(false)
    }
  }

  // Confirmar código de verificación
  const confirmarCodigoWhatsApp = async () => {
    if (!codigoWhatsApp.trim()) {
      setCodigoError("Ingresa el código de verificación")
      return
    }

    setConfirmandoCodigo(true)
    setCodigoError("")

    try {
      await axios.post("/api/WhatsApp/confirmar", {
        clienteId: clienteExistente ? 1 : 0, // Mismo ID que usamos para verificar
        codigo: codigoWhatsApp,
      })

      toast.success("Teléfono verificado correctamente")
      setTelefonoVerificado(true)
      setShowWhatsAppDialog(false)

      // Si el cliente existe, prellenar los datos
      if (clienteExistente) {
        setNombre(clienteExistente.nombre)
        setApellido(clienteExistente.apellido)
        setEmail(clienteExistente.email || "")
        toast.success(`¡Bienvenido de nuevo, ${clienteExistente.nombre}!`)
      }

      // Avanzar al siguiente paso
      setPasoActual("datos")
    } catch (err: any) {
      console.error("Error al confirmar código:", err.response?.data)
      if (err.response?.status === 400) {
        setCodigoError("Código incorrecto. Verifica e intenta nuevamente.")
      } else {
        setCodigoError("Error al verificar el código. Intenta nuevamente.")
      }
    } finally {
      setConfirmandoCodigo(false)
    }
  }

  // Cancelar diálogo de WhatsApp
  const cancelarDialogoWhatsApp = () => {
    setShowWhatsAppDialog(false)
    setCodigoWhatsApp("")
    setCodigoError("")
    setCodigoEnviado(false)
    setClienteExistente(null)
  }

  // Continuar a confirmación
  const continuarAConfirmacion = () => {
    if (!validateFormularioCompleto()) {
      toast.error("Por favor, completa todos los campos requeridos")
      return
    }
    setPasoActual("confirmacion")
  }

  // Confirmar turno final
  const confirmarTurno = async () => {
    if (!sucursal || detalles.length === 0 || !fechaHora || !empleado) {
      toast.error("Faltan datos para confirmar el turno")
      return
    }

    setLoading(true)
    try {
      let clienteId: number;

      if (clienteExistente) {
        // Ya lo tenemos en la BD → usa su Id y no hagas PUT
        clienteId = clienteExistente.id;
      } else {
        // Crea o recupera con el endpoint registrar‑sin‑cuenta
        const res = await axios.post("/api/Cliente/registrar-sin-cuenta", {
          nombre,
          apellido,
          telefono,
          email: email || undefined,
        });
        clienteId = res.data.id;
      }

      // Crear el turno
      const body = {
        fechaHora,
        empleadaId: empleado.id,
        clienteId,
        sucursalId: sucursal.id,
        detalles: detalles.map((d) => ({
          turnoId: 0,
          servicioId: d.servicio.id,
          extrasIds: d.extras.map((e) => e.id),
        })),
      }

      console.log("📤 Body del POST /api/Turnos:", body)
      await axios.post("/api/Turnos", body)

      toast.success("¡Turno agendado con éxito!")

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

  // Volver al paso anterior
  const volverPasoAnterior = () => {
    if (pasoActual === "datos") {
      setPasoActual("telefono")
      setTelefonoVerificado(false)
      setClienteExistente(null)
      setNombre("")
      setApellido("")
      setEmail("")
    } else if (pasoActual === "confirmacion") {
      setPasoActual("datos")
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
              <div className="inline-flex items-center gap-3 bg-blue-100 rounded-full px-4 py-2 mb-3">
                {pasoActual === "telefono" && (
                  <>
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-700 font-medium">Paso 1: Verificar teléfono</span>
                  </>
                )}
                {pasoActual === "datos" && (
                  <>
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-700 font-medium">Paso 2: Completar datos</span>
                  </>
                )}
                {pasoActual === "confirmacion" && (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-700 font-medium">Paso 3: Confirmar cita</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#6d4c41] mb-2">
                {pasoActual === "telefono" && "Verificar tu teléfono"}
                {pasoActual === "datos" && "Completar tus datos"}
                {pasoActual === "confirmacion" && "Confirmar tu cita"}
              </h1>
              <p className="text-[#8d6e63]">
                {pasoActual === "telefono" && "Ingresa tu número de WhatsApp para verificar tu identidad"}
                {pasoActual === "datos" && "Completa o verifica tus datos personales"}
                {pasoActual === "confirmacion" && "Revisa los detalles y confirma tu reserva"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={pasoActual === "telefono" ? () => navigate("/reserva/empleado") : volverPasoAnterior}
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
          {/* Resumen de la cita - Siempre visible */}
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

          {/* Formulario dinámico según el paso */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {/* PASO 1: Verificación de teléfono */}
              {pasoActual === "telefono" && (
                <motion.div
                  key="telefono"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-[#6d4c41] mb-4 flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Verificar tu WhatsApp
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#6d4c41] mb-2">Número de WhatsApp *</label>
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
                          <p className="text-xs text-[#8d6e63] mt-2 flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            Te enviaremos un código de verificación por WhatsApp
                          </p>
                        </div>

                        <Button
                          onClick={iniciarValidacionTelefono}
                          disabled={!telefono.trim()}
                          className="w-full bg-[#a1887f] hover:bg-[#8d6e63] text-white h-12 text-lg font-medium"
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Verificar teléfono
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información sobre la verificación */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">¿Por qué verificamos tu teléfono?</p>
                          <ul className="space-y-1 text-blue-700">
                            <li>• Para confirmar tu identidad</li>
                            <li>• Si ya eres cliente, recuperaremos tus datos automáticamente</li>
                            <li>• Para enviarte recordatorios de tu cita</li>
                            <li>• Para mantener la seguridad de nuestro sistema</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* PASO 2: Completar datos */}
              {pasoActual === "datos" && (
                <motion.div
                  key="datos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Estado de verificación */}
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800">Teléfono verificado</p>
                          <p className="text-sm text-green-700">{telefono}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mensaje para cliente existente */}
                  {clienteExistente && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <UserCheck className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-800">¡Te reconocemos!</p>
                            <p className="text-sm text-blue-700">
                              Hemos recuperado tus datos automáticamente. Puedes modificarlos si es necesario.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Formulario de datos */}
                  <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-[#6d4c41] mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {clienteExistente ? "Verificar tus datos" : "Completar tus datos"}
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
                            <label
                              htmlFor="notificaciones"
                              className="text-sm font-medium text-[#6d4c41] cursor-pointer"
                            >
                              Recibir recordatorios por WhatsApp
                            </label>
                            <p className="text-xs text-[#8d6e63]">
                              Te enviaremos un recordatorio 24hs antes de tu cita
                            </p>
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

                  <Button
                    onClick={continuarAConfirmacion}
                    className="w-full bg-[#a1887f] hover:bg-[#8d6e63] text-white h-12 text-lg font-medium"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Continuar a confirmación
                  </Button>
                </motion.div>
              )}

              {/* PASO 3: Confirmación final */}
              {pasoActual === "confirmacion" && (
                <motion.div
                  key="confirmacion"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Resumen de datos */}
                  <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-[#6d4c41] mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Datos de contacto
                      </h2>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-[#8d6e63]">Nombre:</span>
                          <span className="font-medium text-[#6d4c41]">
                            {nombre} {apellido}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8d6e63]">Teléfono:</span>
                          <span className="font-medium text-[#6d4c41] flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {telefono}
                          </span>
                        </div>
                        {email && (
                          <div className="flex justify-between">
                            <span className="text-[#8d6e63]">Email:</span>
                            <span className="font-medium text-[#6d4c41]">{email}</span>
                          </div>
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

                  {/* Botón de confirmación final */}
                  <Button
                    onClick={confirmarTurno}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-medium"
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
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Diálogo de verificación WhatsApp */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#6d4c41] flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Verificar número de WhatsApp
            </DialogTitle>
            <DialogDescription className="text-[#8d6e63]">
              {!codigoEnviado
                ? "Enviaremos un código de verificación a tu WhatsApp para confirmar tu número."
                : `Ingresa el código de 6 dígitos que enviamos a ${telefono}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!codigoEnviado ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-[#6d4c41]">Número a verificar:</p>
                  <p className="text-lg font-bold text-[#8d6e63]">{telefono}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-[#6d4c41]">
                  Código de verificación
                </Label>
                <Input
                  id="codigo"
                  type="text"
                  placeholder="123456"
                  value={codigoWhatsApp}
                  onChange={(e) => {
                    setCodigoWhatsApp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    if (codigoError) setCodigoError("")
                  }}
                  className={`text-center text-lg tracking-widest ${codigoError ? "border-red-500 focus:border-red-500" : "border-[#e0d6cf] focus:border-[#a1887f]"
                    }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && codigoWhatsApp.length === 6) {
                      confirmarCodigoWhatsApp()
                    }
                  }}
                  maxLength={6}
                />
                {codigoError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {codigoError}
                  </p>
                )}
                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enviarCodigoWhatsApp()}
                    disabled={enviandoCodigo}
                    className="text-[#a1887f] hover:text-[#8d6e63] text-sm"
                  >
                    {enviandoCodigo ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Reenviar código"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={cancelarDialogoWhatsApp}
              className="border-[#e0d6cf] text-[#6d4c41] hover:bg-[#f8f0ec] bg-transparent"
              disabled={enviandoCodigo || confirmandoCodigo}
            >
              Cancelar
            </Button>

            {!codigoEnviado ? (
              <Button
                onClick={() => enviarCodigoWhatsApp()}
                disabled={enviandoCodigo}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {enviandoCodigo ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enviar código
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={confirmarCodigoWhatsApp}
                disabled={codigoWhatsApp.length !== 6 || confirmandoCodigo}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {confirmandoCodigo ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verificar código
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ConfirmarTurnoCliente
