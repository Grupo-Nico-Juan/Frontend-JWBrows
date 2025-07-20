"use client"

import type React from "react"
import type { LucideIcon } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface MenuSectionProps {
  title: string
  icon: LucideIcon
  color: string
  children: React.ReactNode
}

const MenuSection: React.FC<MenuSectionProps> = ({ title, icon: Icon, color, children }) => {
  return (
    <MotionWrapper animation="stagger" className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 bg-gradient-to-r ${color} rounded-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-[#6d4c41]">{title}</h2>
      </div>

      {/* Options Cards */}
      <div className="space-y-3">{children}</div>
    </MotionWrapper>
  )
}

export default MenuSection
