"use client"

import type React from "react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface GridContainerProps {
  children: React.ReactNode
  className?: string
}

const GridContainer: React.FC<GridContainerProps> = ({
  children,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
}) => {
  return (
    <MotionWrapper animation="fadeIn" delay={0.2}>
      <div className={className}>{children}</div>
    </MotionWrapper>
  )
}

export default GridContainer
