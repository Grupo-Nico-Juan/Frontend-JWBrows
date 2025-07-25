"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Building2, Plus } from "lucide-react"

// Componentes reutilizables
import PageLayout from "@/components/common/page-layout"
import LoadingSpinner from "@/components/common/loading-spinner"
import ErrorAlert from "@/components/common/error-alert"
import EmptyState from "@/components/common/empty-state"
import SearchHeader from "@/components/common/search-header"
import SucursalCard from "@/components/common/sucursal-card"
import GridContainer from "@/components/common/grid-container"

interface Sucursal {
  id: number
  nombre: string
  direccion: string
  telefono: string
}

const SucursalesList: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSucursales = async () => {
      setLoading(true)
      try {
        const res = await axios.get("/api/Sucursal")
        setSucursales(res.data)
      } catch {
        setError("Error al cargar sucursales")
      } finally {
        setLoading(false)
      }
    }
    fetchSucursales()
  }, [])

  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar la sucursal "${nombre}"?`)) return
    try {
      await axios.delete(`/api/Sucursal/${id}`)
      setSucursales(sucursales.filter((s) => s.id !== id))
      toast.success("Sucursal eliminada correctamente")
    } catch {
      setError("No se pudo eliminar la sucursal")
      toast.error("Error al eliminar la sucursal")
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/sucursales/editar/${id}`)
  }

  // Filtrar sucursales basado en el término de búsqueda
  const sucursalesFiltradas = sucursales.filter(
    (sucursal) =>
      sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sucursal.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sucursal.telefono.includes(searchTerm),
  )

  if (loading) {
    return <LoadingSpinner message="Cargando sucursales..." />
  }

  return (
    <PageLayout>
      <SearchHeader
        title="Gestión de Sucursales"
        subtitle={
          searchTerm
            ? `${sucursalesFiltradas.length} de ${sucursales.length} sucursales`
            : `${sucursales.length} sucursales registradas`
        }
        icon={Building2}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar sucursales..."
        actionButton={{
          label: "Nueva Sucursal",
          onClick: () => navigate("/sucursales/nueva"),
          icon: Plus,
        }}
      />

      {error && <ErrorAlert message={error} onDismiss={() => setError("")} />}

      <AnimatePresence mode="wait">
        {sucursalesFiltradas.length === 0 ? (
          <EmptyState
            key="empty"
            icon={Building2}
            title={searchTerm ? "No se encontraron sucursales" : "No hay sucursales"}
            description={
              searchTerm
                ? `No hay sucursales que coincidan con "${searchTerm}"`
                : "Comienza agregando tu primera sucursal"
            }
            actionButton={
              searchTerm
                ? {
                    label: "Limpiar búsqueda",
                    onClick: () => setSearchTerm(""),
                  }
                : {
                    label: "Agregar Sucursal",
                    onClick: () => navigate("/sucursales/nueva"),
                    icon: Plus,
                  }
            }
          />
        ) : (
          <GridContainer key="grid">
            {sucursalesFiltradas.map((sucursal, index) => (
              <SucursalCard
                key={sucursal.id}
                sucursal={sucursal}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </GridContainer>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}

export default SucursalesList
