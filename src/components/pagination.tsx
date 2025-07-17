"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  itemName?: string // ej: "empleados", "servicios", "sectores"
  itemsPerPageOptions?: number[]
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemName = "elementos",
  itemsPerPageOptions = [5, 10, 20, 50],
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  if (totalItems === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#e1cfc0] shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Información de paginación */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-sm text-[#8d6e63] text-center sm:text-left">
                Mostrando {startIndex + 1} - {endIndex} de {totalItems} {itemName}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#8d6e63]">Mostrar:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    onItemsPerPageChange(Number(e.target.value))
                    onPageChange(1) // Reset a la primera página
                  }}
                  className="px-2 py-1 border-2 border-[#e1cfc0] rounded-lg text-[#7a5b4c] bg-[#fdf6f1] focus:ring-2 focus:ring-[#a37e63] focus:border-[#a37e63] transition-all duration-200 text-sm"
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                {/* Primera página */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className="border-2 border-[#e1cfc0] text-[#7a5b4c] hover:bg-[#f8f0ec] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Página anterior */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-2 border-[#e1cfc0] text-[#7a5b4c] hover:bg-[#f8f0ec] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Números de página */}
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(pageNumber)}
                        className={
                          currentPage === pageNumber
                            ? "bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] text-white shadow-md min-w-[2rem]"
                            : "border-2 border-[#e1cfc0] text-[#7a5b4c] hover:bg-[#f8f0ec] min-w-[2rem]"
                        }
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                </div>

                {/* Indicador de página en móvil */}
                <div className="sm:hidden flex items-center gap-2">
                  <span className="text-sm text-[#7a5b4c] font-medium">
                    {currentPage} / {totalPages}
                  </span>
                </div>

                {/* Página siguiente */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-2 border-[#e1cfc0] text-[#7a5b4c] hover:bg-[#f8f0ec] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Última página */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="border-2 border-[#e1cfc0] text-[#7a5b4c] hover:bg-[#f8f0ec] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default Pagination
