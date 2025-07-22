"use client"

import type React from "react"
import TimeInputField from "./time-input-field"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface ShiftSectionProps {
  title: string
  number: number
  startTimeLabel: string
  endTimeLabel: string
  startTimeName: string
  endTimeName: string
  startTimeValue: string
  endTimeValue: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  disabled?: boolean
  optional?: boolean
  tip?: string
  delay?: number
  colorScheme: "blue" | "green"
}

const ShiftSection: React.FC<ShiftSectionProps> = ({
  title,
  number,
  startTimeLabel,
  endTimeLabel,
  startTimeName,
  endTimeName,
  startTimeValue,
  endTimeValue,
  onChange,
  required = false,
  disabled = false,
  optional = false,
  tip,
  delay = 0,
  colorScheme,
}) => {
  const colorClasses = {
    blue: {
      bg: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      numberBg: "bg-blue-100",
      numberText: "text-blue-600",
    },
    green: {
      bg: "from-green-50 to-green-100",
      border: "border-green-200",
      numberBg: "bg-green-100",
      numberText: "text-green-600",
    },
  }

  const colors = colorClasses[colorScheme]

  return (
    <MotionWrapper animation="slideLeft" delay={delay} className="space-y-4">
      <div className={`p-6 bg-gradient-to-br ${colors.bg} rounded-2xl border-2 ${colors.border} shadow-inner`}>
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-6 h-6 ${colors.numberBg} rounded-full flex items-center justify-center`}>
            <span className={`${colors.numberText} font-semibold text-xs`}>{number}</span>
          </div>
          <h4 className="font-semibold text-[#7a5b4c]">{title}</h4>
          {required && <span className="text-red-500 text-sm">*</span>}
          {optional && <span className="text-gray-500 text-sm">(Opcional)</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TimeInputField
            label={startTimeLabel}
            name={startTimeName}
            value={startTimeValue}
            onChange={onChange}
            required={required}
            disabled={disabled}
            delay={0}
          />
          <TimeInputField
            label={endTimeLabel}
            name={endTimeName}
            value={endTimeValue}
            onChange={onChange}
            required={required}
            disabled={disabled}
            delay={0.05}
          />
        </div>
        {tip && (
          <p className="text-sm text-[#7a5b4c]/60 bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
            💡 <strong>Tip:</strong> {tip}
          </p>
        )}
      </div>
    </MotionWrapper>
  )
}

export default ShiftSection
