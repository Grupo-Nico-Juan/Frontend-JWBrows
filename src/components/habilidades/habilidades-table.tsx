"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Zap, FileText, Settings, Edit3, Trash2, Loader2 } from "lucide-react"

interface Habilidad {
  id: number
  nombre: string
  descripcion: string
}

interface HabilidadesTableProps {
  habilidades: Habilidad[]
  loadingDelete: Set<number>
  searchTerm: string
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const HabilidadesTable: React.FC<HabilidadesTableProps> = ({
  habilidades,
  loadingDelete,
  searchTerm,
  onEdit,
  onDelete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="hidden md:block bg-white rounded-lg sm:rounded-xl border border-[#e1cfc0] overflow-hidden shadow-sm"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[#f8f0e8] to-[#f3e9dc] border-b border-[#e1cfc0]">
              <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Zap size={14} className="sm:w-4 sm:h-4" />
                  <span>Nombre</span>
                </div>
              </TableHead>
              <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FileText size={14} className="sm:w-4 sm:h-4" />
                  <span>Descripción</span>
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
            {habilidades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Zap size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        {searchTerm ? "No se encontraron habilidades" : "No hay habilidades registradas"}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {searchTerm
                          ? "Intenta con otros términos de búsqueda"
                          : "Agrega una nueva habilidad para comenzar"}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              habilidades.map((habilidad, index) => {
                const isLoadingAction = loadingDelete.has(habilidad.id)
                return (
                  <motion.tr
                    key={habilidad.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-b border-[#f0e6dc] hover:bg-[#fdf6f1] transition-colors"
                  >
                    <TableCell className="py-3 sm:py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#a37e63] rounded-full"></div>
                        <span className="font-medium text-[#7a5b4c] text-sm sm:text-base">{habilidad.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4">
                      <span className="text-[#7a5b4c]/70 text-sm sm:text-base">{habilidad.descripcion}</span>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onEdit(habilidad.id)}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                        >
                          <Edit3 size={12} className="sm:w-4 sm:h-4" />
                          <span>Editar</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: isLoadingAction ? 1 : 1.05 }}
                          whileTap={{ scale: isLoadingAction ? 1 : 0.95 }}
                          onClick={() => onDelete(habilidad.id)}
                          disabled={isLoadingAction}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoadingAction ? (
                            <Loader2 size={12} className="animate-spin sm:w-4 sm:h-4" />
                          ) : (
                            <Trash2 size={12} className="sm:w-4 sm:h-4" />
                          )}
                          <span>Eliminar</span>
                        </motion.button>
                      </div>
                    </TableCell>
                  </motion.tr>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}

export default HabilidadesTable
