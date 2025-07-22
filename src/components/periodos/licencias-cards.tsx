"use client"

import type React from "react"
import { motion } from "framer-motion"
import { FileText, Edit3, Trash2, Loader2 } from "lucide-react"

interface PeriodoLaboral {
  id: number
  empleadaId: number
  tipo: "HorarioHabitual" | "Licencia"
  diaSemana?: string
  horaInicio?: string
  horaFin?: string
  desde?: string
  hasta?: string
  motivo?: string
}

interface LicenciasCardsProps {
  licencias: PeriodoLaboral[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  loadingDelete: Set<number>
}

export const LicenciasCards: React.FC<LicenciasCardsProps> = ({ licencias, onEdit, onDelete, loadingDelete }) => {
  return (
    <div className="md:hidden space-y-4">
      {licencias.map((periodo, index) => (
        <motion.div
          key={periodo.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
          className="bg-white/90 border-2 border-[#e1cfc0] rounded-2xl p-6 shadow-xl backdrop-blur-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-lg">
                <FileText size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="font-bold text-lg text-[#7a5b4c]">{periodo.motivo || "Sin motivo"}</p>
                <p className="text-sm text-[#7a5b4c]/70 mt-1">
                  {periodo.desde ? new Date(periodo.desde).toLocaleDateString("es-ES") : "-"} -{" "}
                  {periodo.hasta ? new Date(periodo.hasta).toLocaleDateString("es-ES") : "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(periodo.id)}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Edit3 size={16} />
              <span>Editar</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(periodo.id)}
              disabled={loadingDelete.has(periodo.id)}
              className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loadingDelete.has(periodo.id) ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              <span>Eliminar</span>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
