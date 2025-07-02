import React, { useEffect, useState } from "react"
import axios from "../../api/AxiosInstance"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { motion } from "framer-motion"

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

const PeriodosLaboralesList: React.FC = () => {
  const [periodos, setPeriodos] = useState<PeriodoLaboral[]>([])
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const empleadaId = new URLSearchParams(location.search).get("empleadaId")

  useEffect(() => {
    if (empleadaId) {
      axios
        .get(`/api/PeriodoLaboral/empleada/${empleadaId}`)
        .then(res => setPeriodos(res.data))
        .catch(() => setError("Error al cargar periodos laborales"))
    }
  }, [empleadaId])

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar este periodo laboral?")) return
    try {
      await axios.delete(`/api/PeriodoLaboral/${id}`)
      setPeriodos(prev => prev.filter(p => p.id !== id))
    } catch {
      setError("No se pudo eliminar el periodo laboral")
    }
  }

  const horarios = periodos.filter(p => p.tipo === "HorarioHabitual")
  const licencias = periodos.filter(p => p.tipo === "Licencia")

  return (
    <div className="min-h-screen flex justify-center bg-[#fdf6f1] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl"
      >
        <Card className="bg-[#fdf6f1] border border-[#e0d6cf]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6d4c41]">
              Periodos Laborales
            </CardTitle>

            {/* Botón volver */}
            <div className="mt-2 flex gap-3 flex-wrap">
              <motion.div
                className="inline-block origin-left"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-[#a1887f] hover:bg-[#8d6e63] text-white"
                  onClick={() => navigate(`/periodos-laborales/nuevo?empleadaId=${empleadaId}`)}
                >
                  + Nuevo Periodo
                </Button>
              </motion.div>

              <motion.div
                className="inline-block origin-left"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={() => navigate("/empleados")}
                >
                  ← Volver a empleados
                </Button>
              </motion.div>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardHeader>

          <CardContent className="space-y-10">
            {/* Horarios Habituales */}
            <section>
              <h3 className="text-xl mb-3 text-[#7a5b4c]">Horarios Habituales</h3>
              {horarios.length === 0 ? (
                <p className="text-gray-500">No hay horarios habituales registrados.</p>
              ) : (
                <div className="overflow-x-auto bg-white rounded-lg border border-[#e0d6cf]">
                  <div className="grid grid-cols-5 gap-4 p-4 font-semibold text-[#6d4c41] bg-[#f3e5e1] rounded-t-lg">
                    <div>Día</div>
                    <div>Hora Inicio</div>
                    <div>Hora Fin</div>
                    <div className="text-center col-span-2">Acciones</div>
                  </div>
                  {horarios.map(periodo => (
                    <div
                      key={periodo.id}
                      className="grid grid-cols-5 gap-4 p-4 border-b last:border-none"
                    >
                      <div>{periodo.diaSemana ?? '-'}</div>
                      <div>{periodo.horaInicio ?? '-'}</div>
                      <div>{periodo.horaFin ?? '-'}</div>
                      <div className="flex gap-2 justify-center col-span-2 flex-wrap">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="bg-[#6d4c41] text-white hover:bg-[#5d4037]"
                            onClick={() => navigate(`/periodos-laborales/editar/${periodo.id}?empleadaId=${empleadaId}`)}
                          >
                            Editar
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(periodo.id)}
                          >
                            Eliminar
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Licencias */}
            <section>
              <h3 className="text-xl mb-3 text-[#7a5b4c]">Licencias</h3>
              {licencias.length === 0 ? (
                <p className="text-gray-500">No hay licencias registradas.</p>
              ) : (
                <div className="overflow-x-auto bg-white rounded-lg border border-[#e0d6cf]">
                  <div className="grid grid-cols-4 gap-4 p-4 font-semibold text-[#6d4c41] bg-[#f3e5e1] rounded-t-lg">
                    <div>Desde</div>
                    <div>Hasta</div>
                    <div>Motivo</div>
                    <div className="text-center">Acciones</div>
                  </div>
                  {licencias.map(periodo => (
                    <div
                      key={periodo.id}
                      className="grid grid-cols-4 gap-4 p-4 border-b last:border-none"
                    >
                      <div>{periodo.desde ? new Date(periodo.desde).toLocaleDateString('es-ES') : '-'}</div>
                      <div>{periodo.hasta ? new Date(periodo.hasta).toLocaleDateString('es-ES') : '-'}</div>
                      <div>{periodo.motivo ?? '-'}</div>
                      <div className="flex gap-2 justify-center flex-wrap">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="bg-[#6d4c41] text-white hover:bg-[#5d4037]"
                            onClick={() => navigate(`/periodos-laborales/editar/${periodo.id}?empleadaId=${empleadaId}`)}
                          >
                            Editar
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(periodo.id)}
                          >
                            Eliminar
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default PeriodosLaboralesList
