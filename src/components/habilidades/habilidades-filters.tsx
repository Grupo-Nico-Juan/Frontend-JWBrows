"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Filter, RotateCcw } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface HabilidadesFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filter: "todas" | "asignadas" | "disponibles"
  onFilterChange: (filter: "todas" | "asignadas" | "disponibles") => void
  onResetFilters: () => void
  totalResults: number
  totalHabilidades: number
}

const HabilidadesFilters: React.FC<HabilidadesFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  onResetFilters,
  totalResults,
  totalHabilidades,
}) => {
  return (
    <MotionWrapper animation="slideUp" delay={0.1}>
      <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8d6e63] h-4 w-4" />
              <Input
                placeholder="Buscar habilidades..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-10 border-[#e0d6cf] focus:border-[#a1887f]"
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
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#8d6e63]" />
              <div className="flex gap-2">
                {(["todas", "asignadas", "disponibles"] as const).map((filterType) => (
                  <Button
                    key={filterType}
                    variant={filter === filterType ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange(filterType)}
                    className={
                      filter === filterType
                        ? "bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                        : "border-[#e0d6cf] text-[#8d6e63] hover:bg-[#f3e5e1]"
                    }
                  >
                    {filterType === "todas" && "Todas"}
                    {filterType === "asignadas" && "Asignadas"}
                    {filterType === "disponibles" && "Disponibles"}
                  </Button>
                ))}
              </div>
              {(searchTerm || filter !== "todas") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetFilters}
                  className="text-[#8d6e63] hover:text-[#6d4c41] hover:bg-[#f3e5e1]"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>
          <div className="mt-4 text-sm text-[#8d6e63]">
            Mostrando {totalResults} de {totalHabilidades} habilidades
          </div>
        </CardContent>
      </Card>
    </MotionWrapper>
  )
}

export default HabilidadesFilters
