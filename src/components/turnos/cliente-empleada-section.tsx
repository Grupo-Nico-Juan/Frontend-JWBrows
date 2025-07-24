"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Users, User, Phone, Plus } from "lucide-react"

interface Cliente {
  id: number
  nombre: string
  apellido: string
  telefono: string
}

interface Empleada {
  id: number
  nombre: string
  apellido: string
  sectorId: number
  email?: string
  cargo?: string
}

interface ClienteEmpleadaSectionProps {
  clientes: Cliente[]
  empleadas: Empleada[]
  clienteId: number
  empleadaId: number
  sectorId: number
  loadingEmpleadas: boolean
  onClienteChange: (value: string) => void
  onEmpleadaChange: (value: string) => void
  onNuevoCliente: () => void
}

const ClienteEmpleadaSection: React.FC<ClienteEmpleadaSectionProps> = ({
  clientes,
  empleadas,
  clienteId,
  empleadaId,
  sectorId,
  loadingEmpleadas,
  onClienteChange,
  onEmpleadaChange,
  onNuevoCliente,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
        <CardHeader>
          <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
            <Users className="h-5 w-5" />
            Cliente y Empleada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#6d4c41] flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente
              </Label>
              <div className="flex gap-2">
                <Select value={clienteId === 0 ? "" : String(clienteId)} onValueChange={onClienteChange}>
                  <SelectTrigger className="border-[#e0d6cf] focus:border-[#a1887f] flex-1">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={String(cliente.id)}>
                        <div className="flex items-center gap-2">
                          <span>
                            {cliente.nombre} {cliente.apellido}
                          </span>
                          <Phone className="h-3 w-3 text-[#8d6e63]" />
                          <span className="text-[#8d6e63]">{cliente.telefono}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onNuevoCliente}
                  className="border-[#e0d6cf] text-[#8d6e63] hover:bg-[#f3e5e1] hover:text-[#6d4c41] px-3 bg-transparent"
                  title="Crear nuevo cliente"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#6d4c41] flex items-center gap-2">
                <Users className="h-4 w-4" />
                Empleada
              </Label>
              <Select
                value={empleadaId === 0 ? "" : String(empleadaId)}
                onValueChange={onEmpleadaChange}
                disabled={!sectorId || loadingEmpleadas}
              >
                <SelectTrigger className="border-[#e0d6cf] focus:border-[#a1887f]">
                  <SelectValue placeholder={loadingEmpleadas ? "Cargando empleadas..." : "Seleccionar empleada"} />
                </SelectTrigger>
                <SelectContent>
                  {empleadas.map((empleada) => (
                    <SelectItem key={empleada.id} value={String(empleada.id)}>
                      {empleada.nombre} {empleada.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!sectorId && <p className="text-sm text-[#8d6e63]">Primero selecciona un sector</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ClienteEmpleadaSection
