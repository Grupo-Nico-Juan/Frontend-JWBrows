"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Plus, ArrowLeft } from "lucide-react"

interface ActionButtonsProps {
  onNuevoPeriodo: () => void
  onBack: () => void
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onNuevoPeriodo, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row gap-4 mb-8"
    >
      <motion.button
        onClick={onNuevoPeriodo}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex-1 sm:flex-none px-6 sm:px-8 py-4 bg-gradient-to-r from-[#7a5b4c] via-[#a37e63] to-[#8b6f56] hover:from-[#6b4d3e] hover:via-[#8f6b50] hover:to-[#7a5b4c] text-white font-bold rounded-xl sm:rounded-2xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl hover:shadow-2xl text-sm sm:text-lg backdrop-blur-sm border border-white/20"
      >
        <Plus size={20} className="sm:w-6 sm:h-6" />
        <span>Nuevo Período</span>
      </motion.button>
      <motion.button
        onClick={onBack}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex-1 sm:flex-none px-6 sm:px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-[#7a5b4c] font-semibold rounded-xl sm:rounded-2xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-lg backdrop-blur-sm border border-gray-300"
      >
        <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
        <span>Volver a Empleados</span>
      </motion.button>
    </motion.div>
  )
}
