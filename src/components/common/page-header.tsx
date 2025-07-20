"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon: LucideIcon
  actionButton?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  delay?: number
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon: Icon, actionButton, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#e1cfc0] p-6 shadow-lg"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] rounded-xl shadow-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#7a5b4c]">{title}</h1>
            {subtitle && <p className="text-[#8d6e63]">{subtitle}</p>}
          </div>
        </div>
        {actionButton && (
          <div className="flex items-center gap-3">
            <Button
              onClick={actionButton.onClick}
              className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {actionButton.icon && <actionButton.icon className="h-4 w-4 mr-2" />}
              {actionButton.label}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PageHeader
