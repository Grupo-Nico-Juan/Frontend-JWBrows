"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Phone, Mail, Save, X, Loader2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Cliente {
  id: number
  nombre: string
  apellido: string
  telefono: string
}

interface NuevoClienteData {
  nombre: string
  apellido: string
  telefono: string
  email?: string
}

interface NuevoClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onClienteCreado: (cliente: Cliente) => void
  isLoading: boolean
  onSubmit: (data: NuevoClienteData) => Promise<void>
}

const NuevoClienteModal: React.FC<NuevoClienteModalProps> = ({
  isOpen,
  onClose,
  onClienteCreado,
  isLoading,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<NuevoClienteData>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState("")

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido"
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    } else if (!/^\d{8,15}$/.test(formData.telefono.replace(/\s/g, ""))) {
      newErrors.telefono = "El teléfono debe tener entre 8 y 15 dígitos"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no tiene un formato válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
      // Si llegamos aquí, el cliente se creó exitosamente
      handleClose()
    } catch (error) {
      setSubmitError("Error al crear el cliente. Por favor, intenta nuevamente.")
    }
  }

  const handleClose = () => {
    setFormData({
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
    })
    setErrors({})
    setSubmitError("")
    onClose()
  }

  const handleInputChange = (field: keyof NuevoClienteData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-[#e0d6cf]">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#6d4c41] flex items-center gap-2">
            <div className="p-2 bg-[#a1887f] rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            Crear Nuevo Cliente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="bg-white/50 border-[#e0d6cf]">
            <CardContent className="pt-6 space-y-4">
              {/* Error general */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">{submitError}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-[#6d4c41] flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nombre *
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Ingresa el nombre"
                  className={`border-[#e0d6cf] focus:border-[#a1887f] ${
                    errors.nombre ? "border-red-300 focus:border-red-400" : ""
                  }`}
                  disabled={isLoading}
                />
                {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <Label htmlFor="apellido" className="text-[#6d4c41] flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Apellido *
                </Label>
                <Input
                  id="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => handleInputChange("apellido", e.target.value)}
                  placeholder="Ingresa el apellido"
                  className={`border-[#e0d6cf] focus:border-[#a1887f] ${
                    errors.apellido ? "border-red-300 focus:border-red-400" : ""
                  }`}
                  disabled={isLoading}
                />
                {errors.apellido && <p className="text-sm text-red-600">{errors.apellido}</p>}
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-[#6d4c41] flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono *
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="Ingresa el teléfono"
                  className={`border-[#e0d6cf] focus:border-[#a1887f] ${
                    errors.telefono ? "border-red-300 focus:border-red-400" : ""
                  }`}
                  disabled={isLoading}
                />
                {errors.telefono && <p className="text-sm text-red-600">{errors.telefono}</p>}
              </div>

              {/* Email (opcional) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#6d4c41] flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email (opcional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Ingresa el email"
                  className={`border-[#e0d6cf] focus:border-[#a1887f] ${
                    errors.email ? "border-red-300 focus:border-red-400" : ""
                  }`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-[#e0d6cf] text-[#8d6e63] hover:bg-[#f3e5e1] hover:text-[#6d4c41] bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#a1887f] hover:bg-[#8d6e63] text-white min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Cliente
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NuevoClienteModal
