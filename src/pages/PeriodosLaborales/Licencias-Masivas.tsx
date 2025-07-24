"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarDays, UserX, Building2 } from "lucide-react"
import  FormLayout  from "@/components/forms/form-layout"
import  FormField  from "@/components/forms/form-field"
import  FormButtons  from "@/components/forms/form-buttons"
import  DateInputField  from "@/components/forms/date-input-field"
import { LoadingSpinner  from "@/components/common/loading-spinner"
import { ErrorAlert  from "@/components/common/error-alert"
import  MotionWrapper from "@/components/animations/motion-wrapper"
import { useToast } from "@/hooks/use-toast"

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

export default function LicenciasMasivas() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [selectedSucursales, setSelectedSucursales] = useState<number[]>([])
  const [formData, setFormData] = useState({
    desde: "",
    hasta: "",
    motivo: "",
  })
  const [loading, setLoading] = useState(false)
  const [loadingSucursales, setLoadingSucursales] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar sucursales
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Sucursal`)
        if (!response.ok) throw new Error("Error al cargar sucursales")
        const data = await response.json()
        setSucursales(data)
      } catch (error) {
        setError("Error al cargar las sucursales")
        console.error("Error:", error)
      } finally {
        setLoadingSucursales(false)
      }
    }

    fetchSucursales()
  }, [])

  const handleSucursalChange = (sucursalId: number, checked: boolean) => {
    if (checked) {
      setSelectedSucursales((prev) => [...prev, sucursalId])
    } else {
      setSelectedSucursales((prev) => prev.filter((id) => id !== sucursalId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSucursales(sucursales.map((s) => s.id))
    } else {
      setSelectedSucursales([])
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    if (selectedSucursales.length === 0) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar al menos una sucursal",
        variant: "destructive",
      })
      return false
    }

    if (!formData.desde || !formData.hasta) {
      toast({
        title: "Error de validación",
        description: "Debe completar las fechas desde y hasta",
        variant: "destructive",
      })
      return false
    }

    if (new Date(formData.desde) > new Date(formData.hasta)) {
      toast({
        title: "Error de validación",
        description: "La fecha 'desde' no puede ser posterior a la fecha 'hasta'",
        variant: "destructive",
      })
      return false
    }

    if (!formData.motivo.trim()) {
      toast({
        title: "Error de validación",
        description: "Debe ingresar un motivo para la licencia",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      const licenciaData: LicenciaMasivaData = {
        sucursalIds: selectedSucursales,
        desde: new Date(formData.desde).toISOString(),
        hasta: new Date(formData.hasta).toISOString(),
        motivo: formData.motivo.trim(),
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/PeriodoLaboral/sucursal/licencia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(licenciaData),
      })

      if (!response.ok) {
        throw new Error("Error al crear las licencias masivas")
      }

      toast({
        title: "Licencias creadas",
        description: `Se han creado las licencias para ${selectedSucursales.length} sucursal(es)`,
        variant: "success",
      })

      // Limpiar formulario
      setSelectedSucursales([])
      setFormData({ desde: "", hasta: "", motivo: "" })
    } catch (error) {
      setError("Error al crear las licencias masivas")
      toast({
        title: "Error",
        description: "No se pudieron crear las licencias. Intente nuevamente.",
        variant: "destructive",
      })
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/menu-admin")
  }

  if (loadingSucursales) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <MotionWrapper>
      <FormLayout
        title="Licencias Masivas"
        subtitle="Asignar licencias a todas las empleadas de las sucursales seleccionadas"
        icon={UserX}
      >
        {error && <ErrorAlert message={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Sucursales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Seleccionar Sucursales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Checkbox
                  id="select-all"
                  checked={selectedSucursales.length === sucursales.length && sucursales.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="font-medium">
                  Seleccionar todas las sucursales
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sucursales.map((sucursal) => (
                  <div key={sucursal.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      id={`sucursal-${sucursal.id}`}
                      checked={selectedSucursales.includes(sucursal.id)}
                      onCheckedChange={(checked) => handleSucursalChange(sucursal.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <label htmlFor={`sucursal-${sucursal.id}`} className="font-medium cursor-pointer">
                        {sucursal.nombre}
                      </label>
                      <p className="text-sm text-muted-foreground">{sucursal.direccion}</p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedSucursales.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {selectedSucursales.length} sucursal(es) seleccionada(s)
                </div>
              )}
            </CardContent>
          </Card>

          {/* Período de Licencia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Período de Licencia
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateInputField
                label="Fecha desde"
                value={formData.desde}
                onChange={(value) => handleInputChange("desde", value)}
                required
              />
              <DateInputField
                label="Fecha hasta"
                value={formData.hasta}
                onChange={(value) => handleInputChange("hasta", value)}
                required
              />
            </CardContent>
          </Card>

          {/* Motivo */}
          <FormField
            label="Motivo de la licencia"
            type="textarea"
            value={formData.motivo}
            onChange={(value) => handleInputChange("motivo", value)}
            placeholder="Ej: Feriado nacional, Cierre temporal, Mantenimiento, etc."
            required
            rows={3}
          />

          <FormButtons onCancel={handleCancel} loading={loading} submitText="Crear Licencias" cancelText="Cancelar" />
        </form>
      </FormLayout>
    </MotionWrapper>
  )
}
