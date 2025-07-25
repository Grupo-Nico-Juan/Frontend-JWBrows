"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FormSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon, children }) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#6d4c41]">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  )
}

export default FormSection
