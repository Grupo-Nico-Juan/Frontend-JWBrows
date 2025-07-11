"use client"
import type React from "react"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Grid3X3, FileText, Building2, ArrowLeft, Save, Loader2, AlertCircle, Layers, X } from "lucide-react"

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

  const handleSelectChange = (value: string) => {
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

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#a1887f]" />
            <span className="text-[#6d4c41] font-medium">Cargando datos...</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] p-6">
      <div className="max-w-2xl mx-auto space-y-6">
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
              onClick={() => navigate("/sectores")}
              className="text-[#8d6e63] hover:text-[#6d4c41] hover:bg-[#f3e5e1]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#a1887f] rounded-lg">
                <Grid3X3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#6d4c41]">{editando ? "Editar Sector" : "Nuevo Sector"}</h1>
                <p className="text-[#8d6e63]">
                  {editando ? "Modifica los datos del sector" : "Completa la información del nuevo sector"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
            <CardHeader>
              <CardTitle className="text-[#6d4c41] flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Información del Sector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6d4c41] flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    Nombre del Sector
                  </label>
                  <Input
                    name="nombre"
                    placeholder="Ej: Peluquería, Manicura, Spa"
                    value={form.nombre}
                    onChange={handleChange}
                    className={`border-[#e0d6cf] focus:border-[#a1887f] ${
                      errores.nombre ? "border-red-300 focus:border-red-500" : ""
                    }`}
                  />
                  <AnimatePresence>
                    {errores.nombre && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-red-600 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errores.nombre}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6d4c41] flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Descripción
                  </label>
                  <Textarea
                    name="descripcion"
                    placeholder="Describe los servicios y características de este sector..."
                    value={form.descripcion}
                    onChange={handleChange}
                    rows={4}
                    className={`border-[#e0d6cf] focus:border-[#a1887f] resize-none ${
                      errores.descripcion ? "border-red-300 focus:border-red-500" : ""
                    }`}
                  />
                  <AnimatePresence>
                    {errores.descripcion && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-red-600 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errores.descripcion}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sucursal */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6d4c41] flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Sucursal
                  </label>
                  <Select value={form.sucursalId.toString()} onValueChange={handleSelectChange}>
                    <SelectTrigger
                      className={`border-[#e0d6cf] focus:border-[#a1887f] ${
                        errores.sucursalId ? "border-red-300 focus:border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Seleccionar sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Seleccionar sucursal</SelectItem>
                      {sucursales.map((sucursal) => (
                        <SelectItem key={sucursal.id} value={sucursal.id.toString()}>
                          {sucursal.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AnimatePresence>
                    {errores.sucursalId && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-red-600 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errores.sucursalId}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Error general */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-700">{error}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setError("")}
                        className="ml-auto h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/sectores")}
                    className="flex-1 border-[#e0d6cf] text-[#8d6e63] hover:bg-[#f3e5e1] hover:text-[#6d4c41]"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editando ? "Guardar Cambios" : "Crear Sector"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default SectorForm
