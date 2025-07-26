"use client"

import type React from "react"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Scissors, FileText, Clock, DollarSign, MapPin, Building2 } from "lucide-react"

// Componentes reutilizables
import FormLayout from "@/components/forms/form-layout"
import FormSection from "@/components/forms/form-section"
import FormField from "@/components/forms/form-field"
import FormTextareaField from "@/components/forms/form-textarea-field"
import FormSelect from "@/components/forms/form-select"
import FormButtons from "@/components/forms/form-buttons"
import LoadingSpinner from "@/components/common/loading-spinner"
import ErrorAlert from "@/components/common/error-alert"

interface Sucursal {
  id: number
  nombre: string
}

interface Sector {
  id: number
  nombre: string
  sucursalId: number
}

interface ServicioFormData {
  nombre: string
  descripcion: string
  duracionMinutos: number | ""
  precio: number | ""
  sucursalId: number | ""
  sectorId: number | ""
}

const ServicioForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const editando = !!id

  const [form, setForm] = useState<ServicioFormData>({
    nombre: "",
    descripcion: "",
    duracionMinutos: "",
    precio: "",
    sucursalId: "",
    sectorId: "",
  })

  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [sectores, setSectores] = useState<Sector[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [initialLoading, setInitialLoading] = useState<boolean>(true)

  // Cargar sucursales al montar
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const sucursalesRes = await axios.get("/api/Sucursal")
        setSucursales(sucursalesRes.data)

        // Si está editando, cargar datos del servicio
        if (editando && id) {
          const servicioRes = await axios.get(`/api/Servicio/${id}`)
          setForm({
            nombre: servicioRes.data.nombre ?? "",
            descripcion: servicioRes.data.descripcion ?? "",
            duracionMinutos: servicioRes.data.duracionMinutos ?? "",
            precio: servicioRes.data.precio ?? "",
            sucursalId: servicioRes.data.sucursalId ?? "",
            sectorId: servicioRes.data.sectorId ?? "",
          })
        }
      } catch {
        setError("No se pudieron cargar los datos iniciales")
      } finally {
        setInitialLoading(false)
      }
    }

    loadInitialData()
  }, [editando, id])

  // Cargar sectores cuando cambia la sucursal seleccionada
  useEffect(() => {
    if (form.sucursalId) {
      axios
        .get(`/api/Sector`)
        .then((res) => {
          setSectores(res.data.filter((s: Sector) => s.sucursalId === form.sucursalId))
        })
        .catch(() => setError("No se pudieron cargar los sectores"))
    } else {
      setSectores([])
      setForm((f) => ({ ...f, sectorId: "" }))
    }
  }, [form.sucursalId])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({
      ...f,
      [name]: name === "duracionMinutos" || name === "precio" ? (value === "" ? "" : Number(value)) : value,
    }))
  }

  const handleSelectChange = (name: string) => (value: string | number) => {
    setForm((f) => ({
      ...f,
      [name]: value === "" ? "" : Number(value),
    }))
    // Si cambia la sucursal, resetea el sector
    if (name === "sucursalId") {
      setForm((f) => ({ ...f, sectorId: "" }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (editando && id) {
        // Agrega el id al body
        const payload = { ...form, id: Number(id) }
        await axios.put(`/api/Servicio/${id}`, payload)
        toast.success("Servicio actualizado correctamente")
      } else {
        await axios.post("/api/Servicio", form)
        toast.success("Servicio creado correctamente")
      }
      navigate("/servicios")
    } catch (err) {
      setError("Error al guardar servicio")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => navigate("/servicios")

  if (initialLoading) {
    return <LoadingSpinner message="Cargando..." />
  }

  return (
    <FormLayout
      title={editando ? "Editar Servicio" : "Nuevo Servicio"}
      subtitle={editando ? "Modifica los datos del servicio" : "Completa la información del nuevo servicio"}
      icon={<Scissors className="h-6 w-6 text-white" />}
      onBack={handleBack}
      isLoading={loading}
    >
      <div className="space-y-6">
        {error && <ErrorAlert message={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del Servicio */}
          <FormSection title="Información del Servicio" icon={<FileText className="h-5 w-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nombre del Servicio"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                icon={Scissors}
                placeholder="Ej: Corte de cabello"
                required
                delay={0.2}
              />
              <FormField
                label="Precio"
                name="precio"
                value={String(form.precio)}
                onChange={handleChange}
                icon={DollarSign}
                placeholder="0.00"
                type="number"
                required
                delay={0.3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Duración (minutos)"
                name="duracionMinutos"
                value={String(form.duracionMinutos)}
                onChange={handleChange}
                icon={Clock}
                placeholder="30"
                type="number"
                required
                delay={0.4}
              />
            </div>

            <FormTextareaField
              id="descripcion"
              name="descripcion"
              label="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              icon={<FileText className="h-4 w-4" />}
              placeholder="Describe el servicio en detalle..."
              rows={3}
            />
          </FormSection>

          {/* Ubicación */}
          <FormSection title="Ubicación" icon={<MapPin className="h-5 w-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label="Sucursal"
                name="sucursalId"
                value={form.sucursalId}
                onChange={handleSelectChange("sucursalId")}
                icon={Building2}
                placeholder="Seleccionar sucursal"
                options={sucursales.map((s) => ({ value: s.id, label: s.nombre }))}
                required
                delay={0.3}
              />
              <FormSelect
                label="Sector"
                name="sectorId"
                value={form.sectorId}
                onChange={handleSelectChange("sectorId")}
                icon={MapPin}
                placeholder="Seleccionar sector"
                options={sectores.map((s) => ({ value: s.id, label: s.nombre }))}
                disabled={!form.sucursalId}
                delay={0.4}
              />
            </div>
            {!form.sucursalId && <p className="text-sm text-[#8d6e63] mt-2">Primero selecciona una sucursal</p>}
          </FormSection>

          {/* Botones de acción */}
          <FormButtons onCancel={handleBack} isLoading={loading} isEditing={editando} delay={0.5} />
        </form>
      </div>
    </FormLayout>
  )
}

export default ServicioForm
