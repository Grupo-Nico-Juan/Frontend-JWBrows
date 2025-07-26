"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../api/AxiosInstance"
import { Building, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import PageLayout from "@/components/common/page-layout"
import LoadingSpinner from "@/components/common/loading-spinner"
import AnimatedCard from "@/components/common/animated-card"
import AnimatedContainer from "@/components/animations/animated-container"
import MotionWrapper from "@/components/animations/motion-wrapper"
import AnimatedError from "@/components/animations/animated-error"
import SucursalesSelector from "@/components/licencias/sucursales-selector"
import PeriodoSelector from "@/components/licencias/periodo-selector"
import MotivoInput from "@/components/licencias/motivo-input"

interface Sucursal {
  id: number
  nombre: string
  direccion: string
}

interface LicenciaMasivaData {
  sucursalIds: number[]
  desde: string
  hasta: string
  motivo: string
}

const LicenciasMasivas: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LicenciaMasivaData>({
    sucursalIds: [],
    desde: "",
    hasta: "",
    motivo: "",
  })
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSucursales, setIsLoadingSucursales] = useState(true)
  const [error, setError] = useState<string>("")

  // Cargar sucursales
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        setIsLoadingSucursales(true)
        const response = await axios.get("/api/Sucursal")
        setSucursales(response.data)
      } catch (error) {
        console.error("Error:", error)
        setError("Error al cargar las sucursales")
        toast.error("Error al cargar las sucursales")
      } finally {
        setIsLoadingSucursales(false)
      }
    }
    fetchSucursales()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSucursalToggle = (sucursalId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sucursalIds: checked ? [...prev.sucursalIds, sucursalId] : prev.sucursalIds.filter((id) => id !== sucursalId),
    }))
  }

  const handleSelectAllSucursales = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sucursalIds: checked ? sucursales.map((s) => s.id) : [],
    }))
  }

  const validateForm = () => {
    if (formData.sucursalIds.length === 0) {
      toast.error("Debe seleccionar al menos una sucursal")
      return false
    }
    if (!formData.desde || !formData.hasta) {
      toast.error("Debe completar las fechas")
      return false
    }
    if (new Date(formData.desde) > new Date(formData.hasta)) {
      toast.error("La fecha 'desde' no puede ser posterior a la fecha 'hasta'")
      return false
    }
    if (!formData.motivo.trim()) {
      toast.error("Debe ingresar un motivo")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError("")
    try {
      const licenciaData = {
        sucursalIds: formData.sucursalIds,
        desde: new Date(formData.desde).toISOString(),
        hasta: new Date(formData.hasta).toISOString(),
        motivo: formData.motivo.trim(),
      }
      await axios.post("/api/PeriodoLaboral/sucursal/licencia", licenciaData)
      toast.success("Licencias masivas creadas correctamente")
      navigate("/menu-admin")
    } catch (error) {
      console.error("Error:", error)
      setError("Error al crear las licencias masivas")
      toast.error("Error al crear las licencias masivas")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/menu-admin")
  }

  if (isLoadingSucursales) {
    return <LoadingSpinner message="Cargando sucursales..." />
  }

  return (
    <PageLayout>
      <AnimatedContainer variant="page">
        <div className="space-y-6">
          {/* Header simple */}
          <AnimatedCard>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#e1cfc0] p-6 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-[#7a5b4c] to-[#a37e63] rounded-xl shadow-lg">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#7a5b4c]">Licencias Masivas</h1>
                    <p className="text-[#8d6e63]">Asignar licencias a múltiples empleadas por sucursal</p>
                  </div>
                </div>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-[#e1cfc0] text-[#7a5b4c] hover:bg-[#fdf6f1] hover:border-[#a37e63] bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </div>
            </div>
          </AnimatedCard>

          {error && <AnimatedError error={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de Sucursales */}
            <SucursalesSelector
              sucursales={sucursales}
              selectedIds={formData.sucursalIds}
              onToggle={handleSucursalToggle}
              onSelectAll={handleSelectAllSucursales}
              disabled={isLoading}
            />

            {/* Fechas */}
            <PeriodoSelector
              desde={formData.desde}
              hasta={formData.hasta}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            {/* Motivo */}
            <MotivoInput motivo={formData.motivo} onChange={handleInputChange} disabled={isLoading} />

            {/* Botones */}
            <MotionWrapper animation="fadeIn" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="border-[#e1cfc0] text-[#7a5b4c] hover:bg-[#fdf6f1] hover:border-[#a37e63] bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || formData.sucursalIds.length === 0}
                  className="bg-[#7a5b4c] hover:bg-[#6b4d3e] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Crear Licencias Masivas
                    </>
                  )}
                </Button>
              </div>
            </MotionWrapper>
          </form>
        </div>
      </AnimatedContainer>
    </PageLayout>
  )
}

export default LicenciasMasivas
