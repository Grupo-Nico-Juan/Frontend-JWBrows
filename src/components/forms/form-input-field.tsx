"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

interface FormInputFieldProps {
  id: string
  name: string
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon: React.ReactNode
  error?: string
  type?: string
  disabled?: boolean
}

const FormInputField: React.FC<FormInputFieldProps> = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  icon,
  error,
  type = "text",
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#6d4c41] font-medium flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border-[#e0d6cf] focus:border-[#a1887f] ${error ? "border-red-300 focus:border-red-400" : ""}`}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}

export default FormInputField
