"use client"

import type React from "react"
import { motion } from "framer-motion"
import { FileText, Coffee } from "lucide-react"
import { LicenciasTable } from "./licencias-table"
import { LicenciasCards } from "./licencias-cards"

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

interface LicenciasSectionProps {
  licencias: PeriodoLaboral[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  loadingDelete: Set<number>
}

export const LicenciasSection: React.FC<LicenciasSectionProps> = ({ licencias, onEdit, onDelete, loadingDelete }) => {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-lg">
          <FileText size={20} className="text-orange-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-[#7a5b4c]">Licencias</h3>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-[#e1cfc0] via-[#d4bfae] to-transparent rounded-full"></div>
      </div>
      {licencias.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 shadow-inner"
        >
          <Coffee size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold text-lg mb-2">No hay licencias registradas</p>
          <p className="text-gray-500 text-sm">Las licencias aparecerán aquí cuando se agreguen</p>
        </motion.div>
      ) : (
        <>
          <LicenciasTable licencias={licencias} onEdit={onEdit} onDelete={onDelete} loadingDelete={loadingDelete} />
          <LicenciasCards licencias={licencias} onEdit={onEdit} onDelete={onDelete} loadingDelete={loadingDelete} />
        </>
      )}
    </motion.section>
  )
}
