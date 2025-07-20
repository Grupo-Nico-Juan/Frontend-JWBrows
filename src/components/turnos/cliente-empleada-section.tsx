"use client"

import type React from "react"
import MotionWrapper from "@/components/animations/motion-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, User, Phone } from "lucide-react"

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
}) => {
  return (
    <MotionWrapper animation="slideLeft" delay={0.3}>
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
              <Select value={clienteId === 0 ? "" : String(clienteId)} onValueChange={onClienteChange}>
                <SelectTrigger className="border-[#e0d6cf] focus:border-[#a1887f]">
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
    </MotionWrapper>
  )
}

export default ClienteEmpleadaSection
