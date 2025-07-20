"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  actionButton?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, actionButton }) => {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-12"
    >
      <Card className="bg-white/90 backdrop-blur-sm border border-[#e1cfc0] p-8 shadow-lg">
        <div className="h-16 w-16 text-[#d4bfae] mx-auto mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-[#7a5b4c] mb-2">{title}</h3>
        <p className="text-[#8d6e63] mb-4">{description}</p>
        {actionButton && (
          <Button
            onClick={actionButton.onClick}
            className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {actionButton.icon}
            {actionButton.label}
          </Button>
        )}
      </Card>
    </motion.div>
  )
}

export default EmptyState
