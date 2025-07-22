"use client"

import type React from "react"
import { Clock, FileText } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface PeriodTypeSelectorProps {
  value: "HorarioHabitual" | "Licencia"
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  delay?: number
}

const PeriodTypeSelector: React.FC<PeriodTypeSelectorProps> = ({ value, onChange, disabled = false, delay = 0 }) => {
  return (
    <MotionWrapper animation="slideLeft" delay={delay} className="relative">
      <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
        <div className="flex items-center space-x-2">
          <FileText size={16} />
          <span>Tipo de Período</span>
        </div>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <MotionWrapper  delay={delay + 0.1}>
          <label
            className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              value === "HorarioHabitual"
                ? "border-[#a37e63] bg-[#a37e63]/10 text-[#7a5b4c]"
                : "border-[#e1cfc0] bg-[#fdf6f1] text-[#7a5b4c]/70 hover:border-[#a37e63]/50"
            }`}
          >
            <input
              type="radio"
              name="tipo"
              value="HorarioHabitual"
              checked={value === "HorarioHabitual"}
              onChange={onChange}
              className="sr-only"
              disabled={disabled}
            />
            <div className="flex items-center space-x-2">
              <Clock size={18} />
              <span className="font-medium text-sm">Horario Habitual</span>
            </div>
          </label>
        </MotionWrapper>
        <MotionWrapper  delay={delay + 0.2}>
          <label
            className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              value === "Licencia"
                ? "border-[#a37e63] bg-[#a37e63]/10 text-[#7a5b4c]"
                : "border-[#e1cfc0] bg-[#fdf6f1] text-[#7a5b4c]/70 hover:border-[#a37e63]/50"
            }`}
          >
            <input
              type="radio"
              name="tipo"
              value="Licencia"
              checked={value === "Licencia"}
              onChange={onChange}
              className="sr-only"
              disabled={disabled}
            />
            <div className="flex items-center space-x-2">
              <FileText size={18} />
              <span className="font-medium text-sm">Licencia</span>
            </div>
          </label>
        </MotionWrapper>
      </div>
    </MotionWrapper>
  )
}

export default PeriodTypeSelector
