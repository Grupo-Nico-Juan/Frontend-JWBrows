"use client"

import type React from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import AnimatedContainer from "@/components/animations/animated-container"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface FormLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  icon: React.ReactNode
  onBack: () => void
  isLoading?: boolean
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl"
}

const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  title,
  subtitle,
  icon,
  onBack,
  isLoading = false,
  maxWidth = "2xl",
}) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-2 sm:px-4 py-4 sm:py-8">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#d4bfae] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#a37e63] rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className={`relative z-10 ${maxWidthClasses[maxWidth]} mx-auto`}>
        <AnimatedContainer variant="card">
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-xl sm:rounded-2xl overflow-hidden">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] p-4 sm:p-6 relative">
              {/* Botón de volver */}
              <button
                onClick={onBack}
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors p-1"
                disabled={isLoading}
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              </button>

              <div className="text-center">
                <MotionWrapper animation="scale" delay={0.2}>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    {icon}
                  </div>
                </MotionWrapper>
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</CardTitle>
                <p className="text-white/80 text-sm mt-2">{subtitle}</p>
              </div>
            </div>

            <CardContent className="p-4 sm:p-6">{children}</CardContent>
          </Card>
        </AnimatedContainer>
      </div>
    </div>
  )
}

export default FormLayout
