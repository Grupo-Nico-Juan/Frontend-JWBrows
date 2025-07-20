"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  headerContent?: React.ReactNode
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  headerContent,
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 20 }
      case "down":
        return { opacity: 0, y: -20 }
      case "left":
        return { opacity: 0, x: -20 }
      case "right":
        return { opacity: 0, x: 20 }
      default:
        return { opacity: 0, y: 20 }
    }
  }

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={`bg-white/90 backdrop-blur-sm border border-[#e1cfc0] shadow-lg ${className}`}>
        {headerContent && <CardHeader>{headerContent}</CardHeader>}
        <CardContent className={headerContent ? "" : "p-6"}>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

export default AnimatedCard
