"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "@/api/AxiosInstance"
import { useNavigate, useParams } from "react-router-dom"
import { User, Briefcase, Save, Plus, MapPin } from "lucide-react"
import { toast } from "sonner"
import FormLayout from "@/components/forms/form-layout"
import FormField from "@/components/forms/form-field"
import FormSelect from "@/components/forms/form-select"
import ColorPicker from "@/components/forms/color-picker"
import FormButtons from "@/components/forms/form-buttons"
import AnimatedError from "@/components/animations/animated-error"
import { useFormData } from "@/hooks/use-form-data"

interface Sucursal {
  id: number
  nombre: string
}

interface EmpleadoFormData {
  nombre: string
  apellido: string
  color: string
  cargo: string
  sucursalId: number
}

const coloresPredefindos = [
  "#7a5b4c",
  "#a37e63",
  "#d4bfae",
  "#8b4513",
  "#cd853f",
  "#daa520",
  "#b8860b",
  "#f4a460",
  "#d2691e",
  "#bc8f8f",
  "#f08080",
  "#cd5c5c",
  "#dc143c",
  "#b22222",
  "#8b0000",
  "#ff6347",
  "#ff4500",
  "#ffa500",
  "#ffd700",
  "#ffff00",
  "#9acd32",
  "#32cd32",
  "#00ff00",
  "#00fa9a",
  "#00ced1",
  "#1e90ff",
  "#0000ff",
  "#4169e1",
  "#8a2be2",
  "#9400d3",
  "#ff1493",
  "#ff69b4",
  "#ffc0cb",
  "#dda0dd",
  "#ee82ee",
]

const EmpleadoForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const editando = !!id
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true)

  const { formData, setFormData, error, setError, isLoading, handleChange, handleSubmit } =
    useFormData<EmpleadoFormData>({
      initialData: {
        nombre: "",
        apellido: "",
        color: "#7a5b4c",
        cargo: "",
        sucursalId: 0,
      },
      onSubmit: async (data) => {
        const dataToSend = {
          id: editando && id ? Number(id) : 0,
          ...data,
          sucursalId: data.sucursalId ? Number(data.sucursalId) : 0,
        }

        const request =
          editando && id ? axios.put(`/api/Empleado/${id}`, dataToSend) : axios.post("/api/Empleado", dataToSend)

        await request
        toast.success(`Empleado ${editando ? "actualizado" : "creado"} correctamente`)
        navigate("/empleados")
      },
    })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        const sucursalesRes = await axios.get("/api/Sucursal")
        setSucursales(sucursalesRes.data)

        if (editando && id) {
          const empleadoRes = await axios.get(`/api/Empleado/${id}`)
          const data = empleadoRes.data
          setFormData({
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            color: data.color || "#7a5b4c",
            cargo: data.cargo || "",
            sucursalId: data.sucursalId || 0,
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
    navigate("/empleados")
  }

  const handleColorChange = (color: string) => {
    setFormData((prev) => ({ ...prev, color }))
    if (error) setError("")
  }

  const sucursalOptions = [
    { value: 0, label: "Sin sucursal asignada" },
    ...sucursales.map((sucursal) => ({
      value: sucursal.id,
      label: sucursal.nombre,
    })),
  ]

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-4">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="w-8 h-8 border-4 border-[#7a5b4c] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-[#7a5b4c] font-medium text-base sm:text-lg">Cargando formulario...</p>
          <p className="text-[#7a5b4c]/60 text-sm mt-2">Esto puede tomar unos segundos</p>
        </div>
      </div>
    )
  }

  return (
    <FormLayout
      title={editando ? "Editar Empleado" : "Nuevo Empleado"}
      subtitle={editando ? "Modifica los datos del empleado" : "Completa la información del nuevo empleado"}
      icon={
        editando ? (
          <User size={24} className="text-white sm:w-8 sm:h-8" />
        ) : (
          <Plus size={24} className="text-white sm:w-8 sm:h-8" />
        )
      }
      onBack={handleBack}
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Información Personal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre del empleado"
            icon={User}
            required
            disabled={isLoading}
            delay={0.3}
            direction="left"
          />
          <FormField
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Apellido del empleado"
            icon={User}
            required
            disabled={isLoading}
            delay={0.35}
            direction="right"
          />
        </div>

        {/* Cargo y Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            placeholder="Ej: Estilista, Manicurista..."
            icon={Briefcase}
            required
            disabled={isLoading}
            delay={0.4}
            direction="left"
          />
          <ColorPicker
            label="Color Identificativo"
            name="color"
            value={formData.color}
            onChange={handleColorChange}
            predefinedColors={coloresPredefindos}
            disabled={isLoading}
            delay={0.45}
            direction="right"
          />
        </div>

        {/* Sucursal */}
        <FormSelect
          label="Sucursal Principal"
          name="sucursalId"
          value={formData.sucursalId}
          onChange={(value) => setFormData((prev) => ({ ...prev, sucursalId: Number(value) }))}
          options={sucursalOptions}
          placeholder="Seleccionar sucursal"
          icon={MapPin}
          disabled={isLoading}
          delay={0.5}
          direction="left"
        />

        {/* Mensaje de error */}
        <AnimatedError error={error} />

        {/* Botones */}
        <FormButtons
          onCancel={handleBack}
          isLoading={isLoading}
          isEditing={editando}
          submitIcon={editando ? Save : Plus}
        />
      </form>
    </FormLayout>
  )
}

export default EmpleadoForm
