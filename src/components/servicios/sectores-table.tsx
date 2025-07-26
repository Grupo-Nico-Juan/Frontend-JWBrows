"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, MapPin, CheckCircle, XCircle, Plus, Minus, Loader2 } from "lucide-react"

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

interface SectoresTableProps {
  sectores: Sector[]
  sucursales: Sucursal[]
  sectoresAsignados: number[]
  loadingActions: Set<number>
  onToggleSector: (sectorId: number) => void
}

const SectoresTable: React.FC<SectoresTableProps> = ({
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
      className="hidden sm:block bg-white rounded-lg sm:rounded-xl border border-[#e1cfc0] overflow-hidden shadow-sm"
    >
      <div className="overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[#f8f0e8] to-[#f3e9dc] border-b border-[#e1cfc0]">
              <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm w-1/4">
                <div className="flex items-center space-x-2">
                  <Building size={14} className="sm:w-4 sm:h-4" />
                  <span>Sucursal</span>
                </div>
              </TableHead>
              <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm w-1/4">
                <div className="flex items-center space-x-2">
                  <MapPin size={14} className="sm:w-4 sm:h-4" />
                  <span>Sector</span>
                </div>
              </TableHead>
              <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-sm hidden md:table-cell w-1/3">
                Descripción
              </TableHead>
              <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-center text-sm w-1/6">
                Estado
              </TableHead>
              <TableHead className="text-[#7a5b4c] font-semibold py-3 sm:py-4 text-center text-sm w-1/6">
                Acción
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectores.map((sector, index) => {
              const estaAsignado = sectoresAsignados.includes(sector.id)
              const isLoadingAction = loadingActions.has(sector.id)
              const sucursalNombre = getSucursalNombre(sector.sucursalId)
              const sucursalInicial = getSucursalInicial(sector.sucursalId)

              return (
                <motion.tr
                  key={sector.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-b border-[#f0e6dc] hover:bg-[#fdf6f1] transition-colors"
                >
                  <TableCell className="py-3 sm:py-4 w-1/4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-bold text-xs sm:text-sm">{sucursalInicial}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span
                          className="font-medium text-[#7a5b4c] text-sm sm:text-base block truncate"
                          title={sucursalNombre}
                        >
                          {sucursalNombre}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 w-1/4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                          estaAsignado ? "bg-green-500" : "bg-gray-300"
                        } transition-colors`}
                      ></div>
                      <span
                        className="font-medium text-[#7a5b4c] text-sm sm:text-base block truncate"
                        title={sector.nombre}
                      >
                        {sector.nombre}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 hidden md:table-cell w-1/3">
                    <span className="text-[#7a5b4c]/70 text-sm block truncate" title={sector.descripcion}>
                      {sector.descripcion}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-center w-1/6">
                    <div className="flex items-center justify-center">
                      {estaAsignado ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="font-medium text-xs sm:text-sm hidden lg:inline">Asignado</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-gray-500">
                          <XCircle size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm hidden lg:inline">No asignado</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-center w-1/6">
                    <motion.button
                      whileHover={{ scale: isLoadingAction ? 1 : 1.05 }}
                      whileTap={{ scale: isLoadingAction ? 1 : 0.95 }}
                      onClick={() => onToggleSector(sector.id)}
                      disabled={isLoadingAction}
                      className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 mx-auto text-xs ${
                        estaAsignado
                          ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
                          : "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoadingAction ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span className="hidden sm:inline">...</span>
                        </>
                      ) : estaAsignado ? (
                        <>
                          <Minus size={12} />
                          <span className="hidden sm:inline">Quitar</span>
                        </>
                      ) : (
                        <>
                          <Plus size={12} />
                          <span className="hidden sm:inline">Asignar</span>
                        </>
                      )}
                    </motion.button>
                  </TableCell>
                </motion.tr>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}

export default SectoresTable
