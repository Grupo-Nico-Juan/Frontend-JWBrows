"use client"

import type React from "react"
import { motion } from "framer-motion"
import { CalendarDays, Clock, Edit3, Trash2, Loader2 } from "lucide-react"

interface HorarioAgrupado {
  diaSemana: string
  turnos: {
    id: number
    horaInicio: string
    horaFin: string
  }[]
}

interface HorariosTableProps {
  horariosAgrupados: HorarioAgrupado[]
  onEdit: (id: number) => void
  onDeleteDia: (horario: HorarioAgrupado) => void
  loadingDelete: Set<number>
}

export const HorariosTable: React.FC<HorariosTableProps> = ({
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
    <div className="hidden lg:block bg-white/80 rounded-2xl border border-[#e1cfc0] overflow-hidden shadow-xl backdrop-blur-sm">
      <div className="bg-gradient-to-r from-[#f8f0e8] via-[#f3e9dc] to-[#f8f0e8] px-8 py-6 border-b border-[#e1cfc0]">
        <div className="grid grid-cols-7 gap-4 font-bold text-[#7a5b4c]">
          <div className="flex items-center space-x-2">
            <CalendarDays size={18} />
            <span>Día</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={18} />
            <span>Turno 1 - Inicio</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={18} />
            <span>Turno 1 - Fin</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={18} />
            <span>Turno 2 - Inicio</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={18} />
            <span>Turno 2 - Fin</span>
          </div>
          <div className="text-center">Editar Turnos</div>
          <div className="text-center">Eliminar Día</div>
        </div>
      </div>
      {horariosAgrupados.map((horarioDelDia, index) => (
        <motion.div
          key={horarioDelDia.diaSemana}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
          className="grid grid-cols-7 gap-4 px-8 py-6 border-b border-[#f0e6dc] last:border-none hover:bg-gradient-to-r hover:from-[#fdf6f1] hover:to-[#f8f0e8] transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 bg-gradient-to-r ${getDiaColor(horarioDelDia.diaSemana)} rounded-full shadow-sm`}
            ></div>
            <span className="font-semibold text-[#7a5b4c]">{formatearDia(horarioDelDia.diaSemana)}</span>
          </div>
          <div className="text-[#7a5b4c]/80 font-medium">
            {formatearHora(horarioDelDia.turnos[0]?.horaInicio || "")}
          </div>
          <div className="text-[#7a5b4c]/80 font-medium">{formatearHora(horarioDelDia.turnos[0]?.horaFin || "")}</div>
          <div className="text-[#7a5b4c]/80 font-medium">
            {horarioDelDia.turnos[1] ? formatearHora(horarioDelDia.turnos[1].horaInicio) : "-"}
          </div>
          <div className="text-[#7a5b4c]/80 font-medium">
            {horarioDelDia.turnos[1] ? formatearHora(horarioDelDia.turnos[1].horaFin) : "-"}
          </div>
          <div className="flex gap-2 justify-center">
            {horarioDelDia.turnos.map((turno, turnoIndex) => (
              <motion.button
                key={turno.id}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(turno.id)}
                className={`px-3 py-2 ${turnoIndex === 0 ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gradient-to-r from-green-500 to-green-600"} hover:shadow-lg text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-1 text-sm shadow-md`}
              >
                <Edit3 size={14} />
                <span>T{turnoIndex + 1}</span>
              </motion.button>
            ))}
          </div>
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDeleteDia(horarioDelDia)}
              disabled={horarioDelDia.turnos.some((t) => loadingDelete.has(t.id))}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 text-sm disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {horarioDelDia.turnos.some((t) => loadingDelete.has(t.id)) ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              <span>Día</span>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
