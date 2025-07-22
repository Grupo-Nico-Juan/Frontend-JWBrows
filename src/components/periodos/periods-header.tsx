"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Calendar, User, Sparkles, Star, ArrowLeft } from "lucide-react"
import { CardTitle } from "@/components/ui/card"

interface PeriodsHeaderProps {
  empleadaNombre: string
  horariosCount: number
  licenciasCount: number
  onBack: () => void
}

export const PeriodsHeader: React.FC<PeriodsHeaderProps> = ({
  empleadaNombre,
  horariosCount,
  licenciasCount,
  onBack,
}) => {
  return (
    <div className="bg-gradient-to-r from-[#7a5b4c] via-[#a37e63] to-[#8b6f56] p-4 sm:p-8 relative overflow-hidden">
      {/* Efectos de fondo en el header */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12 translate-x-full animate-pulse"></div>
      <button
        onClick={onBack}
        className="absolute left-3 sm:left-6 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-white/20 backdrop-blur-sm"
      >
        <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
      </button>
      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
          className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg backdrop-blur-sm border border-white/20"
        >
          <Calendar size={32} className="text-white sm:w-12 sm:h-12 drop-shadow-lg" />
        </motion.div>
        <CardTitle className="text-2xl sm:text-4xl font-bold text-white mb-3 drop-shadow-lg">
          Períodos Laborales
        </CardTitle>
        <div className="flex items-center justify-center space-x-3 text-white/90 mb-2">
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
            <User size={16} className="sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-lg">{empleadaNombre}</span>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-6 text-white/80 text-sm sm:text-base">
          <div className="flex items-center space-x-2">
            <Sparkles size={16} />
            <span>{horariosCount} días con horarios</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star size={16} />
            <span>{licenciasCount} licencias</span>
          </div>
        </div>
      </div>
    </div>
  )
}
