"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LucideIcon } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface FormSelectProps {
  label: string
  name: string
  value: string | number
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  icon?: LucideIcon
  disabled?: boolean
  loading?: boolean
  delay?: number
  direction?: "left" | "right"
  className?: string
  helperText?: string
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Seleccionar opción",
  icon: Icon,
  disabled = false,
  loading = false,
  delay = 0,
  direction = "left",
  className = "",
  helperText,
}) => {
  return (
    <MotionWrapper
      animation={direction === "left" ? "slideLeft" : "slideRight"}
      delay={delay}
      className={`relative ${className}`}
    >
      <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
        <div className="flex items-center space-x-2">
          {Icon && <Icon size={16} />}
          <span>{label}</span>
        </div>
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5 z-10" />}
        <Select value={value === 0 ? "" : String(value)} onValueChange={onChange} disabled={disabled || loading}>
          <SelectTrigger
            className={`${Icon ? "pl-10" : ""} h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200`}
          >
            <SelectValue placeholder={loading ? "Cargando..." : placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {helperText && <p className="text-sm text-[#8d6e63] mt-1">{helperText}</p>}
    </MotionWrapper>
  )
}

export default FormSelect
