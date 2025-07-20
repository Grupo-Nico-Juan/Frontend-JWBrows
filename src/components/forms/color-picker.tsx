"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Palette } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface ColorPickerProps {
  label: string
  name: string
  value: string
  onChange: (color: string) => void
  predefinedColors: string[]
  disabled?: boolean
  delay?: number
  direction?: "left" | "right"
  className?: string
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  name,
  value,
  onChange,
  predefinedColors,
  disabled = false,
  delay = 0,
  direction = "left",
  className = "",
}) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handlePredefinedColorClick = (color: string) => {
    onChange(color)
  }

  return (
    <MotionWrapper
      animation={direction === "left" ? "slideLeft" : "slideRight"}
      delay={delay}
      className={`relative ${className}`}
    >
      <label className="block text-sm font-medium text-[#7a5b4c] mb-2">
        <div className="flex items-center space-x-2">
          <Palette size={16} />
          <span>{label}</span>
        </div>
      </label>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl border-2 border-[#e1cfc0] shadow-sm"
            style={{ backgroundColor: value }}
          />
          <Input
            type="color"
            name={name}
            value={value}
            onChange={handleColorChange}
            disabled={disabled}
            className="w-20 h-12 p-1 bg-[#fdf6f1] border-2 border-[#e1cfc0] focus:border-[#a37e63] rounded-xl cursor-pointer"
          />
          <span className="text-sm text-[#7a5b4c] font-mono">{value}</span>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {predefinedColors.map((color) => (
            <MotionWrapper
              key={color}
              disabled={disabled}
              className=""
            >
              <div
                onClick={() => handlePredefinedColorClick(color)}
                className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  value === color ? "border-[#7a5b4c] shadow-lg" : "border-[#e1cfc0] hover:border-[#a37e63]"
                }`}
                style={{ backgroundColor: color }}
                aria-disabled={disabled}
              />
            </MotionWrapper>
          ))}
        </div>
      </div>
    </MotionWrapper>
  )
}

export default ColorPicker
