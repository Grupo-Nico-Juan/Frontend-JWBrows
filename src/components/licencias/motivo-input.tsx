"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface MotivoInputProps {
  motivo: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
}

const MotivoInput: React.FC<MotivoInputProps> = ({ motivo, onChange, disabled = false }) => {
  return (
    <MotionWrapper animation="fadeIn" delay={0.3}>
      <Card className="bg-white border-[#e1cfc0] shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-[#7a5b4c] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Motivo de la Licencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="motivo" className="text-sm font-medium text-[#7a5b4c]">
              Motivo *
            </Label>
            <Textarea
              id="motivo"
              name="motivo"
              value={motivo}
              onChange={onChange}
              placeholder="Ej: Feriado nacional, Cierre temporal, Mantenimiento..."
              required
              disabled={disabled}
              rows={3}
              className="border-[#e1cfc0] focus:border-[#7a5b4c] focus:ring-[#7a5b4c] resize-none bg-white"
            />
          </div>
        </CardContent>
      </Card>
    </MotionWrapper>
  )
}

export default MotivoInput
