"use client"
import type React from "react"
import { useEffect, useState, useMemo, useCallback } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useLocation } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { PeriodsHeader } from "@/components/periodos/periods-header"
import { ActionButtons } from "@/components/periodos/action-buttons"
import { HorariosSection } from "@/components/periodos/horarios-section"
import { LicenciasSection } from "@/components/periodos/licencias-section"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface PeriodoLaboral {
  id: number
  empleadaId: number
  tipo: "HorarioHabitual" | "Licencia"
  diaSemana?: string
  horaInicio?: string
  horaFin?: string
  desde?: string
  hasta?: string
  motivo?: string
}

interface HorarioAgrupado {
  diaSemana: string
  turnos: {
    id: number
    horaInicio: string
    horaFin: string
  }[]
}

const PeriodosLaboralesList: React.FC = () => {
  const [periodos, setPeriodos] = useState<PeriodoLaboral[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState<Set<number>>(new Set())
  const [empleadaNombre, setEmpleadaNombre] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  
  // Memoizar empleadaId para evitar re-cálculos
  const empleadaId = useMemo(() => 
    new URLSearchParams(location.search).get("empleadaId"), 
    [location.search]
  )

  useEffect(() => {
    const fetchData = async () => {
      if (empleadaId) {
        try {
          setIsLoading(true)
          const [periodosRes, empleadaRes] = await Promise.all([
            axios.get(`/api/PeriodoLaboral/empleada/${empleadaId}`),
            axios.get(`/api/Empleado/${empleadaId}`),
          ])
          setPeriodos(periodosRes.data)
          setEmpleadaNombre(`${empleadaRes.data.nombre} ${empleadaRes.data.apellido}`)
        } catch {
          setError("Error al cargar periodos laborales")
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchData()
  }, [empleadaId])

  // Memoizar callbacks para evitar re-renders
  const handleDelete = useCallback(async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este periodo laboral?")) return

    setLoadingDelete((prev) => new Set(prev).add(id))
    try {
      await axios.delete(`/api/PeriodoLaboral/${id}`)
      setPeriodos((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setError("No se pudo eliminar el periodo laboral")
    } finally {
      setLoadingDelete((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }, [])

  const handleDeleteDia = useCallback(async (horariosDelDia: HorarioAgrupado) => {
    const idsAEliminar = horariosDelDia.turnos.map((t) => t.id)
    const formatearDia = (dia: string) => {
      const dias: { [key: string]: string } = {
        Monday: "Lunes",
        Tuesday: "Martes",
        Wednesday: "Miércoles",
        Thursday: "Jueves",
        Friday: "Viernes",
        Saturday: "Sábado",
        Sunday: "Domingo",
      }
      return dias[dia] || dia
    }
    
    const mensaje =
      idsAEliminar.length > 1
        ? `¿Estás seguro de que deseas eliminar todos los turnos del ${formatearDia(horariosDelDia.diaSemana)}?`
        : `¿Estás seguro de que deseas eliminar el turno del ${formatearDia(horariosDelDia.diaSemana)}?`

    if (!window.confirm(mensaje)) return

    setLoadingDelete((prev) => {
      const newSet = new Set(prev)
      idsAEliminar.forEach((id) => newSet.add(id))
      return newSet
    })

    try {
      await Promise.all(idsAEliminar.map((id) => axios.delete(`/api/PeriodoLaboral/${id}`)))
      setPeriodos((prev) => prev.filter((p) => !idsAEliminar.includes(p.id)))
    } catch {
      setError("No se pudieron eliminar los periodos laborales")
    } finally {
      setLoadingDelete((prev) => {
        const newSet = new Set(prev)
        idsAEliminar.forEach((id) => newSet.delete(id))
        return newSet
      })
    }
  }, [])

  const handleBack = useCallback(() => {
    navigate("/empleados")
  }, [navigate])

  const handleNuevoPeriodo = useCallback(() => {
    navigate(`/periodos-laborales/nuevo?empleadaId=${empleadaId}`)
  }, [navigate, empleadaId])

  const handleEdit = useCallback((periodoId: number) => {
    navigate(`/periodos-laborales/editar/${periodoId}?empleadaId=${empleadaId}`)
  }, [navigate, empleadaId])

  // Memoizar cálculos pesados para evitar re-cálculos innecesarios
  const { horarios, licencias, horariosAgrupados } = useMemo(() => {
    const horarios = periodos.filter((p) => p.tipo === "HorarioHabitual")
    const licencias = periodos.filter((p) => p.tipo === "Licencia")

    // Agrupar horarios por día
    const horariosAgrupados: HorarioAgrupado[] = horarios.reduce((acc, periodo) => {
      if (!periodo.diaSemana) return acc
      const diaExistente = acc.find((h) => h.diaSemana === periodo.diaSemana)
      if (diaExistente) {
        diaExistente.turnos.push({
          id: periodo.id,
          horaInicio: periodo.horaInicio || "",
          horaFin: periodo.horaFin || "",
        })
      } else {
        acc.push({
          diaSemana: periodo.diaSemana,
          turnos: [
            {
              id: periodo.id,
              horaInicio: periodo.horaInicio || "",
              horaFin: periodo.horaFin || "",
            },
          ],
        })
      }
      return acc
    }, [] as HorarioAgrupado[])

    // Ordenar por día de la semana
    const ordenDias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    horariosAgrupados.sort((a, b) => ordenDias.indexOf(a.diaSemana) - ordenDias.indexOf(b.diaSemana))

    // Ordenar turnos por hora de inicio
    horariosAgrupados.forEach((dia) => {
      dia.turnos.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
    })

    return { horarios, licencias, horariosAgrupados }
  }, [periodos])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-4 relative overflow-hidden">
        <MotionWrapper animation="fadeIn" className="text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-white/90 to-white/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-lg border border-white/30">
            <Loader2 size={40} className="text-[#7a5b4c] animate-spin sm:w-12 sm:h-12" />
          </div>
          <p className="text-[#7a5b4c] font-bold text-lg sm:text-xl mb-2">Cargando períodos laborales...</p>
          <p className="text-[#7a5b4c]/60 text-sm">Esto puede tomar unos segundos</p>
        </MotionWrapper>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-2 sm:px-4 py-4 sm:py-8 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <MotionWrapper animation="fadeIn">
          <Card className="bg-white/90 backdrop-blur-lg shadow-2xl border-0 rounded-2xl sm:rounded-3xl overflow-hidden relative">
            {/* Borde decorativo */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#7a5b4c] via-[#a37e63] to-[#7a5b4c] p-0.5 rounded-2xl sm:rounded-3xl">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl h-full w-full"></div>
            </div>
            <div className="relative z-10">
              <PeriodsHeader
                empleadaNombre={empleadaNombre}
                horariosCount={horariosAgrupados.length}
                licenciasCount={licencias.length}
                onBack={handleBack}
              />
              <CardContent className="p-4 sm:p-8 bg-gradient-to-b from-white/95 to-white/90">
                <ActionButtons onNuevoPeriodo={handleNuevoPeriodo} onBack={handleBack} />

                {/* Mensaje de error */}
                <AnimatePresence>
                  {error && (
                    <MotionWrapper animation="fadeIn">
                      <div className="flex items-center space-x-3 p-4 sm:p-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl sm:rounded-2xl mb-8 shadow-lg backdrop-blur-sm">
                        <AlertCircle size={20} className="text-red-500 flex-shrink-0 sm:w-6 sm:h-6" />
                        <p className="text-sm sm:text-base text-red-700 font-semibold">{error}</p>
                      </div>
                    </MotionWrapper>
                  )}
                </AnimatePresence>

                <HorariosSection
                  horariosAgrupados={horariosAgrupados}
                  onEdit={handleEdit}
                  onDeleteDia={handleDeleteDia}
                  loadingDelete={loadingDelete}
                />

                <LicenciasSection
                  licencias={licencias}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loadingDelete={loadingDelete}
                />
              </CardContent>
            </div>
          </Card>
        </MotionWrapper>
      </div>
    </div>
  )
}

export default PeriodosLaboralesList
