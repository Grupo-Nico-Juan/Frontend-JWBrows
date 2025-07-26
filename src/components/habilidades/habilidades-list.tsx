"use client"

import type React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Plus, Minus, Loader2 } from "lucide-react"
import MotionWrapper from "@/components/animations/motion-wrapper"
import EmptyState from "@/components/common/empty-state"

interface Habilidad {
  id: number
  nombre: string
  descripcion: string
}

interface HabilidadesListProps {
  habilidades: Habilidad[]
  habilidadesAsignadas: number[]
  processingIds: Set<number>
  filter: "todas" | "asignadas" | "disponibles"
  searchTerm: string
  onToggleHabilidad: (id: number) => void
  onResetFilters: () => void
}

const HabilidadesList: React.FC<HabilidadesListProps> = ({
  habilidades,
  habilidadesAsignadas,
  processingIds,
  filter,
  searchTerm,
  onToggleHabilidad,
  onResetFilters,
}) => {
  return (
    <MotionWrapper animation="slideUp" delay={0.2}>
      <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
        <CardHeader>
          <CardTitle className="text-lg text-[#6d4c41]">Habilidades {filter !== "todas" && `(${filter})`}</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {habilidades.length === 0 ? (
              <EmptyState
                icon={Settings}
                title={
                  searchTerm || filter !== "todas" ? "No se encontraron habilidades" : "No hay habilidades disponibles"
                }
                description={
                  searchTerm || filter !== "todas"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "No hay habilidades registradas en el sistema"
                }
                actionButton={
                  searchTerm || filter !== "todas"
                    ? {
                        label: "Limpiar filtros",
                        onClick: onResetFilters,
                      }
                    : undefined
                }
              />
            ) : (
              <div className="grid gap-4">
                {habilidades.map((hab, index) => {
                  const asignada = habilidadesAsignadas.includes(hab.id)
                  const isProcessing = processingIds.has(hab.id)

                  return (
                    <motion.div
                      key={hab.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        asignada
                          ? "bg-green-50 border-green-200 hover:bg-green-100"
                          : "bg-white border-[#e0d6cf] hover:bg-[#f8f0ec]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-[#6d4c41]">{hab.nombre}</h3>
                            <Badge
                              variant={asignada ? "default" : "secondary"}
                              className={
                                asignada
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {asignada ? "Asignada" : "Disponible"}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#8d6e63] line-clamp-2">{hab.descripcion}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onToggleHabilidad(hab.id)}
                          disabled={isProcessing}
                          className={
                            asignada
                              ? "bg-red-500 hover:bg-red-600 text-white ml-4"
                              : "bg-green-600 hover:bg-green-700 text-white ml-4"
                          }
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : asignada ? (
                            <>
                              <Minus className="h-4 w-4 mr-1" />
                              Quitar
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Asignar
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </MotionWrapper>
  )
}

export default HabilidadesList
