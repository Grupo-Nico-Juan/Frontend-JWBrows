"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Zap, ArrowLeft, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import LoadingSpinner from "@/components/common/loading-spinner"
import SearchHeader from "@/components/common/search-header"
import ErrorAlert from "@/components/common/error-alert"
import HabilidadesStats from "@/components/habilidades/habilidades-stats"
import HabilidadesTable from "@/components/habilidades/habilidades-table"
import HabilidadesCards from "@/components/habilidades/habilidades-cards"

interface Habilidad {
  id: number
  nombre: string
  descripcion: string
}

const HabilidadesList: React.FC = () => {
  const [habilidades, setHabilidades] = useState<Habilidad[]>([])
  const [filteredHabilidades, setFilteredHabilidades] = useState<Habilidad[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState<Set<number>>(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHabilidades = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/api/Habilidad")
        setHabilidades(response.data)
        setFilteredHabilidades(response.data)
      } catch {
        setError("Error al cargar habilidades")
        toast.error("Error al cargar habilidades")
      } finally {
        setIsLoading(false)
      }
    }
    fetchHabilidades()
  }, [])

  useEffect(() => {
    const filtered = habilidades.filter(
      (habilidad) =>
        habilidad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        habilidad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredHabilidades(filtered)
  }, [searchTerm, habilidades])

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta habilidad?")) return
    setLoadingDelete((prev) => new Set(prev).add(id))
    try {
      await axios.delete(`/api/Habilidad/${id}`)
      setHabilidades((prev) => prev.filter((h) => h.id !== id))
      toast.success("Habilidad eliminada correctamente")
    } catch {
      setError("No se pudo eliminar la habilidad")
      toast.error("No se pudo eliminar la habilidad")
    } finally {
      setLoadingDelete((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/habilidades/editar/${id}`)
  }

  const handleNuevaHabilidad = () => {
    navigate("/habilidades/nueva")
  }

  const handleBack = () => {
    navigate("/menu-admin")
  }

  if (isLoading) {
    return <LoadingSpinner message="Cargando habilidades..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-2 sm:px-4 py-4 sm:py-8">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#d4bfae] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#a37e63] rounded-full opacity-10 blur-3xl"></div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
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
                  <Zap size={24} className="text-white sm:w-8 sm:h-8" />
                </motion.div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">Gestión de Habilidades</CardTitle>
                <p className="text-white/80 text-sm mt-2">
                  {filteredHabilidades.length} habilidad{filteredHabilidades.length !== 1 ? "es" : ""} registrada
                  {filteredHabilidades.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <CardContent className="p-3 sm:p-6">
              {/* Header con búsqueda */}
              <SearchHeader
                title="Habilidades"
                subtitle={`${filteredHabilidades.length} habilidad${filteredHabilidades.length !== 1 ? "es" : ""} ${filteredHabilidades.length !== habilidades.length ? `de ${habilidades.length} total` : ""}`}
                icon={Zap}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Buscar habilidades..."
                actionButton={{
                  label: "Nueva Habilidad",
                  onClick: handleNuevaHabilidad,
                  icon: Plus,
                }}
              />

              {/* Error */}
              {error && <ErrorAlert message={error} />}

              {/* Vista de tabla para desktop */}
              <HabilidadesTable
                habilidades={filteredHabilidades}
                loadingDelete={loadingDelete}
                searchTerm={searchTerm}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              {/* Vista de cards para móvil/tablet */}
              <HabilidadesCards
                habilidades={filteredHabilidades}
                loadingDelete={loadingDelete}
                searchTerm={searchTerm}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              {/* Botón de volver */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 flex justify-center"
              >
                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                  <span>Volver al Menú</span>
                </motion.button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default HabilidadesList
