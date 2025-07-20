"use client"

import type React from "react"

interface PageHeaderProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  actions?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, subtitle, actions }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] rounded-xl shadow-lg">{icon}</div>
        <div>
          <h1 className="text-2xl font-bold text-[#7a5b4c]">{title}</h1>
          <p className="text-[#8d6e63]">{subtitle}</p>
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}

export default PageHeader
