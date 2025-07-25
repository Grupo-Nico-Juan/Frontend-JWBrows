"use client"

import type React from "react"
import { Package, Clock, DollarSign } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface ExtrasStatsProps {
  totalExtras: number
  duracionTotal: number
  precioTotal: number
}

const ExtrasStats: React.FC<ExtrasStatsProps> = ({ totalExtras, duracionTotal, precioTotal }) => {
  const stats = [
    {
      label: "Total Extras",
      value: totalExtras,
      icon: Package,
      color: "blue",
    },
    {
      label: "Duración Total",
      value: `${duracionTotal} min`,
      icon: Clock,
      color: "green",
    },
    {
      label: "Valor Total",
      value: `$${precioTotal}`,
      icon: DollarSign,
      color: "purple",
    },
  ]

  return (
    <MotionWrapper animation="slideUp" delay={0.3} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`bg-gradient-to-r from-${stat.color}-50 to-${stat.color}-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-${stat.color}-200`}
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 bg-${stat.color}-500 rounded-full flex items-center justify-center`}
            >
              <stat.icon size={16} className="text-white sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className={`text-xs sm:text-sm text-${stat.color}-600 font-medium`}>{stat.label}</p>
              <p className={`text-lg sm:text-2xl font-bold text-${stat.color}-700`}>{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </MotionWrapper>
  )
}

export default ExtrasStats
