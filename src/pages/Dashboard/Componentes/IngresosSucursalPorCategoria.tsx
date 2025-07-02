"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import { Loader2, TrendingUp, DollarSign, Calendar } from "lucide-react"
import axios from "@/api/AxiosInstance"

interface IngresoSucursal {
  sucursal: string
  cejas: number
  unas: number
  pestanas: number
  otros: number
}

interface Props {
  anio: number
  mes: number
}

const IngresosSucursalPorCategoria: React.FC<Props> = ({ anio, mes }) => {
  const [data, setData] = useState<IngresoSucursal[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await axios.get<IngresoSucursal[]>("/api/Reportes/ingresos-sucursales", {
          params: {
            anio: anio,
            mes: mes,
          },
        })
        setData(response.data)
      } catch (err) {
        setError("Error al cargar ingresos por sucursal")
        console.error("Error cargando ingresos por sucursal", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [anio, mes])

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const totales = {
      cejas: data.reduce((sum, item) => sum + item.cejas, 0),
      unas: data.reduce((sum, item) => sum + item.unas, 0),
      pestanas: data.reduce((sum, item) => sum + item.pestanas, 0),
      otros: data.reduce((sum, item) => sum + item.otros, 0),
    }

    const totalGeneral = Object.values(totales).reduce((sum, val) => sum + val, 0)

    return { totales, totalGeneral }
  }

  const { totales, totalGeneral } = calcularEstadisticas()

  // Colores personalizados para cada categoría
  const COLORES_CATEGORIAS = {
    cejas: "#a1887f", // Color principal del tema
    unas: "#8d6e63", // Marrón más oscuro
    pestanas: "#795548", // Marrón aún más oscuro
    otros: "#6d4c41", // Marrón más oscuro
  }

  const fechaFormateada = new Date(anio, mes - 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })

  // Preparar datos para el gráfico con totales por sucursal
  const dataConTotales = data.map((item) => ({
    ...item,
    total: item.cejas + item.unas + item.pestanas + item.otros,
  }))

  // Encontrar la sucursal con mayor ingreso
  const sucursalTop = dataConTotales.reduce(
    (max, current) => (current.total > max.total ? current : max),
    dataConTotales[0] || { sucursal: "", total: 0 },
  )

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
      return (
        <div className="bg-white p-4 border border-[#e0d6cf] rounded-lg shadow-lg">
          <p className="text-[#6d4c41] font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-[#8d6e63]" style={{ color: entry.color }}>
              {entry.name}: <span className="font-medium">${entry.value.toLocaleString()}</span>
            </p>
          ))}
          <hr className="my-2 border-[#e0d6cf]" />
          <p className="text-[#6d4c41] font-semibold">Total: ${total.toLocaleString()}</p>
        </div>
      )
    }
    return null
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="bg-[#fdf6f1] border border-[#e0d6cf] h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-[#6d4c41] flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Ingresos por Sucursal
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-[#8d6e63]">
            <Calendar className="h-4 w-4" />
            <span className="capitalize">{fechaFormateada}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#8d6e63]">No hay datos disponibles para este período</p>
            </div>
          ) : (
            <>
              {/* Estadísticas generales */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {Object.entries(totales).map(([categoria, total], index) => (
                  <div key={categoria} className="bg-[#f8f0ec] p-3 rounded-lg border border-[#e8ddd6] text-center">
                    <div
                      className="w-3 h-3 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: COLORES_CATEGORIAS[categoria as keyof typeof COLORES_CATEGORIAS] }}
                    />
                    <p className="text-xs text-[#8d6e63] capitalize">{categoria}</p>
                    <p className="text-lg font-bold text-[#6d4c41]">${total.toLocaleString()}</p>
                  </div>
                ))}
              </motion.div>

              {/* Gráfico de barras */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-4 rounded-lg border border-[#e0d6cf]"
              >
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dataConTotales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis
                      dataKey="sucursal"
                      tick={{ fill: "#6d4c41", fontSize: 12 }}
                      axisLine={{ stroke: "#e0d6cf" }}
                    />
                    <YAxis
                      tick={{ fill: "#6d4c41", fontSize: 12 }}
                      axisLine={{ stroke: "#e0d6cf" }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: "#6d4c41" }} iconType="circle" />
                    <Bar dataKey="cejas" name="Cejas" fill={COLORES_CATEGORIAS.cejas} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="unas" name="Uñas" fill={COLORES_CATEGORIAS.unas} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="pestanas" name="Pestañas" fill={COLORES_CATEGORIAS.pestanas} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="otros" name="Otros" fill={COLORES_CATEGORIAS.otros} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Resumen y sucursal destacada */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Total general */}
                <div className="bg-[#f3e5e1] p-4 rounded-lg border border-[#e0d6cf]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8d6e63]">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-[#6d4c41]">${totalGeneral.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[#a1887f]" />
                  </div>
                </div>

                {/* Sucursal top */}
                {sucursalTop.sucursal && (
                  <div className="bg-[#f3e5e1] p-4 rounded-lg border border-[#e0d6cf]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#8d6e63]">Sucursal Líder</p>
                        <p className="text-lg font-bold text-[#6d4c41]">{sucursalTop.sucursal}</p>
                        <p className="text-sm text-[#a1887f]">${sucursalTop.total.toLocaleString()}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Distribución porcentual */}
              {totalGeneral > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-[#f8f0ec] p-4 rounded-lg border border-[#e8ddd6]"
                >
                  <h4 className="text-sm font-semibold text-[#6d4c41] mb-3">Distribución por Categoría</h4>
                  <div className="space-y-2">
                    {Object.entries(totales).map(([categoria, total]) => {
                      const porcentaje = ((total / totalGeneral) * 100).toFixed(1)
                      return (
                        <div key={categoria} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: COLORES_CATEGORIAS[categoria as keyof typeof COLORES_CATEGORIAS],
                              }}
                            />
                            <span className="text-sm text-[#6d4c41] capitalize">{categoria}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-[#e0d6cf] rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${porcentaje}%` }}
                                transition={{ duration: 1, delay: 0.7 }}
                                className="h-2 rounded-full"
                                style={{
                                  backgroundColor: COLORES_CATEGORIAS[categoria as keyof typeof COLORES_CATEGORIAS],
                                }}
                              />
                            </div>
                            <span className="text-sm text-[#8d6e63] font-medium w-12">{porcentaje}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default IngresosSucursalPorCategoria