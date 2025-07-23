"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../api/AxiosInstance"
import { Building, Calendar, FileText, ArrowLeft, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import PageLayout from "@/components/common/page-layout"
import LoadingSpinner from "@/components/common/loading-spinner"
import AnimatedCard from "@/components/common/animated-card"
import AnimatedContainer from "@/components/animations/animated-container"
import MotionWrapper from "@/components/animations/motion-wrapper"
import AnimatedError from "@/components/animations/animated-error"
import CustomCheckbox from "@/components/common/custom-checkbox"

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
                    <h1 className="text-2xl font-bold text-[#7a5b4c]">Licencias</h1>
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

          <AnimatedError error={error} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de Sucursales */}
            <MotionWrapper animation="slideLeft" delay={0.1}>
              <Card className="bg-white border-[#e1cfc0] shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-[#7a5b4c] flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Seleccionar Sucursales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Seleccionar todas */}
                  <div className="p-4 bg-gradient-to-r from-[#fdf6f1] to-[#f8f0e8] rounded-lg border border-[#e1cfc0]">
                    <CustomCheckbox
                      id="select-all"
                      checked={formData.sucursalIds.length === sucursales.length && sucursales.length > 0}
                      onCheckedChange={handleSelectAllSucursales}
                      label="Seleccionar todas las sucursales"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Lista de sucursales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {sucursales.map((sucursal) => (
                      <div
                        key={sucursal.id}
                        className="p-4 bg-white rounded-lg border border-[#e1cfc0] hover:border-[#a37e63] hover:shadow-md transition-all duration-200"
                      >
                        <CustomCheckbox
                          id={`sucursal-${sucursal.id}`}
                          checked={formData.sucursalIds.includes(sucursal.id)}
                          onCheckedChange={(checked) => handleSucursalToggle(sucursal.id, checked)}
                          label={sucursal.nombre}
                          description={sucursal.direccion}
                          disabled={isLoading}
                        />
                      </div>
                    ))}
                  </div>

                  {formData.sucursalIds.length > 0 && (
                    <div className="p-3 bg-gradient-to-r from-[#e8f5e8] to-[#f0f9f0] border border-[#c3e6c3] rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-[#2d5a2d]">
                          <strong>{formData.sucursalIds.length}</strong> sucursal
                          {formData.sucursalIds.length !== 1 ? "es" : ""} seleccionada
                          {formData.sucursalIds.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </MotionWrapper>

            {/* Fechas */}
            <MotionWrapper animation="slideRight" delay={0.2}>
              <Card className="bg-white border-[#e1cfc0] shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-[#7a5b4c] flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Período de Licencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="desde" className="text-sm font-medium text-[#7a5b4c]">
                      Fecha Desde *
                    </Label>
                    <Input
                      id="desde"
                      name="desde"
                      type="date"
                      value={formData.desde}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="border-[#e1cfc0] focus:border-[#7a5b4c] focus:ring-[#7a5b4c] bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hasta" className="text-sm font-medium text-[#7a5b4c]">
                      Fecha Hasta *
                    </Label>
                    <Input
                      id="hasta"
                      name="hasta"
                      type="date"
                      value={formData.hasta}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      min={formData.desde}
                      className="border-[#e1cfc0] focus:border-[#7a5b4c] focus:ring-[#7a5b4c] bg-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </MotionWrapper>

            {/* Motivo */}
            <MotionWrapper animation="fadeIn" delay={0.3}>
              <Card className="bg-white border-[#e1cfc0] shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-[#7a5b4c] flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Motivo de la Licencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="motivo" className="text-sm font-medium text-[#7a5b4c]">
                      Motivo *
                    </Label>
                    <Textarea
                      id="motivo"
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleInputChange}
                      placeholder="Ej: Feriado nacional, Cierre temporal, Mantenimiento..."
                      required
                      disabled={isLoading}
                      rows={3}
                      className="border-[#e1cfc0] focus:border-[#7a5b4c] focus:ring-[#7a5b4c] resize-none bg-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </MotionWrapper>

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
