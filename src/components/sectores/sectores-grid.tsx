"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import SectorCard from "./sector-card"

interface Sector {
  id: number
  nombre: string
  descripcion: string | null
  sucursalId: number
}

interface SectoresGridProps {
  sectores: Sector[]
  getSucursalNombre: (sucursalId: number) => string
  onEdit: (id: number) => void
  onDelete: (id: number, nombre: string) => void
}

const SectoresGrid: React.FC<SectoresGridProps> = ({ sectores, getSucursalNombre, onEdit, onDelete }) => {
  // Ordenar sectores por sucursal
  const sectoresOrdenados = sectores.sort((a, b) => {
    const sucursalA = getSucursalNombre(a.sucursalId)
    const sucursalB = getSucursalNombre(b.sucursalId)
    // Primero ordenar por sucursal
    if (sucursalA !== sucursalB) {
      return sucursalA.localeCompare(sucursalB)
    }
    // Si son de la misma sucursal, ordenar por nombre del sector
    return a.nombre.localeCompare(b.nombre)
  })

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sectoresOrdenados.map((sector, index) => (
          <SectorCard
            key={sector.id}
            sector={sector}
            index={index}
            getSucursalNombre={getSucursalNombre}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

export default SectoresGrid
