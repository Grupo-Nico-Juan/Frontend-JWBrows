"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Plus, Minus, Loader2 } from "lucide-react"

interface Sector {
  id: number
  nombre: string
  descripcion: string
  sucursalId: number
}

interface Sucursal {
  id: number
  nombre: string
  direccion?: string
}

interface SectoresCardsProps {
  sectores: Sector[]
  sucursales: Sucursal[]
  sectoresAsignados: number[]
  loadingActions: Set<number>
  onToggleSector: (sectorId: number) => void
}

const SectoresCards: React.FC<SectoresCardsProps> = ({
  sectores,
  sucursales,
  sectoresAsignados,
  loadingActions,
  onToggleSector,
}) => {
  const getSucursalNombre = (sucursalId: number): string => {
    const sucursal = sucursales.find((s) => s.id === sucursalId)
    return sucursal?.nombre || `Sucursal ${sucursalId}`
  }

  const getSucursalInicial = (sucursalId: number): string => {
    const sucursal = sucursales.find((s) => s.id === sucursalId)
    if (sucursal?.nombre) {
      return sucursal.nombre.charAt(0).toUpperCase()
    }
    return sucursalId.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="sm:hidden space-y-3"
    >
      {sectores.map((sector, index) => {
        const estaAsignado = sectoresAsignados.includes(sector.id)
        const isLoadingAction = loadingActions.has(sector.id)
        const sucursalNombre = getSucursalNombre(sector.sucursalId)
        const sucursalInicial = getSucursalInicial(sector.sucursalId)

        return (
          <motion.div
            key={sector.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="bg-white border border-[#e1cfc0] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">{sucursalInicial}</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#7a5b4c] text-sm">{sucursalNombre}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            estaAsignado ? "bg-green-500" : "bg-gray-300"
                          } transition-colors`}
                        ></div>
                        <span className="font-semibold text-[#7a5b4c]">{sector.nombre}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {estaAsignado ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle size={14} />
                        <span className="font-medium text-xs">Asignado</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-gray-500">
                        <XCircle size={14} />
                        <span className="text-xs">No asignado</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-[#7a5b4c]/70 text-sm mb-3">{sector.descripcion}</p>
                <motion.button
                  whileHover={{ scale: isLoadingAction ? 1 : 1.02 }}
                  whileTap={{ scale: isLoadingAction ? 1 : 0.98 }}
                  onClick={() => onToggleSector(sector.id)}
                  disabled={isLoadingAction}
                  className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm ${
                    estaAsignado
                      ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoadingAction ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : estaAsignado ? (
                    <>
                      <Minus size={16} />
                      <span>Quitar Sector</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Asignar Sector</span>
                    </>
                  )}
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default SectoresCards
