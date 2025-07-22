"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Clock, Timer } from "lucide-react"
import { HorariosTable } from "./horarios-table"
import { HorariosCards } from "./horarios-cards"

interface HorarioAgrupado {
  diaSemana: string
  turnos: {
    id: number
    horaInicio: string
    horaFin: string
  }[]
}

interface HorariosSectionProps {
  horariosAgrupados: HorarioAgrupado[]
  onEdit: (id: number) => void
  onDeleteDia: (horario: HorarioAgrupado) => void
  loadingDelete: Set<number>
}

export const HorariosSection: React.FC<HorariosSectionProps> = ({
  horariosAgrupados,
  onEdit,
  onDeleteDia,
  loadingDelete,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-10"
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
          <Clock size={20} className="text-blue-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-[#7a5b4c]">Horarios Habituales</h3>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-[#e1cfc0] via-[#d4bfae] to-transparent rounded-full"></div>
      </div>
      {horariosAgrupados.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 shadow-inner"
        >
          <Timer size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold text-lg mb-2">No hay horarios habituales registrados</p>
          <p className="text-gray-500 text-sm">Agrega un nuevo período para comenzar</p>
        </motion.div>
      ) : (
        <>
          <HorariosTable
            horariosAgrupados={horariosAgrupados}
            onEdit={onEdit}
            onDeleteDia={onDeleteDia}
            loadingDelete={loadingDelete}
          />
          <HorariosCards
            horariosAgrupados={horariosAgrupados}
            onEdit={onEdit}
            onDeleteDia={onDeleteDia}
            loadingDelete={loadingDelete}
          />
        </>
      )}
    </motion.section>
  )
}
