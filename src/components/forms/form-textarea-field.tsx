"use client"

import type React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

interface FormTextareaFieldProps {
  id: string
  name: string
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  icon: React.ReactNode
  error?: string
  rows?: number
  disabled?: boolean
}

const FormTextareaField: React.FC<FormTextareaFieldProps> = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  icon,
  error,
  rows = 3,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#6d4c41] font-medium flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        className={`border-[#e0d6cf] focus:border-[#a1887f] resize-none ${
          error ? "border-red-300 focus:border-red-400" : ""
        }`}
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

export default FormTextareaField
