"use client"
import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useLocation } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PeriodsHeader } from "@/components/periodos/periods-header"
import { ActionButtons } from "@/components/periodos/action-buttons"
import { HorariosSection } from "@/components/periodos/horarios-section"
import { LicenciasSection } from "@/components/periodos/licencias-section"

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
  const empleadaId = new URLSearchParams(location.search).get("empleadaId")

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

  const handleDelete = async (id: number) => {
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
  }

  const handleDeleteDia = async (horariosDelDia: HorarioAgrupado) => {
    const idsAEliminar = horariosDelDia.turnos.map((t) => t.id)
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
  }

  const handleBack = () => {
    navigate("/empleados")
  }

  const handleNuevoPeriodo = () => {
    navigate(`/periodos-laborales/nuevo?empleadaId=${empleadaId}`)
  }

  const handleEdit = (periodoId: number) => {
    navigate(`/periodos-laborales/editar/${periodoId}?empleadaId=${empleadaId}`)
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-4 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-[#d4bfae] to-[#c4a484] rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#a37e63] to-[#8b6f56] rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-white/90 to-white/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-lg border border-white/30">
            <Loader2 size={40} className="text-[#7a5b4c] animate-spin sm:w-12 sm:h-12" />
          </div>
          <p className="text-[#7a5b4c] font-bold text-lg sm:text-xl mb-2">Cargando períodos laborales...</p>
          <p className="text-[#7a5b4c]/60 text-sm">Esto puede tomar unos segundos</p>
        </motion.div>
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] via-[#f8f0e8] to-[#f3e9dc] px-2 sm:px-4 py-4 sm:py-8 relative overflow-hidden">
      {/* Elementos decorativos de fondo mejorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-[#d4bfae] to-[#c4a484] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#a37e63] to-[#8b6f56] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#f3e9dc] to-[#e8d5c4] rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        {/* Partículas flotantes */}
        <div
          className="absolute top-20 left-20 w-2 h-2 bg-[#a37e63] rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-1 h-1 bg-[#d4bfae] rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-[#c4a484] rounded-full opacity-35 animate-bounce"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-[#a37e63] rounded-full opacity-25 animate-bounce"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
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

                {/* Mensaje de error mejorado */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-3 p-4 sm:p-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl sm:rounded-2xl mb-8 shadow-lg backdrop-blur-sm"
                    >
                      <AlertCircle size={20} className="text-red-500 flex-shrink-0 sm:w-6 sm:h-6" />
                      <p className="text-sm sm:text-base text-red-700 font-semibold">{error}</p>
                    </motion.div>
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
        </motion.div>
      </div>
    </div>
  )
}

export default PeriodosLaboralesList
