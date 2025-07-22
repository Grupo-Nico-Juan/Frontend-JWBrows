"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MotionWrapper from "@/components/animations/motion-wrapper"
import type { LucideIcon } from "lucide-react"

interface Option {
  value: string | number
  label: string
}

interface FormSelectProps {
  label: string
  name: string
  value: string | number
  onChange: (value: string | number) => void
  options: Option[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  icon?: LucideIcon
  delay?: number
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  required = false,
  disabled = false,
  icon: Icon,
  delay = 0,
}) => {
  // Filtrar opciones para evitar valores vacíos
  const validOptions = options.filter(
    (option) => option.value !== "" && option.value !== null && option.value !== undefined,
  )

  // Asegurar que el valor siempre esté definido para evitar el cambio de controlado/no controlado
  const controlledValue = value !== "" && value !== null && value !== undefined ? String(value) : ""

  return (
    <MotionWrapper animation="slideLeft" delay={delay} className="relative">
      <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
        <div className="flex items-center space-x-2">
          {Icon && <Icon size={16} />}
          <span>{label}</span>
        </div>
      </label>
      <div className="relative">
        
        <Select value={controlledValue} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            className={`w-full ${
              Icon ? "pl-12" : "pl-4"
            } pr-4 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-300 disabled:opacity-50`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {validOptions.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </MotionWrapper>
  )
}

export default FormSelect
