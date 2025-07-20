"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
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

interface EmpleadosTableProps {
  empleados: Empleado[]
  onEdit: (id: number) => void
  onDelete: (id: number, nombre: string, apellido: string) => void
  onHabilidades: (id: number) => void
  onSectores: (id: number) => void
  onPeriodos: (id: number) => void
}

const EmpleadosTable: React.FC<EmpleadosTableProps> = ({
  empleados,
  onEdit,
  onDelete,
  onHabilidades,
  onSectores,
  onPeriodos,
}) => {
  return (
    <motion.div
      key="table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border border-[#e1cfc0] shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#f8f0ec] to-[#f3e9dc] hover:from-[#f8f0ec] hover:to-[#f3e9dc] border-b border-[#e1cfc0]">
                  <TableHead className="text-[#7a5b4c] font-bold">Empleado</TableHead>
                  <TableHead className="text-[#7a5b4c] font-bold">Cargo</TableHead>
                  <TableHead className="text-[#7a5b4c] font-bold">Sucursal</TableHead>
                  <TableHead className="text-[#7a5b4c] font-bold text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empleados.map((emp, index) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-[#f8f0ec] transition-colors border-b border-[#e1cfc0]/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <EmpleadoAvatar nombre={emp.nombre} apellido={emp.apellido} color={emp.color} />
                        <div>
                          <div className="font-medium text-[#7a5b4c]">
                            {emp.nombre} {emp.apellido}
                          </div>
                          <div className="text-sm text-[#8d6e63]">ID: {emp.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <EmpleadoBadge cargo={emp.cargo} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#8d6e63]" />
                        <span className="text-[#7a5b4c]">
                          {emp.sucursalId ? `Sucursal ${emp.sucursalId}` : "Sin asignar"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <EmpleadoActionsMenu
                          empleadoId={emp.id}
                          empleadoNombre={emp.nombre}
                          empleadoApellido={emp.apellido}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onHabilidades={onHabilidades}
                          onSectores={onSectores}
                          onPeriodos={onPeriodos}
                          variant="icon"
                        />
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default EmpleadosTable
