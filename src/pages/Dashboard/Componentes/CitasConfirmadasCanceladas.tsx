"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltip } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Calendar, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import axios from "@/api/AxiosInstance"

type EstadoTurnosResponse = {
  realizados: number
  cancelados: number
}

interface Props {
  anio: number
  mes: number
}

const CitasConfirmadasCanceladas: React.FC<Props> = ({ anio, mes }) => {
  const [data, setData] = useState<EstadoTurnosResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await axios.get<EstadoTurnosResponse>(`/api/Reportes/estado-turnos`, {
          params: {
            anio: anio,
            mes: mes,
          },
        })
        setData(response.data)
      } catch (err) {
        setError("Error al cargar estado de turnos")
        console.error("Error al cargar estado de turnos:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [anio, mes])

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

  if (!data) return null

  const total = data.realizados + data.cancelados
  const porcentajeRealizados = total > 0 ? ((data.realizados / total) * 100).toFixed(1) : "0"
  const porcentajeCancelados = total > 0 ? ((data.cancelados / total) * 100).toFixed(1) : "0"

  const chartData = [
    {
      estado: "Realizados",
      cantidad: data.realizados,
      porcentaje: porcentajeRealizados,
    },
    {
      estado: "Cancelados",
      cantidad: data.cancelados,
      porcentaje: porcentajeCancelados,
    },
  ]

  // Colores personalizados para el gráfico
  const COLORS = {
    realizados: "#a1887f", // Color principal del tema
    cancelados: "#d32f2f", // Rojo para cancelados
  }

  const fechaFormateada = new Date(anio, mes - 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })

  const tasaExito = total > 0 ? (data.realizados / total) * 100 : 0

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="bg-[#fdf6f1] border border-[#e0d6cf] h-full flex flex-col">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl text-[#6d4c41] flex items-center justify-center gap-2">
            <Calendar className="h-5 w-5" />
            Estado de Citas
          </CardTitle>
          <CardDescription className="text-[#8d6e63] capitalize">{fechaFormateada}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
          {total === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#8d6e63]">No hay datos disponibles para este período</p>
            </div>
          ) : (
            <>
              {/* Gráfico de pie */}
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="cantidad"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.realizados : COLORS.cancelados} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white p-3 border border-[#e0d6cf] rounded-lg shadow-lg">
                                <p className="text-[#6d4c41] font-semibold">{data.estado}</p>
                                <p className="text-[#8d6e63]">
                                  Cantidad: <span className="font-medium">{data.cantidad}</span>
                                </p>
                                <p className="text-[#8d6e63]">
                                  Porcentaje: <span className="font-medium">{data.porcentaje}%</span>
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Número total en el centro */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#6d4c41]">{total}</div>
                      <div className="text-xs text-[#8d6e63]">Total</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estadísticas detalladas */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-[#f8f0ec] p-4 rounded-lg border border-[#e8ddd6]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8d6e63]">Realizados</p>
                      <p className="text-2xl font-bold text-[#6d4c41]">{data.realizados}</p>
                      <p className="text-xs text-[#a1887f]">{porcentajeRealizados}%</p>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-[#a1887f]"></div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-[#f8f0ec] p-4 rounded-lg border border-[#e8ddd6]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8d6e63]">Cancelados</p>
                      <p className="text-2xl font-bold text-[#6d4c41]">{data.cancelados}</p>
                      <p className="text-xs text-red-500">{porcentajeCancelados}%</p>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-[#d32f2f]"></div>
                  </div>
                </motion.div>
              </div>

              {/* Indicador de rendimiento */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-[#f3e5e1] p-4 rounded-lg border border-[#e0d6cf]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {tasaExito >= 80 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium text-[#6d4c41]">Tasa de éxito: {tasaExito.toFixed(1)}%</span>
                  </div>
                  <div className="text-xs text-[#8d6e63]">
                    {tasaExito >= 80
                      ? "Excelente rendimiento"
                      : tasaExito >= 60
                        ? "Buen rendimiento"
                        : "Necesita mejora"}
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mt-2 w-full bg-[#e0d6cf] rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tasaExito}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="bg-[#a1887f] h-2 rounded-full"
                  />
                </div>
              </motion.div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CitasConfirmadasCanceladas