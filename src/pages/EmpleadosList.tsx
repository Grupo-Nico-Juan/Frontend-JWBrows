"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "../api/AxiosInstance"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AnimatePresence } from "framer-motion"
import { Users, Plus } from "lucide-react"
import { usePagination } from "@/hooks/use-pagination"

// Componentes reutilizables
import PageLayout from "@/components/common/page-layout"
import AnimatedCard from "@/components/common/animated-card"
import LoadingSpinner from "@/components/common/loading-spinner"
import ErrorAlert from "@/components/common/error-alert"
import PageHeader from "@/components/common/page-header"
import SearchInput from "@/components/common/search-input"
import FilterSelect from "@/components/common/filter-select"
import ViewToggle from "@/components/common/view-toggle"
import EmptyState from "@/components/common/empty-state"
import EmpleadosTable from "@/components/empleados/empleados-table"
import EmpleadosGrid from "@/components/empleados/empleados-grid"
import Pagination from "@/components/pagination"

interface Empleado {
  id: number
  nombre: string
  apellido: string
  color: string
  cargo: string
  sucursalId: number
}

interface Usuario {
  tipoUsuario: string
}

const EmpleadosList: React.FC = () => {
  const { usuario } = useAuth() as { usuario: Usuario | null }
  const navigate = useNavigate()
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [filteredEmpleados, setFilteredEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCargo, setSelectedCargo] = useState<string>("todos")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  // Hook de paginación
  const {
    currentPage,
    itemsPerPage,
    paginatedData: paginatedEmpleados,
    setCurrentPage,
    setItemsPerPage,
    resetToFirstPage,
  } = usePagination({
    data: filteredEmpleados,
    initialItemsPerPage: 5,
  })

  useEffect(() => {
    if (!usuario || usuario.tipoUsuario !== "Administrador") {
      navigate("/")
      return
    }
    const fetchEmpleados = async () => {
      setLoading(true)
      try {
        const res = await axios.get<Empleado[]>("/api/Empleado")
        setEmpleados(res.data)
        setFilteredEmpleados(res.data)
      } catch (err) {
        setError("Error al cargar empleados")
      } finally {
        setLoading(false)
      }
    }
    fetchEmpleados()
  }, [usuario, navigate])

  // Filtrar empleados y resetear paginación cuando cambian los filtros
  useEffect(() => {
    let filtered = empleados
    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.cargo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    // Filtro por cargo
    if (selectedCargo !== "todos") {
      filtered = filtered.filter((emp) => emp.cargo === selectedCargo)
    }
    setFilteredEmpleados(filtered)
    // Solo resetear si realmente cambió el filtro
    if (searchTerm || selectedCargo !== "todos") {
      resetToFirstPage()
    }
  }, [empleados, searchTerm, selectedCargo, resetToFirstPage])

  const handleDelete = async (id: number, nombre: string, apellido: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${nombre} ${apellido}?`)) return
    try {
      await axios.delete(`/api/Empleado/${id}`)
      setEmpleados((prev) => prev.filter((e) => e.id !== id))
    } catch {
      setError("No se pudo eliminar el empleado")
    }
  }

  // Obtener cargos únicos
  const cargosUnicos = Array.from(new Set(empleados.map((emp) => emp.cargo)))

  // Handlers para acciones de empleados
  const handleEdit = (id: number) => navigate(`/empleados/editar/${id}`)
  const handleHabilidades = (id: number) => navigate(`/empleados/${id}/habilidades`)
  const handleSectores = (id: number) => navigate(`/empleados/${id}/sectores`)
  const handlePeriodos = (id: number) => navigate(`/periodos-laborales?empleadaId=${id}`)

  if (loading) {
    return <LoadingSpinner message="Cargando empleados..." />
  }

  return (
    <PageLayout>
      {/* Header */}
      <AnimatedCard direction="down">
        <PageHeader
          icon={<Users className="h-6 w-6 text-white" />}
          title="Gestión de Empleados"
          subtitle={`${filteredEmpleados.length} empleados${
            filteredEmpleados.length !== empleados.length ? ` de ${empleados.length} total` : ""
          }`}
          actions={
            <Button
              onClick={() => navigate("/empleados/nuevo")}
              className="bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
          }
        />
      </AnimatedCard>

      {/* Filtros y búsqueda */}
      <AnimatedCard delay={0.1}>
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <SearchInput placeholder="Buscar por nombre o cargo..." value={searchTerm} onChange={setSearchTerm} />
          <FilterSelect
            value={selectedCargo}
            onChange={setSelectedCargo}
            options={cargosUnicos.map((cargo) => ({ value: cargo, label: cargo }))}
            placeholder="Todos los cargos"
          />
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </AnimatedCard>

      {/* Error */}
      {error && <ErrorAlert message={error} onDismiss={() => setError("")} />}

      {/* Contenido principal */}
      <AnimatePresence mode="wait">
        {filteredEmpleados.length === 0 ? (
          <EmptyState
            icon={<Users className="h-16 w-16" />}
            title={searchTerm || selectedCargo !== "todos" ? "No se encontraron empleados" : "No hay empleados"}
            description={
              searchTerm || selectedCargo !== "todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agregando tu primer empleado"
            }
            actionButton={
              !searchTerm && selectedCargo === "todos"
                ? {
                    label: "Agregar Empleado",
                    onClick: () => navigate("/empleados/nuevo"),
                    icon: <Plus className="h-4 w-4 mr-2" />,
                  }
                : undefined
            }
          />
        ) : viewMode === "table" ? (
          <EmpleadosTable
            empleados={paginatedEmpleados}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onHabilidades={handleHabilidades}
            onSectores={handleSectores}
            onPeriodos={handlePeriodos}
          />
        ) : (
          <EmpleadosGrid
            empleados={paginatedEmpleados}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onHabilidades={handleHabilidades}
            onSectores={handleSectores}
            onPeriodos={handlePeriodos}
          />
        )}
      </AnimatePresence>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredEmpleados.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        itemName="empleados"
      />
    </PageLayout>
  )
}

export default EmpleadosList
