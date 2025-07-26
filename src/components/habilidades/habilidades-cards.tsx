"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Zap, Edit3, Trash2, Loader2 } from "lucide-react"

interface Habilidad {
  id: number
  nombre: string
  descripcion: string
}

interface HabilidadesCardsProps {
  habilidades: Habilidad[]
  loadingDelete: Set<number>
  searchTerm: string
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const HabilidadesCards: React.FC<HabilidadesCardsProps> = ({
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
      className="md:hidden space-y-3"
    >
      {habilidades.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">
            {searchTerm ? "No se encontraron habilidades" : "No hay habilidades registradas"}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {searchTerm ? "Intenta con otros términos de búsqueda" : "Agrega una nueva habilidad para comenzar"}
          </p>
        </div>
      ) : (
        habilidades.map((habilidad, index) => {
          const isLoadingAction = loadingDelete.has(habilidad.id)
          return (
            <motion.div
              key={habilidad.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white border border-[#e1cfc0] rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-8 h-8 bg-[#a37e63]/10 rounded-full flex items-center justify-center">
                    <Zap size={16} className="text-[#a37e63]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#7a5b4c] text-sm">{habilidad.nombre}</h3>
                    <p className="text-[#7a5b4c]/70 text-xs mt-1">{habilidad.descripcion}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEdit(habilidad.id)}
                  className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                >
                  <Edit3 size={14} />
                  <span>Editar</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: isLoadingAction ? 1 : 1.02 }}
                  whileTap={{ scale: isLoadingAction ? 1 : 0.98 }}
                  onClick={() => onDelete(habilidad.id)}
                  disabled={isLoadingAction}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingAction ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  <span>Eliminar</span>
                </motion.button>
              </div>
            </motion.div>
          )
        })
      )}
    </motion.div>
  )
}

export default HabilidadesCards
