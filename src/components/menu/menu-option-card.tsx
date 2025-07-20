"use client"

import type React from "react"
import { Link } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface MenuOptionCardProps {
  label: string
  path: string
  icon: LucideIcon
  description: string
  color: string
  disabled?: boolean
}

const MenuOptionCard: React.FC<MenuOptionCardProps> = ({
  label,
  path,
  icon: Icon,
  description,
  color,
  disabled = false,
}) => {
  return (
    <MotionWrapper animation="scale" onClick={disabled ? undefined : () => {}} disabled={disabled}>
      <Card
        className={`
          border border-[#e0d6cf] shadow-md hover:shadow-lg transition-all duration-300
          ${disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : "bg-white hover:bg-[#fdf6f1] cursor-pointer"}
        `}
      >
        <CardContent className="p-4">
          {disabled ? (
            <div className="flex items-center gap-3">
              <div className={`p-2 ${color} rounded-lg`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#6d4c41] mb-1">{label}</h3>
                <p className="text-sm text-[#8d6e63]">{description}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Próximamente
              </Badge>
            </div>
          ) : (
            <Link to={path} className="block">
              <div className="flex items-center gap-3 group">
                <div className={`p-2 ${color} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#6d4c41] mb-1 group-hover:text-[#a1887f] transition-colors">
                    {label}
                  </h3>
                  <p className="text-sm text-[#8d6e63]">{description}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-[#a1887f] rounded-full"></div>
                </div>
              </div>
            </Link>
          )}
        </CardContent>
      </Card>
    </MotionWrapper>
  )
}

export default MenuOptionCard
