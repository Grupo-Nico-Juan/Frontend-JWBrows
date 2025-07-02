"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, BarChart3, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import IngresosSucursalPorCategoria from "./Componentes/IngresosSucursalPorCategoria"
import CitasConfirmadasCanceladas from "./Componentes/CitasConfirmadasCanceladas"
import CitasPorServicio from "./Componentes/CitasPorServicio"
import HorarioConMasCitas from "./Componentes/HorarioConMaxCitas"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const Dashboard: React.FC = () => {
  const [anio, setAnio] = useState<number>(new Date().getFullYear())
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1)

  const fechaFormateada = new Date(anio, mes - 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })

  const metricas = [
    {
      titulo: "Ingresos",
      descripcion: "Por sucursal y categoría",
      icon: BarChart3,
      color: "#a1887f",
    },
    {
      titulo: "Estado de Citas",
      descripcion: "Confirmadas vs Canceladas",
      icon: TrendingUp,
      color: "#8d6e63",
    },
    {
      titulo: "Servicios",
      descripcion: "Citas por tipo de servicio",
      icon: Calendar,
      color: "#795548",
    },
    {
      titulo: "Horario Pico",
      descripcion: "Hora con más demanda",
      icon: Clock,
      color: "#6d4c41",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#f8f0ec] overflow-x-hidden">
      {/* Header mejorado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border-b border-[#e0d6cf] sticky top-0 z-10 shadow-sm"
      >
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Título y descripción */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#6d4c41] mb-2">Dashboard de Métricas</h1>
              <p className="text-[#8d6e63] capitalize">Análisis de {fechaFormateada}</p>
            </div>

            {/* Selector de fecha mejorado */}
            <Card className="bg-[#fdf6f1] border-[#e0d6cf] lg:w-auto">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-[#a1887f]" />
                  <div>
                    <label className="block text-sm font-medium text-[#6d4c41] mb-1">Período de análisis</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[200px] justify-start text-left font-normal border-[#d2bfae] text-[#6d4c41] bg-white hover:bg-[#f8f0ec] focus:ring-2 focus:ring-[#a1887f] focus:border-transparent"
                        >
                          
                          {fechaFormateada}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0 bg-white border-[#e0d6cf]" align="start">
                        <div className="p-4 space-y-4">
                          

                          {/* Selectores */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-[#8d6e63] mb-2">Mes</label>
                              <Select value={mes.toString()} onValueChange={(value) => setMes(Number.parseInt(value))}>
                                <SelectTrigger className="border-[#d2bfae] focus:ring-[#a1887f]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    "Enero",
                                    "Febrero",
                                    "Marzo",
                                    "Abril",
                                    "Mayo",
                                    "Junio",
                                    "Julio",
                                    "Agosto",
                                    "Septiembre",
                                    "Octubre",
                                    "Noviembre",
                                    "Diciembre",
                                  ].map((nombreMes, index) => (
                                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                                      {nombreMes}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-[#8d6e63] mb-2">Año</label>
                              <Select
                                value={anio.toString()}
                                onValueChange={(value) => setAnio(Number.parseInt(value))}
                              >
                                <SelectTrigger className="border-[#d2bfae] focus:ring-[#a1887f]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(
                                    (year) => (
                                      <SelectItem key={year} value={year.toString()}>
                                        {year}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Botones de acción rápida */}
                          <div className="flex gap-2 pt-2 border-t border-[#e0d6cf]">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const now = new Date()
                                setAnio(now.getFullYear())
                                setMes(now.getMonth() + 1)
                              }}
                              className="flex-1 text-xs border-[#d2bfae] hover:bg-[#f8f0ec]"
                            >
                              Mes actual
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const now = new Date()
                                const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth()
                                const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
                                setAnio(lastMonthYear)
                                setMes(lastMonth)
                              }}
                              className="flex-1 text-xs border-[#d2bfae] hover:bg-[#f8f0ec]"
                            >
                              Mes anterior
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Indicadores de métricas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
          >
            {metricas.map((metrica, index) => (
              <motion.div
                key={metrica.titulo}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-[#e8ddd6] hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${metrica.color}20` }}>
                    <metrica.icon className="h-5 w-5" style={{ color: metrica.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#6d4c41] text-sm">{metrica.titulo}</h3>
                    <p className="text-xs text-[#8d6e63]">{metrica.descripcion}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="px-6 py-8 space-y-8 max-w-full">
        {/* Primera métrica - Ancho completo para layout horizontal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[#6d4c41] flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#a1887f]" />
              Análisis de Ingresos por Sucursal
            </h2>
            <p className="text-sm text-[#8d6e63]">
              Distribución de ingresos por categorías de servicios en cada sucursal
            </p>
          </div>
          <IngresosSucursalPorCategoria anio={anio} mes={mes} />
        </motion.div>

        {/* Segunda fila - Grid de 3 columnas con alturas iguales */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
        >
          {/* Estado de citas - Ocupa 1 columna */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="mb-4 flex-shrink-0">
              <h2 className="text-lg font-semibold text-[#6d4c41] flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#8d6e63]" />
                Estado de Citas
              </h2>
              <p className="text-sm text-[#8d6e63]">Análisis de confirmaciones vs cancelaciones</p>
            </div>
            <div className="flex-1">
              <CitasConfirmadasCanceladas anio={anio} mes={mes} />
            </div>
          </div>

          {/* Citas por servicio - Ocupa 1 columna */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="mb-4 flex-shrink-0">
              <h2 className="text-lg font-semibold text-[#6d4c41] flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#795548]" />
                Servicios Populares
              </h2>
              <p className="text-sm text-[#8d6e63]">Distribución de citas por tipo de servicio</p>
            </div>
            <div className="flex-1">
              <CitasPorServicio anio={anio} mes={mes} />
            </div>
          </div>

          {/* Horario con más citas - Ocupa 1 columna */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="mb-4 flex-shrink-0">
              <h2 className="text-lg font-semibold text-[#6d4c41] flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#6d4c41]" />
                Horario de Mayor Demanda
              </h2>
              <p className="text-sm text-[#8d6e63]">Identificación del horario pico de actividad</p>
            </div>
            <div className="flex-1">
              <HorarioConMasCitas anio={anio} mes={mes} />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Dashboard
