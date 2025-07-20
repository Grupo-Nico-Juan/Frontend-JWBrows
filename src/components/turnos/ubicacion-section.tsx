"use client"

import type React from "react"
import MotionWrapper from "@/components/animations/motion-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Building2 } from "lucide-react"

interface Sucursal {
  id: number
  nombre: string
  direccion: string
}

interface Sector {
  id: number
  nombre: string
  sucursalId: number
}

interface UbicacionSectionProps {
  sucursales: Sucursal[]
  sectores: Sector[]
  sucursalId: number
  sectorId: number
  loadingSectores: boolean
  onSucursalChange: (value: string) => void
  onSectorChange: (value: string) => void
}

const UbicacionSection: React.FC<UbicacionSectionProps> = ({
  sucursales,
  sectores,
  sucursalId,
  sectorId,
  loadingSectores,
  onSucursalChange,
  onSectorChange,
}) => {
  return (
    <MotionWrapper animation="slideLeft" delay={0.3}>
      <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
        <CardHeader>
          <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#6d4c41] flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Sucursal
              </Label>
              <Select value={sucursalId === 0 ? "" : String(sucursalId)} onValueChange={onSucursalChange}>
                <SelectTrigger className="border-[#e0d6cf] focus:border-[#a1887f]">
                  <SelectValue placeholder="Seleccionar sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {sucursales.map((sucursal) => (
                    <SelectItem key={sucursal.id} value={String(sucursal.id)}>
                      {sucursal.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#6d4c41] flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Sector
              </Label>
              <Select
                value={sectorId === 0 ? "" : String(sectorId)}
                onValueChange={onSectorChange}
                disabled={!sucursalId || loadingSectores}
              >
                <SelectTrigger className="border-[#e0d6cf] focus:border-[#a1887f]">
                  <SelectValue placeholder={loadingSectores ? "Cargando sectores..." : "Seleccionar sector"} />
                </SelectTrigger>
                <SelectContent>
                  {sectores.map((sector) => (
                    <SelectItem key={sector.id} value={String(sector.id)}>
                      {sector.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!sucursalId && <p className="text-sm text-[#8d6e63]">Primero selecciona una sucursal</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </MotionWrapper>
  )
}

export default UbicacionSection
