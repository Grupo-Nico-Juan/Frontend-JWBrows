"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "@/api/AxiosInstance"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface CitaPorServicio {
  servicio: string
  cantidad: number
}

interface CitasPorServicioProps {
  anio: number
  mes: number
}

const CitasPorServicio: React.FC<CitasPorServicioProps> = ({ anio, mes }) => {
  const [datos, setDatos] = useState<CitaPorServicio[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await axios.get<CitaPorServicio[]>(`/api/Reportes/turnos-por-servicio?anio=${anio}&mes=${mes}`)
        setDatos(response.data)
      } catch (err) {
        setError("Error al cargar los datos de citas por servicio")
        console.error("Error fetching citas por servicio:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDatos()
  }, [anio, mes])

  const totalCitas = datos.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="bg-[#fdf6f1] border border-[#e0d6cf] h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl text-[#6d4c41]">Citas por Servicio</CardTitle>
          <p className="text-sm text-[#8d6e63]">
            {new Date(anio, mes - 1).toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#a1887f]" />
              <span className="ml-2 text-[#6d4c41]">Cargando...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : datos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#8d6e63]">No hay datos disponibles para este período</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-right">
                <span className="text-sm text-[#8d6e63]">
                  Total de citas: <span className="font-semibold text-[#6d4c41]">{totalCitas}</span>
                </span>
              </div>

              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f3e5e1]">
                      <TableHead className="text-[#6d4c41] font-semibold">Servicio</TableHead>
                      <TableHead className="text-[#6d4c41] font-semibold text-center w-20">Cant.</TableHead>
                      <TableHead className="text-[#6d4c41] font-semibold text-center w-24">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {datos
                      .sort((a, b) => b.cantidad - a.cantidad)
                      .map((item, index) => {
                        const porcentaje = totalCitas > 0 ? ((item.cantidad / totalCitas) * 100).toFixed(1) : "0.0"

                        return (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="hover:bg-[#f8f0ec] transition-colors"
                          >
                            <TableCell className="text-[#6d4c41] pr-2">
                              <div className="truncate max-w-[120px] lg:max-w-[160px]" title={item.servicio.trim()}>
                                {item.servicio.trim()}
                              </div>
                            </TableCell>
                            <TableCell className="text-center w-20">
                              <span className="inline-flex items-center justify-center w-7 h-7 bg-[#a1887f] text-white rounded-full text-xs font-semibold">
                                {item.cantidad}
                              </span>
                            </TableCell>
                            <TableCell className="text-center w-24">
                              <div className="flex flex-col items-center space-y-1">
                                <div className="w-12 bg-[#e0d6cf] rounded-full h-1.5">
                                  <div
                                    className="bg-[#a1887f] h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${porcentaje}%` }}
                                  />
                                </div>
                                <span className="text-xs text-[#8d6e63] font-medium">{porcentaje}%</span>
                              </div>
                            </TableCell>
                          </motion.tr>
                        )
                      })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CitasPorServicio
