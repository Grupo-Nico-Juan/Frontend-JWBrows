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
  horaInicio: string
  horaFin: string
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
    horaInicio: "",
    horaFin: "",
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
            horaInicio: data.horaInicio ?? "",
            horaFin: data.horaFin ?? "",
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
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const dataToSend = {
      empleadaId: form.empleadaId,
      tipo: form.tipo,
      diaSemana: form.tipo === "HorarioHabitual" ? form.diaSemana : null,
      horaInicio: form.tipo === "HorarioHabitual" ? form.horaInicio : null,
      horaFin: form.tipo === "HorarioHabitual" ? form.horaFin : null,
      desde: form.tipo === "Licencia" ? form.desde : null,
      hasta: form.tipo === "Licencia" ? form.hasta : null,
      motivo: form.tipo === "Licencia" ? form.motivo : null,
    }

    try {
      const request =
        editando && id
          ? axios.put(`/api/PeriodoLaboral/${id}`, dataToSend)
          : axios.post("/api/PeriodoLaboral", dataToSend)

      await request
      toast.success(`Período laboral ${editando ? "actualizado" : "creado"} correctamente`)
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
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-2 sm:px-4 py-4 sm:py-8">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#d4bfae] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#a37e63] rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-xl sm:rounded-2xl overflow-hidden">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] p-4 sm:p-6 relative">
              {/* Botón de volver */}
              <button
                onClick={handleBack}
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors p-1"
                disabled={isLoading}
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                >
                  {editando ? (
                    <Calendar size={24} className="text-white sm:w-8 sm:h-8" />
                  ) : (
                    <Plus size={24} className="text-white sm:w-8 sm:h-8" />
                  )}
                </motion.div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {editando ? "Editar Período Laboral" : "Nuevo Período Laboral"}
                </CardTitle>
                <p className="text-white/80 text-sm mt-2">
                  {editando ? "Modifica los datos del período laboral" : "Completa la información del nuevo período"}
                </p>
              </div>
            </div>

            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
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
                      className="w-full pl-10 pr-4 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">Seleccionar empleada</option>
                      {empleadas.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombre} {e.apellido}
                        </option>
                      ))}
                    </select>
                    {/* Flecha personalizada */}
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
                      className="space-y-4"
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
                            className="w-full pl-10 pr-4 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50"
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

                      {/* Horarios */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.15 }}
                          className="relative"
                        >
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
                              name="horaInicio"
                              value={form.horaInicio}
                              onChange={handleChange}
                              required
                              disabled={isLoading}
                              className="pl-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="relative"
                        >
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
                              name="horaFin"
                              value={form.horaFin}
                              onChange={handleChange}
                              required
                              disabled={isLoading}
                              className="pl-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
                            />
                          </div>
                        </motion.div>
                      </div>
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
                      {/* Fechas */}
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
                              className="pl-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
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
                              className="pl-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
                            />
                          </div>
                        </motion.div>
                      </div>

                      {/* Motivo */}
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
                            className="pl-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
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
                    className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#7a5b4c] font-medium rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Cancelar
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
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
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default PeriodoLaboralForm
