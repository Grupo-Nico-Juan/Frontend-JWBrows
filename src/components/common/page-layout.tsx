"use client"

import type React from "react"

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] p-6 ${className}`}>
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 sm:w-60 sm:h-60 bg-[#d4bfae]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-60 sm:h-60 bg-[#a37e63]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 sm:w-32 sm:h-32 bg-[#e1cfc0]/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 left-10 w-16 h-16 sm:w-24 sm:h-24 bg-[#c4a484]/25 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">{children}</div>
    </div>
  )
}

export default PageLayout
