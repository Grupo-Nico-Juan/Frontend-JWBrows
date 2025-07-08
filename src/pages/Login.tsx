"use client"

import type React from "react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../api/AxiosInstance"
import { useAuth } from "../context/AuthContext"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { LogIn, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type AuthContextType = {
  login: (token: string) => void
}

interface FormData {
  email: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth() as AuthContextType
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await axios.post("api/Usuario/login", formData)
      const token: string = response.data.token

      if (token) {
        login(token)
        const payload = JSON.parse(atob(token.split(".")[1]))
        const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        const tipoUsuario = payload[ROLE_CLAIM] || payload.role

        if (tipoUsuario === "Administrador") {
          navigate("/menu-admin")
        } else if (tipoUsuario === "Empleado") {
          navigate("/turnos")
        } else {
          setError("Tipo de usuario no válido.")
        }
      } else {
        setError("Token no recibido. Verifica la respuesta del servidor.")
      }
    } catch (err) {
      console.error(err)
      setError("Credenciales incorrectas o error de servidor.")
    } finally {
      setIsLoading(false)
    }
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
        className="relative z-10"
      >
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <LogIn size={32} className="text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">Bienvenido</CardTitle>
            <p className="text-white/80 text-sm mt-2">Ingresa tus credenciales para continuar</p>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Email */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="pl-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
                  />
                </div>
              </motion.div>

              {/* Campo Password */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] hover:text-[#a37e63] transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              {/* Botón de submit */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  className="w-full h-12 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Ingresando...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Ingresar</span>
                    </>
                  )}
                </motion.button>
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
            </form>

            {/* Footer opcional */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-[#7a5b4c]/60">¿Problemas para acceder? Contacta al administrador</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Login
