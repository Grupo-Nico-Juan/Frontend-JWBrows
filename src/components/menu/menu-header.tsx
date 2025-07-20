"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { User, Sparkles } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface MenuHeaderProps {
  title: string
  subtitle: string
  systemName: string
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ title, subtitle, systemName }) => {
  return (
    <MotionWrapper animation="slideUp" delay={0} duration={0.6} className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-[#a1887f] to-[#8d6e63] rounded-full">
          <User className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-[#6d4c41] mb-2">{title}</h1>
          <p className="text-[#8d6e63] text-lg">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-5 w-5 text-[#a1887f]" />
        <Badge variant="secondary" className="bg-[#a1887f]/10 text-[#6d4c41] border-[#a1887f]/20">
          {systemName}
        </Badge>
        <Sparkles className="h-5 w-5 text-[#a1887f]" />
      </div>
    </MotionWrapper>
  )
}

export default MenuHeader
