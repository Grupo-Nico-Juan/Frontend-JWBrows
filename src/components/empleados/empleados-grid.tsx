"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import EmpleadoAvatar from "./empleado-avatar"
import EmpleadoBadge from "./empleado-badge"
import EmpleadoActionsMenu from "./empleado-actions-menu"

interface Empleado {
  id: number
  nombre: string
  apellido: string
  color: string
  cargo: string
  sucursalId: number
}

interface EmpleadosGridProps {
  empleados: Empleado[]
  onEdit: (id: number) => void
  onDelete: (id: number, nombre: string, apellido: string) => void
  onHabilidades: (id: number) => void
  onSectores: (id: number) => void
  onPeriodos: (id: number) => void
}

const EmpleadosGrid: React.FC<EmpleadosGridProps> = ({
  empleados,
  onEdit,
  onDelete,
  onHabilidades,
  onSectores,
  onPeriodos,
}) => {
  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {empleados.map((emp, index) => (
        <motion.div
          key={emp.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border border-[#e1cfc0] hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <EmpleadoAvatar
                  nombre={emp.nombre}
                  apellido={emp.apellido}
                  color={emp.color}
                  size="lg"
                  className="mx-auto mb-3 shadow-lg"
                />
                <h3 className="font-semibold text-[#7a5b4c] text-lg">
                  {emp.nombre} {emp.apellido}
                </h3>
                <p className="text-sm text-[#8d6e63] mt-1">{emp.cargo}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8d6e63]">Cargo:</span>
                  <EmpleadoBadge cargo={emp.cargo} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8d6e63]">Sucursal:</span>
                  <span className="text-sm font-medium text-[#7a5b4c]">
                    {emp.sucursalId ? `Sucursal ${emp.sucursalId}` : "Sin asignar"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8d6e63]">ID:</span>
                  <span className="text-sm font-medium text-[#7a5b4c]">{emp.id}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#e1cfc0]">
                <EmpleadoActionsMenu
                  empleadoId={emp.id}
                  empleadoNombre={emp.nombre}
                  empleadoApellido={emp.apellido}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onHabilidades={onHabilidades}
                  onSectores={onSectores}
                  onPeriodos={onPeriodos}
                  variant="button"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default EmpleadosGrid
