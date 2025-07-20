"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  message?: string
  fullScreen?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Cargando...", fullScreen = true }) => {
  const content = (
    <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#e1cfc0] shadow-2xl">
      <div className="flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#7a5b4c]" />
        <span className="text-[#7a5b4c] font-medium">{message}</span>
      </div>
    </Card>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}

export default LoadingSpinner
