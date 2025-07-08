"use client"

import type React from "react"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import axios from "../api/AxiosInstance"
import { useNavigate, useParams } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Briefcase,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  Plus,
  Edit3,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface EmpleadoFormData {
  nombre: string
  apellido: string
  email: string
  passwordPlano: string
  cargo: string
}

const EmpleadoForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const editando = !!id

  const [form, setForm] = useState<EmpleadoFormData>({
    nombre: "",
    apellido: "",
    email: "",
    passwordPlano: "",
    cargo: "",
  })

  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  useEffect(() => {
    if (editando && id) {
      setIsLoadingData(true)
      axios
        .get<EmpleadoFormData>(`/api/Empleado/${id}`)
        .then((res) => setForm({ ...res.data, passwordPlano: "" }))
        .catch(() => setError("No se pudo cargar el empleado"))
        .finally(() => setIsLoadingData(false))
    }
  }, [editando, id])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (editando && id) {
        const { passwordPlano, ...rest } = form
        await axios.put(`/api/Empleado/${id}`, passwordPlano ? form : rest)
        toast.success("Empleado actualizado correctamente")
      } else {
        await axios.post("/api/Empleado", form)
        toast.success("Empleado creado correctamente")
      }
      navigate("/empleados")
    } catch (err) {
      setError("Error al guardar empleado")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate("/empleados")
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 size={32} className="text-[#7a5b4c] animate-spin" />
          </div>
          <p className="text-[#7a5b4c] font-medium">Cargando datos del empleado...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-4 py-8">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#d4bfae] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#a37e63] rounded-full opacity-10 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] p-6 text-center relative">
            {/* Botón de volver */}
            <button
              onClick={handleBack}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <ArrowLeft size={20} />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              {editando ? <Edit3 size={32} className="text-white" /> : <UserPlus size={32} className="text-white" />}
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">
              {editando ? "Editar Empleado" : "Nuevo Empleado"}
            </CardTitle>
            <p className="text-white/80 text-sm mt-2">
              {editando ? "Modifica los datos del empleado" : "Completa la información del nuevo empleado"}
            </p>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-4 h-4" />
                    <Input
                      name="nombre"
                      placeholder="Nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="pl-9 h-11 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200 text-sm"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="relative"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-4 h-4" />
                    <Input
                      name="apellido"
                      placeholder="Apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="pl-9 h-11 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200 text-sm"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Email y Password */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-4 h-4" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      disabled={editando || isLoading}
                      className={`pl-9 h-11 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200 text-sm ${
                        editando ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                  {editando && <p className="text-xs text-[#7a5b4c]/60 mt-1">El email no se puede modificar</p>}
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="relative"
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-4 h-4" />
                    <Input
                      name="passwordPlano"
                      type={showPassword ? "text" : "password"}
                      placeholder={editando ? "Nueva contraseña (opcional)" : "Contraseña"}
                      value={form.passwordPlano}
                      onChange={handleChange}
                      required={!editando}
                      disabled={isLoading}
                      className="pl-9 pr-9 h-11 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] hover:text-[#a37e63] transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Cargo */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                  <Input
                    name="cargo"
                    placeholder="Cargo (Encargado, Empleada, Limpieza, etc.)"
                    value={form.cargo}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="pl-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
                  />
                </div>
              </motion.div>

              {/* Mensaje de error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botones */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="flex justify-end gap-3 pt-4"
              >
                <motion.button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#7a5b4c] font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{editando ? "Guardando..." : "Creando..."}</span>
                    </>
                  ) : (
                    <>
                      {editando ? <Save size={16} /> : <Plus size={16} />}
                      <span>{editando ? "Guardar cambios" : "Crear empleado"}</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Footer informativo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-[#7a5b4c]/60">
                {editando
                  ? "Los cambios se aplicarán inmediatamente"
                  : "El empleado recibirá sus credenciales por email"}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default EmpleadoForm
