"use client"

import type React from "react"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface ErrorAlertProps {
  message: string
  onDismiss?: () => void
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-lg"
    >
      <AlertCircle className="h-5 w-5 text-red-500" />
      <span className="text-red-700 font-medium flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-500 hover:text-red-700 ml-2">
          ×
        </button>
      )}
    </motion.div>
  )
}

export default ErrorAlert
