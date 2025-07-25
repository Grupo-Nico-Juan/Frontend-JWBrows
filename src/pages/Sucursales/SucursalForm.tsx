"use client"

import type React from "react"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Building2, MapPin, Phone, Store } from "lucide-react"
import PageLayout from "@/components/common/page-layout"
import LoadingSpinner from "@/components/common/loading-spinner"
import ErrorAlert from "@/components/common/error-alert"
import FormHeader from "@/components/forms/form-header"
import FormSection from "@/components/forms/form-section"
import FormInputField from "@/components/forms/form-input-field"
import FormTextareaField from "@/components/forms/form-textarea-field"
import FormButtons from "@/components/forms/form-buttons"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface SucursalFormData {
  nombre: string
  direccion: string
  telefono: string
}

// Validador simple para la sucursal
const validarSucursal = (form: SucursalFormData): Partial<Record<keyof SucursalFormData, string>> => {
  const errores: Partial<Record<keyof SucursalFormData, string>> = {}

  if (!form.nombre.trim()) {
    errores.nombre = "El nombre es requerido"
  } else if (form.nombre.length < 2) {
    errores.nombre = "El nombre debe tener al menos 2 caracteres"
  } else if (form.nombre.length > 100) {
    errores.nombre = "El nombre no puede exceder 100 caracteres"
  }

  if (!form.direccion.trim()) {
    errores.direccion = "La dirección es requerida"
  } else if (form.direccion.length < 5) {
    errores.direccion = "La dirección debe tener al menos 5 caracteres"
  } else if (form.direccion.length > 200) {
    errores.direccion = "La dirección no puede exceder 200 caracteres"
  }

  if (!form.telefono.trim()) {
    errores.telefono = "El teléfono es requerido"
  } else if (!/^[\d\s\-+()]+$/.test(form.telefono)) {
    errores.telefono = "El teléfono solo puede contener números, espacios, guiones y paréntesis"
  } else if (form.telefono.replace(/\D/g, "").length < 7) {
    errores.telefono = "El teléfono debe tener al menos 7 dígitos"
  }

  return errores
}

const SucursalForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const editando = !!id

  const [form, setForm] = useState<SucursalFormData>({
    nombre: "",
    direccion: "",
    telefono: "",
  })

  const [errores, setErrores] = useState<Partial<Record<keyof SucursalFormData, string>>>({})
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (editando && id) {
      setLoading(true)
      axios
        .get<SucursalFormData>(`/api/Sucursal/${id}`)
        .then((res) => setForm(res.data))
        .catch(() => setError("No se pudo cargar la sucursal"))
        .finally(() => setLoading(false))
    }
  }, [editando, id])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errores[name as keyof SucursalFormData]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nuevosErrores = validarSucursal(form)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      toast.error("Por favor corrige los errores en el formulario")
      return
    }

    setError("")
    setSubmitting(true)

    try {
      if (editando && id) {
        await axios.put(`/api/Sucursal/${id}`, { ...form, id: Number(id) })
        toast.success("Sucursal actualizada correctamente")
      } else {
        await axios.post("/api/Sucursal", form)
        toast.success("Sucursal creada correctamente")
      }
      navigate("/sucursales")
    } catch (err) {
      setError("Error al guardar sucursal")
      toast.error("Error al guardar la sucursal")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/sucursales")
  }

  if (loading) {
    return <LoadingSpinner message="Cargando..." />
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <FormHeader
          title={editando ? "Editar Sucursal" : "Nueva Sucursal"}
          subtitle={editando ? "Modifica los datos de la sucursal" : "Completa la información de la nueva sucursal"}
          icon={<Building2 className="h-6 w-6 text-white" />}
          onBack={handleCancel}
          isLoading={submitting}
        />

        {error && (
          <MotionWrapper animation="fadeIn" delay={0.1}>
            <ErrorAlert message={error} onDismiss={() => setError("")} />
          </MotionWrapper>
        )}

        <MotionWrapper animation="slideLeft" delay={0.2}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="Información de la Sucursal" icon={<Store className="h-5 w-5" />}>
              <FormInputField
                id="nombre"
                name="nombre"
                label="Nombre de la Sucursal"
                placeholder="Ej: Sucursal Centro"
                value={form.nombre}
                onChange={handleChange}
                icon={<Building2 className="h-4 w-4" />}
                error={errores.nombre}
                disabled={submitting}
              />

              <FormTextareaField
                id="direccion"
                name="direccion"
                label="Dirección Completa"
                placeholder="Ej: Av. Principal 123, Centro, Ciudad"
                value={form.direccion}
                onChange={handleChange}
                icon={<MapPin className="h-4 w-4" />}
                error={errores.direccion}
                rows={3}
                disabled={submitting}
              />

              <FormInputField
                id="telefono"
                name="telefono"
                label="Teléfono de Contacto"
                placeholder="Ej: +54 11 1234-5678"
                value={form.telefono}
                onChange={handleChange}
                icon={<Phone className="h-4 w-4" />}
                error={errores.telefono}
                disabled={submitting}
              />
            </FormSection>

            <FormButtons
              onCancel={handleCancel}
              isLoading={submitting}
              isEditing={editando}
              disabled={Object.keys(errores).length > 0}
            />
          </form>
        </MotionWrapper>
      </div>
    </PageLayout>
  )
}

export default SucursalForm
