"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building } from "lucide-react"
import CustomCheckbox from "@/components/common/custom-checkbox"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface Sucursal {
  id: number
  nombre: string
  direccion: string
}

interface SucursalesSelectorProps {
  sucursales: Sucursal[]
  selectedIds: number[]
  onToggle: (sucursalId: number, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  disabled?: boolean
}

const SucursalesSelector: React.FC<SucursalesSelectorProps> = ({
  sucursales,
  selectedIds,
  onToggle,
  onSelectAll,
  disabled = false,
}) => {
  const allSelected = selectedIds.length === sucursales.length && sucursales.length > 0

  return (
    <MotionWrapper animation="slideLeft" delay={0.1}>
      <Card className="bg-white border-[#e1cfc0] shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-[#7a5b4c] flex items-center gap-2">
            <Building className="w-5 h-5" />
            Seleccionar Sucursales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seleccionar todas */}
          <div className="p-4 bg-gradient-to-r from-[#fdf6f1] to-[#f8f0e8] rounded-lg border border-[#e1cfc0]">
            <CustomCheckbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={onSelectAll}
              label="Seleccionar todas las sucursales"
              disabled={disabled}
            />
          </div>

          {/* Lista de sucursales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {sucursales.map((sucursal) => (
              <div
                key={sucursal.id}
                className="p-4 bg-white rounded-lg border border-[#e1cfc0] hover:border-[#a37e63] hover:shadow-md transition-all duration-200"
              >
                <CustomCheckbox
                  id={`sucursal-${sucursal.id}`}
                  checked={selectedIds.includes(sucursal.id)}
                  onCheckedChange={(checked) => onToggle(sucursal.id, checked)}
                  label={sucursal.nombre}
                  description={sucursal.direccion}
                  disabled={disabled}
                />
              </div>
            ))}
          </div>

          {selectedIds.length > 0 && (
            <div className="p-3 bg-gradient-to-r from-[#e8f5e8] to-[#f0f9f0] border border-[#c3e6c3] rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-[#2d5a2d]">
                  <strong>{selectedIds.length}</strong> sucursal
                  {selectedIds.length !== 1 ? "es" : ""} seleccionada
                  {selectedIds.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </MotionWrapper>
  )
}

export default SucursalesSelector
