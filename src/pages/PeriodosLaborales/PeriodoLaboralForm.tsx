"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Calendar, Plus, Users, CalendarDays, FileText } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

// Componentes reutilizables
import FormLayout from "@/components/forms/form-layout"
import FormField from "@/components/forms/form-field"
import FormSelect from "@/components/forms/form-select"
import FormButtons from "@/components/forms/form-buttons"
import AnimatedError from "@/components/animations/animated-error"
import PeriodTypeSelector from "@/components/forms/period-type-selector"
import ShiftSection from "@/components/forms/shift-section"
import DateInputField from "@/components/forms/date-input-field"
import MotionWrapper from "@/components/animations/motion-wrapper"

// Hook personalizado
import { useFormData } from "@/hooks/use-form-data"

interface Empleada {
  id: number
  nombre: string
  apellido: string
}

interface PeriodoLaboralFormData {
  empleadaId: number | ""
  tipo: "HorarioHabitual" | "Licencia"
  diaSemana: string
  horaInicio1Turno: string
  horaFin1Turno: string
  horaInicio2Turno: string
  horaFin2Turno: string
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
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true)

  const { formData, setFormData, error, setError, isLoading, handleChange, handleSubmit } =
    useFormData<PeriodoLaboralFormData>({
      initialData: {
        empleadaId: empleadaIdFromQuery ? Number(empleadaIdFromQuery) : "",
        tipo: "HorarioHabitual",
        diaSemana: "Monday",
        horaInicio1Turno: "10:00",
        horaFin1Turno: "12:00",
        horaInicio2Turno: "13:00",
        horaFin2Turno: "19:00",
        desde: "",
        hasta: "",
        motivo: "",
      },
      onSubmit: async (data) => {
        if (data.tipo === "HorarioHabitual") {
          // Validar que al menos el primer turno esté completo
          if (!data.horaInicio1Turno || !data.horaFin1Turno) {
            throw new Error("El primer turno es obligatorio")
          }

          // Validar que si hay segundo turno, esté completo
          if ((data.horaInicio2Turno && !data.horaFin2Turno) || (!data.horaInicio2Turno && data.horaFin2Turno)) {
            throw new Error("Si agrega un segundo turno, debe completar tanto la hora de inicio como la de fin")
          }

          const requests = []

          // Primer turno (siempre se crea)
          const primerTurno = {
            ...(editando && id ? { id: Number(id) } : {}),
            empleadaId: data.empleadaId,
            tipo: data.tipo,
            diaSemana: data.diaSemana,
            horaInicio: data.horaInicio1Turno,
            horaFin: data.horaFin1Turno,
          }

          if (editando && id) {
            requests.push(axios.put(`/api/PeriodoLaboral/${id}`, primerTurno))
          } else {
            requests.push(axios.post("/api/PeriodoLaboral", primerTurno))
          }

          // Segundo turno (solo si está completo y no estamos editando)
          if (data.horaInicio2Turno && data.horaFin2Turno && !editando) {
            const segundoTurno = {
              empleadaId: data.empleadaId,
              tipo: data.tipo,
              diaSemana: data.diaSemana,
              horaInicio: data.horaInicio2Turno,
              horaFin: data.horaFin2Turno,
            }
            requests.push(axios.post("/api/PeriodoLaboral", segundoTurno))
          }

          await Promise.all(requests)
          const mensaje = editando
            ? "Período laboral actualizado correctamente"
            : `${requests.length === 2 ? "Períodos laborales creados" : "Período laboral creado"} correctamente`
          toast.success(mensaje)
        } else {
          // Lógica para licencias
          const dataToSend = {
            ...(editando && id ? { id: Number(id) } : {}),
            empleadaId: data.empleadaId,
            tipo: data.tipo,
            desde: data.desde,
            hasta: data.hasta,
            motivo: data.motivo,
          }

          const request =
            editando && id
              ? axios.put(`/api/PeriodoLaboral/${id}`, dataToSend)
              : axios.post("/api/PeriodoLaboral", dataToSend)

          await request
          toast.success(`Licencia ${editando ? "actualizada" : "creada"} correctamente`)
        }

        navigate(`/periodos-laborales?empleadaId=${data.empleadaId}`)
      },
    })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        const empleadasRes = await axios.get("/api/Empleado")
        setEmpleadas(empleadasRes.data)

        if (editando && id) {
          const periodoRes = await axios.get(`/api/PeriodoLaboral/${id}`)
          const data = periodoRes.data
          setFormData({
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
  }, [editando, id, setFormData, setError])

  const handleBack = () => {
    navigate(`/periodos-laborales?empleadaId=${formData.empleadaId}`)
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
            <div className="w-8 h-8 border-4 border-[#7a5b4c] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[#7a5b4c] font-medium text-base sm:text-lg">Cargando formulario...</p>
          <p className="text-[#7a5b4c]/60 text-sm mt-2">Esto puede tomar unos segundos</p>
        </motion.div>
      </div>
    )
  }

  const empleadaOptions = empleadas.map((empleada) => ({
    value: empleada.id,
    label: `${empleada.nombre} ${empleada.apellido}`,
  }))

  return (
    <FormLayout
      title={editando ? "Editar Período Laboral" : "Nuevo Período Laboral"}
      subtitle={
        editando
          ? "Modifica los datos del período laboral"
          : "Completa la información del nuevo período. Puedes agregar hasta dos turnos por día."
      }
      icon={
        editando ? (
          <Calendar size={24} className="text-white sm:w-8 sm:h-8" />
        ) : (
          <Plus size={24} className="text-white sm:w-8 sm:h-8" />
        )
      }
      onBack={handleBack}
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Empleada */}
        <FormSelect
          label="Empleada"
          name="empleadaId"
          value={formData.empleadaId}
          onChange={(value) => setFormData((prev) => ({ ...prev, empleadaId: Number(value) }))}
          options={[{ value: "", label: "Seleccionar empleada" }, ...empleadaOptions]}
          icon={Users}
          disabled={isLoading}
          delay={0.3}
        />

        {/* Tipo de Período */}
        <PeriodTypeSelector value={formData.tipo} onChange={handleChange} disabled={isLoading} delay={0.35} />

        {/* Campos para Horario Habitual */}
        <AnimatePresence>
          {formData.tipo === "HorarioHabitual" && (
            <MotionWrapper animation="fadeIn" className="space-y-6">
              {/* Día de la Semana */}
              <FormSelect
                label="Día de la Semana"
                name="diaSemana"
                value={formData.diaSemana}
                onChange={(value) =>
                  handleChange({ target: { name: "diaSemana", value: value } } as React.ChangeEvent<HTMLSelectElement>)
                }
                options={diasSemana}
                icon={CalendarDays}
                disabled={isLoading}
                delay={0.1}
              />

              {/* Primer Turno */}
              <ShiftSection
                title="Primer Turno"
                number={1}
                startTimeLabel="Hora Inicio"
                endTimeLabel="Hora Fin"
                startTimeName="horaInicio1Turno"
                endTimeName="horaFin1Turno"
                startTimeValue={formData.horaInicio1Turno}
                endTimeValue={formData.horaFin1Turno}
                onChange={handleChange}
                required
                disabled={isLoading}
                delay={0.15}
                colorScheme="blue"
              />

              {/* Segundo Turno (solo si no estamos editando) */}
              {!editando && (
                <ShiftSection
                  title="Segundo Turno"
                  number={2}
                  startTimeLabel="Hora Inicio"
                  endTimeLabel="Hora Fin"
                  startTimeName="horaInicio2Turno"
                  endTimeName="horaFin2Turno"
                  startTimeValue={formData.horaInicio2Turno}
                  endTimeValue={formData.horaFin2Turno}
                  onChange={handleChange}
                  disabled={isLoading}
                  optional
                  tip="Si completas el segundo turno, se crearán automáticamente dos períodos laborales para el mismo día."
                  delay={0.2}
                  colorScheme="green"
                />
              )}
            </MotionWrapper>
          )}
        </AnimatePresence>

        {/* Campos para Licencia */}
        <AnimatePresence>
          {formData.tipo === "Licencia" && (
            <MotionWrapper animation="fadeIn" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DateInputField
                  label="Fecha Desde"
                  name="desde"
                  value={formData.desde}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  delay={0.1}
                  direction="left"
                />
                <DateInputField
                  label="Fecha Hasta"
                  name="hasta"
                  value={formData.hasta}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  delay={0.15}
                  direction="right"
                />
              </div>
              <FormField
                label="Motivo de la Licencia"
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                icon={FileText}
                placeholder="Ej: Vacaciones, Enfermedad, Personal..."
                required
                disabled={isLoading}
                delay={0.2}
              />
            </MotionWrapper>
          )}
        </AnimatePresence>

        {/* Mensaje de error */}
        <AnimatedError error={error} />

        {/* Botones */}
        <FormButtons onCancel={handleBack} isLoading={isLoading} isEditing={editando} />
      </form>
    </FormLayout>
  )
}

export default PeriodoLaboralForm
