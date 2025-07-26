"use client"

import type React from "react"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Zap, FileText, User } from "lucide-react"

// Componentes reutilizables
import FormLayout from "@/components/forms/form-layout"
import FormSection from "@/components/forms/form-section"
import FormInputField from "@/components/forms/form-input-field"
import FormButtons from "@/components/forms/form-buttons"
import LoadingSpinner from "@/components/common/loading-spinner"
import ErrorAlert from "@/components/common/error-alert"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface HabilidadFormData {
  nombre: string
  descripcion: string
}

// Función de validación
const validarHabilidad = (form: HabilidadFormData): Partial<Record<keyof HabilidadFormData, string>> => {
  const errores: Partial<Record<keyof HabilidadFormData, string>> = {}

  if (!form.nombre.trim()) {
    errores.nombre = "El nombre es requerido"
  } else if (form.nombre.length < 2) {
    errores.nombre = "El nombre debe tener al menos 2 caracteres"
  } else if (form.nombre.length > 50) {
    errores.nombre = "El nombre no puede exceder 50 caracteres"
  }

  if (!form.descripcion.trim()) {
    errores.descripcion = "La descripción es requerida"
  } else if (form.descripcion.length < 5) {
    errores.descripcion = "La descripción debe tener al menos 5 caracteres"
  } else if (form.descripcion.length > 200) {
    errores.descripcion = "La descripción no puede exceder 200 caracteres"
  }

  return errores
}

const HabilidadForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const editando = !!id

  const [form, setForm] = useState<HabilidadFormData>({
    nombre: "",
    descripcion: "",
  })

  const [errores, setErrores] = useState<Partial<Record<keyof HabilidadFormData, string>>>({})
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false)

  useEffect(() => {
    if (editando && id) {
      setIsLoadingData(true)
      axios
        .get(`/api/Habilidad/${id}`)
        .then((res) =>
          setForm({
            nombre: res.data.nombre ?? "",
            descripcion: res.data.descripcion ?? "",
          }),
        )
        .catch(() => setError("No se pudo cargar la habilidad"))
        .finally(() => setIsLoadingData(false))
    }
  }, [editando, id])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))

    // Limpiar errores cuando el usuario empiece a escribir
    if (errores[name as keyof HabilidadFormData]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }))
    }
    if (error) setError("")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nuevosErrores = validarHabilidad(form)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) return

    setError("")
    setIsLoading(true)

    try {
      if (editando && id) {
        await axios.put(`/api/Habilidad/${id}`, { ...form, id: Number(id) })
        toast.success("Habilidad actualizada correctamente")
      } else {
        await axios.post("/api/Habilidad", form)
        toast.success("Habilidad creada correctamente")
      }
      navigate("/habilidades")
    } catch {
      setError("Error al guardar habilidad")
      toast.error("Error al guardar habilidad")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate("/habilidades")
  }

  if (isLoadingData) {
    return <LoadingSpinner message="Cargando habilidad..." />
  }

  return (
    <FormLayout
      title={editando ? "Editar Habilidad" : "Nueva Habilidad"}
      subtitle={editando ? "Modifica los datos de la habilidad" : "Completa la información de la nueva habilidad"}
      icon={<Zap className="h-6 w-6 text-white" />}
      onBack={handleBack}
      isLoading={isLoading}
    >
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Información de la Habilidad" icon={<Zap className="h-5 w-5" />}>
          <div className="space-y-6">
            <FormInputField
              id="nombre"
              name="nombre"
              label="Nombre de la Habilidad"
              placeholder="Ej: Atención al cliente, Cocina, Limpieza..."
              value={form.nombre}
              onChange={handleChange}
              icon={<Zap className="h-4 w-4" />}
              error={errores.nombre}
              required
            />

            <FormInputField
              id="descripcion"
              name="descripcion"
              label="Descripción"
              placeholder="Describe las competencias y conocimientos necesarios..."
              value={form.descripcion}
              onChange={handleChange}
              icon={<FileText className="h-4 w-4" />}
              error={errores.descripcion}
              required
            />
          </div>
        </FormSection>

       

        <FormButtons
          onCancel={handleBack}
          isLoading={isLoading}
          isEditing={editando}
          cancelText="Cancelar"
          submitText={editando ? "Guardar Cambios" : "Crear Habilidad"}
        />

        {/* Footer informativo */}
        <MotionWrapper animation="fadeIn" delay={0.4}>
          <div className="text-center">
            <p className="text-xs text-[#7a5b4c]/60">
              {editando
                ? "Los cambios se aplicarán inmediatamente a todos los empleados que tengan esta habilidad"
                : "Una vez creada, podrás asignar esta habilidad a los empleados"}
            </p>
          </div>
        </MotionWrapper>
      </form>
    </FormLayout>
  )
}

export default HabilidadForm
