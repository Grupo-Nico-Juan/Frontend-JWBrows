"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Settings, ArrowLeft, Wrench } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import PageLayout from "@/components/common/page-layout"
import LoadingSpinner from "@/components/common/loading-spinner"
import ErrorAlert from "@/components/common/error-alert"
import SectoresTable from "@/components/servicios/sectores-table"
import SectoresCards from "@/components/servicios/sectores-cards"

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

const AsignarSectoresServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const servicioId = Number(id)
  const navigate = useNavigate()

  const [sectores, setSectores] = useState<Sector[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [sectoresAsignados, setSectoresAsignados] = useState<number[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingActions, setLoadingActions] = useState<Set<number>>(new Set())
  const [servicioNombre, setServicioNombre] = useState("")

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [resTodos, resAsignados, resServicio, resSucursales] = await Promise.all([
        axios.get<Sector[]>("/api/Sector"),
        axios.get<Sector[]>(`/api/Servicio/${servicioId}/sectores`),
        axios.get(`/api/Servicio/${servicioId}`),
        axios.get<Sucursal[]>("/api/Sucursal"),
      ])

      setSectores(resTodos.data)
      setSucursales(resSucursales.data)
      setSectoresAsignados(resAsignados.data.map((s) => s.id))
      setServicioNombre(resServicio.data.nombre || `Servicio ${servicioId}`)
      setError("")
    } catch {
      setError("Error al cargar sectores")
      toast.error("Error al cargar sectores")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSector = async (sectorId: number) => {
    const asignado = sectoresAsignados.includes(sectorId)
    setLoadingActions((prev) => new Set(prev).add(sectorId))

    try {
      if (asignado) {
        await axios.delete(`/api/Servicio/${servicioId}/sectores/${sectorId}`)
        setSectoresAsignados((prev) => prev.filter((s) => s !== sectorId))
        toast.success("Sector quitado correctamente")
      } else {
        await axios.post(`/api/Servicio/${servicioId}/sectores/${sectorId}`)
        setSectoresAsignados((prev) => [...prev, sectorId])
        toast.success("Sector asignado correctamente")
      }
      setError("")
    } catch {
      setError("No se pudo actualizar el sector")
      toast.error("No se pudo actualizar el sector")
    } finally {
      setLoadingActions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(sectorId)
        return newSet
      })
    }
  }

  const handleBack = () => {
    navigate("/servicios")
  }

  useEffect(() => {
    if (servicioId) {
      fetchData()
    }
  }, [servicioId])

  if (isLoading) {
    return <LoadingSpinner message="Cargando sectores..." />
  }

  const sectoresAsignadosCount = sectoresAsignados.length
  const totalSectores = sectores.length
  const sucursalesUnicas = new Set(sectores.map((s) => s.sucursalId)).size

  return (
    <PageLayout>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-xl sm:rounded-2xl overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] p-4 sm:p-6 relative">
            {/* Botón de volver */}
            <button
              onClick={handleBack}
              className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors p-1"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>

            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
              >
                <Settings size={24} className="text-white sm:w-8 sm:h-8" />
              </motion.div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">Asignar Sectores</CardTitle>
              <div className="flex items-center justify-center space-x-2 text-white/90">
                <Wrench size={14} className="sm:w-4 sm:h-4" />
                <span className="font-medium text-sm sm:text-base">{servicioNombre}</span>
              </div>
              <p className="text-white/70 text-xs sm:text-sm mt-2">
                {sectoresAsignadosCount} de {totalSectores} sectores asignados
              </p>
            </div>
          </div>

          <CardContent className="p-3 sm:p-6">

            {/* Error Alert */}
            {error && <ErrorAlert message={error} />}

            {/* Vista de tabla para desktop y tablet */}
            <SectoresTable
              sectores={sectores}
              sucursales={sucursales}
              sectoresAsignados={sectoresAsignados}
              loadingActions={loadingActions}
              onToggleSector={toggleSector}
            />

            {/* Vista de cards para móvil */}
            <SectoresCards
              sectores={sectores}
              sucursales={sucursales}
              sectoresAsignados={sectoresAsignados}
              loadingActions={loadingActions}
              onToggleSector={toggleSector}
            />

            {/* Botón de volver */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 sm:mt-6 flex justify-center"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <ArrowLeft size={16} className="sm:w-5 sm:h-5 mr-2" />
                  Volver a Servicios
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </PageLayout>
  )
}

export default AsignarSectoresServicio
