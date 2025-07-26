"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Settings } from "lucide-react"
import { toast } from "sonner"
import PageLayout from "@/components/common/page-layout"
import PageHeader from "@/components/common/page-header"
import LoadingSpinner from "@/components/common/loading-spinner"
import ErrorAlert from "@/components/common/error-alert"
import HabilidadesStats from "@/components/habilidades/habilidades-stats"
import HabilidadesFilters from "@/components/habilidades/habilidades-filters"
import HabilidadesList from "@/components/habilidades/habilidades-list"

interface Habilidad {
  id: number
  nombre: string
  descripcion: string
}

interface ServicioInfo {
  id: number
  nombre: string
}

const AsignarHabilidadesServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [habilidades, setHabilidades] = useState<Habilidad[]>([])
  const [habilidadesAsignadas, setHabilidadesAsignadas] = useState<number[]>([])
  const [servicioInfo, setServicioInfo] = useState<ServicioInfo | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"todas" | "asignadas" | "disponibles">("todas")
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set())

  // Filtrar habilidades
  const habilidadesFiltradas = habilidades.filter((hab) => {
    const matchesSearch =
      hab.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hab.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    if (!matchesSearch) return false

    const isAssigned = habilidadesAsignadas.includes(hab.id)
    switch (filter) {
      case "asignadas":
        return isAssigned
      case "disponibles":
        return !isAssigned
      default:
        return true
    }
  })

  const habilidadesAsignadasCount = habilidadesAsignadas.length
  const habilidadesSinAsignarCount = habilidades.length - habilidadesAsignadas.length

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [todas, asignadas, servicio] = await Promise.all([
          axios.get<Habilidad[]>("/api/Habilidad"),
          axios.get<Habilidad[]>(`/api/Servicio/${id}/habilidades`),
          axios.get<ServicioInfo>(`/api/Servicio/${id}`),
        ])
        setHabilidades(todas.data)
        setHabilidadesAsignadas(asignadas.data.map((h) => h.id))
        setServicioInfo(servicio.data)
      } catch (err) {
        setError("Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const toggleHabilidad = async (habilidadId: number) => {
    if (processingIds.has(habilidadId)) return

    setProcessingIds((prev) => new Set(prev).add(habilidadId))
    const yaAsignada = habilidadesAsignadas.includes(habilidadId)

    try {
      if (yaAsignada) {
        await axios.delete(`/api/Servicio/${id}/habilidades/${habilidadId}`)
        setHabilidadesAsignadas((prev) => prev.filter((hid) => hid !== habilidadId))
        toast.success("Habilidad removida correctamente")
      } else {
        await axios.post(`/api/Servicio/${id}/habilidades/${habilidadId}`)
        setHabilidadesAsignadas((prev) => [...prev, habilidadId])
        toast.success("Habilidad asignada correctamente")
      }
    } catch (err) {
      setError("No se pudo actualizar la habilidad")
      toast.error("Error al actualizar la habilidad")
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(habilidadId)
        return newSet
      })
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setFilter("todas")
  }

  const handleBack = () => {
    navigate("/servicios")
  }

  if (loading) {
    return <LoadingSpinner message="Cargando habilidades..." />
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader
          title="Gestión de Habilidades"
          subtitle={servicioInfo ? `Servicio: ${servicioInfo.nombre}` : "Cargando..."}
          icon={Settings}
          actionButton={{
            label: "Volver",
            onClick: handleBack,
          }}
        />

        <HabilidadesStats
          totalHabilidades={habilidades.length}
          habilidadesAsignadas={habilidadesAsignadasCount}
          habilidadesSinAsignar={habilidadesSinAsignarCount}
        />

        {error && <ErrorAlert message={error} />}

        <HabilidadesFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filter={filter}
          onFilterChange={setFilter}
          onResetFilters={resetFilters}
          totalResults={habilidadesFiltradas.length}
          totalHabilidades={habilidades.length}
        />

        <HabilidadesList
          habilidades={habilidadesFiltradas}
          habilidadesAsignadas={habilidadesAsignadas}
          processingIds={processingIds}
          filter={filter}
          searchTerm={searchTerm}
          onToggleHabilidad={toggleHabilidad}
          onResetFilters={resetFilters}
        />
      </div>
    </PageLayout>
  )
}

export default AsignarHabilidadesServicio
