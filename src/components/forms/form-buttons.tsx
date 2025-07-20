"use client"

import type React from "react"
import { Loader2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface FormButtonsProps {
  onCancel: () => void
  isLoading: boolean
  isEditing: boolean
  cancelText?: string
  submitText?: string
  loadingText?: string
  submitIcon?: LucideIcon
  delay?: number
}

const FormButtons: React.FC<FormButtonsProps> = ({
  onCancel,
  isLoading,
  isEditing,
  cancelText = "Cancelar",
  submitText,
  loadingText,
  submitIcon: SubmitIcon,
  delay = 0.6,
}) => {
  const defaultSubmitText = isEditing ? "Guardar Cambios" : "Crear"
  const defaultLoadingText = isEditing ? "Guardando..." : "Creando..."

  return (
    <MotionWrapper animation="slideUp" delay={delay}>
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        <MotionWrapper
          onClick={onCancel}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#7a5b4c] font-medium rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base text-center"
        >
          <button type="button" className="w-full" disabled={isLoading}>
            {cancelText}
          </button>
        </MotionWrapper>
        <MotionWrapper
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          <button type="submit" className="flex items-center space-x-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin sm:w-5 sm:h-5" />
                <span>{loadingText || defaultLoadingText}</span>
              </>
            ) : (
              <>
                {SubmitIcon && <SubmitIcon size={16} className="sm:w-5 sm:h-5" />}
                <span>{submitText || defaultSubmitText}</span>
              </>
            )}
          </button>
        </MotionWrapper>
      </div>
    </MotionWrapper>
  )
}

export default FormButtons
