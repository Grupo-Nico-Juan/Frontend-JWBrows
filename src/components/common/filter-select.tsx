"use client"

import type React from "react"
import { Filter } from "lucide-react"

interface Option {
  value: string
  label: string
}

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Filtrar...",
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Filter className="h-4 w-4 text-[#8d6e63]" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-[#e1cfc0] rounded-xl text-[#7a5b4c] bg-[#fdf6f1] focus:ring-2 focus:ring-[#a37e63] focus:border-[#a37e63] transition-all duration-200"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterSelect
