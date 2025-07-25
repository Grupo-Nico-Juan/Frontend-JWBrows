"use client"

import type React from "react"
import MotionWrapper from "@/components/animations/motion-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

interface HorarioDisponible {
  fechaHoraInicio: string
  fechaHoraFin: string
  empleadasDisponibles: any[]
}

interface HorariosDisponiblesProps {
  horarios: HorarioDisponible[]
  onTimeSelect: (time: string) => void
}

const HorariosDisponibles: React.FC<HorariosDisponiblesProps> = ({ horarios, onTimeSelect }) => {
  const formatearHora = (fechaHora: string) => {
    return new Date(fechaHora).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (horarios.length === 0) return null

  return (
    <MotionWrapper animation="slideLeft"  delay={0.3}>
      <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
        <CardHeader>
          <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horarios Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {horarios.map((horario, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onTimeSelect(formatearHora(horario.fechaHoraInicio).slice(0, 5))}
                className="text-xs border-[#e0d6cf] hover:bg-[#f3e5e1] hover:border-[#a1887f]"
              >
                {formatearHora(horario.fechaHoraInicio)} - {formatearHora(horario.fechaHoraFin)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </MotionWrapper>
  )
}

export default HorariosDisponibles
