"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { List, Grid3X3 } from "lucide-react"

interface ViewToggleProps {
  viewMode: "table" | "grid"
  onViewModeChange: (mode: "table" | "grid") => void
  className?: string
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange, className = "" }) => {
  return (
    <div className={`flex items-center gap-1 bg-[#f8f0ec] rounded-xl p-1 border border-[#e1cfc0] ${className}`}>
      <Button
        variant={viewMode === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("table")}
        className={
          viewMode === "table"
            ? "bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] text-white shadow-md"
            : "text-[#8d6e63] hover:bg-[#e1cfc0]"
        }
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("grid")}
        className={
          viewMode === "grid"
            ? "bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] text-white shadow-md"
            : "text-[#8d6e63] hover:bg-[#e1cfc0]"
        }
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default ViewToggle
