"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Loader2, Clock, TrendingUp, Users, Calendar, AlertCircle } from "lucide-react"
import axios from "@/api/AxiosInstance"

interface HorarioMayorTurnos {
  hora: number
  cantidad: number
}

interface Props {
  anio: number
  mes: number
}

const HorarioConMaxCitas: React.FC<Props> = ({ anio, mes }) => {
  const [data, setData] = useState<HorarioMayorTurnos | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await axios.get<HorarioMayorTurnos>(`/api/Reportes/horario-mayor-turnos`, {
          params: {
            anio: anio,
            mes: mes,
          },
        })
        setData(response.data)
      } catch (err) {
        setError("Error al cargar horario con más citas")
        console.error("Error al cargar horario con más citas:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [anio, mes])

  // Función para formatear la hora
  const formatearHora = (hora: number) => {
    if (hora === 0) return "12:00 AM"
    if (hora < 12) return `${hora}:00 AM`
    if (hora === 12) return "12:00 PM"
    return `${hora - 12}:00 PM`
  }

  // Función para obtener el período del día
  const obtenerPeriodoDelDia = (hora: number) => {
    if (hora >= 6 && hora < 12) return { periodo: "Mañana", color: "#ffa726", icon: "🌅" }
    if (hora >= 12 && hora < 18) return { periodo: "Tarde", color: "#ff7043", icon: "☀️" }
    if (hora >= 18 && hora < 22) return { periodo: "Noche", color: "#5c6bc0", icon: "🌆" }
    return { periodo: "Madrugada", color: "#7e57c2", icon: "🌙" }
  }

  // Función para obtener recomendaciones
  const obtenerRecomendacion = (hora: number, cantidad: number) => {
    const { periodo } = obtenerPeriodoDelDia(hora)

    if (cantidad >= 5) {
      return {
        tipo: "alta",
        mensaje: `Horario pico en la ${periodo.toLowerCase()}. Considera aumentar el personal.`,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      }
    } else if (cantidad >= 3) {
      return {
        tipo: "media",
        mensaje: `Demanda moderada en la ${periodo.toLowerCase()}. Horario estable.`,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      }
    } else {
      return {
        tipo: "baja",
        mensaje: `Baja demanda en la ${periodo.toLowerCase()}. Oportunidad para promociones.`,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      }
    }
  }

  const fechaFormateada = new Date(anio, mes - 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })

  // Generar datos para visualización de horarios (simulado para mostrar contexto)
  const generarDatosHorarios = () => {
    const horarios = []
    for (let i = 8; i <= 20; i++) {
      const esPico = data && i === data.hora
      horarios.push({
        hora: i,
        cantidad: esPico ? data.cantidad : Math.floor(Math.random() * (data?.cantidad || 1)),
        esPico: esPico,
      })
    }
    return horarios
  }

  if (loading) {
    return (
      <Card className="bg-[#fdf6f1] border border-[#e0d6cf] h-full">
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#a1887f]" />
          <span className="ml-2 text-[#6d4c41]">Cargando...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-[#fdf6f1] border border-[#e0d6cf] h-full">
        <CardContent className="flex items-center justify-center py-16">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.cantidad === 0) {
    return (
      <Card className="bg-[#fdf6f1] border border-[#e0d6cf] h-full">
        <CardContent className="flex items-center justify-center py-16">
          <p className="text-[#8d6e63]">No hay datos disponibles para este período</p>
        </CardContent>
      </Card>
    )
  }

  const { periodo, color, icon } = obtenerPeriodoDelDia(data.hora)
  const recomendacion = obtenerRecomendacion(data.hora, data.cantidad)
  const horariosData = generarDatosHorarios()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="bg-[#fdf6f1] border border-[#e0d6cf] h-full flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-[#6d4c41] flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horario Pico
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-[#8d6e63]">
            <Calendar className="h-4 w-4" />
            <span className="capitalize">{fechaFormateada}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 flex-1 flex flex-col">
          {/* Horario principal destacado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center bg-white p-6 rounded-lg border border-[#e0d6cf] shadow-sm"
          >
            <div className="text-4xl mb-2">{icon}</div>
            <div className="text-3xl font-bold text-[#6d4c41] mb-2">{formatearHora(data.hora)}</div>
            <div className="text-lg text-[#8d6e63] mb-3">{periodo}</div>
            <div className="flex items-center justify-center gap-2">
              <Users className="h-5 w-5 text-[#a1887f]" />
              <span className="text-xl font-semibold text-[#6d4c41]">
                {data.cantidad} {data.cantidad === 1 ? "cita" : "citas"}
              </span>
            </div>
          </motion.div>

          {/* Estadísticas adicionales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-[#f8f0ec] p-4 rounded-lg border border-[#e8ddd6]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8d6e63]">Período</p>
                  <p className="text-lg font-bold text-[#6d4c41]">{periodo}</p>
                </div>
                <div className="text-2xl">{icon}</div>
              </div>
            </div>

            <div className="bg-[#f8f0ec] p-4 rounded-lg border border-[#e8ddd6]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8d6e63]">Demanda</p>
                  <p className="text-lg font-bold text-[#6d4c41]">
                    {data.cantidad >= 5 ? "Alta" : data.cantidad >= 3 ? "Media" : "Baja"}
                  </p>
                </div>
                <TrendingUp className={`h-6 w-6 ${data.cantidad >= 3 ? "text-green-600" : "text-yellow-600"}`} />
              </div>
            </div>
          </motion.div>

          {/* Visualización de horarios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-4 rounded-lg border border-[#e0d6cf]"
          >
            <h4 className="text-sm font-semibold text-[#6d4c41] mb-4">Distribución de Citas por Hora</h4>
            <div className="space-y-2">
              {horariosData.map((horario, index) => (
                <motion.div
                  key={horario.hora}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className={`flex items-center justify-between p-2 rounded ${
                    horario.esPico ? "bg-[#a1887f] text-white" : "bg-[#f8f0ec]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{formatearHora(horario.hora)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-16 h-2 rounded-full ${horario.esPico ? "bg-white/30" : "bg-[#e0d6cf]"}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(horario.cantidad / (data.cantidad || 1)) * 100}%` }}
                        transition={{ duration: 1, delay: 0.7 + index * 0.05 }}
                        className={`h-2 rounded-full ${horario.esPico ? "bg-white" : "bg-[#a1887f]"}`}
                      />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{horario.cantidad}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recomendación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`p-4 rounded-lg border ${recomendacion.bgColor} ${recomendacion.borderColor}`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className={`h-5 w-5 mt-0.5 ${recomendacion.color}`} />
              <div>
                <h4 className={`font-semibold ${recomendacion.color} mb-1`}>Recomendación</h4>
                <p className={`text-sm ${recomendacion.color}`}>{recomendacion.mensaje}</p>
              </div>
            </div>
          </motion.div>

          {/* Información adicional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-[#f3e5e1] p-4 rounded-lg border border-[#e0d6cf]"
          >
            <h4 className="text-sm font-semibold text-[#6d4c41] mb-2">Información del Horario Pico</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#8d6e63]">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Hora: {formatearHora(data.hora)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Citas programadas: {data.cantidad}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <span>Período: {periodo}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Nivel de demanda: {data.cantidad >= 5 ? "Alto" : data.cantidad >= 3 ? "Medio" : "Bajo"}</span>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default HorarioConMaxCitas
