"use client"

import type React from "react"
import { Save, Plus, Loader2 } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface FormButtonsProps {
  onCancel: () => void
  isLoading: boolean
  isEditing: boolean
  disabled?: boolean
  cancelText?: string
  submitText?: string
  delay?: number
}

const FormButtons: React.FC<FormButtonsProps> = ({
  onCancel,
  isLoading,
  isEditing,
  disabled = false,
  cancelText = "Cancelar",
  submitText,
  delay = 0.6,
}) => {
  const defaultSubmitText = isEditing ? "Guardar Cambios" : "Crear"
  const loadingText = isEditing ? "Guardando..." : "Creando..."
  const IconComponent = isEditing ? Save : Plus

  return (
    <MotionWrapper animation="slideUp" delay={delay} className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
      <MotionWrapper onClick={onCancel} disabled={isLoading}>
        <button
          type="button"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 border-[#e0d6cf] text-[#6d4c41] hover:bg-[#f8f0ec] bg-transparent font-medium rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {cancelText}
        </button>
      </MotionWrapper>

      <MotionWrapper disabled={isLoading || disabled}>
        <button
          type="submit"
          disabled={isLoading || disabled}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin sm:w-5 sm:h-5" />
              <span>{loadingText}</span>
            </>
          ) : (
            <>
              <IconComponent size={16} className="sm:w-5 sm:h-5" />
              <span>{submitText || defaultSubmitText}</span>
            </>
          )}
        </button>
      </MotionWrapper>
    </MotionWrapper>
  )
}

export default FormButtons
