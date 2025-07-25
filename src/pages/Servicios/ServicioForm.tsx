"use client"
import type React from "react"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  ArrowLeft,
  Scissors,
  FileText,
  Clock,
  DollarSign,
  MapPin,
  Building2,
  Loader2,
  AlertCircle,
  Save,
  X,
} from "lucide-react"

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

  const handleSelectChange = (name: string, value: string) => {
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

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#a1887f]" />
            <span className="text-[#6d4c41] font-medium">Cargando...</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg border border-[#e0d6cf] p-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/servicios")}
              className="text-[#8d6e63] hover:text-[#6d4c41] hover:bg-[#f3e5e1]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#a1887f] rounded-lg">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#6d4c41]">{editando ? "Editar Servicio" : "Nuevo Servicio"}</h1>
                <p className="text-[#8d6e63]">
                  {editando ? "Modifica los datos del servicio" : "Completa la información del nuevo servicio"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </motion.div>
        )}

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Servicio */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardHeader>
                <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Información del Servicio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-[#6d4c41] flex items-center gap-2">
                      <Scissors className="h-4 w-4" />
                      Nombre del Servicio
                    </Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      placeholder="Ej: Corte de cabello"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      className="border-[#e0d6cf] focus:border-[#a1887f]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="precio" className="text-[#6d4c41] flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Precio
                    </Label>
                    <Input
                      id="precio"
                      name="precio"
                      type="number"
                      placeholder="0.00"
                      value={form.precio}
                      onChange={handleChange}
                      required
                      min={0}
                      step="0.01"
                      className="border-[#e0d6cf] focus:border-[#a1887f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duracionMinutos" className="text-[#6d4c41] flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Duración (minutos)
                    </Label>
                    <Input
                      id="duracionMinutos"
                      name="duracionMinutos"
                      type="number"
                      placeholder="30"
                      value={form.duracionMinutos}
                      onChange={handleChange}
                      required
                      min={1}
                      className="border-[#e0d6cf] focus:border-[#a1887f]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion" className="text-[#6d4c41] flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Descripción
                  </Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    placeholder="Describe el servicio en detalle..."
                    value={form.descripcion}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="border-[#e0d6cf] focus:border-[#a1887f] resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ubicación */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardHeader>
                <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#6d4c41] flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Sucursal
                    </Label>
                    <Select
                      value={form.sucursalId === "" ? "" : String(form.sucursalId)}
                      onValueChange={(value) => handleSelectChange("sucursalId", value)}
                    >
                      <SelectTrigger className="border-[#e0d6cf] focus:border-[#a1887f]">
                        <SelectValue placeholder="Seleccionar sucursal" />
                      </SelectTrigger>
                      <SelectContent>
                        {sucursales.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#6d4c41] flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Sector
                    </Label>
                    <Select
                      value={form.sectorId === "" ? "" : String(form.sectorId)}
                      onValueChange={(value) => handleSelectChange("sectorId", value)}
                      disabled={!form.sucursalId}
                    >
                      <SelectTrigger className="border-[#e0d6cf] focus:border-[#a1887f]">
                        <SelectValue placeholder="Seleccionar sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectores.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!form.sucursalId && <p className="text-sm text-[#8d6e63]">Primero selecciona una sucursal</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardContent className="pt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/servicios")}
                    className="border-[#e0d6cf] text-[#8d6e63] hover:bg-[#f3e5e1] hover:text-[#6d4c41]"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-[#a1887f] hover:bg-[#8d6e63] text-white">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editando ? "Guardar cambios" : "Crear servicio"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ServicioForm
