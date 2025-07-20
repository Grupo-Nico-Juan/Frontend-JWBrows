"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import type { LucideIcon } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface FormFieldProps {
  label: string
  name: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: "text" | "email" | "password" | "number" | "color"
  icon?: LucideIcon
  required?: boolean
  disabled?: boolean
  delay?: number
  direction?: "left" | "right"
  className?: string
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  required = false,
  disabled = false,
  delay = 0,
  direction = "left",
  className = "",
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
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5" />}
        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`${
            Icon ? "pl-10" : ""
          } h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-200`}
        />
      </div>
    </MotionWrapper>
  )
}

export default FormField
