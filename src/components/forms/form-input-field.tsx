"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
  required?: boolean
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
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-[#6d4c41] flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border-[#e0d6cf] focus:border-[#a1887f] ${error ? "border-red-300 focus:border-red-500" : ""}`}
      />
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-600 text-sm"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FormInputField
