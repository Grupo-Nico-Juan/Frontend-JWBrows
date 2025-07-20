"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface AnimatedErrorProps {
  error: string
  className?: string
}

const AnimatedError: React.FC<AnimatedErrorProps> = ({ error, className = "" }) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center space-x-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl ${className}`}
        >
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 sm:w-5 sm:h-5" />
          <p className="text-sm sm:text-base text-red-600 font-medium">{error}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnimatedError
