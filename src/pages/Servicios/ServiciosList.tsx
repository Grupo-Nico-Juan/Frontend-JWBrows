"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { Scissors, Plus } from "lucide-react"
import { usePagination } from "@/hooks/use-pagination"
import PageLayout from "@/components/common/page-layout"
import SearchHeader from "@/components/common/search-header"
import LoadingSpinner from "@/components/common/loading-spinner"
import ErrorAlert from "@/components/common/error-alert"
import EmptyState from "@/components/common/empty-state"
import ServiciosTable from "@/components/servicios/servicios-table"
import ServiciosCards from "@/components/servicios/servicios-cards"
import Pagination from "@/components/pagination"

interface Servicio {
  id: number
  nombre: string
  descripcion: string
  duracionMinutos: number
  precio: number
}

interface Extra {
  id: number
}

const ServiciosList: React.FC = () => {
  const navigate = useNavigate()
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [filteredServicios, setFilteredServicios] = useState<Servicio[]>([])
  const [extrasCount, setExtrasCount] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Hook de paginación
  const {
    currentPage,
    itemsPerPage,
    paginatedData: paginatedServicios,
    setCurrentPage,
    setItemsPerPage,
    resetToFirstPage,
  } = usePagination({
    data: filteredServicios,
    initialItemsPerPage: 8,
  })

  useEffect(() => {
    const fetchServicios = async () => {
      setLoading(true)
      try {
        const res = await axios.get<Servicio[]>("/api/Servicio")
        setServicios(res.data)
        setFilteredServicios(res.data)
      } catch {
        setError("Error al cargar los servicios")
      } finally {
        setLoading(false)
      }
    }
    fetchServicios()
  }, [])

  useEffect(() => {
    if (servicios.length === 0) return
    const fetchCounts = async () => {
      try {
        const countsArr = await Promise.all(
          servicios.map(async (s) => {
            const res = await axios.get<Extra[]>(`/api/Servicio/${s.id}/extras`)
            return [s.id, res.data.length] as const
          }),
        )
        const counts: Record<number, number> = {}
        countsArr.forEach(([id, count]) => {
          counts[id] = count
        })
        setExtrasCount(counts)
      } catch {
        // ignore
      }
    }
    fetchCounts()
  }, [servicios])

  // Filtrar servicios
  useEffect(() => {
    const filtered = servicios.filter((servicio) => servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredServicios(filtered)
    resetToFirstPage()
  }, [servicios, searchTerm, resetToFirstPage])

  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el servicio "${nombre}"?`)) return
    try {
      await axios.delete(`/api/Servicio/${id}`)
      setServicios(servicios.filter((s) => s.id !== id))
    } catch {
      setError("No se pudo eliminar el servicio")
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
    }
    return `${minutes}m`
  }

  const getPriceColor = (precio: number) => {
    if (precio >= 100) return "bg-emerald-100 text-emerald-800"
    if (precio >= 50) return "bg-amber-100 text-amber-800"
    return "bg-slate-100 text-slate-800"
  }

  if (loading) {
    return <LoadingSpinner message="Cargando servicios..." />
  }

  return (
    <PageLayout>
      <SearchHeader
        title="Gestión de Servicios"
        subtitle={`${filteredServicios.length} servicios${filteredServicios.length !== servicios.length ? ` de ${servicios.length} total` : ""}`}
        icon={Scissors}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar servicios..."
        actionButton={{
          label: "Nuevo Servicio",
          onClick: () => navigate("/servicios/nuevo"),
          icon: Plus,
        }}
      />

      {error && <ErrorAlert message={error} />}
      
      <AnimatePresence mode="wait">
        {filteredServicios.length === 0 ? (
          <EmptyState
            icon={Scissors}
            title={searchTerm ? "No se encontraron servicios" : "No hay servicios"}
            description={
              searchTerm
                ? `No hay servicios que coincidan con "${searchTerm}"`
                : "Comienza agregando tu primer servicio"
            }
            actionButton={
              searchTerm
                ? {
                    label: "Limpiar búsqueda",
                    onClick: () => setSearchTerm(""),
                  }
                : {
                    label: "Agregar Servicio",
                    onClick: () => navigate("/servicios/nuevo"),
                    icon: Plus,
                  }
            }
          />
        ) : (
          <>
            <ServiciosTable
              servicios={paginatedServicios}
              extrasCount={extrasCount}
              onDelete={handleDelete}
              formatDuration={formatDuration}
              getPriceColor={getPriceColor}
            />
            <ServiciosCards
              servicios={paginatedServicios}
              extrasCount={extrasCount}
              onDelete={handleDelete}
              formatDuration={formatDuration}
              getPriceColor={getPriceColor}
            />
          </>
        )}
      </AnimatePresence>

      {filteredServicios.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredServicios.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          itemName="servicios"
          itemsPerPageOptions={[4, 8, 16, 32]}
        />
      )}
    </PageLayout>
  )
}

export default ServiciosList
