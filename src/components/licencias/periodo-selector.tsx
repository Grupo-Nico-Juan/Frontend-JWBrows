"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface PeriodoSelectorProps {
  desde: string
  hasta: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const PeriodoSelector: React.FC<PeriodoSelectorProps> = ({ desde, hasta, onChange, disabled = false }) => {
  return (
    <MotionWrapper animation="slideRight" delay={0.2}>
      <Card className="bg-white border-[#e1cfc0] shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-[#7a5b4c] flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Período de Licencia
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="desde" className="text-sm font-medium text-[#7a5b4c]">
              Fecha Desde *
            </Label>
            <Input
              id="desde"
              name="desde"
              type="date"
              value={desde}
              onChange={onChange}
              required
              disabled={disabled}
              className="border-[#e1cfc0] focus:border-[#7a5b4c] focus:ring-[#7a5b4c] bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hasta" className="text-sm font-medium text-[#7a5b4c]">
              Fecha Hasta *
            </Label>
            <Input
              id="hasta"
              name="hasta"
              type="date"
              value={hasta}
              onChange={onChange}
              required
              disabled={disabled}
              min={desde}
              className="border-[#e1cfc0] focus:border-[#7a5b4c] focus:ring-[#7a5b4c] bg-white"
            />
          </div>
        </CardContent>
      </Card>
    </MotionWrapper>
  )
}

export default PeriodoSelector
