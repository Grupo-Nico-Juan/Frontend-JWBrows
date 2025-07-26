"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Grid3X3, Plus } from "lucide-react"
import { usePagination } from "@/hooks/use-pagination"
import PageLayout from "@/components/common/page-layout"
import SearchHeader from "@/components/common/search-header"
import LoadingSpinner from "@/components/common/loading-spinner"
import ErrorAlert from "@/components/common/error-alert"
import EmptyState from "@/components/common/empty-state"
import SectoresGrid from "@/components/sectores/sectores-grid"
import Pagination from "@/components/pagination"

interface Sector {
  id: number
  nombre: string
  descripcion: string | null
  sucursalId: number
}

interface Sucursal {
  id: number
  nombre: string
}

const SectoresList: React.FC = () => {
  const [sectores, setSectores] = useState<Sector[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [filteredSectores, setFilteredSectores] = useState<Sector[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  // Hook de paginación
  const {
    currentPage,
    itemsPerPage,
    paginatedData: paginatedSectores,
    setCurrentPage,
    setItemsPerPage,
    resetToFirstPage,
  } = usePagination({
    data: filteredSectores,
    initialItemsPerPage: 12,
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [sectoresRes, sucursalesRes] = await Promise.all([axios.get("/api/Sector"), axios.get("/api/Sucursal")])
        setSucursales(sucursalesRes.data)
        setSectores(sectoresRes.data)
        setFilteredSectores(sectoresRes.data)
      } catch {
        setError("Error al cargar sectores o sucursales")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filtrar sectores
  useEffect(() => {
    const filtered = sectores.filter(
      (sector) =>
        sector.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sector.descripcion && sector.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        getSucursalNombre(sector.sucursalId).toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredSectores(filtered)
    resetToFirstPage()
  }, [sectores, searchTerm, resetToFirstPage])

  const getSucursalNombre = (sucursalId: number) => {
    if (!sucursalId || sucursalId === 0) return "Sin sucursal"
    const sucursal = sucursales.find((s) => s.id === sucursalId)
    return sucursal ? sucursal.nombre : "Sucursal desconocida"
  }

  const handleEdit = (id: number) => {
    navigate(`/sectores/editar/${id}`)
  }

  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el sector "${nombre}"?`)) return

    try {
      await axios.delete(`/api/Sector/${id}`)
      setSectores(sectores.filter((s) => s.id !== id))
      toast.success("Sector eliminado correctamente")
    } catch {
      setError("No se pudo eliminar el sector")
      toast.error("Error al eliminar el sector")
    }
  }

  const handleNewSector = () => {
    navigate("/sectores/nuevo")
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  if (loading) {
    return <LoadingSpinner message="Cargando sectores..." />
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <SearchHeader
          title="Gestión de Sectores"
          subtitle={`${filteredSectores.length} sectores${
            filteredSectores.length !== sectores.length ? ` de ${sectores.length} total` : ""
          }`}
          icon={Grid3X3}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar sectores..."
          actionButton={{
            label: "Nuevo Sector",
            onClick: handleNewSector,
            icon: Plus,
          }}
        />

        {error && <ErrorAlert message={error} />}

        {filteredSectores.length === 0 ? (
          <EmptyState
            icon={Grid3X3}
            title={searchTerm ? "No se encontraron sectores" : "No hay sectores"}
            description={
              searchTerm ? `No hay sectores que coincidan con "${searchTerm}"` : "Comienza agregando tu primer sector"
            }
            actionButton={
              searchTerm
                ? {
                    label: "Limpiar búsqueda",
                    onClick: handleClearSearch,
                  }
                : {
                    label: "Agregar Sector",
                    onClick: handleNewSector,
                    icon: Plus,
                  }
            }
          />
        ) : (
          <SectoresGrid
            sectores={paginatedSectores}
            getSucursalNombre={getSucursalNombre}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <Pagination
          currentPage={currentPage}
          totalItems={filteredSectores.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          itemName="sectores"
          itemsPerPageOptions={[6, 12, 24, 48]}
        />
      </div>
    </PageLayout>
  )
}

export default SectoresList
