"use client"
import type React from "react"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Save,
  Plus,
  AlertCircle,
  Loader2,
  CalendarDays,
  FileText,
  Timer,
  Users,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Empleada {
  id: number
  nombre: string
  apellido: string
}

interface PeriodoLaboralFormData {
  empleadaId: number | ""
  tipo: "HorarioHabitual" | "Licencia"
  diaSemana: string
  // Primer turno
  horaInicio1Turno: string
  horaFin1Turno: string
  // Segundo turno (opcional)
  horaInicio2Turno: string
  horaFin2Turno: string
  // Para licencias
  desde: string
  hasta: string
  motivo: string
}

const diasSemana = [
  { value: "Monday", label: "Lunes" },
  { value: "Tuesday", label: "Martes" },
  { value: "Wednesday", label: "Miércoles" },
  { value: "Thursday", label: "Jueves" },
  { value: "Friday", label: "Viernes" },
  { value: "Saturday", label: "Sábado" },
  { value: "Sunday", label: "Domingo" },
]

const PeriodoLaboralForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const location = useLocation()
  const empleadaIdFromQuery = new URLSearchParams(location.search).get("empleadaId")
  const editando = !!id

  const [empleadas, setEmpleadas] = useState<Empleada[]>([])
  const [form, setForm] = useState<PeriodoLaboralFormData>({
    empleadaId: empleadaIdFromQuery ? Number(empleadaIdFromQuery) : "",
    tipo: "HorarioHabitual",
    diaSemana: "Monday",
    horaInicio1Turno: "",
    horaFin1Turno: "",
    horaInicio2Turno: "",
    horaFin2Turno: "",
    desde: "",
    hasta: "",
    motivo: "",
  })
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        const empleadasRes = await axios.get("/api/Empleado")
        setEmpleadas(empleadasRes.data)

        if (editando && id) {
          const periodoRes = await axios.get(`/api/PeriodoLaboral/${id}`)
          const data = periodoRes.data
          setForm({
            empleadaId: data.empleadaId,
            tipo: data.tipo,
            diaSemana: data.diaSemana ?? "Monday",
            horaInicio1Turno: data.horaInicio ?? "",
            horaFin1Turno: data.horaFin ?? "",
            horaInicio2Turno: "",
            horaFin2Turno: "",
            desde: data.desde ? data.desde.substring(0, 10) : "",
            hasta: data.hasta ? data.hasta.substring(0, 10) : "",
            motivo: data.motivo ?? "",
          })
        }
      } catch {
        setError("Error al cargar los datos")
      } finally {
        setIsLoadingData(false)
      }
    }
    fetchData()
  }, [editando, id])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (form.tipo === "HorarioHabitual") {
        // Validar que al menos el primer turno esté completo
        if (!form.horaInicio1Turno || !form.horaFin1Turno) {
          setError("El primer turno es obligatorio")
          setIsLoading(false)
          return
        }

        // Validar que si hay segundo turno, esté completo
        if ((form.horaInicio2Turno && !form.horaFin2Turno) || (!form.horaInicio2Turno && form.horaFin2Turno)) {
          setError("Si agrega un segundo turno, debe completar tanto la hora de inicio como la de fin")
          setIsLoading(false)
          return
        }

        const requests = []

        // Primer turno (siempre se crea)
        const primerTurno = {
          ...(editando && id ? { id: Number(id) } : {}),
          empleadaId: form.empleadaId,
          tipo: form.tipo,
          diaSemana: form.diaSemana,
          horaInicio: form.horaInicio1Turno,
          horaFin: form.horaFin1Turno,
        }

        if (editando && id) {
          requests.push(axios.put(`/api/PeriodoLaboral/${id}`, primerTurno))
        } else {
          requests.push(axios.post("/api/PeriodoLaboral", primerTurno))
        }

        // Segundo turno (solo si está completo y no estamos editando)
        if (form.horaInicio2Turno && form.horaFin2Turno && !editando) {
          const segundoTurno = {
            empleadaId: form.empleadaId,
            tipo: form.tipo,
            diaSemana: form.diaSemana,
            horaInicio: form.horaInicio2Turno,
            horaFin: form.horaFin2Turno,
          }
          requests.push(axios.post("/api/PeriodoLaboral", segundoTurno))
        }

        await Promise.all(requests)

        const mensaje = editando
          ? "Período laboral actualizado correctamente"
          : `${requests.length === 2 ? "Períodos laborales creados" : "Período laboral creado"} correctamente`

        toast.success(mensaje)
      } else {
        // Lógica para licencias (sin cambios)
        const dataToSend = {
          ...(editando && id ? { id: Number(id) } : {}),
          empleadaId: form.empleadaId,
          tipo: form.tipo,
          desde: form.desde,
          hasta: form.hasta,
          motivo: form.motivo,
        }

        const request =
          editando && id
            ? axios.put(`/api/PeriodoLaboral/${id}`, dataToSend)
            : axios.post("/api/PeriodoLaboral", dataToSend)

        await request
        toast.success(`Licencia ${editando ? "actualizada" : "creada"} correctamente`)
      }

      navigate(`/periodos-laborales?empleadaId=${form.empleadaId}`)
    } catch {
      setError("Error al guardar el período laboral")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate(`/periodos-laborales?empleadaId=${form.empleadaId}`)
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 size={32} className="text-[#7a5b4c] animate-spin sm:w-10 sm:h-10" />
          </div>
          <p className="text-[#7a5b4c] font-medium text-base sm:text-lg">Cargando formulario...</p>
          <p className="text-[#7a5b4c]/60 text-sm mt-2">Esto puede tomar unos segundos</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-2 sm:px-4 py-4 sm:py-8 relative overflow-hidden">
      {/* Elementos decorativos de fondo mejorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-[#d4bfae] to-[#c4a484] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#a37e63] to-[#8b6f56] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#f3e9dc] to-[#e8d5c4] rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Partículas flotantes */}
        <div
          className="absolute top-20 left-20 w-2 h-2 bg-[#a37e63] rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-1 h-1 bg-[#d4bfae] rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-[#c4a484] rounded-full opacity-35 animate-bounce"
          style={{ animationDelay: "2.5s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <Card className="bg-white/90 backdrop-blur-lg shadow-2xl border-0 rounded-2xl sm:rounded-3xl overflow-hidden relative">
            {/* Borde decorativo */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#7a5b4c] via-[#a37e63] to-[#7a5b4c] p-0.5 rounded-2xl sm:rounded-3xl">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl h-full w-full"></div>
            </div>

            <div className="relative z-10">
              {/* Header con gradiente mejorado */}
              <div className="bg-gradient-to-r from-[#7a5b4c] via-[#a37e63] to-[#8b6f56] p-4 sm:p-6 relative overflow-hidden">
                {/* Efectos de fondo en el header */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12 translate-x-full animate-pulse"></div>

                <button
                  onClick={handleBack}
                  className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-white/20 backdrop-blur-sm"
                  disabled={isLoading}
                >
                  <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                </button>

                <div className="text-center relative z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
                    className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg backdrop-blur-sm border border-white/20"
                  >
                    {editando ? (
                      <Calendar size={28} className="text-white sm:w-10 sm:h-10 drop-shadow-lg" />
                    ) : (
                      <Plus size={28} className="text-white sm:w-10 sm:h-10 drop-shadow-lg" />
                    )}
                  </motion.div>
                  <CardTitle className="text-xl sm:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                    {editando ? "Editar Período Laboral" : "Nuevo Período Laboral"}
                  </CardTitle>
                  <p className="text-white/90 text-sm sm:text-base mt-2 drop-shadow-sm">
                    {editando
                      ? "Modifica los datos del período laboral"
                      : "Completa la información del nuevo período. Puedes agregar hasta dos turnos por día."}
                  </p>
                </div>
              </div>

              <CardContent className="p-4 sm:p-8 bg-gradient-to-b from-white/95 to-white/90">
                {/* Resto del formulario permanece igual pero con estilos mejorados en los campos */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Selección de Empleada */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                      <div className="flex items-center space-x-2">
                        <Users size={16} />
                        <span>Empleada</span>
                      </div>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5 z-10" />
                      <select
                        name="empleadaId"
                        value={form.empleadaId}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="w-full pl-10 pr-4 h-12 bg-gradient-to-r from-[#fdf6f1] to-[#f8f0e8] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-4 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 hover:shadow-lg hover:border-[#a37e63]/50 backdrop-blur-sm font-medium"
                      >
                        <option value="">Seleccionar empleada</option>
                        {empleadas.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.nombre} {e.apellido}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-[#7a5b4c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  {/* Tipo de Período */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                      <div className="flex items-center space-x-2">
                        <FileText size={16} />
                        <span>Tipo de Período</span>
                      </div>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.label
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          form.tipo === "HorarioHabitual"
                            ? "border-[#a37e63] bg-[#a37e63]/10 text-[#7a5b4c]"
                            : "border-[#e1cfc0] bg-[#fdf6f1] text-[#7a5b4c]/70 hover:border-[#a37e63]/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="tipo"
                          value="HorarioHabitual"
                          checked={form.tipo === "HorarioHabitual"}
                          onChange={handleChange}
                          className="sr-only"
                          disabled={isLoading}
                        />
                        <div className="flex items-center space-x-2">
                          <Clock size={18} />
                          <span className="font-medium text-sm">Horario Habitual</span>
                        </div>
                      </motion.label>
                      <motion.label
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          form.tipo === "Licencia"
                            ? "border-[#a37e63] bg-[#a37e63]/10 text-[#7a5b4c]"
                            : "border-[#e1cfc0] bg-[#fdf6f1] text-[#7a5b4c]/70 hover:border-[#a37e63]/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="tipo"
                          value="Licencia"
                          checked={form.tipo === "Licencia"}
                          onChange={handleChange}
                          className="sr-only"
                          disabled={isLoading}
                        />
                        <div className="flex items-center space-x-2">
                          <FileText size={18} />
                          <span className="font-medium text-sm">Licencia</span>
                        </div>
                      </motion.label>
                    </div>
                  </motion.div>

                  {/* Campos para Horario Habitual */}
                  <AnimatePresence>
                    {form.tipo === "HorarioHabitual" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Día de la Semana */}
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="relative"
                        >
                          <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                            <div className="flex items-center space-x-2">
                              <CalendarDays size={16} />
                              <span>Día de la Semana</span>
                            </div>
                          </label>
                          <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5 z-10" />
                            <select
                              name="diaSemana"
                              value={form.diaSemana}
                              onChange={handleChange}
                              disabled={isLoading}
                              className="w-full pl-10 pr-4 h-12 bg-gradient-to-r from-[#fdf6f1] to-[#f8f0e8] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-4 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 hover:shadow-lg hover:border-[#a37e63]/50 backdrop-blur-sm font-medium"
                            >
                              {diasSemana.map((dia) => (
                                <option key={dia.value} value={dia.value}>
                                  {dia.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg
                                className="w-4 h-4 text-[#7a5b4c]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </motion.div>

                        {/* Primer Turno */}
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.15 }}
                          className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 shadow-inner"
                        >
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-xs">1</span>
                            </div>
                            <h4 className="font-semibold text-[#7a5b4c]">Primer Turno</h4>
                            <span className="text-red-500 text-sm">*</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                              <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                                <div className="flex items-center space-x-2">
                                  <Timer size={16} />
                                  <span>Hora Inicio</span>
                                </div>
                              </label>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                                <Input
                                  type="time"
                                  name="horaInicio1Turno"
                                  value={form.horaInicio1Turno}
                                  onChange={handleChange}
                                  required
                                  disabled={isLoading}
                                  className="w-full pl-10 pr-4 h-12 bg-gradient-to-r from-[#fdf6f1] to-[#f8f0e8] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-4 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 hover:shadow-lg hover:border-[#a37e63]/50 backdrop-blur-sm font-medium"
                                />
                              </div>
                            </div>
                            <div className="relative">
                              <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                                <div className="flex items-center space-x-2">
                                  <Timer size={16} />
                                  <span>Hora Fin</span>
                                </div>
                              </label>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                                <Input
                                  type="time"
                                  name="horaFin1Turno"
                                  value={form.horaFin1Turno}
                                  onChange={handleChange}
                                  required
                                  disabled={isLoading}
                                  className="w-full pl-10 pr-4 h-12 bg-gradient-to-r from-[#fdf6f1] to-[#f8f0e8] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-4 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 hover:shadow-lg hover:border-[#a37e63]/50 backdrop-blur-sm font-medium"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Segundo Turno (Opcional) */}
                        {!editando && (
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 shadow-inner"
                          >
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-semibold text-xs">2</span>
                              </div>
                              <h4 className="font-semibold text-[#7a5b4c]">Segundo Turno</h4>
                              <span className="text-gray-500 text-sm">(Opcional)</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="relative">
                                <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Timer size={16} />
                                    <span>Hora Inicio</span>
                                  </div>
                                </label>
                                <div className="relative">
                                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                                  <Input
                                    type="time"
                                    name="horaInicio2Turno"
                                    value={form.horaInicio2Turno}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full pl-10 pr-4 h-12 bg-gradient-to-r from-[#fdf6f1] to-[#f8f0e8] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-4 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 hover:shadow-lg hover:border-[#a37e63]/50 backdrop-blur-sm font-medium"
                                  />
                                </div>
                              </div>
                              <div className="relative">
                                <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Timer size={16} />
                                    <span>Hora Fin</span>
                                  </div>
                                </label>
                                <div className="relative">
                                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                                  <Input
                                    type="time"
                                    name="horaFin2Turno"
                                    value={form.horaFin2Turno}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full pl-10 pr-4 h-12 bg-gradient-to-r from-[#fdf6f1] to-[#f8f0e8] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-4 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 hover:shadow-lg hover:border-[#a37e63]/50 backdrop-blur-sm font-medium"
                                  />
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-[#7a5b4c]/60 bg-blue-50 p-3 rounded-lg border border-blue-200">
                              💡 <strong>Tip:</strong> Si completas el segundo turno, se crearán automáticamente dos
                              períodos laborales para el mismo día.
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Campos para Licencia */}
                  <AnimatePresence>
                    {form.tipo === "Licencia" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="relative"
                          >
                            <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                              <div className="flex items-center space-x-2">
                                <Calendar size={16} />
                                <span>Fecha Desde</span>
                              </div>
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                              <Input
                                type="date"
                                name="desde"
                                value={form.desde}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="w-full pl-10 pr-4 h-12 bg-gradient-to-r from-[#fdf6f1] to-[#f8f0e8] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-4 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 hover:shadow-lg hover:border-[#a37e63]/50 backdrop-blur-sm font-medium"
                              />
                            </div>
                          </motion.div>
                          <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="relative"
                          >
                            <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                              <div className="flex items-center space-x-2">
                                <Calendar size={16} />
                                <span>Fecha Hasta</span>
                              </div>
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                              <Input
                                type="date"
                                name="hasta"
                                value={form.hasta}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="w-full pl-10 pr-4 h-12 bg-gradient-to-r from-[#fdf6f1] to-[#f8f0e8] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-4 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 hover:shadow-lg hover:border-[#a37e63]/50 backdrop-blur-sm font-medium"
                              />
                            </div>
                          </motion.div>
                        </div>
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="relative"
                        >
                          <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                            <div className="flex items-center space-x-2">
                              <FileText size={16} />
                              <span>Motivo de la Licencia</span>
                            </div>
                          </label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                            <Input
                              name="motivo"
                              placeholder="Ej: Vacaciones, Enfermedad, Personal..."
                              value={form.motivo}
                              onChange={handleChange}
                              required
                              disabled={isLoading}
                              className="w-full pl-10 pr-4 h-12 bg-gradient-to-r from-[#fdf6f1] to-[#f8f0e8] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-4 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 hover:shadow-lg hover:border-[#a37e63]/50 backdrop-blur-sm font-medium"
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mensaje de error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center space-x-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl"
                      >
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0 sm:w-5 sm:h-5" />
                        <p className="text-sm sm:text-base text-red-600 font-medium">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Botones */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row justify-end gap-3 pt-4"
                  >
                    <motion.button
                      type="button"
                      onClick={handleBack}
                      disabled={isLoading}
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-[#7a5b4c] font-bold rounded-xl sm:rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:shadow-xl backdrop-blur-sm border border-gray-300"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#7a5b4c] via-[#a37e63] to-[#8b6f56] hover:from-[#6b4d3e] hover:via-[#8f6b50] hover:to-[#7a5b4c] text-white font-bold rounded-xl sm:rounded-2xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base backdrop-blur-sm border border-white/20"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin sm:w-5 sm:h-5" />
                          <span>{editando ? "Guardando..." : "Creando..."}</span>
                        </>
                      ) : (
                        <>
                          {editando ? (
                            <Save size={16} className="sm:w-5 sm:h-5" />
                          ) : (
                            <Plus size={16} className="sm:w-5 sm:h-5" />
                          )}
                          <span>{editando ? "Guardar Cambios" : "Crear Período"}</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default PeriodoLaboralForm
