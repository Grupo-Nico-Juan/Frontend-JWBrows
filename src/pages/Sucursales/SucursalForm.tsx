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
import { motion } from "framer-motion"
import { toast } from "sonner"
import { ArrowLeft, Building2, MapPin, Phone, FileText, Loader2, AlertCircle, Save, X, Store } from "lucide-react"

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
  } else if (!/^[\d\s\-+$$$$]+$/.test(form.telefono)) {
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

  if (loading) {
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
              onClick={() => navigate("/sucursales")}
              className="text-[#8d6e63] hover:text-[#6d4c41] hover:bg-[#f8f0ec]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#a1887f] rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#6d4c41]">{editando ? "Editar Sucursal" : "Nueva Sucursal"}</h1>
                <p className="text-[#8d6e63]">
                  {editando ? "Modifica los datos de la sucursal" : "Completa la información de la nueva sucursal"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error general */}
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
            {/* Información básica */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#6d4c41]">
                  <Store className="h-5 w-5" />
                  Información de la Sucursal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-[#6d4c41] font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Nombre de la Sucursal
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Ej: Sucursal Centro"
                    value={form.nombre}
                    onChange={handleChange}
                    className={`border-[#e0d6cf] focus:border-[#a1887f] ${
                      errores.nombre ? "border-red-300 focus:border-red-400" : ""
                    }`}
                  />
                  {errores.nombre && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errores.nombre}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion" className="text-[#6d4c41] font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Dirección Completa
                  </Label>
                  <Textarea
                    id="direccion"
                    name="direccion"
                    placeholder="Ej: Av. Principal 123, Centro, Ciudad"
                    value={form.direccion}
                    onChange={handleChange}
                    rows={3}
                    className={`border-[#e0d6cf] focus:border-[#a1887f] resize-none ${
                      errores.direccion ? "border-red-300 focus:border-red-400" : ""
                    }`}
                  />
                  {errores.direccion && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errores.direccion}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-[#6d4c41] font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono de Contacto
                  </Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    placeholder="Ej: +54 11 1234-5678"
                    value={form.telefono}
                    onChange={handleChange}
                    className={`border-[#e0d6cf] focus:border-[#a1887f] ${
                      errores.telefono ? "border-red-300 focus:border-red-400" : ""
                    }`}
                  />
                  {errores.telefono && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errores.telefono}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vista previa */}
            <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#6d4c41]">
                  <FileText className="h-5 w-5" />
                  Vista Previa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-[#f8f0ec] to-[#f3e5e1] rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#a1887f] rounded-lg">
                      <Store className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#6d4c41]">{form.nombre || "Nombre de la sucursal"}</h3>
                    </div>
                  </div>
                  <div className="space-y-2 ml-11">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-[#8d6e63] mt-0.5 flex-shrink-0" />
                      <span className="text-[#8d6e63]">{form.direccion || "Dirección de la sucursal"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-[#8d6e63] flex-shrink-0" />
                      <span className="text-[#8d6e63]">{form.telefono || "Teléfono de contacto"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/sucursales")}
                className="border-[#e0d6cf] text-[#6d4c41] hover:bg-[#f8f0ec]"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting} className="bg-[#a1887f] hover:bg-[#8d6e63] text-white">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editando ? "Guardar cambios" : "Crear sucursal"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default SucursalForm
