"use client"

import type React from "react"
import MotionWrapper from "@/components/animations/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface SearchHeaderProps {
  title: string
  subtitle: string
  icon: LucideIcon
  searchTerm: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  actionButton?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  actionButton,
}) => {
  return (
    <MotionWrapper animation="slideLeft" delay={0}>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-[#e0d6cf] p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#a1887f] rounded-lg">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#6d4c41]">{title}</h1>
              <p className="text-[#8d6e63]">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8d6e63] h-4 w-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-10 w-64 border-[#e0d6cf] focus:border-[#a1887f]"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8d6e63] hover:text-[#6d4c41]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {actionButton && (
              <Button onClick={actionButton.onClick} className="bg-[#a1887f] hover:bg-[#8d6e63] text-white">
                {actionButton.icon && <actionButton.icon className="h-4 w-4 mr-2" />}
                {actionButton.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </MotionWrapper>
  )
}

export default SearchHeader
