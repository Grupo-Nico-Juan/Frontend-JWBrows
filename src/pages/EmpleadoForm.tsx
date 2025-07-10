"use client"

import type React from "react"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import axios from "@/api/AxiosInstance"
import { useNavigate, useParams } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { User, Briefcase, ArrowLeft, Save, Plus, AlertCircle, Loader2, MapPin, Palette } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

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
  const [form, setForm] = useState<EmpleadoFormData>({
    nombre: "",
    apellido: "",
    color: "#7a5b4c",
    cargo: "",
    sucursalId: 0,
  })
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        const sucursalesRes = await axios.get("/api/Sucursal")
        setSucursales(sucursalesRes.data)

        if (editando && id) {
          const empleadoRes = await axios.get(`/api/Empleado/${id}`)
          const data = empleadoRes.data
          setForm({
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
  }, [editando, id])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "sucursalId" ? Number(value) : value,
    }))
    if (error) setError("")
  }

  const handleColorChange = (color: string) => {
    setForm((prev) => ({ ...prev, color }))
    if (error) setError("")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const dataToSend = {
      id: editando && id ? Number(id) : 0,
      ...form,
      sucursalId: form.sucursalId ? Number(form.sucursalId) : 0,
    }

    try {
      const request =
        editando && id ? axios.put(`/api/Empleado/${id}`, dataToSend) : axios.post("/api/Empleado", dataToSend)

      await request
      toast.success(`Empleado ${editando ? "actualizado" : "creado"} correctamente`)
      navigate("/empleados")
    } catch {
      setError("Error al guardar el empleado")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate("/empleados")
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
          <p className="text-[#7a5b4c] font-medium text-base sm:text-lg">Cargando formulario...</p>
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
                    <User size={24} className="text-white sm:w-8 sm:h-8" />
                  ) : (
                    <Plus size={24} className="text-white sm:w-8 sm:h-8" />
                  )}
                </motion.div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {editando ? "Editar Empleado" : "Nuevo Empleado"}
                </CardTitle>
                <p className="text-white/80 text-sm mt-2">
                  {editando ? "Modifica los datos del empleado" : "Completa la información del nuevo empleado"}
                </p>
              </div>
            </div>

            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Información Personal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                      <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>Nombre</span>
                      </div>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                      <Input
                        name="nombre"
                        placeholder="Nombre del empleado"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="pl-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                      <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>Apellido</span>
                      </div>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                      <Input
                        name="apellido"
                        placeholder="Apellido del empleado"
                        value={form.apellido}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="pl-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Cargo y Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                      <div className="flex items-center space-x-2">
                        <Briefcase size={16} />
                        <span>Cargo</span>
                      </div>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                      <Input
                        name="cargo"
                        placeholder="Ej: Estilista, Manicurista..."
                        value={form.cargo}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="pl-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                      <div className="flex items-center space-x-2">
                        <Palette size={16} />
                        <span>Color Identificativo</span>
                      </div>
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl border-2 border-[#e1cfc0] shadow-sm"
                          style={{ backgroundColor: form.color }}
                        />
                        <Input
                          type="color"
                          name="color"
                          value={form.color}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="w-20 h-12 p-1 bg-[#fdf6f1] border-2 border-[#e1cfc0] focus:border-[#a37e63] rounded-xl cursor-pointer"
                        />
                        <span className="text-sm text-[#7a5b4c] font-mono">{form.color}</span>
                      </div>
                      <div className="grid grid-cols-8 gap-2">
                        {coloresPredefindos.map((color) => (
                          <motion.button
                            key={color}
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleColorChange(color)}
                            className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                              form.color === color
                                ? "border-[#7a5b4c] shadow-lg"
                                : "border-[#e1cfc0] hover:border-[#a37e63]"
                            }`}
                            style={{ backgroundColor: color }}
                            disabled={isLoading}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Sucursal */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} />
                      <span>Sucursal Principal</span>
                    </div>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5 z-10" />
                    <select
                      name="sucursalId"
                      value={form.sucursalId}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value={0}>Sin sucursal asignada</option>
                      {sucursales.map((sucursal) => (
                        <option key={sucursal.id} value={sucursal.id}>
                          {sucursal.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-[#7a5b4c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
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
                      className="flex items-center space-x-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl"
                    >
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0 sm:w-5 sm:h-5" />
                      <p className="text-sm sm:text-base text-red-600 font-medium">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                          <Plus size={16} className="sm:w-5 sm:h-5" />
                        )}
                        <span>{editando ? "Guardar Cambios" : "Crear Empleado"}</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default EmpleadoForm
