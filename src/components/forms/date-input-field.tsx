"use client"

import type React from "react"
import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface DateInputFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  disabled?: boolean
  delay?: number
  direction?: "left" | "right"
}

const DateInputField: React.FC<DateInputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  delay = 0,
  direction = "left",
}) => {
  const animation = direction === "left" ? "slideLeft" : "slideRight"

  return (
    <MotionWrapper animation={animation} delay={delay} className="relative">
      <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
        <div className="flex items-center space-x-2">
          <Calendar size={16} />
          <span>{label}</span>
        </div>
      </label>
      <div className="relative">
        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7a5b4c] w-5 h-5 z-20 pointer-events-none" />
        <Input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="w-full pl-12 pr-4 h-12 bg-[#fdf6f1] text-[#7a5b4c] border-2 border-[#e1cfc0] focus:border-[#a37e63] focus:ring-2 focus:ring-[#a37e63]/20 rounded-xl transition-all duration-300 disabled:opacity-50 font-medium"
        />
      </div>
    </MotionWrapper>
  )
}

export default DateInputField
