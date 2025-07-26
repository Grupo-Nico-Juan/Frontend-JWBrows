"use client"

import type React from "react"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Grid3X3, FileText, Building2, Layers } from "lucide-react"

// Componentes reutilizables
import FormLayout from "@/components/forms/form-layout"
import FormSection from "@/components/forms/form-section"
import FormInputField from "@/components/forms/form-input-field"
import FormTextareaField from "@/components/forms/form-textarea-field"
import FormSelect from "@/components/forms/form-select"
import FormButtons from "@/components/forms/form-buttons"
import LoadingSpinner from "@/components/common/loading-spinner"
import ErrorAlert from "@/components/common/error-alert"

interface SectorFormData {
  nombre: string
  descripcion: string
  sucursalId: string | number
}

interface Sucursal {
  id: number
  nombre: string
}

// Validador integrado
const validarSector = (form: SectorFormData): Partial<Record<keyof SectorFormData, string>> => {
  const errores: Partial<Record<keyof SectorFormData, string>> = {}

  if (!form.nombre.trim()) {
    errores.nombre = "El nombre es requerido"
  } else if (form.nombre.length < 2) {
    errores.nombre = "El nombre debe tener al menos 2 caracteres"
  } else if (form.nombre.length > 100) {
    errores.nombre = "El nombre no puede exceder 100 caracteres"
  }

  if (!form.descripcion.trim()) {
    errores.descripcion = "La descripción es requerida"
  } else if (form.descripcion.length < 5) {
    errores.descripcion = "La descripción debe tener al menos 5 caracteres"
  } else if (form.descripcion.length > 500) {
    errores.descripcion = "La descripción no puede exceder 500 caracteres"
  }

  if (!form.sucursalId || form.sucursalId === "") {
    errores.sucursalId = "Debe seleccionar una sucursal"
  }

  return errores
}

const SectorForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const editando = !!id

  const [form, setForm] = useState<SectorFormData>({
    nombre: "",
    descripcion: "",
    sucursalId: "",
  })

  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [errores, setErrores] = useState<Partial<Record<keyof SectorFormData, string>>>({})
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingData, setLoadingData] = useState<boolean>(false)

  useEffect(() => {
    // Cargar sucursales para el select
    const fetchSucursales = async () => {
      try {
        const res = await axios.get("/api/Sucursal")
        setSucursales(res.data)
      } catch {
        setError("No se pudieron cargar las sucursales")
      }
    }
    fetchSucursales()
  }, [])

  useEffect(() => {
    if (editando && id) {
      setLoadingData(true)
      axios
        .get<SectorFormData>(`/api/Sector/${id}`)
        .then((res) => setForm(res.data))
        .catch(() => setError("No se pudo cargar el sector"))
        .finally(() => setLoadingData(false))
    }
  }, [editando, id])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name as keyof SectorFormData]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSelectChange = (value: string | number) => {
    setForm((f) => ({ ...f, sucursalId: value === "" ? "" : Number(value) }))

    // Limpiar error del campo
    if (errores.sucursalId) {
      setErrores((prev) => ({ ...prev, sucursalId: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nuevosErrores = validarSector(form)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) return

    setError("")
    setLoading(true)

    try {
      if (editando && id) {
        await axios.put(`/api/Sector/${id}`, { ...form, id: Number(id) })
        toast.success("Sector actualizado correctamente")
      } else {
        await axios.post("/api/Sector", form)
        toast.success("Sector creado correctamente")
      }
      navigate("/sectores")
    } catch (err) {
      setError("Error al guardar sector")
      toast.error("Error al guardar el sector")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => navigate("/sectores")

  if (loadingData) {
    return <LoadingSpinner message="Cargando datos..." />
  }

  // Preparar opciones para el select
  const sucursalOptions = sucursales.map((sucursal) => ({
    value: sucursal.id,
    label: sucursal.nombre,
  }))

  return (
    <FormLayout
      title={editando ? "Editar Sector" : "Nuevo Sector"}
      subtitle={editando ? "Modifica los datos del sector" : "Completa la información del nuevo sector"}
      icon={<Grid3X3 className="h-6 w-6 text-white" />}
      onBack={handleBack}
      isLoading={loading}
    >
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Información del Sector" icon={<Layers className="h-5 w-5" />}>
          <div className="space-y-6">
            <FormInputField
              id="nombre"
              name="nombre"
              label="Nombre del Sector"
              placeholder="Ej: Peluquería, Manicura, Spa"
              value={form.nombre}
              onChange={handleChange}
              icon={<Grid3X3 className="h-4 w-4" />}
              error={errores.nombre}
              required
            />

            <FormTextareaField
              id="descripcion"
              name="descripcion"
              label="Descripción"
              placeholder="Describe los servicios y características de este sector..."
              value={form.descripcion}
              onChange={handleChange}
              icon={<FileText className="h-4 w-4" />}
              error={errores.descripcion}
              rows={4}
            />

            <FormSelect
              label="Sucursal"
              name="sucursalId"
              value={form.sucursalId}
              onChange={handleSelectChange}
              options={sucursalOptions}
              placeholder="Seleccionar sucursal"
              required
              icon={Building2}
            />
            {errores.sucursalId && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                <Grid3X3 className="h-3 w-3" />
                {errores.sucursalId}
              </p>
            )}
          </div>
        </FormSection>

        <FormButtons
          onCancel={handleBack}
          isLoading={loading}
          isEditing={editando}
          cancelText="Cancelar"
          submitText={editando ? "Guardar Cambios" : "Crear Sector"}
        />
      </form>
    </FormLayout>
  )
}

export default SectorForm
