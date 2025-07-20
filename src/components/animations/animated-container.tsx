"use client"

import type React from "react"
import { motion } from "framer-motion"

interface AnimatedContainerProps {
  children: React.ReactNode
  className?: string
  variant?: "card" | "page" | "section"
  delay?: number
}

const variants = {
  card: {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  section: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className = "",
  variant = "card",
  delay = 0,
}) => {
  const config = variants[variant]

  return (
    <motion.div
      initial={config.initial}
      animate={config.animate}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedContainer
