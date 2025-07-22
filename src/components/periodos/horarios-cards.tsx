"use client"

import type React from "react"
import { motion } from "framer-motion"
import { CalendarDays, Edit3, Trash2, Loader2 } from "lucide-react"

interface HorarioAgrupado {
  diaSemana: string
  turnos: {
    id: number
    horaInicio: string
    horaFin: string
  }[]
}

interface HorariosCardsProps {
  horariosAgrupados: HorarioAgrupado[]
  onEdit: (id: number) => void
  onDeleteDia: (horario: HorarioAgrupado) => void
  loadingDelete: Set<number>
}

export const HorariosCards: React.FC<HorariosCardsProps> = ({
  horariosAgrupados,
  onEdit,
  onDeleteDia,
  loadingDelete,
}) => {
  const formatearDia = (dia: string) => {
    const dias: { [key: string]: string } = {
      Monday: "Lunes",
      Tuesday: "Martes",
      Wednesday: "Miércoles",
      Thursday: "Jueves",
      Friday: "Viernes",
      Saturday: "Sábado",
      Sunday: "Domingo",
    }
    return dias[dia] || dia
  }

  const formatearHora = (hora: string) => {
    if (!hora) return "-"
    const fecha = new Date(`1970-01-01T${hora}`)
    return fecha.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDiaColor = (dia: string) => {
    const colores: { [key: string]: string } = {
      Monday: "from-blue-500 to-blue-600",
      Tuesday: "from-green-500 to-green-600",
      Wednesday: "from-purple-500 to-purple-600",
      Thursday: "from-orange-500 to-orange-600",
      Friday: "from-pink-500 to-pink-600",
      Saturday: "from-indigo-500 to-indigo-600",
      Sunday: "from-red-500 to-red-600",
    }
    return colores[dia] || "from-gray-500 to-gray-600"
  }

  return (
    <div className="lg:hidden space-y-4">
      {horariosAgrupados.map((horarioDelDia, index) => (
        <motion.div
          key={horarioDelDia.diaSemana}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
          className="bg-white/90 border-2 border-[#e1cfc0] rounded-2xl p-6 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${getDiaColor(horarioDelDia.diaSemana)} rounded-full flex items-center justify-center shadow-lg`}
              >
                <CalendarDays size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-lg text-[#7a5b4c]">{formatearDia(horarioDelDia.diaSemana)}</p>
                <p className="text-sm text-[#7a5b4c]/60">
                  {horarioDelDia.turnos.length} turno{horarioDelDia.turnos.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            {horarioDelDia.turnos.map((turno, turnoIndex) => (
              <div
                key={turno.id}
                className={`p-4 rounded-xl ${turnoIndex === 0 ? "bg-blue-50 border border-blue-200" : "bg-green-50 border border-green-200"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 ${turnoIndex === 0 ? "bg-blue-500" : "bg-green-500"} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {turnoIndex + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-[#7a5b4c]">
                        {formatearHora(turno.horaInicio)} - {formatearHora(turno.horaFin)}
                      </p>
                      <p className="text-xs text-[#7a5b4c]/60">Turno {turnoIndex + 1}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(turno.id)}
                    className={`px-3 py-2 ${turnoIndex === 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"} text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 text-sm shadow-md`}
                  >
                    <Edit3 size={14} />
                    <span>Editar</span>
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDeleteDia(horarioDelDia)}
            disabled={horarioDelDia.turnos.some((t) => loadingDelete.has(t.id))}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
          >
            {horarioDelDia.turnos.some((t) => loadingDelete.has(t.id)) ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            <span>Eliminar Día Completo</span>
          </motion.button>
        </motion.div>
      ))}
    </div>
  )
}
