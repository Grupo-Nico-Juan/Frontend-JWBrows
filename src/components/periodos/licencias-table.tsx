"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Calendar, FileText, Edit3, Trash2, Loader2 } from "lucide-react"

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

interface LicenciasTableProps {
  licencias: PeriodoLaboral[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  loadingDelete: Set<number>
}

export const LicenciasTable: React.FC<LicenciasTableProps> = ({ licencias, onEdit, onDelete, loadingDelete }) => {
  return (
    <div className="hidden md:block bg-white/80 rounded-2xl border border-[#e1cfc0] overflow-hidden shadow-xl backdrop-blur-sm">
      <div className="bg-gradient-to-r from-[#f8f0e8] via-[#f3e9dc] to-[#f8f0e8] px-8 py-6 border-b border-[#e1cfc0]">
        <div className="grid grid-cols-4 gap-4 font-bold text-[#7a5b4c]">
          <div className="flex items-center space-x-2">
            <Calendar size={18} />
            <span>Desde</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar size={18} />
            <span>Hasta</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText size={18} />
            <span>Motivo</span>
          </div>
          <div className="text-center">Acciones</div>
        </div>
      </div>
      {licencias.map((periodo, index) => (
        <motion.div
          key={periodo.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
          className="grid grid-cols-4 gap-4 px-8 py-6 border-b border-[#f0e6dc] last:border-none hover:bg-gradient-to-r hover:from-[#fdf6f1] hover:to-[#f8f0e8] transition-all duration-300"
        >
          <div className="text-[#7a5b4c]/80 font-medium">
            {periodo.desde ? new Date(periodo.desde).toLocaleDateString("es-ES") : "-"}
          </div>
          <div className="text-[#7a5b4c]/80 font-medium">
            {periodo.hasta ? new Date(periodo.hasta).toLocaleDateString("es-ES") : "-"}
          </div>
          <div className="font-semibold text-[#7a5b4c]">{periodo.motivo || "-"}</div>
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(periodo.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 text-sm shadow-md hover:shadow-lg"
            >
              <Edit3 size={16} />
              <span>Editar</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(periodo.id)}
              disabled={loadingDelete.has(periodo.id)}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 text-sm disabled:opacity-50 shadow-md hover:shadow-lg"
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
