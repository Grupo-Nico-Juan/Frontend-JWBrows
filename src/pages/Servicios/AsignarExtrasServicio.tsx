"use client"

import type React from "react"
import { type ChangeEvent, useEffect, useState, type FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "@/api/AxiosInstance"
import { Star, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import PageLayout from "@/components/common/page-layout"
import LoadingSpinner from "@/components/common/loading-spinner"
import ErrorAlert from "@/components/common/error-alert"
import EmptyState from "@/components/common/empty-state"
import FormHeader from "@/components/forms/form-header"
import ExtrasStats from "@/components/extras/extras-stats"
import AddExtraForm from "@/components/extras/add-extra-form"
import ExtrasTable from "@/components/extras/extras-table"
import ExtrasCards from "@/components/extras/extras-cards"
import { Button } from "@/components/ui/button"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface Extra {
  id: number
  nombre: string
  duracionMinutos: number
  precio: number
}

const AsignarExtrasServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const servicioId = Number(id)
  const navigate = useNavigate()

  const [extras, setExtras] = useState<Extra[]>([])
  const [nuevo, setNuevo] = useState<Omit<Extra, "id" | "servicioId">>({
    nombre: "",
    duracionMinutos: 0,
    precio: 0,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState<Set<number>>(new Set())
  const [servicioNombre, setServicioNombre] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [extrasRes, servicioRes] = await Promise.all([
          axios.get<Extra[]>(`/api/Servicio/${servicioId}/extras`),
          axios.get(`/api/Servicio/${servicioId}`),
        ])
        setExtras(extrasRes.data)
        setServicioNombre(servicioRes.data.nombre || `Servicio ${servicioId}`)
        setError("")
      } catch {
        setError("Error al cargar extras")
        toast.error("Error al cargar extras")
      } finally {
        setIsLoading(false)
      }
    }

    if (servicioId) {
      fetchData()
    }
  }, [servicioId])

  const handleDeleteExtra = async (extraId: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este extra?")) return

    setLoadingDelete((prev) => new Set(prev).add(extraId))
    try {
      await axios.delete(`/api/Servicio/extras/${extraId}`)
      setExtras((prev) => prev.filter((e) => e.id !== extraId))
      toast.success("Extra eliminado correctamente")
    } catch {
      setError("No se pudo borrar el extra")
      toast.error("No se pudo eliminar el extra")
    } finally {
      setLoadingDelete((prev) => {
        const newSet = new Set(prev)
        newSet.delete(extraId)
        return newSet
      })
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNuevo((n) => ({
      ...n,
      [name]: name === "duracionMinutos" || name === "precio" ? Number(value) : value,
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!nuevo.nombre.trim()) {
      setError("El nombre del extra es requerido")
      return
    }

    setError("")
    setIsAdding(true)
    try {
      await axios.post(`/api/Servicio/${servicioId}/extras`, {
        ...nuevo,
        servicioId: servicioId,
      })
      setNuevo({ nombre: "", duracionMinutos: 0, precio: 0 })
      const res = await axios.get<Extra[]>(`/api/Servicio/${servicioId}/extras`)
      setExtras(res.data)
      toast.success("Extra agregado correctamente")
    } catch {
      setError("No se pudo agregar el extra")
      toast.error("No se pudo agregar el extra")
    } finally {
      setIsAdding(false)
    }
  }

  const handleBack = () => {
    navigate("/servicios")
  }

  if (isLoading) {
    return <LoadingSpinner message="Cargando extras..." />
  }

  const totalExtras = extras.length
  const duracionTotal = extras.reduce((sum, extra) => sum + extra.duracionMinutos, 0)
  const precioTotal = extras.reduce((sum, extra) => sum + extra.precio, 0)

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <FormHeader
          title="Extras del Servicio"
          subtitle={servicioNombre}
          icon={<Star />}
          onBack={handleBack}
        />

        {error && <ErrorAlert message={error} onDismiss={() => setError("")} />}

        <ExtrasStats totalExtras={totalExtras} duracionTotal={duracionTotal} precioTotal={precioTotal} />

        <AddExtraForm nuevo={nuevo} isAdding={isAdding} onChange={handleChange} onSubmit={handleSubmit} />

        {totalExtras === 0 ? (
          <EmptyState
            icon={Star} 
            title="No hay extras configurados"
            description="Agrega el primer extra usando el formulario de arriba"
          />
        ) : (
          <>
            <ExtrasTable extras={extras} onDelete={handleDeleteExtra} loadingDelete={loadingDelete} />
            <ExtrasCards extras={extras} onDelete={handleDeleteExtra} loadingDelete={loadingDelete} />
          </>
        )}

        <MotionWrapper animation="slideLeft" className="flex justify-center">
          <Button
            onClick={handleBack}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] hover:from-[#6b4d3e] hover:to-[#8f6b50] text-white font-semibold rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
            <span>Volver a Servicios</span>
          </Button>
        </MotionWrapper>
      </div>
    </PageLayout>
  )
}

export default AsignarExtrasServicio
