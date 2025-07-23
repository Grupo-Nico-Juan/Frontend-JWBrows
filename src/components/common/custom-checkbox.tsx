"use client"

import type React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomCheckboxProps {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn("flex items-start space-x-3", className)}>
      <div className="flex items-center">
        <button
          type="button"
          id={id}
          onClick={() => !disabled && onCheckedChange(!checked)}
          disabled={disabled}
          className={cn(
            "relative w-5 h-5 rounded-md border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7a5b4c]/20 focus:ring-offset-2 ",
            checked ? "bg-[#7a5b4c] border-[#7a5b4c] text-white" : "bg-white border-[#d1c7bd] hover:border-[#a37e63]",
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "cursor-pointer hover:shadow-sm",
          )}
        >
          {checked && (
            <Check
              className="w-3 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
              strokeWidth={3}
            />
          )}
        </button>
      </div>

      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "text-sm font-medium text-[#7a5b4c] cursor-pointer select-none",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              {label}
            </label>
          )}
          {description && <p className={cn("text-xs text-[#8d6e63] mt-1", disabled && "opacity-50")}>{description}</p>}
        </div>
      )}
    </div>
  )
}

export default CustomCheckbox
