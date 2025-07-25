"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star, Clock, DollarSign, Settings, Timer, Trash2, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import AnimatedCard from "@/components/common/animated-card"

interface Extra {
  id: number
  nombre: string
  duracionMinutos: number
  precio: number
}

interface ExtrasTableProps {
  extras: Extra[]
  onDelete: (id: number) => Promise<void>
  loadingDelete: Set<number>
}

const ExtrasTable: React.FC<ExtrasTableProps> = ({ extras, onDelete, loadingDelete }) => {
  return (
    <AnimatedCard delay={0.5} className="hidden md:block shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[#f8f0e8] to-[#f3e9dc] border-b border-[#e1cfc0]">
              <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Star size={14} className="sm:w-4 sm:h-4" />
                  <span>Nombre del Extra</span>
                </div>
              </TableHead>
              <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock size={14} className="sm:w-4 sm:h-4" />
                  <span>Duración</span>
                </div>
              </TableHead>
              <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign size={14} className="sm:w-4 sm:h-4" />
                  <span>Precio</span>
                </div>
              </TableHead>
              <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-center text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Settings size={14} className="sm:w-4 sm:h-4" />
                  <span>Acciones</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extras.map((extra, index) => {
              const isLoadingAction = loadingDelete.has(extra.id)
              return (
                <motion.tr
                  key={extra.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-b border-[#f0e6dc] hover:bg-[#fdf6f1] transition-colors"
                >
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#a37e63] rounded-full"></div>
                      <span className="font-medium text-[#7a5b4c] text-sm sm:text-base">{extra.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex items-center space-x-2">
                      <Timer size={14} className="text-[#7a5b4c]/60" />
                      <span className="text-[#7a5b4c]/70 text-sm sm:text-base">{extra.duracionMinutos} min</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign size={14} className="text-green-600" />
                      <span className="font-semibold text-green-700 text-sm sm:text-base">${extra.precio}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-center">
                    <motion.button
                      whileHover={{ scale: isLoadingAction ? 1 : 1.05 }}
                      whileTap={{ scale: isLoadingAction ? 1 : 0.95 }}
                      onClick={() => onDelete(extra.id)}
                      disabled={isLoadingAction}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 sm:space-x-2 mx-auto text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingAction ? (
                        <Loader2 size={12} className="animate-spin sm:w-4 sm:h-4" />
                      ) : (
                        <Trash2 size={12} className="sm:w-4 sm:h-4" />
                      )}
                      <span>Eliminar</span>
                    </motion.button>
                  </TableCell>
                </motion.tr>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </AnimatedCard>
  )
}

export default ExtrasTable

