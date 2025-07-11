"use client"

import type React from "react"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useParams } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Zap, FileText, Save, Plus, ArrowLeft, Loader2, AlertCircle, Edit3, CheckCircle, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Tipos para el validador (asumiendo que existe)
interface HabilidadFormData {
  nombre: string
  descripcion: string
}

// Función de validación simulada (reemplaza con tu validador real)
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
          <p className="text-[#7a5b4c] font-medium text-base sm:text-lg">Cargando habilidad...</p>
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
                    <Edit3 size={24} className="text-white sm:w-8 sm:h-8" />
                  ) : (
                    <Plus size={24} className="text-white sm:w-8 sm:h-8" />
                  )}
                </motion.div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {editando ? "Editar Habilidad" : "Nueva Habilidad"}
                </CardTitle>
                <p className="text-white/80 text-sm mt-2">
                  {editando ? "Modifica los datos de la habilidad" : "Completa la información de la nueva habilidad"}
                </p>
              </div>
            </div>

            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Campo Nombre */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                    <div className="flex items-center space-x-2">
                      <Zap size={16} />
                      <span>Nombre de la Habilidad</span>
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                    <Input
                      name="nombre"
                      placeholder="Ej: Atención al cliente, Cocina, Limpieza..."
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className={`pl-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 transition-all duration-200 rounded-xl ${
                        errores.nombre
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20"
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {errores.nombre && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center space-x-2 mt-2 text-red-600"
                      >
                        <AlertCircle size={14} />
                        <p className="text-sm">{errores.nombre}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Campo Descripción */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                    <div className="flex items-center space-x-2">
                      <FileText size={16} />
                      <span>Descripción</span>
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                    <Input
                      name="descripcion"
                      placeholder="Describe las competencias y conocimientos necesarios..."
                      value={form.descripcion}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className={`pl-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 transition-all duration-200 rounded-xl ${
                        errores.descripcion
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20"
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {errores.descripcion && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center space-x-2 mt-2 text-red-600"
                      >
                        <AlertCircle size={14} />
                        <p className="text-sm">{errores.descripcion}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Mensaje de error general */}
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

                {/* Información adicional */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 text-sm">Consejos para crear habilidades</h4>
                      <ul className="text-blue-700 text-xs mt-2 space-y-1">
                        <li>• Usa nombres descriptivos y específicos</li>
                        <li>• Incluye los conocimientos y competencias necesarios</li>
                        <li>• Considera el nivel de experiencia requerido</li>
                        <li>• Mantén la descripción clara y concisa</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

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
                          <CheckCircle size={16} className="sm:w-5 sm:h-5" />
                        )}
                        <span>{editando ? "Guardar Cambios" : "Crear Habilidad"}</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Footer informativo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-center"
              >
                <p className="text-xs text-[#7a5b4c]/60">
                  {editando
                    ? "Los cambios se aplicarán inmediatamente a todos los empleados que tengan esta habilidad"
                    : "Una vez creada, podrás asignar esta habilidad a los empleados"}
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default HabilidadForm
