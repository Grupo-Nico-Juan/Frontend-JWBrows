"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface FormHeaderProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  onBack: () => void
  isLoading?: boolean
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle, icon, onBack, isLoading = false }) => {
  return (
    <MotionWrapper animation="slideLeft" delay={0}>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-[#e0d6cf] p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={isLoading}
            className="text-[#8d6e63] hover:text-[#6d4c41] hover:bg-[#f8f0ec]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#a1887f] rounded-lg">{icon}</div>
            <div>
              <h1 className="text-2xl font-bold text-[#6d4c41]">{title}</h1>
              <p className="text-[#8d6e63]">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </MotionWrapper>
  )
}

export default FormHeader
