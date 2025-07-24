"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { User, Phone, Mail, Loader2, Save, X } from "lucide-react"
import { motion } from "framer-motion"

interface NuevoClienteData {
  nombre: string
  apellido: string
  telefono: string
  email?: string
}

interface NuevoClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onClienteCreado: (cliente: { id: number; nombre: string; apellido: string; telefono: string }) => void
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

  const [errors, setErrors] = useState<Partial<NuevoClienteData>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof NuevoClienteData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<NuevoClienteData> = {}

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
      newErrors.email = "El email no es válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
      // Limpiar formulario después del éxito
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
      })
      setErrors({})
    } catch (error) {
      // El error se maneja en el componente padre
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
      })
      setErrors({})
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-[#e0d6cf]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#6d4c41] flex items-center gap-2">
            <div className="p-2 bg-[#a1887f] rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            Crear Nuevo Cliente
          </DialogTitle>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="bg-[#fdf6f1] border-[#e0d6cf]">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label className="text-[#6d4c41] flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nombre *
                  </Label>
                  <Input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingresa el nombre"
                    className="border-[#e0d6cf] focus:border-[#a1887f]"
                    disabled={isLoading}
                  />
                  {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}
                </div>

                {/* Apellido */}
                <div className="space-y-2">
                  <Label className="text-[#6d4c41] flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Apellido *
                  </Label>
                  <Input
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Ingresa el apellido"
                    className="border-[#e0d6cf] focus:border-[#a1887f]"
                    disabled={isLoading}
                  />
                  {errors.apellido && <p className="text-sm text-red-600">{errors.apellido}</p>}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label className="text-[#6d4c41] flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono *
                  </Label>
                  <Input
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Ej: 1234567890"
                    className="border-[#e0d6cf] focus:border-[#a1887f]"
                    disabled={isLoading}
                  />
                  {errors.telefono && <p className="text-sm text-red-600">{errors.telefono}</p>}
                </div>

                {/* Email (opcional) */}
                <div className="space-y-2">
                  <Label className="text-[#6d4c41] flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email (opcional)
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="cliente@ejemplo.com"
                    className="border-[#e0d6cf] focus:border-[#a1887f]"
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

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
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default NuevoClienteModal
