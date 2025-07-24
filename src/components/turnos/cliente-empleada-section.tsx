"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { User, Users, Plus, Loader2, Phone } from "lucide-react"
import MotionWrapper from "../animations/motion-wrapper"

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
  // Preparar opciones para el combobox de clientes
  const clienteOptions = clientes.map((cliente) => ({
    value: cliente.id.toString(),
    label: `${cliente.nombre} ${cliente.apellido} - ${cliente.telefono}`,
    searchText: `${cliente.nombre} ${cliente.apellido} ${cliente.telefono}`.toLowerCase(),
  }))

  const clienteSeleccionado = clientes.find((c) => c.id === clienteId)
  const empleadaSeleccionada = empleadas.find((e) => e.id === empleadaId)

  return (
    <MotionWrapper animation="slideLeft" delay={0.3}>
      <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
            <div className="p-2 bg-[#a1887f] rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            Cliente y Empleada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Selección de Cliente con búsqueda */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6d4c41] flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente *
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Combobox
                    options={clienteOptions}
                    value={clienteId > 0 ? clienteId.toString() : ""}
                    onValueChange={onClienteChange}
                    placeholder="Buscar cliente..."
                    searchPlaceholder="Escribe nombre, apellido o teléfono..."
                    emptyText="No se encontraron clientes"
                    className="border-[#e0d6cf] focus:border-[#a1887f]"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onNuevoCliente}
                  className="border-[#e0d6cf] text-[#8d6e63] hover:bg-[#f3e5e1] hover:text-[#6d4c41] hover:border-[#a1887f] bg-transparent"
                  title="Crear nuevo cliente"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6d4c41] flex items-center gap-2">
                <User className="h-4 w-4" />
                Empleada *
              </label>
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
          {/* Información del cliente seleccionado */}
          {clienteSeleccionado && (
            <MotionWrapper
              animation="slideLeft"
              className="mt-4 p-3 bg-[#f8f0ec] rounded-lg border border-[#e0d6cf]"
            >
              <div className="flex items-center gap-2 text-sm text-[#6d4c41]">
                <User className="h-4 w-4" />
                <strong>Cliente:</strong> {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                <Phone className="h-3 w-3 ml-2" />
                <span className="text-[#8d6e63]">{clienteSeleccionado.telefono}</span>
              </div>
            </MotionWrapper>
          )}

          {/* Información de la empleada seleccionada */}
          {empleadaSeleccionada && (
            <MotionWrapper
              animation="slideLeft"
              className="mt-4 p-3 bg-[#f8f0ec] rounded-lg border border-[#e0d6cf]"
            >
              <div className="flex items-center gap-2 text-sm text-[#6d4c41]">
                <User className="h-4 w-4" />
                <strong>Empleada:</strong> {empleadaSeleccionada.nombre} {empleadaSeleccionada.apellido}
                {empleadaSeleccionada.cargo && (
                  <span className="text-[#8d6e63] ml-2">- {empleadaSeleccionada.cargo}</span>
                )}
              </div>
            </MotionWrapper>

          )}
        </CardContent>
      </Card>
    </MotionWrapper>
  )
}

export default ClienteEmpleadaSection

