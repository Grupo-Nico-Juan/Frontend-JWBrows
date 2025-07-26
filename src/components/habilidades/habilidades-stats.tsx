"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle2, Plus } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface HabilidadesStatsProps {
  totalHabilidades: number
  habilidadesAsignadas: number
  habilidadesSinAsignar: number
}

const HabilidadesStats: React.FC<HabilidadesStatsProps> = ({
  totalHabilidades,
  habilidadesAsignadas,
  habilidadesSinAsignar,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MotionWrapper animation="slideUp" delay={0.1}>
        <Card className="bg-[#f3e5e1] border-[#e0d6cf]">
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#a1887f]" />
              <span className="text-[#6d4c41] font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold text-[#6d4c41]">{totalHabilidades}</p>
          </CardContent>
        </Card>
      </MotionWrapper>

      <MotionWrapper animation="slideUp" delay={0.2}>
        <Card className="bg-green-50 border-green-200">
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Asignadas</span>
            </div>
            <p className="text-2xl font-bold text-green-800">{habilidadesAsignadas}</p>
          </CardContent>
        </Card>
      </MotionWrapper>

      <MotionWrapper animation="slideUp" delay={0.3}>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent>
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">Sin Asignar</span>
            </div>
            <p className="text-2xl font-bold text-blue-800">{habilidadesSinAsignar}</p>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  )
}

export default HabilidadesStats
