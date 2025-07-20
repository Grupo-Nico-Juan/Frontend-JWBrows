"use client"

import type React from "react"
import { motion } from "framer-motion"

interface MotionWrapperProps {
  children: React.ReactNode
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale" | "stagger"
  delay?: number
  duration?: number
  className?: string
  onClick?: () => void
  disabled?: boolean
}

const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  stagger: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
}

const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 0.5,
  className = "",
  onClick,
  disabled = false,
}) => {
  const animationConfig = animations[animation]

  const motionProps = {
    initial: animationConfig.initial,
    animate: animationConfig.animate,
    transition: { delay, duration },
    className,
    ...(onClick && {
      whileTap: { scale: disabled ? 1 : 0.98 },
      whileHover: { scale: disabled ? 1 : 1.02 },
      onClick: disabled ? undefined : onClick,
    }),
  }

  return <motion.div {...motionProps}>{children}</motion.div>
}

export default MotionWrapper
